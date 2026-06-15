import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Delete Account — GoBela",
	description: "Request deletion of your GoBela account and associated data.",
};

export default function DeleteAccountPage() {
	return (
		<main
			style={{
				fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
				background: "#fff",
				color: "#1a1a1a",
				minHeight: "100vh",
			}}
		>
			<nav
				style={{
					padding: "20px 40px",
					display: "flex",
					alignItems: "center",
					borderBottom: "1px solid #f0f0f0",
				}}
			>
				<Link
					href="/"
					style={{
						fontSize: 22,
						fontWeight: 800,
						color: "#10B981",
						textDecoration: "none",
					}}
				>
					GoBela
				</Link>
			</nav>

			<div
				style={{ maxWidth: 640, margin: "60px auto", padding: "0 24px 80px" }}
			>
				<h1
					style={{
						fontSize: 32,
						fontWeight: 800,
						marginBottom: 8,
						letterSpacing: "-0.5px",
					}}
				>
					Delete Your Account
				</h1>
				<p style={{ color: "#999", fontSize: 14, marginBottom: 40 }}>
					GoBela Pte. Ltd. · Last updated: 11 May 2026
				</p>

				<p
					style={{
						fontSize: 16,
						lineHeight: 1.7,
						color: "#444",
						marginBottom: 24,
					}}
				>
					You can request deletion of your GoBela account and all associated
					personal data at any time. We will process your request within{" "}
					<strong>3 business days</strong> in accordance with the Singapore
					Personal Data Protection Act (PDPA).
				</p>

				<h2 style={{ fontSize: 20, fontWeight: 700, margin: "32px 0 12px" }}>
					What gets deleted
				</h2>
				<ul
					style={{
						fontSize: 16,
						lineHeight: 1.8,
						color: "#444",
						paddingLeft: 24,
						marginBottom: 24,
					}}
				>
					<li>Your account credentials (email address, password)</li>
					<li>Your profile information (name, child profile)</li>
					<li>Your saved preferences and dietary settings</li>
					<li>Your booking history and dispute records</li>
					<li>Any content or reviews you have submitted</li>
				</ul>

				<h2 style={{ fontSize: 20, fontWeight: 700, margin: "32px 0 12px" }}>
					What may be retained
				</h2>
				<p
					style={{
						fontSize: 16,
						lineHeight: 1.7,
						color: "#444",
						marginBottom: 24,
					}}
				>
					Anonymised, aggregated analytics data may be retained for up to 90
					days. Financial transaction records required for legal or tax
					compliance may be retained for up to 7 years as required by Singapore
					law.
				</p>

				<h2 style={{ fontSize: 20, fontWeight: 700, margin: "32px 0 12px" }}>
					How to request deletion
				</h2>
				<p
					style={{
						fontSize: 16,
						lineHeight: 1.7,
						color: "#444",
						marginBottom: 16,
					}}
				>
					Send an email to{" "}
					<a
						href="mailto:privacy@gobela.sg?subject=Account%20Deletion%20Request"
						style={{ color: "#10B981" }}
					>
						privacy@gobela.sg
					</a>{" "}
					with the subject line <strong>"Account Deletion Request"</strong> from
					the email address associated with your GoBela account.
				</p>
				<p
					style={{
						fontSize: 16,
						lineHeight: 1.7,
						color: "#444",
						marginBottom: 32,
					}}
				>
					We will confirm receipt within 1 business day and complete the
					deletion within 3 business days.
				</p>

				<a
					href="mailto:privacy@gobela.sg?subject=Account%20Deletion%20Request"
					style={{
						display: "inline-block",
						background: "#10B981",
						color: "#fff",
						padding: "14px 28px",
						borderRadius: 12,
						fontWeight: 700,
						fontSize: 15,
						textDecoration: "none",
					}}
				>
					Email us to delete my account
				</a>

				<p style={{ fontSize: 13, color: "#999", marginTop: 24 }}>
					For other privacy requests, see our{" "}
					<Link href="/privacy" style={{ color: "#10B981" }}>
						Privacy Policy
					</Link>
					.
				</p>
			</div>

			<footer
				style={{
					textAlign: "center",
					padding: "40px 24px",
					fontSize: 13,
					color: "#999",
					borderTop: "1px solid #f0f0f0",
				}}
			>
				© 2026 GoBela Pte. Ltd. ·{" "}
				<Link href="/" style={{ color: "#10B981" }}>
					Home
				</Link>
			</footer>
		</main>
	);
}
