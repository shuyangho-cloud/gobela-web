import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { NextResponse } from "next/server";

// Worst case is 3 sequential provider attempts at PROVIDER_TIMEOUT_MS each
// (36s) plus request overhead -- give the function room for that instead
// of relying on the platform default, which can be lower.
export const maxDuration = 45;

const BELA_SYSTEM = `You are Bela — GoBela's warm, helpful AI companion for Singapore families. You live on the GoBela website and inside the GoBela app.

ABOUT GOBELA:
GoBela is a family weekend planner built for Singapore parents. The app is available on iOS (App Store) and Android (Google Play). Here is what GoBela does:

• Discover tab: Browse curated enrichment classes and kids' activities in Singapore — Sports, Music, Art, Dance, Drama, Swimming, Martial Arts, and more. Filter by category, distance, and price. Tap any class to see details, reviews, and pricing, then tap "Book Trial" to book a trial session.
• Dine tab: Find family-friendly restaurants nearby. Shows Google ratings, Street View previews, Open Now status, and Near Me sorting.
• GoBela Circle tab: A parent community feed for sharing weekend tips, discoveries, and recommendations.
• Profile tab: Set up your child's profile (name, age, gender, interests), view My Bookings, and manage Saved Classes.
• Weekend Mode: Tap the Weekend button on Discover for a curated weekend plan combining classes, dining, and activities.
• Pass / Subscription: Monthly trial pass — one trial class per month at any partner school. Upgrade in the Profile tab.
• Booking flow: Browse Discover → tap a class → choose a time slot → confirm → pay via card. Booking confirmation sent instantly.
• Saved Classes: Tap the bookmark icon on any class to save it. View all in Profile → Saved Classes.
• Recipes: Family-friendly meal ideas tailored to the child's mood (hungry, picky, sick, adventurous).
• Bela AI (that's you!): In the app, available via the chat icon in Discover. On the website, you're the chat widget helping families before they download.

HOW TO GUIDE USERS:
- If asked "how do I find classes?" → open the GoBela app → Discover tab → browse or filter by category.
- If asked "how do I book a class?" → tap any class in Discover → tap "Book Trial" → choose a slot → pay.
- If asked "where are my bookings?" → Profile tab → My Bookings.
- If asked about the pass → Profile tab → upgrade for the monthly trial pass.
- If asked "how do I save a class?" → tap the bookmark icon on any class card.
- If asked how to download → App Store (iOS) or Google Play (Android), search "GoBela".

YOUR ROLE ON THE WEBSITE:
You are a preview of the full Bela experience. Help visitors understand what GoBela does, answer parenting and weekend planning questions, and encourage them to download the app. If someone asks something better answered inside the app (like specific class availability or booking), tell them to download GoBela.

CONTENT:
Help parents with:
- What to cook (meal ideas, recipes, Singapore-friendly ingredients)
- Where to dine (family-friendly restaurants, hawker centres, cafés)
- What enrichment classes or activities to book for their child
- How to plan weekends (personalised to kids' ages, mood, weather, budget)

Singapore context to reference:
- Places: East Coast Park, Gardens by the Bay, Sentosa, VivoCity, Polliwogs, KidZania, Science Centre, hawker centres (Old Airport Road, Maxwell, Lau Pa Sat)
- Food: chicken rice, char kway teow, nasi lemak, laksa, roti prata, bak kut teh
- Local context: HDB estates, MRT lines, NTUC FairPrice, school holidays, rainy season

TONE: Warm, practical, Singapore-specific, concise (2–4 sentences max). Always end with a helpful next step or follow-up question.`;

const anthropic = process.env.ANTHROPIC_API_KEY
	? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
	: null;
const openai = process.env.OPENAI_API_KEY
	? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
	: null;
const geminiApiKey = process.env.GEMINI_API_KEY || null;

// claude-sonnet-4-20250514 (a dated snapshot) carries an active Anthropic
// deprecation warning with an end-of-life of 2026-06-15 -- already past as
// of this fix -- so it was silently one bad-model-ID away from failing
// even after the account-level usage cap lifts. claude-sonnet-4-6 is the
// current, non-deprecated rolling alias and was the confirmed-working
// value before this file's model IDs were last touched.
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
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

function sanitizeMaxTokens(value) {
	const parsed = Number(value);
	if (!Number.isFinite(parsed)) return 400;
	return Math.max(64, Math.min(1200, Math.floor(parsed)));
}

