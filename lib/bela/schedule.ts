/**
 * Keyword matching of the free-text `enrichment_classes.schedule` column
 * against a day of week. Real values look like "Sat 1:00pm–2:45pm",
 * "Mon/Tue/Wed/Thu 4:00-5:30pm", "Wed - Fri 12:45pm", "Weekdays & weekends",
 * "Monday–Sunday, subject to availability" and "By arrangement".
 */
export const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
export type DayFilter = (typeof DAYS)[number] | "weekend" | "weekday";

const DAY_TOKEN =
	"(mon(?:day)?|tues?(?:day)?|wed(?:nesday)?|thu(?:rs?)?(?:day)?|fri(?:day)?|sat(?:urday)?|sun(?:day)?)s?";
const DAY_TOKEN_RE = new RegExp(`\\b${DAY_TOKEN}\\b`, "g");
const DAY_RANGE_RE = new RegExp(`\\b${DAY_TOKEN}\\s*(?:-|to)\\s*${DAY_TOKEN}\\b`, "g");
// Schedules that don't pin a day ("By arrangement", "Flexible — coach comes
// to you") are kept as matches: they can likely be booked on the asked day,
// and Bela is told to mention that the schedule is arranged directly.
const ANY_DAY_RE = /\b(daily|every ?day|most days|any ?day|7 days|flexible|by arrangement|by appointment)\b/;

function dayIndex(token: string): number {
	return DAYS.findIndex((day) => day.startsWith(token.slice(0, 3)));
}

export function normalizeDay(value: unknown): DayFilter | null {
	if (typeof value !== "string") return null;
	const v = value.trim().toLowerCase();
	if (!v) return null;
	if (/^weekends?$/.test(v)) return "weekend";
	if (/^weekdays?$/.test(v)) return "weekday";
	const match = new RegExp(`^${DAY_TOKEN}$`).exec(v);
	if (!match) return null;
	const index = dayIndex(match[1]);
	return index >= 0 ? DAYS[index] : null;
}

/** Days (0 = Monday … 6 = Sunday) a schedule text mentions, or "any". */
export function scheduleDays(schedule: unknown): Set<number> | "any" {
	const days = new Set<number>();
	if (typeof schedule !== "string") return days;
	const s = schedule.toLowerCase().replace(/[‐-―−]/g, "-");
	if (ANY_DAY_RE.test(s)) return "any";
	if (/\bweekends?\b/.test(s)) {
		days.add(5);
		days.add(6);
	}
	if (/\bweekdays?\b/.test(s)) for (let d = 0; d < 5; d += 1) days.add(d);
	for (const [, from, to] of s.matchAll(DAY_RANGE_RE)) {
		const start = dayIndex(from);
		const end = dayIndex(to);
		if (start < 0 || end < 0) continue;
		for (let d = start; ; d = (d + 1) % 7) {
			days.add(d);
			if (d === end) break;
		}
	}
	for (const [, token] of s.matchAll(DAY_TOKEN_RE)) {
		const index = dayIndex(token);
		if (index >= 0) days.add(index);
	}
	return days;
}

export function scheduleMatchesDay(schedule: unknown, day: DayFilter): boolean {
	const days = scheduleDays(schedule);
	if (days === "any") return true;
	if (day === "weekend") return days.has(5) || days.has(6);
	if (day === "weekday") return [0, 1, 2, 3, 4].some((d) => days.has(d));
	return days.has(DAYS.indexOf(day));
}
