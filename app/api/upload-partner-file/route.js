import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request) {
	try {
		const formData = await request.formData();
		const file = formData.get("file");
		const label = formData.get("label") || "photo"; // 'logo' | 'photo'

		if (!file)
			return NextResponse.json({ error: "No file provided" }, { status: 400 });

		const supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL,
			process.env.SUPABASE_SERVICE_ROLE_KEY,
		);

		const ext = file.name.split(".").pop();
		const path = `submissions/${Date.now()}_${label}.${ext}`;
		const buf = Buffer.from(await file.arrayBuffer());

		const { error } = await supabase.storage
			.from("partner-assets")
			.upload(path, buf, { contentType: file.type, upsert: false });

		if (error)
			return NextResponse.json({ error: error.message }, { status: 500 });

		const {
			data: { publicUrl },
		} = supabase.storage.from("partner-assets").getPublicUrl(path);

		return NextResponse.json({ url: publicUrl });
	} catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
