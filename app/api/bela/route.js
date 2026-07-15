import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { NextResponse } from "next/server";

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

const anthropic = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY,
});

// Fallback provider — only used when the primary Anthropic call fails.
// null (not undefined) when unconfigured, so callers can check truthiness
// without an env-var read on every request.
const openai = process.env.OPENAI_API_KEY
	? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
	: null;
const OPENAI_FALLBACK_MODEL = "gpt-4o-mini";

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
	let messages, system, max_tokens;
	try {
		({ messages, system, max_tokens } = await request.json());
	} catch (error) {
		console.error("[Bela API] Invalid JSON body:", error.message);
		return NextResponse.json({ error: "Invalid JSON body", code: "bad_request" }, { status: 400 });
	}

	if (!messages || !Array.isArray(messages)) {
		return NextResponse.json(
			{ error: "messages array required", code: "bad_request" },
			{ status: 400 },
		);
	}

	const startTs = Date.now();
	let response;
	try {
		response = await anthropic.messages.create({
			model: "claude-sonnet-4-6",
			max_tokens: max_tokens || 400,
			system: system || BELA_SYSTEM,
			messages,
		});
	} catch (error) {
		const took = Date.now() - startTs;
		const { status, code, message } = classifyAnthropicError(error);
		// Structured, single-line log: status/code/request_id/duration up front
		// so `vercel logs` (or any log search) surfaces the category without
		// needing to expand the full error object, unlike the previous
		// console.error(error) which required pulling raw JSON logs to find
		// the actual cause (this was a real incident — see route history).
		console.error(
			`[Bela API] upstream_error code=${code} status=${status} anthropic_status=${error.status ?? "n/a"} request_id=${error.requestID ?? "n/a"} took=${took}ms messages=${messages.length} max_tokens=${max_tokens || 400} detail=${error.message}`,
		);

		if (openai) {
			const fallbackStart = Date.now();
			try {
				const completion = await openai.chat.completions.create({
					model: OPENAI_FALLBACK_MODEL,
					max_tokens: max_tokens || 400,
					messages: [
						{ role: "system", content: system || BELA_SYSTEM },
						...messages,
					],
				});
				const reply = completion.choices[0]?.message?.content ?? "";
				console.log(
					`[Bela API] fallback_success provider=openai model=${OPENAI_FALLBACK_MODEL} took=${Date.now() - fallbackStart}ms after_anthropic_code=${code}`,
				);
				return NextResponse.json({ reply, fallback: "openai" });
			} catch (fallbackError) {
				console.error(
					`[Bela API] fallback_failed provider=openai took=${Date.now() - fallbackStart}ms after_anthropic_code=${code} detail=${fallbackError.message}`,
				);
				// fall through — return the original Anthropic error below
			}
		}

		return NextResponse.json({ error: message, code }, { status });
	}
	console.log(`[Bela API] Anthropic call took ${Date.now() - startTs}ms; messages=${messages.length}; max_tokens=${max_tokens || 400}`);

	const reply = response.content
		.filter((block) => block.type === "text")
		.map((block) => block.text)
		.join("");

	return NextResponse.json({ reply });
}
