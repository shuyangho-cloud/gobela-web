import { describe, expect, it } from "vitest";
import { distanceKm, resolveArea } from "./areas";

describe("resolveArea", () => {
	it.each([
		["Bishan", "Bishan"],
		["bishan mrt", "Bishan"],
		["near AMK", "Ang Mo Kio"],
		["Toa Payoh MRT station", "Toa Payoh"],
		["Bedok Reservoir", "Bedok Reservoir"],
		["East Coast Park", "East Coast"],
		["the east side", "East"],
		["Tiong Bahru / Havelock MRT", "Tiong Bahru"],
		["Kick Off! Kovan, Singapore", "Kovan"],
		["27 West Coast Highway #02-01/02, S117867", "West Coast"],
		// Longest name wins when several appear.
		["Orchard (Somerset)", "Somerset"],
	])("resolves %s → %s", (input, expected) => {
		expect(resolveArea(input)?.name).toBe(expected);
	});

	it.each([["Singapore"], ["Singapore (contact for venue)"], [""], ["Narnia"], [null]])(
		"returns null for %s",
		(input) => {
			expect(resolveArea(input)).toBeNull();
		},
	);

	it("does not match a name inside another word", () => {
		// "ubi" must not match inside "Kubis" and "east" not inside "Eastwoodish".
		expect(resolveArea("Kubis")).toBeNull();
	});
});

describe("distanceKm", () => {
	it("is ~0 for the same point and roughly right between towns", () => {
		const bishan = resolveArea("Bishan")!;
		const amk = resolveArea("Ang Mo Kio")!;
		const tampines = resolveArea("Tampines")!;
		expect(distanceKm(bishan.lat, bishan.lng, bishan.lat, bishan.lng)).toBeCloseTo(0, 5);
		expect(distanceKm(bishan.lat, bishan.lng, amk.lat, amk.lng)).toBeGreaterThan(1.5);
		expect(distanceKm(bishan.lat, bishan.lng, amk.lat, amk.lng)).toBeLessThan(3);
		expect(distanceKm(bishan.lat, bishan.lng, tampines.lat, tampines.lng)).toBeGreaterThan(9);
	});
});
