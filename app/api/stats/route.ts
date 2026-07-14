import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const revalidate = 300; // cache for 5 minutes

export async function GET() {
	try {
		// Service-role key, not anon: trial_bookings has RLS scoped to the
		// owning user, so an anon-key count silently returns 0 regardless of
		// the real total (found live 2026-07-14 — a partner flagged the
		// homepage stat looking broken).
		const supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.SUPABASE_SERVICE_ROLE_KEY!,
		);
		const { count } = await supabase
			.from("trial_bookings")
			.select("*", { count: "exact", head: true })
			.not("status", "in", "(cancelled,expired)");

		return NextResponse.json({ bookings: count ?? 0 });
	} catch {
		return NextResponse.json({ bookings: 0 });
	}
}
