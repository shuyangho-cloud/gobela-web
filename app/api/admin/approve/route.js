import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function slugify(str) {
	return str
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

// Map partner type → enrichment category (best guess; admin can edit in Supabase after)
const TYPE_CATEGORY = {
	swimming: "swimming",
	gymnastics: "gymnastics",
	coding: "coding",
	music: "music",
	dance: "dance",
	sports: "sports",
	art: "art",
	brain: "brain",
	tuition: "tuition",
	activity: "sports",
};

export async function POST(request) {
	const { id, action, password } = await request.json();
	if (password !== (process.env.ADMIN_PASSWORD || 'gobela-admin-2026')) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.SUPABASE_SERVICE_ROLE_KEY,
	);

	if (action === "reject") {
		await supabase
			.from("partner_applications")
			.update({ status: "rejected", reviewed_at: new Date().toISOString() })
			.eq("id", id);
		return NextResponse.json({ ok: true });
	}

	// action === 'approve'
	const { data: app, error: fetchErr } = await supabase
		.from("partner_applications")
		.select("*")
		.eq("id", id)
		.single();

	if (fetchErr || !app)
		return NextResponse.json({ error: "Not found" }, { status: 404 });

	const classes = Array.isArray(app.class_details) ? app.class_details : [];
	const baseSlug = slugify(app.business_name);
	const photoUrls = Array.isArray(app.photo_urls) ? app.photo_urls : [];

	let classesCreated = 0;
	if (classes.length > 0) {
		const rows = classes.map((cls, i) => ({
			id: `${baseSlug}-${i + 1}`,
			name: cls.name,
			provider: app.business_name,
			category: TYPE_CATEGORY[cls.category] ?? "sports",
			location: app.location_district ?? "Singapore",
			address: app.full_address ?? null,
			trial_price: parseFloat(cls.trial_price) || 0,
			monthly_price: parseFloat(cls.term_price) || 0,
			age_range: cls.age_range,
			description: cls.description,
			rating: 0,
			review_count: 0,
			schedule: cls.schedule,
			tags: [`Trial S$${cls.trial_price}`, app.business_name],
			is_partner: true,
			is_active: true,
			duration_minutes: parseInt(cls.duration, 10) || 60,
			whatsapp: app.whatsapp ?? null,
			website_url: app.website ?? null,
			logo_url: app.logo_url ?? null,
			image_url: photoUrls[i] ?? photoUrls[0] ?? null,
			booking_mode: "gobela",
			sort_order: 200 + i,
		}));

		const { error: insertErr } = await supabase
			.from("enrichment_classes")
			.insert(rows);
		if (insertErr)
			return NextResponse.json({ error: insertErr.message }, { status: 500 });
		classesCreated = rows.length;
	}

	await supabase
		.from("partner_applications")
		.update({ status: "approved", reviewed_at: new Date().toISOString() })
		.eq("id", id);

	return NextResponse.json({ ok: true, classes_created: classesCreated });
}
