import { describe, expect, it } from "vitest";
import { normalizeDay, scheduleMatchesDay } from "./schedule";

describe("scheduleMatchesDay", () => {
	it.each([
		["Sat 1:00pm–2:45pm", "saturday", true],
		["Sat 1:00pm–2:45pm", "sunday", false],
		["SUN 11.00AM - 12.00PM", "sunday", true],
		["Thurs 5pm", "thursday", true],
		["Mon/Tue/Wed/Thu 4:00-5:30pm, Sat 10:00am and 12:30pm", "wednesday", true],
		["Mon/Tue/Wed/Thu 4:00-5:30pm, Sat 10:00am and 12:30pm", "friday", false],
		["Wed - Fri 12:45pm - 2pm", "thursday", true],
		["Wed - Fri 12:45pm - 2pm", "saturday", false],
		["Weekdays (Tue-Fri) 1-7pm · Weekends (Sat-Sun) 9am-5pm", "monday", true],
		["Monday–Sunday, subject to availability", "wednesday", true],
		["Saturdays 9-10am", "saturday", true],
		["Weekends — contact for schedule", "sunday", true],
		["Weekends — contact for schedule", "tuesday", false],
		["Weekday evenings & weekends", "weekday", true],
		["Sat 1:00pm–2:45pm", "weekend", true],
		["Thurs 5pm", "weekend", false],
		["By arrangement", "tuesday", true],
		["Flexible — coach comes to you", "sunday", true],
		["45-min sessions, 4x/month", "monday", false],
		["School holidays · check website for upcoming dates", "saturday", false],
		["", "saturday", false],
	] as const)("%s on %s → %s", (schedule, day, expected) => {
		expect(scheduleMatchesDay(schedule, day)).toBe(expected);
	});
});

describe("normalizeDay", () => {
	it.each([
		["Saturday", "saturday"],
		["sat", "saturday"],
		["Thurs", "thursday"],
		["weekends", "weekend"],
		["weekday", "weekday"],
		["someday", null],
		[42, null],
	])("%s → %s", (input, expected) => {
		expect(normalizeDay(input)).toBe(expected);
	});
});
