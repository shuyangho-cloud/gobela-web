import { adminAccess } from '@/lib/superbrain/admin';
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request) {
	const denied = await adminAccess(request);
	if (denied) return denied;

	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.SUPABASE_SERVICE_ROLE_KEY,
	);

	const status = new URL(request.url).searchParams.get("status") || "pending";
	const { data, error } = await supabase
		.from("partner_applications")
		.select("*")
		.eq("status", status)
		.order("created_at", { ascending: false });

	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json({ applications: data });
}
