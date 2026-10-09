/**
 * Request validation for /api/bela. Everything a caller can influence is
 * bounded here: which server-side prompt runs (by named mode, never by a
 * caller-supplied system prompt), how much history is sent upstream, and
 * how long each message may be. max_tokens is fixed per mode server-side.
 */

export const BELA_MODES = ["general", "parenting", "feeding", "itinerary", "recipes", "facts"] as const;
export type BelaMode = (typeof BELA_MODES)[number];

export const MAX_BODY_BYTES = 128 * 1024;
export const MAX_HISTORY_MESSAGES = 12;
export const MAX_MESSAGE_CHARS = 1000;
// Old app builds put their whole instruction block (itinerary/recipe JSON
// templates, ingredient lists, fact-extraction transcripts) into the user
// message, which routinely exceeds 1000 chars. Requests that still send the
// legacy `system` field get this larger cap so those builds keep working.
export const LEGACY_MAX_MESSAGE_CHARS = 4000;

export type BelaMessage = { role: "user" | "assistant"; content: string };

export type ValidRequest = { ok: true; mode: BelaMode; legacy: boolean; messages: BelaMessage[] };
export type InvalidRequest = { ok: false; status: number; code: string; error: string };

/**
 * Maps an old client's `system` text to a server mode. The text itself is
 * never forwarded to a model — only these keywords are read from it.
 */
export function modeFromLegacySystem(system: string): BelaMode {
	const s = system.toLowerCase();
	// Checked most-specific first: the app's parenting prompt also mentions
	// "itineraries" and "cooking", so those words alone aren't used.
	if (s.includes("preference facts")) return "facts";
	if (s.includes("french bulldog")) return "itinerary";
	if (s.includes("cooking assistant")) return "recipes";
	if (s.includes("feeding") || s.includes("weaning") || s.includes("toddler nutrition")) return "feeding";
	return "parenting";
}

export function resolveMode(body: Record<string, unknown>): { mode: BelaMode; legacy: boolean } | null {
	const legacy = typeof body.system === "string" && body.system.trim().length > 0;
	if (body.mode !== undefined && body.mode !== null) {
		const mode = typeof body.mode === "string" ? body.mode.trim().toLowerCase() : "";
		return (BELA_MODES as readonly string[]).includes(mode) ? { mode: mode as BelaMode, legacy } : null;
	}
	if (legacy) return { mode: modeFromLegacySystem(body.system as string), legacy };
	return { mode: "general", legacy: false };
}

function invalid(code: string, error: string, status = 400): InvalidRequest {
	return { ok: false, status, code, error };
}

export function validateBelaRequest(body: unknown): ValidRequest | InvalidRequest {
	if (!body || typeof body !== "object" || Array.isArray(body)) {
		return invalid("bad_request", "Request body must be a JSON object");
	}
	const record = body as Record<string, unknown>;
	const resolved = resolveMode(record);
	if (!resolved) return invalid("bad_mode", `mode must be one of: ${BELA_MODES.join(", ")}`);

	const raw = record.messages;
	if (!Array.isArray(raw) || raw.length === 0) {
		return invalid("bad_request", "messages must be a non-empty array of { role, content } objects");
	}
	const messages: BelaMessage[] = [];
	for (const message of raw) {
		if (!message || typeof message !== "object") {
			return invalid("bad_request", "messages must be a non-empty array of { role, content } objects");
		}
		const m = message as Record<string, unknown>;
		const role = typeof m.role === "string" ? m.role.trim().toLowerCase() : "";
		const content = typeof m.content === "string" ? m.content.trim() : "";
		if ((role !== "user" && role !== "assistant") || !content) {
			return invalid("bad_request", "messages must be a non-empty array of { role, content } objects");
		}
		messages.push({ role, content });
	}

	const last = messages[messages.length - 1];
	if (last.role !== "user") return invalid("bad_request", "The last message must be from the user");

	const cap = resolved.legacy ? LEGACY_MAX_MESSAGE_CHARS : MAX_MESSAGE_CHARS;
	if (last.content.length > cap) {
		return invalid("message_too_long", `Please keep your message under ${cap} characters.`);
	}

	// Clients keep the whole thread client-side (old app builds never trim
	// it), so older turns are trimmed here instead of rejected.
	const recent = messages.slice(-MAX_HISTORY_MESSAGES).map((m) =>
		m.content.length > cap ? { ...m, content: `${m.content.slice(0, cap)}…` } : m,
	);
	while (recent.length > 0 && recent[0].role !== "user") recent.shift();

	return { ok: true, mode: resolved.mode, legacy: resolved.legacy, messages: recent };
}

const ALLOWED_ORIGINS = new Set(["https://gobela.sg", "https://www.gobela.sg"]);
const VERCEL_PREVIEW_RE = /^https:\/\/gobela-web(?:-[a-z0-9-]+)?\.vercel\.app$/;
const LOCALHOST_RE = /^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/;

/**
 * Browser requests carry an Origin header; only our own sites may call the
 * endpoint from a browser. Requests with no Origin (the mobile app, curl)
 * are allowed and rely on the rate limit. Extra origins can be added with
 * BELA_ALLOWED_ORIGINS (comma-separated).
 */
export function isAllowedOrigin(origin: string | null, extra: string | undefined = process.env.BELA_ALLOWED_ORIGINS): boolean {
	if (origin === null || origin === "") return true;
	const value = origin.trim().toLowerCase();
	if (ALLOWED_ORIGINS.has(value) || VERCEL_PREVIEW_RE.test(value) || LOCALHOST_RE.test(value)) return true;
	const extras = (extra ?? "")
		.split(",")
		.map((v) => v.trim().toLowerCase().replace(/\/$/, ""))
		.filter(Boolean);
	return extras.includes(value);
}

export function isBelaEnabled(value: string | undefined = process.env.BELA_ENABLED): boolean {
	if (value === undefined) return true;
	return !/^(0|false|off|no|disabled)$/i.test(value.trim());
}
