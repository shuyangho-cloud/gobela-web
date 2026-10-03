import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { isValidEmail } from "@/lib/validation";
import { checkRateLimit, clientIdentifier } from "@/lib/rateLimit";
import { upsertBrevoContact, PARENT_LIST_ID } from "@/lib/brevo";

export async function POST(request) {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
	);
	try {
		const { name, email, child_age, interests, preferred_area, company } =
			await request.json();

		// Honeypot — real users never fill this hidden field. Pretend success
		// so bots don't learn the field is being checked.
		if (company) {
			return NextResponse.json({ ok: true });
		}

		if (!name?.trim() || !email?.trim()) {
			return NextResponse.json(
				{ error: "Name and email are required" },
				{ status: 400 },
			);
		}

		if (!isValidEmail(email)) {
			return NextResponse.json(
				{ error: "Please enter a valid email address" },
				{ status: 400 },
			);
		}

		const allowed = await checkRateLimit(supabase, {
			route: "waitlist",
			identifier: clientIdentifier(request),
			max: 5,
			windowSeconds: 600,
		});
		if (!allowed) {
			return NextResponse.json(
				{ error: "Too many requests, please try again later" },
				{ status: 429 },
			);
		}

		const cleanEmail = email.trim().toLowerCase();

		const { error } = await supabase.from("waitlist").insert({
			name: name.trim(),
			email: cleanEmail,
			child_age: child_age || null,
		});

		if (error && error.code !== "23505") {
			console.error("Supabase error:", error);
			return NextResponse.json({ error: "Failed to save" }, { status: 500 });
		}

		// Sync to Brevo's parent contact list — fire-and-forget, same as the
		// existing partner-application notification email: a Brevo failure
		// should never fail this request, since the signup itself already
		// succeeded in our own database.
		try {
			const result = await upsertBrevoContact({
				email: cleanEmail,
				listId: PARENT_LIST_ID,
				attributes: {
					CHILD_AGE_GROUP: child_age,
					INTERESTS: interests,
					PREFERRED_AREA: preferred_area,
				},
			});
			if (!result.ok) {
				console.error("Brevo contact sync failed:", result.error);
			}
		} catch (brevoErr) {
			console.error("Brevo contact sync failed:", brevoErr);
		}

		return NextResponse.json({ ok: true, duplicate: error?.code === "23505" });
	} catch (err) {
		console.error("Waitlist error:", err);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
