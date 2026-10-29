import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { SEARCH_CLASSES_TOOL, searchClasses } from "@/lib/bela/classSearch";
import { buildSystemPrompt, MODE_CONFIG } from "@/lib/bela/prompts";
import {
	isAllowedOrigin,
	isBelaEnabled,
	MAX_BODY_BYTES,
	validateBelaRequest,
} from "@/lib/bela/request";
import { pickMood, selectCards } from "@/lib/bela/response";
import { checkRateLimit, clientIdentifier } from "@/lib/rateLimit";

// Worst case is a few sequential provider/tool calls; TOTAL_BUDGET_MS keeps
// the whole request inside this limit instead of relying on the platform
// default, which can be lower.
export const maxDuration = 45;
const TOTAL_BUDGET_MS = 40000;

const anthropic = process.env.ANTHROPIC_API_KEY
	? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
	: null;
const openai = process.env.OPENAI_API_KEY
	? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
	: null;
const geminiApiKey = process.env.GEMINI_API_KEY || null;

// Haiku is plenty for short, grounded chat replies and much cheaper than
// Sonnet; ANTHROPIC_MODEL still overrides it.
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
// gemini-2.5-flash returns a live 404 ("no longer available to new users")
// -- confirmed by forcing it to the front of the provider chain and
// reading the raw Gemini error from Vercel logs, not assumed. gemini-flash-latest
// is the alias Google keeps pointed at a served model.
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
const PROVIDER_PRIORITY = (process.env.BELA_PROVIDER_PRIORITY || "anthropic,openai,gemini")
	.split(",")
	.map((value) => value.trim().toLowerCase())
	.filter(Boolean);

// Per-IP limits. The limiter fails open (see lib/rateLimit.ts), so a
// Supabase hiccup never takes Bela down — it only logs.
const RATE_LIMITS = [
	{ route: "bela", max: 20, windowSeconds: 60 },
	{ route: "bela-day", max: 100, windowSeconds: 86400 },
];

// Gemini isn't given the class-search tool, so it runs with the
// "can't look up classes" prompt instead.
const TOOL_PROVIDERS = new Set(["anthropic", "openai"]);
const MAX_TOOL_ROUNDS = 4;
const MAX_SEARCHES_PER_REQUEST = 6;

const OPENAI_SEARCH_TOOL = {
	type: "function",
	function: {
		name: SEARCH_CLASSES_TOOL.name,
		description: SEARCH_CLASSES_TOOL.description,
		parameters: SEARCH_CLASSES_TOOL.input_schema,
	},
};

const FALLBACK_REPLY = "Sorry, I got a little muddled there — could you ask me that again?";

function getAvailableProviders() {
	const configured = {
		anthropic: Boolean(anthropic),
		openai: Boolean(openai),
		gemini: Boolean(geminiApiKey),
	};
	const ordered = [];
	for (const provider of PROVIDER_PRIORITY) {
		if (configured[provider] && !ordered.includes(provider)) ordered.push(provider);
	}
	for (const provider of ["anthropic", "openai", "gemini"]) {
		if (configured[provider] && !ordered.includes(provider)) ordered.push(provider);
	}
	return ordered;
}

function getSupabase() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !key) return null;
	return createClient(url, key);
}

// Bounds each provider call so a hung/slow provider can't burn the whole
// function's execution budget before the loop reaches a working fallback
// tier -- SDK defaults are ~10 min.
const PROVIDER_TIMEOUT_MS = 12000;

function callTimeout(deadline) {
	const remaining = deadline - Date.now();
	if (remaining < 1500) {
		const err = new Error("Bela time budget exhausted");
		err.code = "budget_exhausted";
		throw err;
	}
	return Math.min(PROVIDER_TIMEOUT_MS, remaining);
}

