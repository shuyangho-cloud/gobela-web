import { describe, expect, it } from "vitest";
import { ageRangeIncludes, parseAgeRangeMonths } from "./ageRange";

describe("parseAgeRangeMonths", () => {
	it.each([
		["3–5 yrs", { min: 36, max: 71 }],
		["3-6 Yrs", { min: 36, max: 83 }],
		["12-16 Years", { min: 144, max: 203 }],
		["6-14", { min: 72, max: 179 }],
		["10-11", { min: 120, max: 143 }],
		["1.5–2.5 yrs", { min: 18, max: 30 }],
		["1–3.5 yrs", { min: 12, max: 42 }],
		["6 months – 3 yrs", { min: 6, max: 47 }],
		["6m–3yrs", { min: 6, max: 47 }],
		["18 to 36 months", { min: 18, max: 36 }],
		["P1–P6, 6–12 yrs", { min: 72, max: 155 }],
		["Upper Primary, approx. 9–12 yrs", { min: 108, max: 155 }],
		["40+ months", { min: 40, max: null }],
		["4 yrs & above (placed by English proficiency level, not age)", { min: 48, max: null }],
		["5 yrs & up", { min: 60, max: null }],
		["5.5 yrs & above", { min: 66, max: null }],
		["7 yrs+", { min: 84, max: null }],
		["under 6 yrs", { min: 0, max: 71 }],
		["All ages", { min: 0, max: null }],
		["4 yrs", { min: 48, max: 59 }],
	])("parses %s", (text, expected) => {
		expect(parseAgeRangeMonths(text)).toEqual(expected);
	});

	it.each([[""], ["Beginners"], ["P1–P6"], [null], [undefined], [42]])("returns null for %s", (text) => {
		expect(parseAgeRangeMonths(text)).toBeNull();
	});
});

describe("ageRangeIncludes", () => {
	const threeToFive = parseAgeRangeMonths("3–5 yrs");

	it("includes the whole of the upper year", () => {
		expect(ageRangeIncludes(threeToFive, 36)).toBe(true);
		expect(ageRangeIncludes(threeToFive, 71)).toBe(true);
		expect(ageRangeIncludes(threeToFive, 72)).toBe(false);
		expect(ageRangeIncludes(threeToFive, 35)).toBe(false);
	});

	it("treats open-ended ranges as having no upper bound", () => {
		expect(ageRangeIncludes(parseAgeRangeMonths("40+ months"), 200)).toBe(true);
	});

	it("never matches an unparseable range", () => {
		expect(ageRangeIncludes(null, 48)).toBe(false);
	});
});
