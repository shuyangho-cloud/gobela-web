"use client";

import { useState } from "react";

const C = {
	coral: "#FFB020",
	coralLight: "rgba(255,176,32,0.10)",
	coralBdr: "rgba(255,176,32,0.25)",
	navy: "#0D2137",
	gold: "#FFB020",
	cream: "#FFFBF5",
	bg2: "#F8F4F0",
	border: "#EDE5DB",
	muted: "#64748B",
	white: "#FFFFFF",
	green: "#16A34A",
};

const S = {
	btnPrimary: {
		display: "inline-flex",
		alignItems: "center",
		gap: 8,
		background: C.coral,
		color: C.navy,
		border: "none",
		padding: "11px 24px",
		borderRadius: 10,
		fontSize: 14,
		fontWeight: 600,
		cursor: "pointer",
		fontFamily: "inherit",
		transition: "opacity 0.15s",
		textDecoration: "none",
	} as React.CSSProperties,
	btnSecondary: {
		display: "inline-flex",
		alignItems: "center",
		gap: 8,
		background: "transparent",
		color: C.muted,
		border: `1px solid ${C.border}`,
		padding: "11px 24px",
		borderRadius: 10,
		fontSize: 14,
		fontWeight: 500,
		cursor: "pointer",
		fontFamily: "inherit",
		transition: "all 0.15s",
	} as React.CSSProperties,
	input: {
		width: "100%",
		padding: "11px 14px",
		border: `1px solid ${C.border}`,
		borderRadius: 10,
		fontSize: 14,
		fontFamily: "inherit",
		background: C.white,
		color: C.navy,
		outline: "none",
		transition: "border-color 0.15s",
		boxSizing: "border-box",
	} as React.CSSProperties,
	card: {
		background: C.white,
		border: `1px solid ${C.border}`,
		borderRadius: 16,
	} as React.CSSProperties,
	section: { padding: "72px 24px" } as React.CSSProperties,
	container: { maxWidth: 960, margin: "0 auto" } as React.CSSProperties,
	eyebrow: {
		fontSize: 11,
		fontWeight: 600,
		color: C.coral,
		textTransform: "uppercase" as const,
		letterSpacing: "0.08em",
		marginBottom: 10,
	} as React.CSSProperties,
	h2: {
		fontSize: "clamp(26px,4vw,40px)",
		fontWeight: 700,
		color: C.navy,
		letterSpacing: "-0.02em",
		lineHeight: 1.15,
		marginBottom: 14,
	} as React.CSSProperties,
	lead: {
		fontSize: 15,
		color: C.muted,
		lineHeight: 1.7,
	} as React.CSSProperties,
	label: {
		display: "block",
		fontSize: 13,
		fontWeight: 600,
		color: C.navy,
		marginBottom: 6,
	} as React.CSSProperties,
};

function Nav() {
	return (
		<nav
			style={{
				position: "sticky",
				top: 0,
				zIndex: 100,
				background: "rgba(255,251,245,0.95)",
				backdropFilter: "blur(12px)",
				borderBottom: `1px solid ${C.border}`,
				padding: "0 24px",
			}}
		>
			<div
				style={{
					maxWidth: 960,
					margin: "0 auto",
					display: "flex",
					alignItems: "center",
					height: 60,
					gap: 24,
				}}
			>
				<a
					href="/"
					style={{
						fontSize: 20,
						fontWeight: 700,
						color: C.navy,
						textDecoration: "none",
						marginRight: "auto",
					}}
				>
					Go<span style={{ color: C.coral }}>Bela</span>
				</a>
				{(
					[
						["Features", "/#features"],
						["How it works", "/#how-it-works"],
						["About", "/about"],
					] as [string, string][]
				).map(([l, h]) => (
					<a
						key={l}
						href={h}
						style={{ fontSize: 13, color: C.muted, textDecoration: "none" }}
					>
						{l}
					</a>
				))}
				<a
					href="/partners"
					style={{
						fontSize: 13,
						color: C.coral,
						fontWeight: 600,
						textDecoration: "none",
					}}
				>
					Partners
				</a>
				<a
					href="/#waitlist"
					style={{ ...S.btnPrimary, padding: "9px 18px", fontSize: 13 }}
				>
					Get early access
				</a>
			</div>
		</nav>
	);
}