async function callGemini(ctx) {
	const res = await fetch(
		`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-goog-api-key": geminiApiKey,
			},
			body: JSON.stringify({
				systemInstruction: { parts: [{ text: ctx.system }] },
				// Gemini uses "model" where Anthropic/OpenAI use "assistant".
				contents: ctx.messages.map((m) => ({
					role: m.role === "assistant" ? "model" : "user",
					parts: [{ text: m.content }],
				})),
				generationConfig: { maxOutputTokens: ctx.maxTokens },
			}),
			signal: AbortSignal.timeout(callTimeout(ctx.deadline)),
		},
	);
	if (!res.ok) {
		const body = await res.text();
		// classifyGenericProviderError() reads error.status first, falling
		// back to text matching only when it's absent -- a plain `new Error`
		// here left every Gemini failure (auth, quota, invalid model, ...)
		// misclassified as upstream_unknown regardless of the real HTTP
		// status, since res.status was never attached to anything Node
		// treats as .status.
		const err = new Error(`${res.status} ${body}`);
		err.status = res.status;
		throw err;
	}
	const data = await res.json();
	return (data.candidates?.[0]?.content?.parts ?? [])
		.map((p) => p.text ?? "")
		.join("");
}

async function callAnthropic(ctx) {
	const tools = ctx.useTools ? [SEARCH_CLASSES_TOOL] : undefined;
	const convo = ctx.messages.map((m) => ({ role: m.role, content: m.content }));
	for (let round = 0; ; round += 1) {
		// After MAX_TOOL_ROUNDS the tools stay declared (earlier turns
		// reference them) but tool_choice "none" forces a text answer.
		const canSearch = Boolean(tools) && round < MAX_TOOL_ROUNDS;
		const response = await anthropic.messages.create(
			{
				model: ANTHROPIC_MODEL,
				max_tokens: ctx.maxTokens,
				system: ctx.system,
				messages: convo,
				...(tools ? { tools, tool_choice: { type: canSearch ? "auto" : "none" } } : {}),
			},
			{ timeout: callTimeout(ctx.deadline) },
		);
		const toolUses = response.content.filter((block) => block.type === "tool_use");
		if (!canSearch || toolUses.length === 0) {
			return response.content
				.filter((block) => block.type === "text")
				.map((block) => block.text)
				.join("");
		}
		convo.push({ role: "assistant", content: response.content });
		const results = [];
		for (const use of toolUses) {
			results.push({
				type: "tool_result",
				tool_use_id: use.id,
				content: await ctx.runTool(use.name, use.input),
			});
		}
		convo.push({ role: "user", content: results });
	}
}

async function callOpenAI(ctx) {
	const tools = ctx.useTools ? [OPENAI_SEARCH_TOOL] : undefined;
	const convo = [{ role: "system", content: ctx.system }, ...ctx.messages];
	for (let round = 0; ; round += 1) {
		const canSearch = Boolean(tools) && round < MAX_TOOL_ROUNDS;
		const completion = await openai.chat.completions.create(
			{
				model: OPENAI_MODEL,
				max_tokens: ctx.maxTokens,
				messages: convo,
				...(tools ? { tools, tool_choice: canSearch ? "auto" : "none" } : {}),
			},
			{ timeout: callTimeout(ctx.deadline) },
		);
		const message = completion.choices[0]?.message;
		const calls = (message?.tool_calls ?? []).filter((call) => call.type === "function");
		if (!canSearch || calls.length === 0) return message?.content ?? "";
		convo.push(message);
		for (const call of calls) {
			let input = {};
			try {
				input = JSON.parse(call.function.arguments || "{}");
			} catch {
				// Malformed arguments: search with no filters rather than fail.
			}
			convo.push({
				role: "tool",
				tool_call_id: call.id,
				content: await ctx.runTool(call.function.name, input),
			});
		}
	}
}

function classifyGenericProviderError(error) {
	const status = Number(error?.status) || Number(error?.code) || 0;
	const message = String(error?.message || "");
	if (status === 401 || status === 403 || /api key|auth|unauthorized|forbidden/i.test(message)) {
		return { status: 502, code: "upstream_auth", message: "Bela is misconfigured (provider authentication failed). This is a server issue, not yours." };
	}
	if (status === 429 || /rate limit|quota|capacity/i.test(message)) {
		return { status: 429, code: "upstream_rate_limited", message: "Bela is getting a lot of requests right now — try again in a moment." };
	}
	if (status >= 500 || /timeout|timed out|network|fetch failed|connection/i.test(message)) {
		return { status: 503, code: "upstream_unavailable", message: "Bela is temporarily unavailable — try again in a moment." };
	}
	return { status: 502, code: "upstream_unknown", message: "Bela couldn't respond right now — try again in a moment." };
}

function classifyProviderError(provider, error) {
	if (error?.code === "budget_exhausted") {
		return { status: 503, code: "upstream_unavailable", message: "Bela is temporarily unavailable — try again in a moment." };
	}
	if (provider === "anthropic") return classifyAnthropicError(error);
	return classifyGenericProviderError(error);
}

async function callProvider(provider, ctx) {
	if (provider === "anthropic") return callAnthropic(ctx);
	if (provider === "openai") return callOpenAI(ctx);
	if (provider === "gemini") return callGemini(ctx);
	throw new Error(`Unsupported provider: ${provider}`);
}

// Maps an Anthropic SDK error to (a) the HTTP status we return to our own
// client and (b) a safe, actionable message — never the raw API error text,
// which can echo back request content or account-identifying detail.
function classifyAnthropicError(error) {
	if (error instanceof Anthropic.AuthenticationError) {
		return { status: 502, code: "upstream_auth", message: "Bela is misconfigured (invalid API key). This is a server issue, not yours." };
	}
	if (error instanceof Anthropic.PermissionDeniedError) {
		return { status: 502, code: "upstream_permission", message: "Bela's API key lacks permission for this request. This is a server issue, not yours." };
	}
	if (error instanceof Anthropic.RateLimitError) {
		return { status: 429, code: "upstream_rate_limited", message: "Bela is getting a lot of requests right now — try again in a moment." };
	}
	if (error instanceof Anthropic.BadRequestError) {
		// Anthropic reports account-level usage/spend caps as a 400
		// invalid_request_error, indistinguishable from a real malformed
		// request except by message text — this was the actual root cause
		// of the 2026-07 outage, and it looked identical to a generic 500
		// until the raw error was pulled from Vercel logs.
		const upstreamMessage = error.message || "";
		if (/usage limit|spend limit|billing/i.test(upstreamMessage)) {
			return { status: 503, code: "upstream_usage_limit", message: "Bela is temporarily unavailable (API usage limit reached). Please try again later." };
		}
		return { status: 502, code: "upstream_bad_request", message: "Bela couldn't process that request. Please try rephrasing." };
	}
	if (error instanceof Anthropic.APIConnectionError) {
		return { status: 502, code: "upstream_connection", message: "Bela couldn't be reached — try again in a moment." };
	}
	if (error instanceof Anthropic.APIStatusError && error.status >= 500) {
		return { status: 503, code: "upstream_unavailable", message: "Bela is temporarily unavailable — try again in a moment." };
	}
	return { status: 502, code: "upstream_unknown", message: "Bela couldn't respond right now — try again in a moment." };
}

function errorResponse(status, code, error, mood = "Sad") {
	return NextResponse.json({ error, code, mood }, { status });
}

async function checkLimits(supabase, request) {
	if (!supabase) {
		console.error("[Bela API] Rate limit skipped (Supabase not configured) — failing open");
		return true;
	}
	const identifier = clientIdentifier(request);
	for (const limit of RATE_LIMITS) {
		const allowed = await checkRateLimit(supabase, { ...limit, identifier });
		if (!allowed) return false;
	}
	return true;
}

export async function POST(request) {
	if (!isBelaEnabled()) {
		return errorResponse(503, "bela_disabled", "Bela is taking a short break — please try again later.", "Tired");
	}

	if (!isAllowedOrigin(request.headers.get("origin"))) {
		return errorResponse(403, "forbidden_origin", "This origin is not allowed to use Bela.");
	}

	const declaredLength = Number(request.headers.get("content-length"));
	if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
		return errorResponse(413, "payload_too_large", "That request is too large.");
	}

	let body;
	try {
		const raw = await request.text();
		if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
			return errorResponse(413, "payload_too_large", "That request is too large.");
		}
		body = JSON.parse(raw);
	} catch (error) {
		console.error("[Bela API] Invalid JSON body:", error.message);
		return NextResponse.json({ error: "Invalid JSON body", code: "bad_request" }, { status: 400 });
	}

	// Any caller-supplied `system` / `max_tokens` is ignored; old app builds
	// still send `system`, which is only used to pick a server-side mode.
	const validated = validateBelaRequest(body);
	if (!validated.ok) {
		return NextResponse.json({ error: validated.error, code: validated.code }, { status: validated.status });
	}
	const { mode, legacy, messages } = validated;
	const config = MODE_CONFIG[mode];

	const supabase = getSupabase();
	if (!(await checkLimits(supabase, request))) {
		return errorResponse(429, "rate_limited", "You've been chatting a lot! Please take a short break and try again soon.", "Tired");
	}

	const providers = getAvailableProviders();
	if (providers.length === 0) {
		console.error("[Bela API] No AI providers configured for Bela route");
		return errorResponse(503, "server_unconfigured", "Bela is not configured on the server right now.");
	}

	const startTs = Date.now();
	const deadline = startTs + TOTAL_BUDGET_MS;
	let firstFailure = null;
	for (let index = 0; index < providers.length; index += 1) {
		const provider = providers[index];
		const providerStart = Date.now();
		// Fresh per attempt so a failed provider's searches never leak into
		// the cards of the one that answers.
		const searches = [];
		const useTools = config.classSearch && TOOL_PROVIDERS.has(provider);
		const ctx = {
			messages,
			maxTokens: config.maxTokens,
			deadline,
			useTools,
			system: buildSystemPrompt(mode, { toolsAvailable: useTools }),
			runTool: async (name, input) => {
				if (name !== SEARCH_CLASSES_TOOL.name) return JSON.stringify({ error: `Unknown tool ${name}` });
				if (searches.length >= MAX_SEARCHES_PER_REQUEST) {
					return JSON.stringify({ error: "Search limit reached for this message. Answer with what you have." });
				}
				if (!supabase) {
					return JSON.stringify({ error: "Class search is unavailable right now. Don't name any classes; suggest browsing Explore in the GoBela app." });
				}
				try {
					const { outcome, payload } = await searchClasses(supabase, input);
					searches.push(outcome.results.map((r) => r.row));
					return JSON.stringify(payload);
				} catch (error) {
					console.error(`[Bela API] search_classes failed: ${error.message}`);
					searches.push([]);
					return JSON.stringify({ error: "Class search is unavailable right now. Don't name any classes; suggest browsing Explore in the GoBela app." });
				}
			},
		};
		try {
			let reply = await callProvider(provider, ctx);
			if (!config.json && !reply.trim()) reply = FALLBACK_REPLY;
			const cards = config.classSearch ? selectCards(reply, searches) : [];
			const mood = pickMood({
				mode,
				userMessage: messages[messages.length - 1].content,
				cards,
				searched: searches.length > 0,
			});
			console.log(
				`[Bela API] success provider=${provider} model=${provider === "anthropic" ? ANTHROPIC_MODEL : provider === "openai" ? OPENAI_MODEL : GEMINI_MODEL} mode=${mode} legacy=${legacy} searches=${searches.length} cards=${cards.length} took=${Date.now() - providerStart}ms total=${Date.now() - startTs}ms messages=${messages.length} max_tokens=${config.maxTokens} fallback_count=${index}`,
			);
			// `reply` (+ provider_used/fallback_count on fallback) is the
			// original response shape; mode/mood/cards are additive.
			return NextResponse.json({
				reply,
				...(index === 0 ? {} : { provider_used: provider, fallback_count: index }),
				mode,
				mood,
				cards,
			});
		} catch (error) {
			const classified = classifyProviderError(provider, error);
			if (!firstFailure) firstFailure = classified;
			console.error(
				`[Bela API] provider_failed provider=${provider} code=${classified.code} status=${classified.status} mode=${mode} took=${Date.now() - providerStart}ms total=${Date.now() - startTs}ms messages=${messages.length} max_tokens=${config.maxTokens} detail=${error.message}`,
			);
			if (error?.code === "budget_exhausted") break;
		}
	}

	return errorResponse(
		firstFailure?.status || 502,
		firstFailure?.code || "upstream_unknown",
		firstFailure?.message || "Failed to get a response from Bela",
		firstFailure?.status === 429 ? "Tired" : "Sad",
	);
}