function normalizeMessages(messages) {
	if (!Array.isArray(messages) || messages.length === 0) return null;
	const allowedRoles = new Set(["user", "assistant"]);
	const normalized = [];
	for (const message of messages) {
		if (!message || typeof message !== "object") return null;
		const role = typeof message.role === "string" ? message.role.trim().toLowerCase() : "";
		const content = typeof message.content === "string" ? message.content.trim() : "";
		if (!allowedRoles.has(role) || !content) return null;
		normalized.push({ role, content });
	}
	return normalized.length ? normalized : null;
}

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

// Bounds each provider attempt so a hung/slow provider can't burn the
// whole Vercel function's execution budget before the loop ever reaches a
// working fallback tier -- previously unbounded (SDK defaults are ~10 min).
const PROVIDER_TIMEOUT_MS = 12000;

async function callGemini(messages, system, maxTokens) {
	const res = await fetch(
		`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-goog-api-key": geminiApiKey,
			},
			body: JSON.stringify({
				systemInstruction: { parts: [{ text: system || BELA_SYSTEM }] },
				// Gemini uses "model" where Anthropic/OpenAI use "assistant".
				contents: messages.map((m) => ({
					role: m.role === "assistant" ? "model" : "user",
					parts: [{ text: m.content }],
				})),
				generationConfig: { maxOutputTokens: maxTokens },
			}),
			signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
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

async function callAnthropic(messages, system, maxTokens) {
	const response = await anthropic.messages.create(
		{
			model: ANTHROPIC_MODEL,
			max_tokens: maxTokens,
			system: system || BELA_SYSTEM,
			messages,
		},
		{ timeout: PROVIDER_TIMEOUT_MS },
	);
	return response.content
		.filter((block) => block.type === "text")
		.map((block) => block.text)
		.join("");
}

async function callOpenAI(messages, system, maxTokens) {
	const completion = await openai.chat.completions.create(
		{
			model: OPENAI_MODEL,
			max_tokens: maxTokens,
			messages: [
				{ role: "system", content: system || BELA_SYSTEM },
				...messages,
			],
		},
		{ timeout: PROVIDER_TIMEOUT_MS },
	);
	return completion.choices[0]?.message?.content ?? "";
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
	if (provider === "anthropic") return classifyAnthropicError(error);
	return classifyGenericProviderError(error);
}

async function callProvider(provider, messages, system, maxTokens) {
	if (provider === "anthropic") return callAnthropic(messages, system, maxTokens);
	if (provider === "openai") return callOpenAI(messages, system, maxTokens);
	if (provider === "gemini") return callGemini(messages, system, maxTokens);
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

export async function POST(request) {
	let body;
	try {
		body = await request.json();
	} catch (error) {
		console.error("[Bela API] Invalid JSON body:", error.message);
		return NextResponse.json({ error: "Invalid JSON body", code: "bad_request" }, { status: 400 });
	}

	const messages = normalizeMessages(body?.messages);
	const system = typeof body?.system === "string" && body.system.trim()
		? body.system.trim()
		: BELA_SYSTEM;
	const maxTokens = sanitizeMaxTokens(body?.max_tokens);

	if (!messages) {
		return NextResponse.json(
			{ error: "messages must be a non-empty array of { role, content } objects", code: "bad_request" },
			{ status: 400 },
		);
	}

	const providers = getAvailableProviders();
	if (providers.length === 0) {
		console.error("[Bela API] No AI providers configured for Bela route");
		return NextResponse.json(
			{ error: "Bela is not configured on the server right now.", code: "server_unconfigured" },
			{ status: 503 },
		);
	}

	const startTs = Date.now();
	let firstFailure = null;
	for (let index = 0; index < providers.length; index += 1) {
		const provider = providers[index];
		const providerStart = Date.now();
		try {
			const reply = await callProvider(provider, messages, system, maxTokens);
			console.log(
				`[Bela API] success provider=${provider} model=${provider === "anthropic" ? ANTHROPIC_MODEL : provider === "openai" ? OPENAI_MODEL : GEMINI_MODEL} took=${Date.now() - providerStart}ms total=${Date.now() - startTs}ms messages=${messages.length} max_tokens=${maxTokens} fallback_count=${index}`,
			);
			return NextResponse.json(
				index === 0
					? { reply }
					: { reply, provider_used: provider, fallback_count: index },
			);
		} catch (error) {
			const classified = classifyProviderError(provider, error);
			if (!firstFailure) firstFailure = classified;
			console.error(
				`[Bela API] provider_failed provider=${provider} code=${classified.code} status=${classified.status} took=${Date.now() - providerStart}ms total=${Date.now() - startTs}ms messages=${messages.length} max_tokens=${maxTokens} detail=${error.message}`,
			);
		}
	}

	return NextResponse.json(
		{ error: firstFailure?.message || "Failed to get a response from Bela", code: firstFailure?.code || "upstream_unknown" },
		{ status: firstFailure?.status || 502 },
	);
}
