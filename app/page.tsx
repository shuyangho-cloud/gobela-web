"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
	coral: "#FFB020",
	coralLight: "rgba(255,176,32,0.10)",
	coralBdr: "rgba(255,176,32,0.25)",
	navy: "#0D2137",
	cream: "#FFFBF5",
	bg2: "#F8F4F0",
	border: "#EDE5DB",
	muted: "#64748B",
	white: "#FFFFFF",
};

const S: Record<string, React.CSSProperties> = {
	btnPrimary: {
		display: "inline-flex",
		alignItems: "center",
		gap: 8,
		background: C.coral,
		color: C.navy,
		border: "none",
		padding: "13px 28px",
		borderRadius: 12,
		fontSize: 15,
		fontWeight: 700,
		cursor: "pointer",
		fontFamily: "inherit",
		transition: "opacity 0.15s",
		textDecoration: "none",
		letterSpacing: "-0.01em",
	},
	btnSecondary: {
		display: "inline-flex",
		alignItems: "center",
		gap: 8,
		background: "transparent",
		color: C.muted,
		border: `1.5px solid ${C.border}`,
		padding: "13px 28px",
		borderRadius: 12,
		fontSize: 15,
		fontWeight: 500,
		cursor: "pointer",
		fontFamily: "inherit",
		transition: "all 0.15s",
		textDecoration: "none",
	},
	input: {
		width: "100%",
		padding: "12px 16px",
		border: `1px solid ${C.border}`,
		borderRadius: 10,
		fontSize: 14,
		fontFamily: "inherit",
		background: C.white,
		color: C.navy,
		outline: "none",
		transition: "border-color 0.15s",
		boxSizing: "border-box",
	},
	card: {
		background: C.white,
		border: `1px solid ${C.border}`,
		borderRadius: 16,
	},
	section: { padding: "80px 24px" },
	container: { maxWidth: 960, margin: "0 auto" },
	eyebrow: {
		fontSize: 11,
		fontWeight: 700,
		color: C.coral,
		textTransform: "uppercase",
		letterSpacing: "0.1em",
		marginBottom: 10,
	},
	h2: {
		fontSize: "clamp(28px,4vw,42px)",
		fontWeight: 700,
		color: C.navy,
		letterSpacing: "-0.025em",
		lineHeight: 1.15,
		marginBottom: 16,
	},
	lead: { fontSize: 16, color: C.muted, lineHeight: 1.75 },
};

// ─── Global responsive CSS ───────────────────────────────────────────────────
function GlobalStyles() {
	return (
		<style>{`
      *, *::before, *::after { box-sizing: border-box; }
      @keyframes gb-pulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.4)} }
      @keyframes gb-typing { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1.2)} }

      /* Stat bar */
      .stat-grid { display: grid; grid-template-columns: repeat(4,1fr); }
      .stat-item { padding: 22px 16px; text-align: center; border-right: 1px solid ${C.border}; }
      .stat-item:last-child { border-right: none; }

      /* Testimonials */
      .test-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }

      /* Partners */
      .partner-grid { display: flex; gap: 24px; flex-wrap: wrap; justify-content: center; }
      .partner-card { flex: 1 1 300px; max-width: 440px; }

      /* Feature layout */
      .feat-row { display: flex; gap: 48px; align-items: flex-start; flex-wrap: wrap; }
      .feat-col  { flex: 1 1 340px; min-width: 0; }

      /* Hero buttons */
      .hero-ctas   { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px; }
      .hero-stores { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 32px; }
      .store-pill  { display: inline-flex; align-items: center; gap: 7px; background: ${C.navy}; color: #fff; border-radius: 10px; padding: 9px 16px; text-decoration: none; font-size: 13px; font-weight: 600; transition: opacity 0.15s; }
      .store-pill:hover { opacity: 0.82; }
      .store-pill-outline { background: transparent; border: 1.5px solid ${C.border}; color: ${C.navy}; }
      .store-pill-outline:hover { background: ${C.bg2}; opacity: 1; }

      /* Download section buttons */
      .dl-btns  { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 32px; }
      .dl-ios   { display: inline-flex; align-items: center; gap: 12px; background: #fff; color: ${C.navy}; border-radius: 14px; padding: 15px 28px; text-decoration: none; font-weight: 700; font-size: 15px; box-shadow: 0 4px 24px rgba(0,0,0,0.18); transition: transform 0.15s, box-shadow 0.15s; }
      .dl-ios:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.22); }
      .dl-gp    { display: inline-flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.1); color: #fff; border: 1.5px solid rgba(255,255,255,0.22); border-radius: 14px; padding: 15px 28px; text-decoration: none; font-weight: 700; font-size: 15px; transition: background 0.15s; }
      .dl-gp:hover { background: rgba(255,255,255,0.18); }

      /* Screens carousel */
      .screens-row { display: flex; gap: 16px; justify-content: center; align-items: flex-end; flex-wrap: wrap; }

      /* Scenario cards */
      .scenario-cards { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-top: 44px; }
      .scenario-card  { background: #fff; border: 1px solid ${C.border}; border-radius: 14px; padding: 18px 16px; max-width: 185px; flex: 0 1 185px; text-align: left; }

      /* Mobile overrides */
      @media (max-width: 640px) {
        .stat-grid { grid-template-columns: repeat(2,1fr); }
        .stat-item { border-right: none !important; border-bottom: 1px solid ${C.border}; }
        .stat-item:nth-child(odd)      { border-right: 1px solid ${C.border} !important; }
        .stat-item:nth-last-child(-n+2) { border-bottom: none; }
        .test-grid  { grid-template-columns: 1fr; }
        .hero-ctas  { flex-direction: column; align-items: center; }
        .hero-stores { flex-direction: column; align-items: center; }
        .dl-btns    { flex-direction: column; align-items: center; }
        .dl-ios, .dl-gp { width: min(340px, 90vw); justify-content: center; }
        .feat-row   { gap: 24px; }
        .scenario-card { max-width: 160px; flex: 0 1 160px; padding: 14px 12px; }
      }
      @media (max-width: 480px) {
        .screens-row > div { display: none; }
        .screens-row > div:nth-child(1),
        .screens-row > div:nth-child(2) { display: block; }
      }
    `}</style>
	);
}

// ─── Reusable atoms ───────────────────────────────────────────────────────────
function CheckItem({
	color,
	title,
	desc,
}: {
	color: string;
	title: string;
	desc: string;
}) {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "flex-start",
				gap: 10,
				marginBottom: 16,
			}}
		>
			<svg
				width="18"
				height="18"
				viewBox="0 0 18 18"
				style={{ flexShrink: 0, marginTop: 2 }}
				aria-hidden="true"
			>
				<circle cx="9" cy="9" r="9" fill={color} opacity="0.15" />
				<path
					d="M5 9l3 3 5-5"
					stroke={color}
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
					fill="none"
				/>
			</svg>
			<div>
				<div
					style={{
						fontSize: 14,
						fontWeight: 600,
						color: C.navy,
						marginBottom: 2,
					}}
				>
					{title}
				</div>
				<div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
					{desc}
				</div>
			</div>
		</div>
	);
}

function MetricCards({ items }: { items: { value: string; label: string }[] }) {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: `repeat(${items.length},1fr)`,
				gap: 8,
				margin: "22px 0",
			}}
		>
			{items.map(({ value, label }) => (
				<div
					key={label}
					style={{
						background: C.bg2,
						border: `1px solid ${C.border}`,
						borderRadius: 10,
						padding: "10px 12px",
						textAlign: "center",
					}}
				>
					<div style={{ fontSize: 20, fontWeight: 700, color: C.navy }}>
						{value}
					</div>
					<div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
						{label}
					</div>
				</div>
			))}
		</div>
	);
}

