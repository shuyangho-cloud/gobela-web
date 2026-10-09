/**
 * Parses the free-text `enrichment_classes.age_range` column into a month
 * range so Ask Bela can filter by a child's age. Real values look like
 * "3–5 yrs", "6 months – 3 yrs", "40+ months", "5.5 yrs & above",
 * "P1–P6, 6–12 yrs", "6-14" and "All ages".
 *
 * Bounds are inclusive. A whole-year upper bound means "up to the end of
 * that year of age" ("3–5 yrs" accepts a child of 5y11m), while fractional
 * or month-based bounds are taken literally. `max: null` means no upper
 * bound. Returns null when nothing usable can be read.
 */
export type AgeRangeMonths = { min: number; max: number | null };

const UNIT = "(months?|mths?|mos?|m|years?|yrs?|yr|y)";
const NUM = "(\\d+(?:\\.\\d+)?)";

const RANGE_RE = new RegExp(`${NUM}\\s*${UNIT}?\\s*-\\s*${NUM}\\s*${UNIT}?(?![a-z])`);
const OPEN_RE = new RegExp(
	`${NUM}\\s*${UNIT}?\\s*(?:\\+|(?:&|and|or)\\s*(?:above|up|over|older)|above|upwards|up|over|older)\\s*${UNIT}?`,
);
const UNDER_RE = new RegExp(`(?:under|below|up to)\\s*${NUM}\\s*${UNIT}?`);
const SINGLE_RE = new RegExp(`${NUM}\\s*${UNIT}(?![a-z])`);

function isMonths(unit: string | undefined): boolean {
	return Boolean(unit && unit.startsWith("m"));
}

function toMonths(value: number, unit: string | undefined, isUpper: boolean): number {
	if (isMonths(unit)) return Math.round(value);
	if (isUpper && Number.isInteger(value)) return value * 12 + 11;
	return Math.round(value * 12);
}

export function parseAgeRangeMonths(text: unknown): AgeRangeMonths | null {
	if (typeof text !== "string") return null;
	const s = text
		.toLowerCase()
		.replace(/[‐-―−]/g, "-")
		.replace(/\bto\b/g, "-");
	if (!s.trim()) return null;
	if (/\ball ages\b/.test(s)) return { min: 0, max: null };

	const range = RANGE_RE.exec(s);
	if (range) {
		const [, a, unitA, b, unitB] = range;
		// "1.5–2.5 yrs": the unit is only written once, after the upper bound.
		const lowUnit = unitA ?? unitB;
		const min = toMonths(Number(a), lowUnit, false);
		const max = toMonths(Number(b), unitB ?? unitA, true);
		return min <= max ? { min, max } : null;
	}

	const open = OPEN_RE.exec(s);
	if (open) {
		const [, a, unitA, unitB] = open;
		return { min: toMonths(Number(a), unitA ?? unitB, false), max: null };
	}

	const under = UNDER_RE.exec(s);
	if (under) {
		const [, a, unit] = under;
		// "under 6" excludes 6 itself.
		return { min: 0, max: Math.max(0, toMonths(Number(a), unit, false) - 1) };
	}

	const single = SINGLE_RE.exec(s);
	if (single) {
		const [, a, unit] = single;
		const value = Number(a);
		return { min: toMonths(value, unit, false), max: toMonths(value, unit, true) };
	}

	return null;
}

export function ageRangeIncludes(range: AgeRangeMonths | null, ageMonths: number): boolean {
	if (!range) return false;
	return ageMonths >= range.min && (range.max === null || ageMonths <= range.max);
}
