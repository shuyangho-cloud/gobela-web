"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OnboardingContent() {
	const params = useSearchParams();
	const status = params.get("status");

	if (status === "complete") {
		return (
			<div style={{ textAlign: "center", padding: "80px 24px" }}>
				<div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
				<h1
					style={{
						fontSize: 28,
						fontWeight: 700,
						color: "#0D2137",
						marginBottom: 12,
					}}
				>
					You&apos;re all set!
				</h1>
				<p
					style={{
						fontSize: 16,
						color: "#64748B",
						maxWidth: 400,
						margin: "0 auto 32px",
						lineHeight: 1.6,
					}}
				>
					Your Stripe account is connected. GoBela can now send you payouts after
					each confirmed booking. You&apos;ll receive an email from Stripe once
					your account is verified.
				</p>
				<p style={{ fontSize: 14, color: "#64748B" }}>
					Questions? WhatsApp us at{" "}
					<a
						href="https://wa.me/6581506489"
						style={{ color: "#FFB020", fontWeight: 600 }}
					>
						+65 8150 6489
					</a>
				</p>
			</div>
		);
	}

	if (status === "refresh") {
		return (
			<div style={{ textAlign: "center", padding: "80px 24px" }}>
				<div style={{ fontSize: 48, marginBottom: 16 }}>⏱️</div>
				<h1
					style={{
						fontSize: 28,
						fontWeight: 700,
						color: "#0D2137",
						marginBottom: 12,
					}}
				>
					Link expired
				</h1>
				<p
					style={{
						fontSize: 16,
						color: "#64748B",
						maxWidth: 400,
						margin: "0 auto 32px",
						lineHeight: 1.6,
					}}
				>
					Your onboarding link has expired. Please contact GoBela and we&apos;ll
					send you a fresh link.
				</p>
				<p style={{ fontSize: 14, color: "#64748B" }}>
					WhatsApp us at{" "}
					<a
						href="https://wa.me/6581506489"
						style={{ color: "#FFB020", fontWeight: 600 }}
					>
						+65 8150 6489
					</a>
				</p>
			</div>
		);
	}

	return (
		<div style={{ textAlign: "center", padding: "80px 24px" }}>
			<div style={{ fontSize: 48, marginBottom: 16 }}>🔗</div>
			<h1
				style={{
					fontSize: 28,
					fontWeight: 700,
					color: "#0D2137",
					marginBottom: 12,
				}}
			>
				Partner Onboarding
			</h1>
			<p style={{ fontSize: 16, color: "#64748B" }}>
				Please use the link sent to you by GoBela to complete your Stripe
				account setup.
			</p>
		</div>
	);
}

export default function PartnerOnboardingPage() {
	return (
		<main
			style={{
				minHeight: "100vh",
				background: "#FFFBF5",
				fontFamily: "system-ui, sans-serif",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<div style={{ maxWidth: 560, width: "100%" }}>
				<div style={{ textAlign: "center", marginBottom: 32 }}>
					<span
						style={{ fontSize: 22, fontWeight: 800, color: "#0D2137" }}
					>
						Go<span style={{ color: "#FFB020" }}>Bela</span>
					</span>
				</div>
				<Suspense>
					<OnboardingContent />
				</Suspense>
			</div>
		</main>
	);
}