function PartnerCallout({
	bg,
	bdr,
	textColor,
	titleColor,
	title,
	body,
}: {
	bg: string;
	bdr: string;
	textColor: string;
	titleColor: string;
	title: string;
	body: string;
}) {
	return (
		<div
			style={{
				background: bg,
				border: `1px solid ${bdr}`,
				borderRadius: 14,
				padding: "18px 20px",
				marginTop: 24,
			}}
		>
			<div
				style={{
					fontSize: 13,
					fontWeight: 700,
					color: titleColor,
					marginBottom: 6,
					display: "flex",
					alignItems: "center",
					gap: 6,
				}}
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
					<polyline points="9 22 9 12 15 12 15 22" />
				</svg>
				{title}
			</div>
			<p
				style={{
					fontSize: 13,
					color: textColor,
					lineHeight: 1.65,
					margin: "0 0 10px",
				}}
			>
				{body}
			</p>
			<a
				href="/partners"
				style={{
					display: "inline-flex",
					alignItems: "center",
					gap: 4,
					fontSize: 12,
					fontWeight: 700,
					color: titleColor,
					textDecoration: "none",
				}}
			>
				Apply to partner →
			</a>
		</div>
	);
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
	return (
		<div
			style={{
				width: 164,
				height: 326,
				borderRadius: 28,
				border: `1.5px solid ${C.border}`,
				background: C.white,
				overflow: "hidden",
				position: "relative",
				boxShadow: "0 8px 32px rgba(13,33,55,0.08)",
			}}
		>
			<div
				style={{
					position: "absolute",
					top: 9,
					left: "50%",
					transform: "translateX(-50%)",
					width: 40,
					height: 5,
					borderRadius: 3,
					background: C.border,
					zIndex: 5,
				}}
			/>
			<div style={{ paddingTop: 20, height: "100%", overflow: "hidden" }}>
				{children}
			</div>
		</div>
	);
}

// ─── Store button SVGs ────────────────────────────────────────────────────────
const AppleSVG = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="currentColor"
		aria-hidden="true"
	>
		<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
	</svg>
);
const GoogleSVG = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="currentColor"
		aria-hidden="true"
	>
		<path d="M3.18 23.76c.37.21.8.22 1.2.04l12.44-6.87-2.84-2.84-10.8 9.67zm-.96-20.7C2.07 3.36 2 3.67 2 4v16c0 .33.07.64.22.93l.08.08 8.97-8.97v-.21L2.3 3.06l-.08.1zM19.37 9.76l-2.55-1.41-3.18 3.18 3.18 3.18 2.58-1.42c.73-.41.73-1.11-.03-1.53zM4.38.24C3.98.06 3.55.07 3.18.28l10.8 9.71 2.84-2.84L4.38.24z" />
	</svg>
);