function PartnerHero() {
	return (
		<section style={{ background: C.navy, padding: "80px 24px 64px" }}>
			<div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
				<div
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: 7,
						background: "rgba(255,176,32,0.2)",
						border: "1px solid rgba(255,176,32,0.4)",
						color: "#FFD060",
						borderRadius: 999,
						padding: "5px 16px",
						fontSize: 12,
						fontWeight: 600,
						marginBottom: 24,
					}}
				>
					🤝 Partner with GoBela
				</div>
				<h1
					style={{
						fontSize: "clamp(30px,5vw,52px)",
						fontWeight: 700,
						lineHeight: 1.1,
						letterSpacing: "-0.025em",
						color: "#fff",
						marginBottom: 18,
					}}
				>
					Reach Singapore families{" "}
					<span style={{ color: C.coral }}>at the moment of decision</span>
				</h1>
				<p
					style={{
						fontSize: 17,
						lineHeight: 1.75,
						color: "rgba(255,255,255,0.65)",
						maxWidth: 520,
						margin: "0 auto 36px",
					}}
				>
					GoBela puts your venue, class, or product in front of parents exactly
					when they&apos;re deciding where to go, what to eat, and how to spend
					their weekend.
				</p>
				<div
					style={{
						display: "flex",
						gap: 12,
						justifyContent: "center",
						flexWrap: "wrap",
					}}
				>
					<a
						href="#apply"
						style={{ ...S.btnPrimary, fontSize: 15, padding: "13px 28px" }}
					>
						Apply to partner — free
					</a>
					<a
						href="mailto:partnerships@gobela.sg"
						style={{
							...S.btnSecondary,
							fontSize: 15,
							padding: "13px 28px",
							color: "rgba(255,255,255,0.65)",
							borderColor: "rgba(255,255,255,0.2)",
						}}
					>
						Talk to us first
					</a>
				</div>

				<div
					style={{
						display: "flex",
						gap: 0,
						justifyContent: "center",
						marginTop: 52,
						borderTop: "1px solid rgba(255,255,255,0.1)",
						paddingTop: 32,
					}}
				>
					{[
						{ value: "847+", label: "Families on waitlist" },
						{ value: "S$0", label: "To get listed" },
						{ value: "3–5", label: "Days to onboard" },
					].map(({ value, label }, i, arr) => (
						<div
							key={label}
							style={{
								flex: 1,
								textAlign: "center",
								borderRight:
									i < arr.length - 1
										? "1px solid rgba(255,255,255,0.1)"
										: "none",
								padding: "0 20px",
							}}
						>
							<div style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>
								{value}
							</div>
							<div
								style={{
									fontSize: 12,
									color: "rgba(255,255,255,0.5)",
									marginTop: 4,
								}}
							>
								{label}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

const CURRENT_PARTNERS = [
	{
		emoji: "🐧",
		name: "Penguin Swim School",
		category: "Swimming · Ages 3–12",
		description:
			"Professional swimming lessons for children at multiple pools across Singapore. Free trial class available.",
		color: "#0EA5E9",
	},
	{
		emoji: "⚽",
		name: "MiniSport",
		category: "Multi-sport · Ages 18m–8y",
		description:
			"Award-winning multi-sport programme building motor skills, confidence, and a love of movement in young children.",
		color: "#16A34A",
	},
];

function PartnerShowcase() {
	return (
		<section style={{ ...S.section, background: C.white }}>
			<div style={S.container}>
				<div style={{ textAlign: "center", marginBottom: 44 }}>
					<div style={S.eyebrow}>Featured partners</div>
					<h2 style={S.h2}>Trusted by Singapore families</h2>
					<p style={{ ...S.lead, maxWidth: 480, margin: "0 auto" }}>
						Every GoBela partner is individually reviewed before going live in
						the app.
					</p>
				</div>
				<div
					style={{
						display: "flex",
						gap: 20,
						flexWrap: "wrap",
						justifyContent: "center",
					}}
				>
					{CURRENT_PARTNERS.map(
						({ emoji, name, category, description, color }) => (
							<div
								key={name}
								style={{
									...S.card,
									padding: 28,
									flex: "1 1 280px",
									maxWidth: 380,
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: 14,
										marginBottom: 16,
									}}
								>
									<div
										style={{
											width: 52,
											height: 52,
											borderRadius: 14,
											background: `${color}18`,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											fontSize: 26,
											flexShrink: 0,
										}}
									>
										{emoji}
									</div>
									<div>
										<div
											style={{ fontSize: 16, fontWeight: 700, color: C.navy }}
										>
											{name}
										</div>
										<div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
											{category}
										</div>
									</div>
								</div>
								<p
									style={{
										fontSize: 13,
										color: C.muted,
										lineHeight: 1.65,
										margin: 0,
									}}
								>
									{description}
								</p>
								<div
									style={{
										marginTop: 14,
										display: "flex",
										alignItems: "center",
										gap: 6,
									}}
								>
									<span
										style={{ color: C.green, fontSize: 11, fontWeight: 700 }}
									>
										✓
									</span>
									<span
										style={{ fontSize: 11, fontWeight: 600, color: C.green }}
									>
										GoBela Verified Partner
									</span>
								</div>
							</div>
						),
					)}
				</div>
			</div>
		</section>
	);
}

const PARTNER_TYPES = [
	{
		emoji: "🎡",
		type: "Activity providers",
		subtitle:
			"Enrichment centres, indoor playgrounds, sports academies, arts studios, and more.",
		benefits: [
			"Instant booking integration",
			"Real-time slot management",
			"Targeted reach by child age",
		],
		color: C.coral,
	},
	{
		emoji: "🍽️",
		type: "Restaurants & F&B",
		subtitle:
			"Family-friendly cafés, restaurants, and hawker stalls. Featured in Bela's curated dining picks.",
		benefits: [
			"Curated placement in the Dine tab",
			"Menu and allergy tagging",
			"Parent-reviewed credibility boost",
		],
		color: C.navy,
	},
	{
		emoji: "🛒",
		type: "Suppliers & brands",
		subtitle:
			"Fresh produce, pantry staples, meal kits, and family products. Partner with Cook at Home.",
		benefits: [
			"In-recipe product placement",
			"Seasonal promotion slots",
			"Direct-to-family marketing channel",
		],
		color: "#16A34A",
	},
];

function PartnerTypes() {
	return (
		<section id="types" style={{ ...S.section, background: C.bg2 }}>
			<div style={S.container}>
				<div style={{ textAlign: "center", marginBottom: 48 }}>
					<div style={S.eyebrow}>Who we work with</div>
					<h2 style={S.h2}>Three types of family-focused partners</h2>
					<p style={{ ...S.lead, maxWidth: 500, margin: "0 auto" }}>
						GoBela works with businesses that genuinely improve family life in
						Singapore.
					</p>
				</div>
				<div
					style={{
						display: "flex",
						gap: 16,
						flexWrap: "wrap",
						justifyContent: "center",
					}}
				>
					{PARTNER_TYPES.map(({ emoji, type, subtitle, benefits, color }) => (
						<div
							key={type}
							style={{
								...S.card,
								padding: 28,
								flex: "1 1 260px",
								maxWidth: 300,
							}}
						>
							<div
								style={{
									width: 48,
									height: 48,
									borderRadius: 12,
									background: `${color}18`,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: 24,
									marginBottom: 16,
								}}
							>
								{emoji}
							</div>
							<h3
								style={{
									fontSize: 17,
									fontWeight: 700,
									color: C.navy,
									marginBottom: 8,
								}}
							>
								{type}
							</h3>
							<p
								style={{
									fontSize: 13,
									color: C.muted,
									lineHeight: 1.65,
									marginBottom: 18,
								}}
							>
								{subtitle}
							</p>
							<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
								{benefits.map((b) => (
									<div
										key={b}
										style={{
											display: "flex",
											alignItems: "flex-start",
											gap: 8,
											fontSize: 13,
											color: C.navy,
										}}
									>
										<span
											style={{
												color,
												fontWeight: 700,
												marginTop: 1,
												flexShrink: 0,
											}}
										>
											✓
										</span>
										{b}
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

interface FormState {
	businessName: string;
	contactName: string;
	email: string;
	phone: string;
	whatsapp: string;
	partnerType: string;
	website: string;
	instagram: string;
	address: string;
	description: string;
}

interface ClassEntry {
	name: string;
	age_range: string;
	description: string;
	trial_price: string;
	term_price: string;
	duration: string;
	schedule: string;
}

const EMPTY_FORM: FormState = {
	businessName: "",
	contactName: "",
	email: "",
	phone: "",
	whatsapp: "",
	partnerType: "",
	website: "",
	instagram: "",
	address: "",
	description: "",
};

const EMPTY_CLASS: ClassEntry = {
	name: "",
	age_range: "",
	description: "",
	trial_price: "",
	term_price: "",
	duration: "60",
	schedule: "",
};

function StepDots({ step, total }: { step: number; total: number }) {
	return (
		<div
			style={{
				display: "flex",
				gap: 8,
				justifyContent: "center",
				marginBottom: 32,
			}}
		>
			{Array.from({ length: total }, (_, i) => (
				<div
					key={i}
					style={{
						height: 6,
						borderRadius: 3,
						width: i + 1 === step ? 24 : 8,
						background: i + 1 <= step ? C.coral : C.border,
						transition: "all 0.2s",
					}}
				/>
			))}
		</div>
	);
}

function PartnerForm() {
	const [step, setStep] = useState(1);
	const [form, setForm] = useState<FormState>(EMPTY_FORM);
	const [classes, setClasses] = useState<ClassEntry[]>([{ ...EMPTY_CLASS }]);
	const [logoUrl, setLogoUrl] = useState<string | null>(null);
	const [photoUrls, setPhotoUrls] = useState<string[]>([]);
	const [submitted, setSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [uploading, setUploading] = useState<string | null>(null);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const update =
		(field: keyof FormState) =>
		(
			e: React.ChangeEvent<
				HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
			>,
		) =>
			setForm((f) => ({ ...f, [field]: e.target.value }));

	const fieldStyle = (field: string): React.CSSProperties => ({
		...S.input,
		borderColor: errors[field] ? "#EF4444" : C.border,
	});

	const Label = ({
		children,
		optional,
	}: {
		children: React.ReactNode;
		optional?: boolean;
	}) => (
		<label style={S.label}>
			{children}{" "}
			{optional && (
				<span style={{ fontSize: 12, fontWeight: 400, color: C.muted }}>
					(optional)
				</span>
			)}
		</label>
	);

	const FieldError = ({ field }: { field: string }) =>
		errors[field] ? (
			<p style={{ fontSize: 12, color: "#EF4444", margin: "5px 0 0" }}>
				{errors[field]}
			</p>
		) : null;

	const isActivity = form.partnerType === "activity";
	const totalSteps = isActivity ? 3 : 2;

	const validateStep1 = () => {
		const e: Record<string, string> = {};
		if (!form.businessName.trim()) e.businessName = "Required";
		if (!form.contactName.trim()) e.contactName = "Required";
		if (!form.email.trim()) e.email = "Required";
		if (!form.partnerType) e.partnerType = "Please select a type";
		if (!form.website.trim() && !form.instagram.trim())
			e.online = "Provide a website or Instagram";
		return e;
	};

	const uploadFile = async (file: File, label: string) => {
		setUploading(label);
		try {
			const fd = new FormData();
			fd.append("file", file);
			fd.append("label", label);
			const res = await fetch("/api/upload-partner-file", {
				method: "POST",
				body: fd,
			});
			const data = await res.json();
			if (label === "logo") setLogoUrl(data.url);
			else setPhotoUrls((p) => [...p, data.url]);
		} finally {
			setUploading(null);
		}
	};

	const handleNext = () => {
		if (step === 1) {
			const e = validateStep1();
			if (Object.keys(e).length > 0) {
				setErrors(e);
				return;
			}
			setErrors({});
		}
		setStep((s) => s + 1);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleSubmit = async () => {
		setLoading(true);
		try {
			await fetch("/api/partner-application", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...form,
					class_details: isActivity ? classes : [],
					logo_url: logoUrl,
					photo_urls: photoUrls,
				}),
			});
			setSubmitted(true);
		} catch {
			setSubmitted(true);
		} finally {
			setLoading(false);
		}
	};

	const updateClass =
		(i: number, field: keyof ClassEntry) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
			setClasses((cs) =>
				cs.map((c, j) => (j === i ? { ...c, [field]: e.target.value } : c)),
			);

	if (submitted) {
		return (
			<section id="apply" style={{ ...S.section, background: C.white }}>
				<div style={{ maxWidth: 560, margin: "0 auto" }}>
					<div style={{ ...S.card, padding: 48, textAlign: "center" }}>
						<div style={{ fontSize: 56, marginBottom: 20 }}>🎉</div>
						<h3
							style={{
								fontSize: 24,
								fontWeight: 700,
								color: C.navy,
								marginBottom: 10,
							}}
						>
							Application received!
						</h3>
						<p
							style={{
								fontSize: 15,
								color: C.muted,
								lineHeight: 1.65,
								maxWidth: 380,
								margin: "0 auto 24px",
							}}
						>
							Thanks, <strong>{form.contactName || "there"}</strong>. We&apos;ll
							review and get back within 3 business days.
						</p>
						<a
							href="mailto:partnerships@gobela.sg"
							style={{ ...S.btnSecondary, margin: "0 auto" }}
						>
							partnerships@gobela.sg
						</a>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section id="apply" style={{ ...S.section, background: C.white }}>
			<div style={{ maxWidth: 680, margin: "0 auto" }}>
				<div style={{ textAlign: "center", marginBottom: 36 }}>
					<div style={S.eyebrow}>Apply to become a partner</div>
					<h2 style={S.h2}>Let&apos;s work together</h2>
					<p style={{ ...S.lead, maxWidth: 480, margin: "0 auto" }}>
						{step === 1 && "Tell us about your business."}
						{step === 2 && isActivity && "Add your programmes and pricing."}
						{(step === 2 && !isActivity) || step === 3
							? "Upload your logo and a few photos."
							: ""}
					</p>
				</div>

				<StepDots step={step} total={totalSteps} />

				<div style={{ ...S.card, padding: 36 }}>
					{/* ── STEP 1: Business info ── */}
					{step === 1 && (
						<>
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
									gap: 20,
									marginBottom: 20,
								}}
							>
								<div>
									<Label>Business name</Label>
									<input
										style={fieldStyle("businessName")}
										placeholder="Little Stars Enrichment"
										value={form.businessName}
										onChange={update("businessName")}
									/>
									<FieldError field="businessName" />
								</div>
								<div>
									<Label>Contact name</Label>
									<input
										style={fieldStyle("contactName")}
										placeholder="Sarah Tan"
										value={form.contactName}
										onChange={update("contactName")}
									/>
									<FieldError field="contactName" />
								</div>
								<div>
									<Label>Email</Label>
									<input
										style={fieldStyle("email")}
										type="email"
										placeholder="hello@yourbusiness.com"
										value={form.email}
										onChange={update("email")}
									/>
									<FieldError field="email" />
								</div>
								<div>
									<Label optional>Phone</Label>
									<input
										style={S.input}
										type="tel"
										placeholder="+65 9123 4567"
										value={form.phone}
										onChange={update("phone")}
									/>
								</div>
								<div>
									<Label optional>WhatsApp number</Label>
									<input
										style={S.input}
										type="tel"
										placeholder="+65 9123 4567"
										value={form.whatsapp}
										onChange={update("whatsapp")}
									/>
								</div>
								<div>
									<Label>Partner type</Label>
									<select
										style={fieldStyle("partnerType")}
										value={form.partnerType}
										onChange={update("partnerType")}
									>
										<option value="">Select a category</option>
										<option value="activity">
											Activity / enrichment class
										</option>
										<option value="fnb">Restaurant / F&amp;B</option>
										<option value="supplier">Supplier / brand / product</option>
										<option value="other">Other</option>
									</select>
									<FieldError field="partnerType" />
								</div>
							</div>

							<div
								style={{
									display: "grid",
									gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
									gap: 14,
									marginBottom: 20,
								}}
							>
								<div>
									<Label optional>Website</Label>
									<input
										style={{
											...S.input,
											borderColor: errors.online ? "#EF4444" : C.border,
										}}
										placeholder="https://yourbusiness.com"
										value={form.website}
										onChange={update("website")}
										type="url"
									/>
								</div>
								<div>
									<Label optional>Instagram</Label>
									<input
										style={{
											...S.input,
											borderColor: errors.online ? "#EF4444" : C.border,
										}}
										placeholder="@yourbusiness"
										value={form.instagram}
										onChange={(e) =>
											setForm((f) => ({
												...f,
												instagram: e.target.value.replace(/^@/, ""),
											}))
										}
									/>
								</div>
							</div>
							{errors.online && (
								<p
									style={{
										fontSize: 12,
										color: "#EF4444",
										margin: "-12px 0 12px",
									}}
								>
									{errors.online}
								</p>
							)}

							<div style={{ marginBottom: 20 }}>
								<Label optional>Full address</Label>
								<input
									style={S.input}
									placeholder="22 Havelock Road, #01-689, Singapore 169628"
									value={form.address}
									onChange={update("address")}
								/>
							</div>

							<div style={{ marginBottom: 28 }}>
								<Label optional>Tell us about your business</Label>
								<textarea
									style={{
										...S.input,
										minHeight: 90,
										resize: "vertical",
										lineHeight: 1.6,
									}}
									placeholder="What do you offer, who do you serve, and why would GoBela families love you?"
									value={form.description}
									onChange={update("description")}
								/>
							</div>
						</>
					)}

					{/* ── STEP 2: Classes (activity only) ── */}
					{step === 2 && isActivity && (
						<>
							<p style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>
								Add each class or programme you offer. You can add up to 6.
							</p>
							{classes.map((cls, i) => (
								<div
									key={i}
									style={{
										background: C.bg2,
										border: `1px solid ${C.border}`,
										borderRadius: 12,
										padding: 20,
										marginBottom: 16,
									}}
								>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											marginBottom: 14,
										}}
									>
										<span
											style={{ fontSize: 14, fontWeight: 700, color: C.navy }}
										>
											Class {i + 1}
										</span>
										{classes.length > 1 && (
											<button
												onClick={() =>
													setClasses((cs) => cs.filter((_, j) => j !== i))
												}
												style={{
													background: "none",
													border: "none",
													color: "#EF4444",
													fontSize: 13,
													cursor: "pointer",
													fontFamily: "inherit",
												}}
											>
												Remove
											</button>
										)}
									</div>
									<div
										style={{
											display: "grid",
											gridTemplateColumns:
												"repeat(auto-fit, minmax(200px, 1fr))",
											gap: 14,
										}}
									>
										<div>
											<Label>Class name</Label>
											<input
												style={S.input}
												placeholder="Scratch Foundations"
												value={cls.name}
												onChange={updateClass(i, "name")}
											/>
										</div>
										<div>
											<Label>Age range</Label>
											<input
												style={S.input}
												placeholder="9–11 yrs"
												value={cls.age_range}
												onChange={updateClass(i, "age_range")}
											/>
										</div>
										<div>
											<Label>Trial price (S$)</Label>
											<input
												style={S.input}
												type="number"
												placeholder="57"
												value={cls.trial_price}
												onChange={updateClass(i, "trial_price")}
											/>
										</div>
										<div>
											<Label>Term / monthly price (S$)</Label>
											<input
												style={S.input}
												type="number"
												placeholder="278"
												value={cls.term_price}
												onChange={updateClass(i, "term_price")}
											/>
										</div>
										<div>
											<Label>Duration (minutes)</Label>
											<input
												style={S.input}
												type="number"
												placeholder="60"
												value={cls.duration}
												onChange={updateClass(i, "duration")}
											/>
										</div>
										<div>
											<Label>Schedule</Label>
											<input
												style={S.input}
												placeholder="Sat & Sun 9:30am–12pm"
												value={cls.schedule}
												onChange={updateClass(i, "schedule")}
											/>
										</div>
									</div>
									<div style={{ marginTop: 14 }}>
										<Label>Short description</Label>
										<textarea
											style={{
												...S.input,
												minHeight: 72,
												resize: "vertical",
												lineHeight: 1.6,
											}}
											placeholder="What happens in this class, who is it for, and what makes it special?"
											value={cls.description}
											onChange={updateClass(i, "description")}
										/>
									</div>
								</div>
							))}
							{classes.length < 6 && (
								<button
									onClick={() =>
										setClasses((cs) => [...cs, { ...EMPTY_CLASS }])
									}
									style={{
										...S.btnSecondary,
										width: "100%",
										justifyContent: "center",
										marginBottom: 8,
										fontSize: 14,
									}}
								>
									+ Add another class
								</button>
							)}
						</>
					)}

					{/* ── STEP 3 (or 2 for non-activity): Logo & photos ── */}
					{((step === 3 && isActivity) || (step === 2 && !isActivity)) && (
						<>
							<p style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>
								Upload your logo and up to 4 action photos. These appear in the
								GoBela app listing.
							</p>

							{/* Logo */}
							<div style={{ marginBottom: 28 }}>
								<Label>Logo</Label>
								{logoUrl ? (
									<div
										style={{ display: "flex", alignItems: "center", gap: 14 }}
									>
										<img
											src={logoUrl}
											alt="logo"
											style={{
												height: 72,
												objectFit: "contain",
												borderRadius: 10,
												border: `1px solid ${C.border}`,
												background: C.bg2,
												padding: 8,
											}}
										/>
										<button
											onClick={() => setLogoUrl(null)}
											style={{
												background: "none",
												border: "none",
												color: "#EF4444",
												fontSize: 13,
												cursor: "pointer",
												fontFamily: "inherit",
											}}
										>
											Remove
										</button>
									</div>
								) : (
									<label
										style={{
											display: "block",
											border: `2px dashed ${C.border}`,
											borderRadius: 10,
											padding: "24px",
											textAlign: "center",
											cursor: uploading === "logo" ? "wait" : "pointer",
											background: C.bg2,
										}}
									>
										<div style={{ fontSize: 28, marginBottom: 8 }}>🖼️</div>
										<div style={{ fontSize: 13, color: C.muted }}>
											{uploading === "logo"
												? "Uploading…"
												: "Click to upload logo (PNG or JPG)"}
										</div>
										<input
											type="file"
											accept="image/*"
											style={{ display: "none" }}
											onChange={(e) => {
												const f = e.target.files?.[0];
												if (f) uploadFile(f, "logo");
											}}
										/>
									</label>
								)}
							</div>

							{/* Photos */}
							<div style={{ marginBottom: 28 }}>
								<Label optional>Action photos (up to 4)</Label>
								<div
									style={{
										display: "flex",
										gap: 10,
										flexWrap: "wrap",
										marginBottom: 10,
									}}
								>
									{photoUrls.map((url, i) => (
										<div key={i} style={{ position: "relative" }}>
											<img
												src={url}
												alt=""
												style={{
													width: 100,
													height: 80,
													objectFit: "cover",
													borderRadius: 8,
													border: `1px solid ${C.border}`,
												}}
											/>
											<button
												onClick={() =>
													setPhotoUrls((p) => p.filter((_, j) => j !== i))
												}
												style={{
													position: "absolute",
													top: -6,
													right: -6,
													width: 20,
													height: 20,
													borderRadius: "50%",
													background: "#EF4444",
													color: "#fff",
													border: "none",
													fontSize: 12,
													cursor: "pointer",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													lineHeight: 1,
												}}
											>
												✕
											</button>
										</div>
									))}
									{photoUrls.length < 4 && (
										<label
											style={{
												width: 100,
												height: 80,
												border: `2px dashed ${C.border}`,
												borderRadius: 8,
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
												justifyContent: "center",
												cursor: uploading === "photo" ? "wait" : "pointer",
												background: C.bg2,
												gap: 4,
											}}
										>
											<span style={{ fontSize: 20 }}>📷</span>
											<span style={{ fontSize: 10, color: C.muted }}>
												{uploading === "photo" ? "…" : "Add photo"}
											</span>
											<input
												type="file"
												accept="image/*"
												style={{ display: "none" }}
												onChange={(e) => {
													const f = e.target.files?.[0];
													if (f) uploadFile(f, "photo");
												}}
											/>
										</label>
									)}
								</div>
							</div>

							{/* Terms + submit */}
							<button
								style={{
									...S.btnPrimary,
									width: "100%",
									justifyContent: "center",
									fontSize: 15,
									padding: "14px",
									opacity: loading ? 0.7 : 1,
								}}
								onClick={handleSubmit}
								disabled={loading}
							>
								{loading ? "Submitting…" : "Submit application →"}
							</button>
							<p
								style={{
									textAlign: "center",
									fontSize: 12,
									color: C.muted,
									marginTop: 12,
								}}
							>
								By submitting you agree to our{" "}
								<a
									href="/partner-terms"
									style={{
										color: C.navy,
										fontWeight: 600,
										textDecoration: "underline",
									}}
									target="_blank"
									rel="noopener noreferrer"
								>
									Partner Terms
								</a>
								.
							</p>
						</>
					)}

					{/* Navigation buttons */}
					<div
						style={{ display: "flex", gap: 10, marginTop: step === 1 ? 0 : 8 }}
					>
						{step > 1 && (
							<button
								onClick={() => setStep((s) => s - 1)}
								style={{
									...S.btnSecondary,
									flex: "0 0 auto",
									fontSize: 14,
									padding: "12px 20px",
								}}
							>
								← Back
							</button>
						)}
						{/* Show Next only on steps that aren't the final submit step */}
						{!((step === 3 && isActivity) || (step === 2 && !isActivity)) && (
							<button
								onClick={handleNext}
								style={{
									...S.btnPrimary,
									flex: 1,
									justifyContent: "center",
									fontSize: 15,
									padding: "14px",
								}}
							>
								Next →
							</button>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}

const FAQS = [
	{
		q: "How much does it cost to partner with GoBela?",
		a: "We offer a free listing tier for all partners. Premium placement, booking integrations, and promotional slots are available as paid add-ons. Contact us for current pricing.",
	},
	{
		q: "How quickly can I get listed?",
		a: "Once you submit the form, our team reviews and onboards within 3–5 business days. Premium partners get a dedicated onboarding session.",
	},
	{
		q: "Can I manage my own listings?",
		a: "Yes. The GoBela Partner Portal (coming soon) lets you update listings, manage booking slots, view analytics, and respond to enquiries in real time.",
	},
	{
		q: "What booking platforms does GoBela support?",
		a: "We currently integrate with Klook, Peatix, and Fever, as well as direct booking links. Our zero-commission direct partner integration is in beta.",
	},
	{
		q: "Is GoBela only for Singapore?",
		a: "For now, yes — we are hyper-focused on Singapore families. Regional expansion is planned for 2027.",
	},
];

function FAQ() {
	const [open, setOpen] = useState<number | null>(null);
	return (
		<section id="faq" style={{ ...S.section, background: C.bg2 }}>
			<div style={{ maxWidth: 680, margin: "0 auto" }}>
				<div style={{ textAlign: "center", marginBottom: 44 }}>
					<div style={S.eyebrow}>FAQ</div>
					<h2 style={S.h2}>Frequently asked questions</h2>
				</div>
				<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
					{FAQS.map(({ q, a }, i) => (
						<div key={i} style={{ ...S.card, overflow: "hidden" }}>
							<button
								onClick={() => setOpen(open === i ? null : i)}
								style={{
									width: "100%",
									padding: "18px 20px",
									background: "none",
									border: "none",
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									gap: 12,
									cursor: "pointer",
									fontFamily: "inherit",
									textAlign: "left",
								}}
							>
								<span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>
									{q}
								</span>
								<span
									style={{
										fontSize: 18,
										color: C.coral,
										flexShrink: 0,
										transform: open === i ? "rotate(45deg)" : "none",
										transition: "transform 0.2s",
									}}
								>
									+
								</span>
							</button>
							{open === i && (
								<div style={{ padding: "0 20px 18px" }}>
									<p
										style={{
											fontSize: 14,
											color: C.muted,
											lineHeight: 1.7,
											margin: 0,
										}}
									>
										{a}
									</p>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function Footer() {
	const cols: { heading: string; links: [string, string][] }[] = [
		{
			heading: "App",
			links: [
				["Features", "/#features"],
				["How it works", "/#how-it-works"],
				["Early access", "/#waitlist"],
			],
		},
		{
			heading: "Partners",
			links: [
				["Become a partner", "/partners"],
				["Partner types", "/partners#types"],
				["FAQ", "/partners#faq"],
			],
		},
		{
			heading: "Company",
			links: [
				["About", "/about"],
				["Contact", "mailto:hello@gobela.sg"],
				["Privacy policy", "/privacy"],
				["Terms of service", "/support"],
				["Child safety policy", "/child-safety"],
			],
		},
	];
	return (
		<footer
			style={{
				background: "#060F18",
				padding: "48px 24px 20px",
				borderTop: "1px solid rgba(255,255,255,0.06)",
			}}
		>
			<div style={{ maxWidth: 960, margin: "0 auto" }}>
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						gap: 32,
						marginBottom: 40,
					}}
				>
					<div style={{ flex: "1 1 200px" }}>
						<a
							href="/"
							style={{
								fontSize: 20,
								fontWeight: 700,
								color: "#fff",
								textDecoration: "none",
							}}
						>
							Go<span style={{ color: C.coral }}>Bela</span>
						</a>
						<p
							style={{
								fontSize: 13,
								color: "rgba(255,255,255,0.4)",
								lineHeight: 1.7,
								maxWidth: 200,
								marginTop: 10,
							}}
						>
							The operating system for modern parenting. Singapore · 2026.
						</p>
					</div>
					{cols.map(({ heading, links }) => (
						<div key={heading} style={{ flex: "0 1 140px" }}>
							<div
								style={{
									fontSize: 11,
									fontWeight: 600,
									color: "rgba(255,255,255,0.3)",
									textTransform: "uppercase",
									letterSpacing: "0.07em",
									marginBottom: 14,
								}}
							>
								{heading}
							</div>
							{links.map(([label, href]) => (
								<div key={label} style={{ marginBottom: 8 }}>
									<a
										href={href}
										style={{
											fontSize: 13,
											color: "rgba(255,255,255,0.5)",
											textDecoration: "none",
										}}
									>
										{label}
									</a>
								</div>
							))}
						</div>
					))}
				</div>
				<div
					style={{
						borderTop: "1px solid rgba(255,255,255,0.06)",
						paddingTop: 20,
						display: "flex",
						flexWrap: "wrap",
						gap: 12,
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
						© 2026 GOBELA PTE. LTD. · UEN 202620732H · All rights reserved.
					</div>
					<div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
						Made with ❤️ for Singapore families 🇸🇬
					</div>
				</div>
			</div>
		</footer>
	);
}

export default function PartnersPage() {
	return (
		<main
			style={{
				fontFamily:
					"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
				minHeight: "100vh",
				background: C.cream,
				color: C.navy,
			}}
		>
			<Nav />
			<PartnerHero />
			<PartnerShowcase />
			<PartnerTypes />
			<PartnerForm />
			<FAQ />
			<Footer />
		</main>
	);
}
