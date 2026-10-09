import { type ClassCard, type ClassRow, MAX_RESULTS, toCard } from "./classSearch";
import type { BelaMode } from "./request";

/** Bela expression names shared with the app/website artwork. */
export const BELA_MOODS = [
	"Happy",
	"Thinking",
	"Excited",
	"Recommending",
	"Exploring",
	"Sad",
	"Encouraging",
	"Sending Love",
	"Tired",
] as const;
export type BelaMood = (typeof BELA_MOODS)[number];

const CARE_RE = /\b(sick|fever|vomit\w*|rash|allerg\w*|injur\w*|hurt|bleed\w*|cough\w*|diarrh\w*|hospital|doctor|medicine|medication|asthma|eczema|choking|fell|bump(ed)? (his|her|their) head)\b/i;
const STRUGGLE_RE = /\b(tired|exhausted|stress\w*|overwhelm\w*|tantrum\w*|meltdown\w*|struggl\w*|frustrat\w*|worried|anxious|can'?t cope|burn(ed|t)? out|picky|won'?t eat)\b/i;

/**
 * Picks which Bela expression the client should show. Errors use Sad /
 * Tired (set by the route); "Thinking" is left for clients to show while
 * a reply is loading.
 */
export function pickMood({
	mode,
	userMessage,
	cards,
	searched,
}: {
	mode: BelaMode;
	userMessage: string;
	cards: ClassCard[];
	searched: boolean;
}): BelaMood {
	if (CARE_RE.test(userMessage)) return "Sending Love";
	if (cards.length > 0) return "Recommending";
	if (searched) return "Exploring";
	if (STRUGGLE_RE.test(userMessage)) return "Encouraging";
	if (mode === "itinerary") return "Excited";
	return "Happy";
}

/**
 * Cards come only from search_classes results. Prefer the classes Bela
 * actually named in the reply; if the reply names none (paraphrased),
 * fall back to the most recent search's results.
 */
export function selectCards(reply: string, searches: ClassRow[][]): ClassCard[] {
	const seen = new Map<string, ClassRow>();
	for (const rows of searches) for (const row of rows) seen.set(String(row.id), row);
	const text = reply.toLowerCase();
	const named = [...seen.values()].filter((row) => typeof row.name === "string" && row.name.trim() && text.includes(row.name.trim().toLowerCase()));
	const rows = named.length > 0 ? named : (searches[searches.length - 1] ?? []);
	return rows.slice(0, MAX_RESULTS).map(toCard);
}