// ─── LAUNCH BANNER ───────────────────────────────────────────────────────────
function LaunchBanner() {
	const [visible, setVisible] = useState(true);
	if (!visible) return null;
	return (
		<div
			style={{
				background: "#1D9E75",
				color: "#fff",
				padding: "10px 20px",
				textAlign: "center",
				position: "relative",
				fontSize: 14,
				fontWeight: 600,
				lineHeight: 1.5,
			}}
		>
			🎉 GoBela is now live on the App Store!&nbsp;
			<a
				href="https://apps.apple.com/sg/app/gobela/id6767062415"
				target="_blank"
				rel="noopener noreferrer"
				style={{
					color: "#fff",
					textDecoration: "underline",
					textUnderlineOffset: 3,
				}}
			>
				Download free →
			</a>
			<button
				onClick={() => setVisible(false)}
				aria-label="Dismiss"
				style={{
					position: "absolute",
					right: 16,
					top: "50%",
					transform: "translateY(-50%)",
					background: "none",
					border: "none",
					color: "rgba(255,255,255,0.7)",
					fontSize: 18,
					cursor: "pointer",
					lineHeight: 1,
					padding: 4,
				}}
			>
				×
			</button>
		</div>
	);
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function HeroSection({ onTryBela }: { onTryBela: () => void }) {
	const scenarios = [
		{
			icon: "🌧️",
			title: "Rainy Sunday?",
			desc: "Bela finds 5 indoor activities near you — filtered by age and budget",
		},
		{
			icon: "🍳",
			title: "Nothing to cook?",
			desc: "Weekly meal plan from NTUC basics — ready in seconds",
		},
		{
			icon: "⚡",
			title: "Kids need to burn energy?",
			desc: "East Coast, Bedok Reservoir, Gardens by the Bay — all near MRT",
		},
	];
	return (
		<section
			style={{ background: C.cream, padding: "clamp(56px,8vw,88px) 24px 60px" }}
			aria-label="Hero"
		>
			<div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
				{/* Live badge */}
				<div
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: 8,
						background: "rgba(29,158,117,0.10)",
						border: "1px solid rgba(29,158,117,0.3)",
						color: "#1D9E75",
						borderRadius: 999,
						padding: "5px 16px",
						fontSize: 12,
						fontWeight: 700,
						marginBottom: 24,
						letterSpacing: "0.01em",
					}}
				>
					<span
						style={{
							width: 6,
							height: 6,
							borderRadius: "50%",
							background: "#4ADE80",
							animation: "gb-pulse 2s infinite",
						}}
					/>
					Now live · iOS &amp; Android
				</div>

				{/* Headline */}
				<h1
					style={{
						fontSize: "clamp(34px,5.5vw,60px)",
						fontWeight: 700,
						lineHeight: 1.08,
						letterSpacing: "-0.03em",
						color: C.navy,
						marginBottom: 20,
					}}
				>
					Stop spending Sundays{" "}
					<span style={{ color: C.coral }}>deciding.</span>
					<br />
					Start enjoying them.
				</h1>

				{/* Sub */}
				<p
					style={{
						fontSize: "clamp(15px,2vw,18px)",
						lineHeight: 1.75,
						color: C.muted,
						maxWidth: 500,
						margin: "0 auto 28px",
					}}
				>
					GoBela is Singapore&apos;s AI parenting co-pilot — meal plans, hawker
					discoveries, trial classes, and weekend ideas personalised to your
					kids.
				</p>

				{/* Primary CTA */}
				<div className="hero-ctas">
					<a
						href="https://apps.apple.com/sg/app/gobela/id6767062415"
						target="_blank"
						rel="noopener noreferrer"
						style={{ ...S.btnPrimary, fontSize: 15, padding: "14px 28px" }}
					>
						<AppleSVG /> Download on iOS
					</a>
					<a
						href="https://play.google.com/store/apps/details?id=com.gobela.app"
						target="_blank"
						rel="noopener noreferrer"
						style={{ ...S.btnSecondary, fontSize: 15, padding: "14px 28px" }}
					>
						<GoogleSVG /> Download on Android
					</a>
				</div>

				{/* Secondary CTA */}
				<div style={{ marginBottom: 32 }}>
					<button
						onClick={onTryBela}
						style={{
							background: "none",
							border: "none",
							color: C.coral,
							fontSize: 13,
							fontWeight: 600,
							cursor: "pointer",
							fontFamily: "inherit",
							textDecoration: "underline",
							textDecorationColor: "rgba(255,176,32,0.4)",
							textUnderlineOffset: 3,
						}}
					>
						💬 Or try Bela in your browser first →
					</button>
				</div>

				{/* Trust row */}
				<div
					style={{
						display: "flex",
						gap: 20,
						justifyContent: "center",
						flexWrap: "wrap",
						fontSize: 13,
						color: C.muted,
					}}
				>
					{[
						"🇸🇬 Built for Singapore",
						"🔒 Free to download",
						"⭐ No credit card",
						"📍 Location-aware",
					].map((t) => (
						<span
							key={t}
							style={{ display: "flex", alignItems: "center", gap: 4 }}
						>
							{t}
						</span>
					))}
				</div>

				{/* Scenario cards */}
				<div className="scenario-cards" role="list">
					{scenarios.map(({ icon, title, desc }) => (
						<div key={title} className="scenario-card" role="listitem">
							<div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
							<div
								style={{
									fontSize: 13,
									fontWeight: 700,
									color: C.navy,
									marginBottom: 5,
								}}
							>
								{title}
							</div>
							<div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
								{desc}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

// ─── STATS BAR ────────────────────────────────────────────────────────────────
function StatsBar() {
	const [bookings, setBookings] = useState<number | null>(null);

	useEffect(() => {
		fetch("/api/stats")
			.then((r) => r.json())
			.then((d) => setBookings(d.bookings))
			.catch(() => {});
	}, []);

	const stats = [
		{
			value: bookings === null ? "…" : bookings === 0 ? "—" : `${bookings}`,
			label: "Trial bookings made",
			icon: "🎓",
		},
		{ value: "12", label: "Partner studios", icon: "✅" },
		{ value: "S$5", label: "Flat platform fee", icon: "💸" },
		{ value: "🇸🇬", label: "Singapore-built & owned", icon: "" },
	];
	return (
		<div
			style={{
				background: C.white,
				borderTop: `1px solid ${C.border}`,
				borderBottom: `1px solid ${C.border}`,
			}}
			role="region"
			aria-label="Key statistics"
		>
			<div style={{ maxWidth: 960, margin: "0 auto" }}>
				<div className="stat-grid">
					{stats.map(({ value, label, icon }) => (
						<div key={label} className="stat-item">
							<div
								style={{
									fontSize: value === "🇸🇬" ? 28 : 24,
									fontWeight: 800,
									color: C.navy,
									letterSpacing: "-0.02em",
									lineHeight: 1.1,
								}}
							>
								{value !== "🇸🇬" && icon && (
									<span style={{ marginRight: 4 }}></span>
								)}
								{value}
							</div>
							<div
								style={{
									fontSize: 12,
									color: C.muted,
									marginTop: 4,
									lineHeight: 1.4,
								}}
							>
								{label}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
function TestimonialsSection() {
	const testimonials = [
		{
			quote:
				"Booked a trial swim class for my 3-year-old in literally 2 minutes. The coach came to our condo pool — my daughter loved it and we signed up for the full term the same week.",
			name: "Sarah L.",
			detail: "Mum of 1 · Tampines",
			emoji: "🏊",
		},
		{
			quote:
				"I was spending every Sunday googling 'enrichment classes near me' and calling schools that never pick up. GoBela just solved that. Booked a fencing trial for my 8-year-old and he's obsessed now.",
			name: "David T.",
			detail: "Dad of 2 · Bishan",
			emoji: "🤺",
		},
		{
			quote:
				"The meal planning alone is worth it. I tell Bela what's in my fridge and she plans the whole week. My kids actually eat what she suggests.",
			name: "Michelle K.",
			detail: "Mum of 3 · Jurong West",
			emoji: "🍳",
		},
	];
	return (
		<section
			style={{ ...S.section, background: C.bg2 }}
			aria-label="Parent testimonials"
		>
			<div style={S.container}>
				<div style={{ textAlign: "center", marginBottom: 44 }}>
					<div style={S.eyebrow}>What parents say</div>
					<h2 style={S.h2}>Built for real Singapore families.</h2>
					<p style={{ ...S.lead, maxWidth: 480, margin: "0 auto" }}>
						From Tampines to Jurong, Singapore parents are reclaiming their
						weekends with GoBela.
					</p>
				</div>
				<div className="test-grid">
					{testimonials.map(({ quote, name, detail, emoji }) => (
						<div key={name} style={{ ...S.card, padding: 28 }}>
							<div style={{ fontSize: 28, marginBottom: 16 }}>{emoji}</div>
							<p
								style={{
									fontSize: 14,
									color: C.navy,
									lineHeight: 1.75,
									margin: "0 0 20px",
									fontStyle: "italic",
								}}
							>
								&ldquo;{quote}&rdquo;
							</p>
							<div
								style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}
							>
								<div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>
									{name}
								</div>
								<div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
									{detail}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

// ─── FEATURES ────────────────────────────────────────────────────────────────
function ExplorePhoneScreen() {
	const items = [
		{
			name: "Fencing Masters · Ubi Ave 4",
			detail: "Age 7–18 · FREE trial class",
			time: "Sat & Sun slots",
			free: true,
		},
		{
			name: "Penguin Swim School · Islandwide",
			detail: "Age 6m–14 · Trial S$45",
			time: "Flexible slots",
			free: false,
		},
		{
			name: "MiniSport Singapore · Various",
			detail: "Age 2–8 · Trial S$20",
			time: "Weekend mornings",
			free: false,
		},
	];
	return (
		<div style={{ height: "100%", background: C.cream, fontSize: 11 }}>
			<div style={{ background: C.coral, padding: "9px 10px", color: C.navy }}>
				<div style={{ fontSize: 10, opacity: 0.75 }}>BelaExplore</div>
				<div style={{ fontSize: 12, fontWeight: 700 }}>
					50+ classes near you
				</div>
			</div>
			<div
				style={{
					display: "flex",
					gap: 4,
					padding: "6px 8px",
					borderBottom: `1px solid ${C.border}`,
				}}
			>
				{(["All", "Sports", "Music", "Arts"] as const).map((label, i) => (
					<div
						key={label}
						style={{
							flexShrink: 0,
							borderRadius: 999,
							padding: "2px 7px",
							fontSize: 10,
							background: i === 0 ? C.coral : C.bg2,
							color: i === 0 ? C.navy : C.muted,
							border: i === 0 ? "none" : `1px solid ${C.border}`,
							fontWeight: i === 0 ? 700 : 400,
						}}
					>
						{label}
					</div>
				))}
			</div>
			<div
				style={{
					padding: "6px 8px",
					display: "flex",
					flexDirection: "column",
					gap: 5,
				}}
			>
				{items.map(({ name, detail, time, free }) => (
					<div
						key={name}
						style={{
							background: C.white,
							border: `1px solid ${C.border}`,
							borderRadius: 8,
							padding: "6px 8px",
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "flex-start",
								justifyContent: "space-between",
								gap: 4,
							}}
						>
							<div style={{ flex: 1 }}>
								<div
									style={{
										fontSize: 10,
										fontWeight: 700,
										color: C.navy,
										lineHeight: 1.3,
									}}
								>
									{name}
								</div>
								<div style={{ fontSize: 10, color: C.muted }}>{detail}</div>
								<div style={{ fontSize: 10, color: C.muted }}>{time}</div>
							</div>
							{free && (
								<div
									style={{
										fontSize: 9,
										background: "#EAF3DE",
										color: "#27500A",
										borderRadius: 4,
										padding: "1px 4px",
										fontWeight: 700,
										flexShrink: 0,
									}}
								>
									FREE
								</div>
							)}
						</div>
						<div
							style={{
								marginTop: 5,
								background: C.coral,
								color: C.navy,
								borderRadius: 5,
								padding: "3px 7px",
								fontSize: 10,
								fontWeight: 700,
								display: "inline-block",
							}}
						>
							Book trial
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function MealPhoneScreen() {
	const days = [
		{ d: "MON", m: "Chicken Rice", s: "Home · 25 min" },
		{ d: "TUE", m: "Maxwell Hawker", s: "Nearby · til 10pm" },
		{ d: "WED", m: "Aglio Olio", s: "15 min · NTUC items" },
		{ d: "THU", m: "Nasi Lemak 🥚", s: "45 min · Kids fave" },
		{ d: "FRI", m: "Pizza Night 🍕", s: "20 min · Easy" },
	];
	return (
		<div
			style={{
				height: "100%",
				background: C.cream,
				fontSize: 11,
				display: "flex",
				flexDirection: "column",
			}}
		>
			<div
				style={{
					background: C.navy,
					padding: "9px 10px",
					color: "#fff",
					flexShrink: 0,
				}}
			>
				<div style={{ fontSize: 10, opacity: 0.65 }}>
					This week&apos;s meals
				</div>
				<div style={{ fontSize: 12, fontWeight: 700 }}>
					May 2026 · 5 planned
				</div>
			</div>
			<div style={{ padding: "4px 8px", flex: 1 }}>
				{days.map(({ d, m, s }, i) => (
					<div
						key={d}
						style={{
							display: "flex",
							alignItems: "center",
							gap: 6,
							padding: "4px 0",
							borderBottom:
								i < days.length - 1 ? `1px solid ${C.border}` : "none",
						}}
					>
						<div
							style={{
								fontSize: 10,
								fontWeight: 700,
								color: C.coral,
								width: 26,
								flexShrink: 0,
							}}
						>
							{d}
						</div>
						<div style={{ flex: 1, minWidth: 0 }}>
							<div
								style={{
									fontSize: 10,
									fontWeight: 600,
									color: C.navy,
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
								}}
							>
								{m}
							</div>
							<div style={{ fontSize: 10, color: C.muted }}>{s}</div>
						</div>
					</div>
				))}
			</div>
			<div style={{ padding: "5px 8px", flexShrink: 0 }}>
				<div
					style={{
						background: "#E1F5EE",
						border: "1px solid #9FE1CB",
						borderRadius: 8,
						padding: "6px 8px",
					}}
				>
					<div style={{ fontSize: 10, fontWeight: 700, color: "#085041" }}>
						🛒 NTUC shopping list
					</div>
					<div style={{ fontSize: 10, color: "#0F6E56" }}>
						14 items · Auto-generated
					</div>
				</div>
			</div>
			<div style={{ padding: "5px 8px 8px", flexShrink: 0 }}>
				<div
					style={{
						background: C.coral,
						color: C.navy,
						borderRadius: 8,
						padding: "6px",
						textAlign: "center",
						fontSize: 10,
						fontWeight: 700,
					}}
				>
					✨ Regenerate plan
				</div>
			</div>
		</div>
	);
}

function FeaturesSection() {
	const [active, setActive] = useState(0);
	const tabStyle = (i: number): React.CSSProperties => ({
		flex: 1,
		padding: "10px 16px",
		border: "none",
		borderRadius: 10,
		fontSize: 14,
		fontWeight: i === active ? 600 : 400,
		cursor: "pointer",
		fontFamily: "inherit",
		transition: "all 0.2s",
		background: i === active ? C.white : "transparent",
		color: i === active ? C.navy : C.muted,
		boxShadow:
			i === active
				? `0 0 0 1px ${C.border}, 0 2px 8px rgba(0,0,0,0.05)`
				: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		gap: 6,
	});
	return (
		<section
			id="features"
			style={{ ...S.section, background: C.white }}
			aria-label="Features"
		>
			<div style={S.container}>
				<div style={{ textAlign: "center", marginBottom: 40 }}>
					<div style={S.eyebrow}>What GoBela does</div>
					<h2 style={S.h2}>Two problems. Solved every week.</h2>
					<p style={{ ...S.lead, maxWidth: 480, margin: "0 auto" }}>
						Every Singapore parent faces the same two questions on repeat.
						GoBela answers both before you even think to ask.
					</p>
				</div>

				{/* Tab switcher */}
				<div
					style={{
						display: "flex",
						gap: 4,
						background: C.bg2,
						padding: 4,
						borderRadius: 14,
						maxWidth: 520,
						margin: "0 auto 44px",
					}}
					role="tablist"
				>
					<button
						role="tab"
						aria-selected={active === 0}
						style={tabStyle(0)}
						onClick={() => setActive(0)}
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
							<path d="M13 5v2" />
							<path d="M13 17v2" />
							<path d="M13 11v2" />
						</svg>
						BelaExplore
					</button>
					<button
						role="tab"
						aria-selected={active === 1}
						style={tabStyle(1)}
						onClick={() => setActive(1)}
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
							<line x1="16" y1="2" x2="16" y2="6" />
							<line x1="8" y1="2" x2="8" y2="6" />
							<line x1="3" y1="10" x2="21" y2="10" />
						</svg>
						Meal planning
					</button>
				</div>

				{active === 0 && (
					<div id="belaexplore" className="feat-row" role="tabpanel">
						<div className="feat-col">
							<div
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: 6,
									background: "#FAEEDA",
									border: "1px solid #FAC775",
									color: "#854F0B",
									borderRadius: 999,
									padding: "4px 14px",
									fontSize: 11,
									fontWeight: 700,
									marginBottom: 18,
								}}
							>
								⚡ Biggest reason families book a trial
							</div>
							<h3
								style={{
									fontSize: "clamp(22px,3vw,32px)",
									fontWeight: 700,
									color: C.navy,
									letterSpacing: "-0.02em",
									lineHeight: 1.15,
									marginBottom: 14,
								}}
							>
								Try any class.
								<br />
								Cancel anytime.
							</h3>
							<p
								style={{
									fontSize: 15,
									color: C.muted,
									lineHeight: 1.75,
									marginBottom: 24,
								}}
							>
								Browse 50+ enrichment centres, sports academies, arts studios,
								and dance schools across Singapore — book a single trial session
								before committing to a full term.
							</p>
							<CheckItem
								color="#1D9E75"
								title="1-session trials before any commitment"
								desc="Try piano, fencing, or coding once — no deposits, no full-term lock-in"
							/>
							<CheckItem
								color="#1D9E75"
								title="Filtered by age, area, and category"
								desc="Enrichment, sports, music, arts, dance — all near your MRT or postcode"
							/>
							<CheckItem
								color="#1D9E75"
								title="Instant booking — no phone calls"
								desc="Confirm your slot in the app. Booking reference sent instantly by email."
							/>
							<CheckItem
								color="#1D9E75"
								title="Bela recommends classes for each child"
								desc="Age, interests, and past trials all factor into what Bela suggests next"
							/>
							<MetricCards
								items={[
									{ value: "50+", label: "Classes" },
									{ value: "8", label: "Partner studios" },
									{ value: "S$0", label: "To get listed" },
								]}
							/>
							<PartnerCallout
								bg="#FAEEDA"
								bdr="#FAC775"
								textColor="#633806"
								titleColor="#412402"
								title="For activity providers"
								body="Get in front of trial-ready Singapore families before they commit to a competitor. Zero commission on first-session bookings. Free listing tier, 3–5 day onboarding."
							/>
						</div>
						<div
							style={{
								flexShrink: 0,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								gap: 12,
							}}
						>
							<div
								style={{
									background: C.bg2,
									borderRadius: 20,
									padding: 16,
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									gap: 10,
								}}
							>
								<PhoneFrame>
									<ExplorePhoneScreen />
								</PhoneFrame>
								<div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>
									BelaExplore in the app
								</div>
							</div>
						</div>
					</div>
				)}

				{active === 1 && (
					<div id="mealplan" className="feat-row" role="tabpanel">
						<div className="feat-col">
							<div
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: 6,
									background: "#E1F5EE",
									border: "1px solid #9FE1CB",
									color: "#085041",
									borderRadius: 999,
									padding: "4px 14px",
									fontSize: 11,
									fontWeight: 700,
									marginBottom: 18,
								}}
							>
								⚡ Used by families every single week
							</div>
							<h3
								style={{
									fontSize: "clamp(22px,3vw,32px)",
									fontWeight: 700,
									color: C.navy,
									letterSpacing: "-0.02em",
									lineHeight: 1.15,
									marginBottom: 14,
								}}
							>
								Your family&apos;s meals,
								<br />
								sorted for the week.
							</h3>
							<p
								style={{
									fontSize: 15,
									color: C.muted,
									lineHeight: 1.75,
									marginBottom: 24,
								}}
							>
								AI-powered weekly meal plans built around your kids&apos;
								tastes, dietary needs, and what&apos;s at your nearest NTUC
								FairPrice or hawker centre.
							</p>
							<CheckItem
								color={C.coral}
								title="5 dinners planned in seconds"
								desc="Hawker night, quick home cook, or delivery — Bela balances your week automatically"
							/>
							<CheckItem
								color={C.coral}
								title="Auto-generated NTUC shopping list"
								desc="Exact quantities, updated as you tick items off — no more over-buying"
							/>
							<CheckItem
								color={C.coral}
								title="Fussy-eater mode and allergy filters"
								desc="Bela adapts to each child — never suggests what they&apos;ll refuse"
							/>
							<CheckItem
								color={C.coral}
								title="Hawker + home cook balance you control"
								desc="Maxwell, Lau Pa Sat, Old Airport Rd mixed with simple 15–30 min recipes"
							/>
							<MetricCards
								items={[
									{ value: "5", label: "Meals/week" },
									{ value: "Auto", label: "Shopping list" },
									{ value: "0", label: "Wasted items" },
								]}
							/>
							<PartnerCallout
								bg="#E1F5EE"
								bdr="#9FE1CB"
								textColor="#085041"
								titleColor="#04342C"
								title="For F&B brands, hawkers & suppliers"
								body="Get featured directly in weekly meal plans and auto-generated shopping lists — placement in Singapore family kitchens from day one."
							/>
						</div>
						<div
							style={{
								flexShrink: 0,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								gap: 12,
							}}
						>
							<div
								style={{
									background: C.bg2,
									borderRadius: 20,
									padding: 16,
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									gap: 10,
								}}
							>
								<PhoneFrame>
									<MealPhoneScreen />
								</PhoneFrame>
								<div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>
									Meal planning in the app
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</section>
	);
}

// ─── FOUNDER BRIDGE ──────────────────────────────────────────────────────────
function FounderSection() {
	return (
		<section
			style={{ background: C.bg2, padding: "72px 24px" }}
			aria-label="Founder story"
		>
			<div
				style={{
					maxWidth: 720,
					margin: "0 auto",
					display: "flex",
					gap: 40,
					alignItems: "center",
					flexWrap: "wrap",
				}}
			>
				<div style={{ flexShrink: 0 }}>
					<div
						style={{
							width: 88,
							height: 88,
							borderRadius: "50%",
							overflow: "hidden",
							border: `3px solid ${C.border}`,
							boxShadow: "0 4px 16px rgba(13,33,55,0.10)",
						}}
					>
						<img
							src="/about/founder.jpg"
							alt="Shuyang Ho, GoBela founder"
							style={{
								width: "100%",
								height: "100%",
								objectFit: "cover",
								objectPosition: "center 42%",
							}}
						/>
					</div>
				</div>
				<div style={{ flex: "1 1 300px", minWidth: 0 }}>
					<div
						style={{
							fontSize: 11,
							fontWeight: 700,
							color: C.coral,
							textTransform: "uppercase",
							letterSpacing: "0.1em",
							marginBottom: 8,
						}}
					>
						Built by a Singapore dad
					</div>
					<p
						style={{
							fontSize: 16,
							lineHeight: 1.75,
							color: C.navy,
							fontWeight: 600,
							margin: "0 0 6px",
						}}
					>
						&ldquo;Not because of her, I would not build this app.&rdquo;
					</p>
					<p
						style={{
							fontSize: 14,
							lineHeight: 1.7,
							color: C.muted,
							margin: "0 0 16px",
						}}
					>
						GoBela started with a Sunday morning argument about what to do with
						a 5-year-old. It grew into a mission to give every Singapore family
						their weekends back.
					</p>
					<a
						href="/about"
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 6,
							fontSize: 14,
							fontWeight: 700,
							color: C.coral,
							textDecoration: "none",
						}}
					>
						Read the full story →
					</a>
				</div>
			</div>
		</section>
	);
}

// ─── PARTNER SPOTLIGHT ────────────────────────────────────────────────────────
function PartnerSpotlightSection() {
	const partners = [
		{
			name: "Penguin Swim School",
			category: "🏊 Swimming",
			tagline: "Singapore's highest-rated home swim school",
			description:
				"Coach comes to your condo pool. 40+ certified coaches island-wide. Gentle water confidence for babies through competitive squad training.",
			ageRange: "6 months – 14 yrs",
			trial: "Trial from S$45",
			tags: ["Islandwide", "Flexible schedule", "Parent-in-pool option"],
			verified: true,
		},
		{
			name: "Fencing Masters",
			category: "🤺 Fencing",
			tagline: "Olympic-standard fencing for kids & teens",
			description:
				"Led by IOC-certified coaches with 50+ years of combined experience. Free trial class with equipment provided. SSC Sport Enrichment programme at 177 Ubi Ave 4.",
			ageRange: "7–18 yrs",
			trial: "FREE trial class",
			tags: ["Free trial", "Equipment provided", "IOC certified"],
			verified: true,
		},
		{
			name: "MiniSport Singapore",
			category: "🏃 Multi-sports",
			tagline: "Active play & sport skills for little ones",
			description:
				"Structured multi-sport sessions introducing football, basketball, tennis and more across island-wide venues. Designed for young children — high energy, big smiles.",
			ageRange: "2–8 yrs",
			trial: "Trial available",
			tags: ["Island-wide venues", "Ages 2+", "Weekend sessions"],
			verified: true,
		},
		{
			name: "Elevate Dance Academie",
			category: "💃 Dance",
			tagline: "Where passion meets performance",
			description:
				"Professional dance training across contemporary, hip hop, jazz, and ballet. Small class sizes ensure every child gets personal attention from qualified instructors.",
			ageRange: "3 yrs & up",
			trial: "Trial available",
			tags: ["Multiple styles", "Small classes", "All levels welcome"],
			verified: true,
		},
	];
	return (
		<section
			id="partners"
			style={{ ...S.section, background: C.white }}
			aria-label="Partner studios"
		>
			<div style={S.container}>
				<div style={{ textAlign: "center", marginBottom: 44 }}>
					<div style={S.eyebrow}>GoBela Verified Partners</div>
					<h2 style={S.h2}>Real classes. Real coaches. Real results.</h2>
					<p style={{ ...S.lead, maxWidth: 500, margin: "0 auto" }}>
						Every GoBela Verified partner is personally onboarded and vetted —
						not scraped from a directory.
					</p>
				</div>
				<div className="partner-grid">
					{partners.map((p) => (
						<div
							key={p.name}
							className="partner-card"
							style={{ ...S.card, padding: 24 }}
						>
							<div
								style={{
									display: "flex",
									alignItems: "flex-start",
									justifyContent: "space-between",
									gap: 12,
									marginBottom: 14,
								}}
							>
								<div>
									<div
										style={{
											fontSize: 12,
											fontWeight: 600,
											color: C.muted,
											marginBottom: 4,
										}}
									>
										{p.category}
									</div>
									<div
										style={{
											fontSize: 17,
											fontWeight: 700,
											color: C.navy,
											letterSpacing: "-0.02em",
										}}
									>
										{p.name}
									</div>
									<div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
										{p.tagline}
									</div>
								</div>
								{p.verified && (
									<div
										style={{
											flexShrink: 0,
											display: "flex",
											alignItems: "center",
											gap: 4,
											background: "#DCFCE7",
											border: "1px solid #86EFAC",
											borderRadius: 999,
											padding: "3px 10px",
											fontSize: 11,
											fontWeight: 700,
											color: "#166534",
											whiteSpace: "nowrap",
										}}
									>
										✓ Verified
									</div>
								)}
							</div>
							<p
								style={{
									fontSize: 13,
									color: C.muted,
									lineHeight: 1.65,
									marginBottom: 14,
								}}
							>
								{p.description}
							</p>
							<div
								style={{
									display: "flex",
									gap: 6,
									flexWrap: "wrap",
									marginBottom: 16,
								}}
							>
								{p.tags.map((tag) => (
									<span
										key={tag}
										style={{
											background: C.coralLight,
											border: `1px solid ${C.coralBdr}`,
											borderRadius: 999,
											padding: "3px 10px",
											fontSize: 11,
											color: "#854F0B",
											fontWeight: 600,
										}}
									>
										{tag}
									</span>
								))}
							</div>
							<div
								style={{
									display: "flex",
									gap: 12,
									borderTop: `1px solid ${C.border}`,
									paddingTop: 14,
								}}
							>
								<div style={{ flex: 1 }}>
									<div style={{ fontSize: 11, color: C.muted }}>Ages</div>
									<div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>
										{p.ageRange}
									</div>
								</div>
								<div style={{ flex: 1 }}>
									<div style={{ fontSize: 11, color: C.muted }}>Trial</div>
									<div
										style={{ fontSize: 13, fontWeight: 700, color: "#166534" }}
									>
										{p.trial}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
				<div style={{ textAlign: "center", marginTop: 36 }}>
					<a href="/partners" style={{ ...S.btnSecondary, fontSize: 14 }}>
						Are you an activity provider? Apply to list your classes →
					</a>
				</div>
			</div>
		</section>
	);
}

// ─── BELA CHAT ────────────────────────────────────────────────────────────────
const BELA_PROMPTS = [
	{
		label: "🌧️ Raining, kid bored",
		text: "It's raining and my 5-year-old is bored at home — what can we do?",
	},
	{
		label: "🍜 Hawker dinner tonight",
		text: "Family dinner near Tampines tonight, kids aged 4 and 7",
	},
	{
		label: "🛒 Cook from NTUC",
		text: "What can I cook for dinner using NTUC basics? My kids are fussy eaters",
	},
	{
		label: "🌳 Free weekend Jurong",
		text: "Free weekend activities near Jurong for a 6-year-old",
	},
];

type Msg = { role: "user" | "assistant"; content: string };

function BelaChatSection() {
	const [messages, setMessages] = useState<Msg[]>([
		{
			role: "assistant",
			content:
				"Hi! I'm Bela 🐾 — your GoBela AI companion.\n\nGoBela helps Singapore families plan better weekends — enrichment classes for your kids, family dining spots, meal ideas, and weekend plans.\n\nTry a question below, or ask me anything about planning your family's weekend!",
		},
	]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const chatRef = useRef<HTMLDivElement>(null);
	const histRef = useRef<Msg[]>([]);

	useEffect(() => {
		if (chatRef.current)
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
	}, [messages, loading]);

	const send = async (text?: string) => {
		const content = (text ?? input).trim();
		if (!content || loading) return;
		setInput("");
		setLoading(true);
		const userMsg: Msg = { role: "user", content };
		histRef.current = [...histRef.current, userMsg];
		setMessages((p) => [...p, userMsg]);
		try {
			const res = await fetch("/api/bela", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ messages: histRef.current }),
			});
			const data = await res.json();
			const reply = data.reply || "Hmm, can you tell me a bit more?";
			const aMsg: Msg = { role: "assistant", content: reply };
			histRef.current = [...histRef.current, aMsg];
			setMessages((p) => [...p, aMsg]);
		} catch {
			setMessages((p) => [
				...p,
				{
					role: "assistant",
					content: "Oops! Something went wrong. Try again in a moment 🙏",
				},
			]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<section
			id="bela-chat"
			style={{ ...S.section, background: C.bg2 }}
			aria-label="Try Bela"
		>
			<div style={{ maxWidth: 680, margin: "0 auto" }}>
				<div style={{ textAlign: "center", marginBottom: 36 }}>
					<div style={S.eyebrow}>Try Bela live</div>
					<h2 style={S.h2}>Tell Bela about your day ✨</h2>
					<p style={S.lead}>
						Type any parenting scenario and see Bela plan your next move with
						real Singapore suggestions.
					</p>
				</div>
				<div
					style={{
						...S.card,
						padding: 0,
						overflow: "hidden",
						boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
					}}
					role="region"
					aria-label="Bela chat interface"
				>
					{/* Header */}
					<div
						style={{
							background: C.navy,
							padding: "14px 20px",
							display: "flex",
							alignItems: "center",
							gap: 12,
						}}
					>
						<img
							src="/mascot/transparent/Happy.png"
							alt="Bela mascot"
							style={{
								width: 40,
								height: 40,
								objectFit: "contain",
								flexShrink: 0,
							}}
						/>
						<div>
							<div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
								Bela
							</div>
							<div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
								Your AI parenting co-pilot
							</div>
						</div>
						<div
							style={{
								marginLeft: "auto",
								display: "flex",
								alignItems: "center",
								gap: 6,
								fontSize: 12,
								color: "rgba(255,255,255,0.55)",
							}}
						>
							<div
								style={{
									width: 6,
									height: 6,
									borderRadius: "50%",
									background: "#4ADE80",
								}}
							/>{" "}
							Online
						</div>
					</div>
					{/* Messages */}
					<div
						ref={chatRef}
						style={{
							height: 300,
							overflowY: "auto",
							padding: 20,
							display: "flex",
							flexDirection: "column",
							gap: 12,
						}}
						role="log"
						aria-live="polite"
						aria-label="Chat messages"
					>
						{messages.map((msg, i) => (
							<div
								key={i}
								style={{
									display: "flex",
									flexDirection: msg.role === "user" ? "row-reverse" : "row",
									gap: 8,
									alignItems: "flex-end",
								}}
							>
								{msg.role === "assistant" && (
									<img
										src="/mascot/transparent/Happy.png"
										alt="Bela"
										style={{
											width: 28,
											height: 28,
											objectFit: "contain",
											flexShrink: 0,
										}}
									/>
								)}
								<div
									style={{
										padding: "10px 14px",
										fontSize: 14,
										lineHeight: 1.6,
										maxWidth: "78%",
										borderRadius: 14,
										borderBottomLeftRadius: msg.role === "assistant" ? 3 : 14,
										borderBottomRightRadius: msg.role === "user" ? 3 : 14,
										background: msg.role === "user" ? C.coral : C.bg2,
										color: msg.role === "user" ? C.navy : C.navy,
										border:
											msg.role === "assistant"
												? `1px solid ${C.border}`
												: "none",
									}}
								>
									{msg.content}
								</div>
							</div>
						))}
						{loading && (
							<div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
								<img
									src="/mascot/transparent/Happy.png"
									alt="Bela"
									style={{
										width: 28,
										height: 28,
										objectFit: "contain",
										flexShrink: 0,
									}}
								/>
								<div
									style={{
										padding: "12px 16px",
										borderRadius: "14px 14px 14px 3px",
										background: C.bg2,
										border: `1px solid ${C.border}`,
										display: "flex",
										gap: 4,
										alignItems: "center",
									}}
									role="status"
									aria-label="Bela is typing"
								>
									{[0, 1, 2].map((i) => (
										<div
											key={i}
											style={{
												width: 6,
												height: 6,
												borderRadius: "50%",
												background: C.coral,
												animation: `gb-typing 1s ${i * 0.2}s infinite`,
											}}
										/>
									))}
								</div>
							</div>
						)}
					</div>
					{/* Prompt chips */}
					<div
						style={{
							padding: "10px 20px",
							borderTop: `1px solid ${C.border}`,
							display: "flex",
							gap: 8,
							flexWrap: "wrap",
						}}
					>
						{BELA_PROMPTS.map(({ label, text }) => (
							<button
								key={label}
								onClick={() => send(text)}
								style={{
									background: C.bg2,
									border: `1px solid ${C.border}`,
									color: C.muted,
									borderRadius: 999,
									padding: "5px 12px",
									fontSize: 12,
									cursor: "pointer",
									fontFamily: "inherit",
									transition: "all 0.15s",
								}}
							>
								{label}
							</button>
						))}
					</div>
					{/* Input */}
					<div
						style={{
							padding: "10px 16px 16px",
							borderTop: `1px solid ${C.border}`,
							display: "flex",
							gap: 8,
						}}
					>
						<input
							style={{ ...S.input, flex: 1 }}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && send()}
							placeholder="Tell Bela about your family's day..."
							disabled={loading}
							aria-label="Message to Bela"
						/>
						<button
							style={{
								...S.btnPrimary,
								padding: "10px 18px",
								flexShrink: 0,
								opacity: !input.trim() || loading ? 0.45 : 1,
								fontSize: 18,
							}}
							onClick={() => send()}
							disabled={loading || !input.trim()}
							aria-label="Send message"
						>
							↑
						</button>
					</div>
				</div>
				<p
					style={{
						textAlign: "center",
						fontSize: 12,
						color: C.muted,
						marginTop: 14,
					}}
				>
					💡 Bela uses Claude AI — responses are suggestions, not professional
					advice.
				</p>
			</div>
		</section>
	);
}

// ─── APP SCREENSHOTS ──────────────────────────────────────────────────────────
function HomeScreen() {
	return (
		<div
			style={{
				height: "100%",
				background: C.cream,
				fontSize: 10,
				display: "flex",
				flexDirection: "column",
			}}
		>
			<div
				style={{
					background: C.coral,
					padding: 10,
					color: C.navy,
					flexShrink: 0,
				}}
			>
				<div style={{ fontSize: 10, opacity: 0.75 }}>Good morning, Sarah ☀️</div>
				<div style={{ fontSize: 12, fontWeight: 700 }}>
					Saturday · Sunny · 31°C
				</div>
			</div>
			<div
				style={{
					display: "flex",
					gap: 5,
					padding: 8,
					borderBottom: `1px solid ${C.border}`,
					flexShrink: 0,
				}}
			>
				{["🍳 Cook", "🍜 Dine", "🎡 Play"].map((l) => (
					<div
						key={l}
						style={{
							flex: 1,
							background: C.white,
							border: `1px solid ${C.border}`,
							borderRadius: 7,
							padding: "5px 3px",
							textAlign: "center",
							fontSize: 10,
							fontWeight: 600,
						}}
					>
						{l}
					</div>
				))}
			</div>
			<div
				style={{ padding: 8, display: "flex", flexDirection: "column", gap: 5 }}
			>
				<div style={{ fontSize: 10, fontWeight: 600, color: C.muted }}>
					Bela suggests today
				</div>
				<div
					style={{
						background: C.coralLight,
						border: `1px solid ${C.coralBdr}`,
						borderRadius: 8,
						padding: "7px 8px",
					}}
				>
					<div style={{ fontSize: 10, fontWeight: 700, color: C.coral }}>
						🚲 East Coast Park cycling
					</div>
					<div style={{ fontSize: 10, color: C.muted }}>
						Free · Perfect weather · 2–3 hrs
					</div>
				</div>
				<div
					style={{
						background: C.white,
						border: `1px solid ${C.border}`,
						borderRadius: 8,
						padding: "7px 8px",
					}}
				>
					<div style={{ fontSize: 10, fontWeight: 600, color: C.navy }}>
						🍲 Tonight: Nasi Lemak
					</div>
					<div style={{ fontSize: 10, color: C.muted }}>
						25 min · Items at home
					</div>
				</div>
			</div>
		</div>
	);
}

function MealScreen() {
	const meals = [
		["Mon", "Chicken Rice", "25 min"],
		["Tue", "Aglio Olio", "15 min"],
		["Wed", "Char Kway Teow", "30 min"],
		["Thu", "Nasi Lemak 🥚", "45 min"],
		["Fri", "Pizza Night 🍕", "20 min"],
	];
	return (
		<div style={{ height: "100%", background: C.cream }}>
			<div style={{ background: C.navy, padding: 10, color: "#fff" }}>
				<div style={{ fontSize: 11, fontWeight: 700 }}>
					This week&apos;s meals
				</div>
				<div style={{ fontSize: 10, opacity: 0.55, marginTop: 1 }}>
					May 2026 · 5 plans
				</div>
			</div>
			<div style={{ padding: "6px 8px" }}>
				{meals.map(([day, meal, time]) => (
					<div
						key={day}
						style={{
							display: "flex",
							alignItems: "center",
							gap: 6,
							padding: "5px 0",
							borderBottom: `1px solid ${C.border}`,
						}}
					>
						<div
							style={{
								fontSize: 10,
								fontWeight: 600,
								color: C.muted,
								width: 22,
							}}
						>
							{day}
						</div>
						<div style={{ flex: 1 }}>
							<div style={{ fontSize: 10, fontWeight: 600, color: C.navy }}>
								{meal}
							</div>
							<div style={{ fontSize: 10, color: C.muted }}>{time}</div>
						</div>
						<span style={{ color: C.muted }}>›</span>
					</div>
				))}
				<div
					style={{
						marginTop: 8,
						background: C.coral,
						color: C.navy,
						borderRadius: 8,
						padding: 6,
						textAlign: "center",
						fontSize: 10,
						fontWeight: 700,
					}}
				>
					✨ Regenerate plan
				</div>
			</div>
		</div>
	);
}

function DiscoverScreen() {
	const places = [
		{ name: "Polliwogs", detail: "★4.8 · Ages 2–8", price: "$22" },
		{ name: "KidZania Singapore", detail: "★4.6 · Ages 4–14", price: "$38" },
		{ name: "Sentosa Palawan Beach", detail: "★4.9 · All ages", price: "Free" },
	];
	return (
		<div style={{ height: "100%", background: C.cream }}>
			<div style={{ background: C.navy, padding: 10, color: "#fff" }}>
				<div style={{ fontSize: 11, fontWeight: 700 }}>📍 Near VivoCity</div>
				<div style={{ fontSize: 10, opacity: 0.55, marginTop: 1 }}>
					Weekend · Budget $30
				</div>
			</div>
			<div
				style={{ padding: 8, display: "flex", flexDirection: "column", gap: 5 }}
			>
				{places.map(({ name, detail, price }) => (
					<div
						key={name}
						style={{
							background: C.white,
							border: `1px solid ${C.border}`,
							borderRadius: 8,
							padding: "7px 8px",
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "flex-start",
							}}
						>
							<div>
								<div style={{ fontSize: 10, fontWeight: 600, color: C.navy }}>
									{name}
								</div>
								<div style={{ fontSize: 10, color: C.muted }}>{detail}</div>
							</div>
							<div style={{ fontSize: 10, fontWeight: 700, color: C.coral }}>
								{price}
							</div>
						</div>
					</div>
				))}
				<div
					style={{
						fontSize: 10,
						color: C.coral,
						textAlign: "center",
						fontWeight: 600,
						marginTop: 2,
					}}
				>
					+ 12 more nearby →
				</div>
			</div>
		</div>
	);
}

function ChatScreen() {
	return (
		<div
			style={{
				height: "100%",
				background: C.cream,
				display: "flex",
				flexDirection: "column",
			}}
		>
			<div
				style={{
					background: C.navy,
					padding: "8px 10px",
					color: "#fff",
					display: "flex",
					alignItems: "center",
					gap: 7,
					flexShrink: 0,
				}}
			>
				<div
					style={{
						width: 22,
						height: 22,
						borderRadius: "50%",
						background: C.coral,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: 12,
					}}
				>
					🤖
				</div>
				<div>
					<div style={{ fontSize: 11, fontWeight: 700 }}>Bela</div>
					<div style={{ fontSize: 10, opacity: 0.5 }}>AI co-pilot</div>
				</div>
			</div>
			<div
				style={{
					padding: 8,
					display: "flex",
					flexDirection: "column",
					gap: 6,
					flex: 1,
				}}
			>
				{[
					{
						s: "bela",
						t: "Hi! Tell me your family's day and I'll plan something great.",
					},
					{ s: "user", t: "Kids hyper, raining outside" },
					{
						s: "bela",
						t: "Found 3 indoor spots! Polliwogs at VivoCity has a 2pm slot — shall I check?",
					},
				].map((m, i) => (
					<div
						key={i}
						style={{
							background: m.s === "user" ? C.coral : C.white,
							border: m.s === "bela" ? `1px solid ${C.border}` : "none",
							borderRadius: 10,
							borderBottomLeftRadius: m.s === "bela" ? 2 : 10,
							borderBottomRightRadius: m.s === "user" ? 2 : 10,
							padding: "7px 8px",
							fontSize: 10,
							color: m.s === "user" ? C.navy : C.navy,
							alignSelf: m.s === "user" ? "flex-end" : "flex-start",
							maxWidth: "85%",
							lineHeight: 1.45,
						}}
					>
						{m.t}
					</div>
				))}
			</div>
			<div
				style={{
					padding: "6px 8px",
					borderTop: `1px solid ${C.border}`,
					display: "flex",
					gap: 4,
					flexShrink: 0,
				}}
			>
				<div
					style={{
						flex: 1,
						background: C.white,
						border: `1px solid ${C.border}`,
						borderRadius: 7,
						padding: "5px 8px",
						fontSize: 10,
						color: C.muted,
					}}
				>
					Message Bela...
				</div>
				<div
					style={{
						background: C.coral,
						borderRadius: 7,
						padding: "5px 8px",
						fontSize: 10,
						color: C.navy,
						fontWeight: 700,
					}}
				>
					↑
				</div>
			</div>
		</div>
	);
}

const SCREENS = [
	{ label: "Home", Component: HomeScreen },
	{ label: "Meal planning", Component: MealScreen },
	{ label: "Discover", Component: DiscoverScreen },
	{ label: "Chat with Bela", Component: ChatScreen },
];

function ScreenshotsSection() {
	const [active, setActive] = useState(0);
	useEffect(() => {
		const id = setInterval(
			() => setActive((a) => (a + 1) % SCREENS.length),
			3800,
		);
		return () => clearInterval(id);
	}, []);
	return (
		<section
			id="how-it-works"
			style={{ ...S.section, background: C.white }}
			aria-label="App screens"
		>
			<div style={{ ...S.container, textAlign: "center" }}>
				<div style={S.eyebrow}>Inside the app</div>
				<h2 style={S.h2}>Four screens. One seamless family experience.</h2>
				<p style={{ ...S.lead, marginBottom: 48 }}>
					Cook, discover, plan, and chat with Bela — all in one place.
				</p>
				<div className="screens-row" style={{ marginBottom: 28 }}>
					{SCREENS.map(({ label, Component }, i) => {
						const on = i === active;
						return (
							<div key={label} style={{ textAlign: "center" }}>
								<button
									onClick={() => setActive(i)}
									aria-label={`View ${label} screen`}
									style={{
										background: "none",
										border: "none",
										cursor: "pointer",
										padding: 0,
									}}
								>
									<div
										style={{
											width: 148,
											height: 290,
											borderRadius: 26,
											border: `1.5px solid ${on ? C.coral : C.border}`,
											background: C.white,
											overflow: "hidden",
											position: "relative",
											transition: "all 0.25s",
											boxShadow: on
												? `0 0 0 3px ${C.coralLight}, 0 12px 40px rgba(13,33,55,0.12)`
												: "0 2px 12px rgba(0,0,0,0.05)",
											transform: on ? "translateY(-8px)" : "none",
										}}
									>
										<div
											style={{
												position: "absolute",
												top: 8,
												left: "50%",
												transform: "translateX(-50%)",
												width: 36,
												height: 4,
												borderRadius: 2,
												background: C.border,
												zIndex: 5,
											}}
										/>
										<div
											style={{
												paddingTop: 18,
												height: "100%",
												overflow: "hidden",
											}}
										>
											<Component />
										</div>
									</div>
								</button>
								<div
									style={{
										marginTop: 10,
										fontSize: 13,
										fontWeight: 500,
										color: on ? C.coral : C.muted,
										transition: "color 0.25s",
									}}
								>
									{label}
								</div>
							</div>
						);
					})}
				</div>
				<div
					style={{ display: "flex", gap: 6, justifyContent: "center" }}
					role="tablist"
					aria-label="Screen navigation"
				>
					{SCREENS.map((_, i) => (
						<button
							key={i}
							onClick={() => setActive(i)}
							role="tab"
							aria-label={`Screen ${i + 1}`}
							aria-selected={i === active}
							style={{
								width: i === active ? 24 : 8,
								height: 8,
								borderRadius: 4,
								border: "none",
								padding: 0,
								background: i === active ? C.coral : C.border,
								cursor: "pointer",
								transition: "all 0.25s",
							}}
						/>
					))}
				</div>
			</div>
		</section>
	);
}

// ─── DOWNLOAD ─────────────────────────────────────────────────────────────────
function DownloadSection() {
	return (
		<section
			id="download"
			style={{
				...S.section,
				background: C.navy,
				position: "relative",
				overflow: "hidden",
			}}
			aria-label="Download GoBela"
		>
			<div
				style={{
					position: "absolute",
					top: -80,
					right: -80,
					width: 320,
					height: 320,
					borderRadius: "50%",
					background: "rgba(255,176,32,0.07)",
					pointerEvents: "none",
				}}
				aria-hidden="true"
			/>
			<div
				style={{
					position: "absolute",
					bottom: -60,
					left: -60,
					width: 240,
					height: 240,
					borderRadius: "50%",
					background: "rgba(255,176,32,0.05)",
					pointerEvents: "none",
				}}
				aria-hidden="true"
			/>
			<div
				style={{
					maxWidth: 560,
					margin: "0 auto",
					position: "relative",
					textAlign: "center",
				}}
			>
				<div
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: 7,
						background: "rgba(74,222,128,0.15)",
						border: "1px solid rgba(74,222,128,0.3)",
						color: "#4ADE80",
						borderRadius: 999,
						padding: "5px 16px",
						fontSize: 12,
						fontWeight: 700,
						marginBottom: 20,
						letterSpacing: "0.01em",
					}}
				>
					<span
						style={{
							width: 6,
							height: 6,
							borderRadius: "50%",
							background: "#4ADE80",
						}}
					/>
					Live on iOS &amp; Android
				</div>
				<h2
					style={{
						...S.h2,
						color: "#fff",
						fontSize: "clamp(28px,4vw,40px)",
						marginBottom: 14,
					}}
				>
					Download GoBela — free
				</h2>
				<p
					style={{
						fontSize: 16,
						color: "rgba(255,255,255,0.62)",
						lineHeight: 1.7,
						marginBottom: 36,
						maxWidth: 440,
						margin: "0 auto 36px",
					}}
				>
					Join Singapore families already using GoBela to plan meals, book trial
					classes, and discover weekend activities with their kids.
				</p>
				<div className="dl-btns">
					<a
						href="https://apps.apple.com/sg/app/gobela/id6767062415"
						target="_blank"
						rel="noopener noreferrer"
						className="dl-ios"
					>
						<AppleSVG />
						<div style={{ textAlign: "left" }}>
							<div
								style={{
									fontSize: 11,
									fontWeight: 500,
									opacity: 0.6,
									lineHeight: 1,
								}}
							>
								Download on the
							</div>
							<div
								style={{
									fontSize: 17,
									fontWeight: 700,
									lineHeight: 1.3,
									letterSpacing: "-0.01em",
								}}
							>
								App Store
							</div>
						</div>
					</a>
					<a
						href="https://play.google.com/store/apps/details?id=com.gobela.app"
						target="_blank"
						rel="noopener noreferrer"
						className="dl-gp"
					>
						<GoogleSVG />
						<div style={{ textAlign: "left" }}>
							<div
								style={{
									fontSize: 11,
									fontWeight: 500,
									opacity: 0.6,
									lineHeight: 1,
								}}
							>
								Get it on
							</div>
							<div
								style={{
									fontSize: 17,
									fontWeight: 700,
									lineHeight: 1.3,
									letterSpacing: "-0.01em",
								}}
							>
								Google Play
							</div>
						</div>
					</a>
				</div>
				<div
					style={{
						display: "flex",
						gap: 24,
						justifyContent: "center",
						flexWrap: "wrap",
						marginTop: 8,
					}}
				>
					{[
						"🔒 Free to download",
						"📍 Singapore-only",
						"⭐ No subscription required",
					].map((t) => (
						<span
							key={t}
							style={{ fontSize: 13, color: "rgba(255,255,255,0.38)" }}
						>
							{t}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
	const cols = [
		{
			heading: "App",
			links: [
				["Features", "/#features"],
				["How it works", "/#how-it-works"],
				["Try Bela", "/#bela-chat"],
				["Download", "/#download"],
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
				["Delete account", "/delete-account"],
			],
		},
	];
	return (
		<footer
			style={{
				background: "#060F18",
				padding: "52px 24px 24px",
				borderTop: "1px solid rgba(255,255,255,0.06)",
			}}
		>
			<div style={{ maxWidth: 960, margin: "0 auto" }}>
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						gap: 40,
						marginBottom: 44,
					}}
				>
					{/* Brand */}
					<div style={{ flex: "1 1 220px" }}>
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
								color: "rgba(255,255,255,0.38)",
								lineHeight: 1.7,
								maxWidth: 200,
								marginTop: 10,
								marginBottom: 18,
							}}
						>
							The easiest way for Singapore families to book trial classes, plan
							meals, and enjoy their weekends.
						</p>
						{/* Mini store buttons in footer */}
						<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
							<a
								href="https://apps.apple.com/sg/app/gobela/id6767062415"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: 7,
									background: "rgba(255,255,255,0.08)",
									border: "1px solid rgba(255,255,255,0.12)",
									color: "#fff",
									borderRadius: 9,
									padding: "8px 14px",
									textDecoration: "none",
									fontSize: 12,
									fontWeight: 600,
									width: "fit-content",
								}}
							>
								<AppleSVG /> App Store
							</a>
							<a
								href="https://play.google.com/store/apps/details?id=com.gobela.app"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: 7,
									background: "rgba(255,255,255,0.08)",
									border: "1px solid rgba(255,255,255,0.12)",
									color: "#fff",
									borderRadius: 9,
									padding: "8px 14px",
									textDecoration: "none",
									fontSize: 12,
									fontWeight: 600,
									width: "fit-content",
								}}
							>
								<GoogleSVG /> Google Play
							</a>
						</div>
					</div>
					{/* Nav cols */}
					{cols.map(({ heading, links }) => (
						<div key={heading} style={{ flex: "0 1 140px" }}>
							<div
								style={{
									fontSize: 11,
									fontWeight: 700,
									color: "rgba(255,255,255,0.28)",
									textTransform: "uppercase",
									letterSpacing: "0.08em",
									marginBottom: 14,
								}}
							>
								{heading}
							</div>
							{links.map(([label, href]) => (
								<div key={label} style={{ marginBottom: 10 }}>
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
					<div style={{ fontSize: 12, color: "rgba(255,255,255,0.28)" }}>
						© 2026 GoBela Pte. Ltd. · UEN 202620732H · All rights reserved.
					</div>
					<div style={{ display: "flex", gap: 16, alignItems: "center" }}>
						<a
							href="https://www.instagram.com/gobelaapp"
							target="_blank"
							rel="noopener noreferrer"
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: 6,
								fontSize: 12,
								color: "rgba(255,255,255,0.38)",
								textDecoration: "none",
							}}
						>
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="currentColor"
								aria-hidden="true"
							>
								<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
							</svg>
							@gobelaapp
						</a>
						<div style={{ fontSize: 12, color: "rgba(255,255,255,0.28)" }}>
							Made with ❤️ for Singapore families 🇸🇬
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
	const belaRef = useRef<HTMLDivElement>(null);
	const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) =>
		ref.current?.scrollIntoView({ behavior: "smooth" });

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
			<GlobalStyles />
			<LaunchBanner />
			<Navbar />
			<HeroSection onTryBela={() => scrollTo(belaRef)} />
			<StatsBar />
			<FeaturesSection />
			<FounderSection />
			<TestimonialsSection />
			<PartnerSpotlightSection />
			<div ref={belaRef}>
				<BelaChatSection />
			</div>
			<ScreenshotsSection />
			<DownloadSection />
			<Footer />
		</main>
	);
}
