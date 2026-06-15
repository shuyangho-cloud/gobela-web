import { type NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
	const { password, title, body, data } = await req.json();

	if (password !== ADMIN_PASSWORD) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	if (!title?.trim() || !body?.trim()) {
		return NextResponse.json(
			{ error: "Title and body are required" },
			{ status: 400 },
		);
	}

	const res = await fetch(`${SUPABASE_URL}/functions/v1/broadcast-push`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			apikey: SUPABASE_ANON,
			"x-admin-key": ADMIN_PASSWORD,
		},
		body: JSON.stringify({
			title: title.trim(),
			body: body.trim(),
			data: data ?? {},
		}),
	});

	const result = await res.json();
	if (!res.ok)
		return NextResponse.json({ error: result.error }, { status: 500 });
	return NextResponse.json(result);
}
