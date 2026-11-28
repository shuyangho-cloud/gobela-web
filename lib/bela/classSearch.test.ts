import { describe, expect, it } from "vitest";
import { type ClassRow, filterAndRankClasses, normalizeFilters, toCard, toToolPayload } from "./classSearch";

function row(overrides: Partial<ClassRow>): ClassRow {
	return {
		id: overrides.name ?? "x",
		name: "Class",
		provider: "Provider",
		category: "music",
		location: null,
		address: null,
		lat: null,
		lng: null,
		is_islandwide: false,
		age_range: "3–12 yrs",
		schedule: "Sat 10am",
		trial_price: 30,
		trial_label: null,
		monthly_price: 150,
		rating: 4.5,
		review_count: 10,
		tags: [],
		is_partner: true,
		booking_mode: "gobela",
		booking_url: null,
		website_url: null,
		image_url: null,
		sort_order: 100,
		...overrides,
	};
}

const ROWS: ClassRow[] = [
	row({ id: 1, name: "Bishan Piano", lat: 1.351, lng: 103.8485, tags: ["piano"] }),
	row({ id: 2, name: "AMK Violin", lat: 1.37, lng: 103.8496 }),
	row({ id: 3, name: "Tampines Drums", lat: 1.354, lng: 103.945 }),
	row({ id: 4, name: "Islandwide Ukulele", is_islandwide: true }),
	row({ id: 5, name: "Toa Payoh Guitar (no coords)", location: "Toa Payoh" }),
	row({ id: 6, name: "Mystery Venue Music", location: "Singapore (contact for venue)" }),
	row({ id: 7, name: "Toddler Music", lat: 1.351, lng: 103.8485, age_range: "18–36 months" }),
	row({ id: 8, name: "Weekday Swim", category: "swimming", lat: 1.351, lng: 103.8485, schedule: "Tue 4pm", trial_price: 45 }),
	row({ id: 9, name: "Non-partner Choir", lat: 1.351, lng: 103.8485, is_partner: false, sort_order: 1 }),
];

const names = (filters: Parameters<typeof filterAndRankClasses>[1]) =>
	filterAndRankClasses(ROWS, filters).results.map((r) => r.row.name);

describe("filterAndRankClasses — area matching", () => {
	it("keeps nearby rows nearest-first, then islandwide; drops far and location-less rows", () => {
		const outcome = filterAndRankClasses(ROWS, { area: "Bishan MRT", category: "music", child_age_months: 60 });
		const got = outcome.results.map((r) => r.row.name);
		expect(outcome.area?.name).toBe("Bishan");
		// Bishan-coordinate rows (distance 0) come first, Toa Payoh text match
		// and AMK next, islandwide last. Tampines (~10 km) and the "Singapore"
		// row with no usable location are excluded.
		expect(got.slice(0, 2)).toEqual(expect.arrayContaining(["Bishan Piano", "Non-partner Choir"]));
		expect(got).toContain("Toa Payoh Guitar (no coords)");
		expect(got).toContain("AMK Violin");
		expect(got).not.toContain("Tampines Drums");
		expect(got).not.toContain("Mystery Venue Music");
		expect(outcome.total).toBe(5);
		expect(got.length).toBe(5);
		const islandwide = filterAndRankClasses(ROWS, { area: "Tampines", category: "music" }).results;
		expect(islandwide.map((r) => r.row.name)).toEqual(["Tampines Drums", "Islandwide Ukulele"]);
		expect(islandwide[1].distanceKm).toBeNull();
		expect(islandwide[1].islandwide).toBe(true);
	});

	it("flags an unrecognised area and does not filter by it", () => {
		const outcome = filterAndRankClasses(ROWS, { area: "Narnia", category: "swimming" });
		expect(outcome.unknownArea).toBe(true);
		expect(outcome.results.map((r) => r.row.name)).toEqual(["Weekday Swim"]);
		expect(toToolPayload(outcome, { area: "Narnia" }).notes[0]).toMatch(/not recognised/);
	});
});

describe("filterAndRankClasses — other filters", () => {
	it("filters by child age in months", () => {
		expect(names({ child_age_months: 24 })).toEqual(["Toddler Music"]);
	});

	it("filters by day of week", () => {
		expect(names({ day: "tuesday" })).toEqual(["Weekday Swim"]);
		expect(names({ day: "weekday" })).toEqual(["Weekday Swim"]);
	});

	it("filters by max trial price and partner-only, and ranks partners first", () => {
		expect(names({ max_trial_price: 40, category: "swimming" })).toEqual([]);
		expect(names({ partner_only: true })).not.toContain("Non-partner Choir");
		expect(names({})[0]).not.toBe("Non-partner Choir");
	});

	it("matches a keyword against name and tags", () => {
		expect(names({ keyword: "piano" })).toEqual(["Bishan Piano"]);
	});

	it("returns at most 5 results and reports the total", () => {
		const outcome = filterAndRankClasses(ROWS, {});
		expect(outcome.results).toHaveLength(5);
		expect(outcome.total).toBe(ROWS.length);
	});

	it("tells the model to say 'not on GoBela yet' when nothing matches", () => {
		const outcome = filterAndRankClasses(ROWS, { category: "coding" });
		const payload = toToolPayload(outcome, { category: "coding" });
		expect(payload.classes).toEqual([]);
		expect(payload.notes.join(" ")).toMatch(/isn't on GoBela yet/);
	});
});

describe("normalizeFilters", () => {
	it("keeps valid filters and drops junk from the model", () => {
		expect(
			normalizeFilters({
				category: "Music",
				child_age_months: "54",
				area: " Bishan ",
				day: "Sat",
				max_trial_price: 40,
				partner_only: true,
				extra: "ignored",
			}),
		).toEqual({ category: "music", child_age_months: 54, area: "Bishan", day: "saturday", max_trial_price: 40, partner_only: true });
		expect(normalizeFilters({ category: "knitting", child_age_months: -3, day: "funday", max_trial_price: "free" })).toEqual({});
		expect(normalizeFilters(null)).toEqual({});
	});
});

describe("toCard", () => {
	it("only exposes http(s) URLs", () => {
		expect(toCard(row({ booking_url: "javascript:alert(1)", website_url: "https://example.sg" })).url).toBe("https://example.sg");
		expect(toCard(row({ image_url: "data:image/png;base64,xx" })).image_url).toBeNull();
	});
});
