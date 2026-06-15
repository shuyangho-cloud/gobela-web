import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request) {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
	);
	try {
		const { name, email, child_age } = await request.json();

		if (!name?.trim() || !email?.trim()) {
			return NextResponse.json(
				{ error: "Name and email are required" },
				{ status: 400 },
			);
		}

		const { error } = await supabase.from("waitlist").insert({
			name: name.trim(),
			email: email.trim().toLowerCase(),
			child_age: child_age || null,
		});

		if (error) {
			if (error.code === "23505") {
				return NextResponse.json({ ok: true, duplicate: true });
			}
			console.error("Supabase error:", error);
			return NextResponse.json({ error: "Failed to save" }, { status: 500 });
		}

		return NextResponse.json({ ok: true });
	} catch (err) {
		console.error("Waitlist error:", err);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
