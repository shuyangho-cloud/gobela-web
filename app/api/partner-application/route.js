import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request) {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
	);
	try {
		const body = await request.json();
		const {
			businessName,
			contactName,
			email,
			phone,
			whatsapp,
			partnerType,
			website,
			instagram,
			address,
			description,
			class_details,
			logo_url,
			photo_urls,
		} = body;

		if (
			!businessName?.trim() ||
			!contactName?.trim() ||
			!email?.trim() ||
			!partnerType
		) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		const { error } = await supabase.from("partner_applications").insert({
			business_name: businessName.trim(),
			contact_name: contactName.trim(),
			contact_email: email.trim().toLowerCase(),
			contact_phone: phone?.trim() || null,
			whatsapp: whatsapp?.trim() || null,
			application_type: partnerType,
			website: website?.trim() || null,
			instagram: instagram?.trim() || null,
			full_address: address?.trim() || null,
			description: description?.trim() || null,
			class_details: class_details || [],
			logo_url: logo_url || null,
			photo_urls: photo_urls || [],
			status: "pending",
		});

		if (error) {
			console.error("Partner application error:", error);
			return NextResponse.json(
				{ error: "Failed to save application" },
				{ status: 500 },
			);
		}

		// A submitted application means this lead has converted — stop the cold
		// outreach pipeline from still following up with them (outreach_due_contacts
		// only looks at outreach_sends history, so without this it keeps nudging
		// people who already signed up).
		await supabase
			.from("outreach_contacts")
			.update({ do_not_contact: true })
			.ilike("email", email.trim());

		// Notify Shuyang via email
		await _notifyNewApplication({
			businessName,
			contactName,
			email,
			phone,
			partnerType,
			website,
			instagram,
			description,
		});

		return NextResponse.json({ ok: true });
	} catch (err) {
		console.error("Partner application error:", err);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

async function _notifyNewApplication(data) {
	const apiKey = process.env.BREVO_API_KEY;
	if (!apiKey) return;

	const html = `
    <h2>🎉 New Partner Application on GoBela</h2>
    <table style="border-collapse:collapse;font-family:sans-serif;font-size:15px">
      <tr><td style="padding:6px 16px 6px 0;color:#6B7280">Business</td><td><strong>${data.businessName}</strong></td></tr>
      <tr><td style="padding:6px 16px 6px 0;color:#6B7280">Contact</td><td>${data.contactName}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;color:#6B7280">Email</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
      <tr><td style="padding:6px 16px 6px 0;color:#6B7280">Phone</td><td>${data.phone || "—"}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;color:#6B7280">Type</td><td>${data.partnerType}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;color:#6B7280">Website</td><td>${data.website || "—"}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;color:#6B7280">Instagram</td><td>${data.instagram || "—"}</td></tr>
      ${data.description ? `<tr><td style="padding:6px 16px 6px 0;color:#6B7280;vertical-align:top">About</td><td>${data.description}</td></tr>` : ""}
    </table>
    <p style="margin-top:24px">
      <a href="https://supabase.com/dashboard/project/mcyvyqieygpbtcheouzr/editor/17589" style="background:#1F2937;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:14px">
        View in Supabase →
      </a>
    </p>
  `;

	try {
		await fetch("https://api.brevo.com/v3/smtp/email", {
			method: "POST",
			headers: {
				accept: "application/json",
				"api-key": apiKey,
				"content-type": "application/json",
			},
			body: JSON.stringify({
				sender: { name: "GoBela", email: "hello@gobela.sg" },
				to: [{ email: "shuyangho@gmail.com", name: "Shuyang" }],
				subject: `🤝 New partner application: ${data.businessName}`,
				htmlContent: html,
			}),
		});
	} catch (e) {
		console.error("Notification email failed:", e);
	}
}
