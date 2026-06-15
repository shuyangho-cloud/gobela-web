import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Partner Terms & Conditions · GoBela",
};

const C = {
	coral: "#FFB020",
	navy: "#0D2137",
	cream: "#FFFBF5",
	border: "#EDE5DB",
	muted: "#64748B",
	bg2: "#F8F4F0",
};

export default function PartnerTermsPage() {
	return (
		<div
			style={{
				background: C.cream,
				minHeight: "100vh",
				fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
			}}
		>
			{/* Nav */}
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
						maxWidth: 800,
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
					<a
						href="/partners"
						style={{
							fontSize: 13,
							color: C.coral,
							fontWeight: 600,
							textDecoration: "none",
						}}
					>
						← Back to Partner Signup
					</a>
				</div>
			</nav>

			{/* Content */}
			<div
				style={{ maxWidth: 800, margin: "0 auto", padding: "56px 24px 96px" }}
			>
				{/* Header */}
				<div style={{ marginBottom: 48 }}>
					<p
						style={{
							fontSize: 11,
							fontWeight: 600,
							color: C.coral,
							textTransform: "uppercase",
							letterSpacing: "0.08em",
							marginBottom: 10,
						}}
					>
						Legal
					</p>
					<h1
						style={{
							fontSize: "clamp(28px,4vw,40px)",
							fontWeight: 700,
							color: C.navy,
							letterSpacing: "-0.02em",
							lineHeight: 1.15,
							marginBottom: 14,
						}}
					>
						Partner Terms & Conditions
					</h1>
					<p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
						Effective upon submission of your partner application via
						gobela.sg/partners.
					</p>
				</div>

				{/* Terms */}
				<div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
					{[
						{
							n: "1",
							title: "Listing",
							body: "GoBela will create and maintain your class listing on the GoBela app at no cost. You may request updates to your listing details at any time by contacting hello@gobela.sg.",
						},
						{
							n: "2",
							title: "Trial Vouchers",
							body: "Parents purchase a trial voucher through the GoBela app for a class listed on your profile. Upon purchase, the parent receives a unique voucher code and your contact details. The parent will contact you directly to arrange a suitable trial date and time. You are not required to manage availability through GoBela.",
						},
						{
							n: "3",
							title: "Voucher Redemption",
							body: "You agree to accommodate voucher holders by offering a suitable trial slot within a reasonable timeframe. Trial vouchers are valid for 90 days from the date of purchase. If you are unable to accommodate a parent within the validity period, please notify GoBela at hello@gobela.sg so that a refund or extension can be arranged.",
						},
						{
							n: "4",
							title: "Payment & Platform Fee — Trial Vouchers",
							body: "GoBela collects the full trial voucher price from the parent as stated in your listing. A flat S$5 platform fee is deducted from that amount, and the remaining balance is transferred to you within 2–3 business days of the trial class taking place.",
						},
						{
							n: "5",
							title: "Payment & Platform Fee — Packages & Term Enrolments",
							body: "Where a parent proceeds to sign up for a full package or term enrolment through GoBela, GoBela will collect the full package price from the parent on your behalf. A platform fee of 8% of the total package price is deducted, and the remaining balance is transferred to you within 2–3 business days of the enrolment being confirmed.",
						},
						{
							n: "6",
							title: "Cancellations & Refunds",
							body: "If you are unable to honour a voucher redemption request, notify GoBela at hello@gobela.sg as soon as possible. GoBela reserves the right to issue a refund to the parent in such cases. Repeated failures to accommodate voucher holders may result in your listing being suspended.",
						},
						{
							n: "7",
							title: "Accuracy",
							body: "You are responsible for ensuring your listing information (pricing, schedule, location, age groups) is accurate and up to date. To update your listing, notify GoBela by emailing hello@gobela.sg or by resubmitting your details via gobela.sg/partners. Changes will be reflected within 1–2 working days.",
						},
						{
							n: "8",
							title: "Conduct",
							body: "Partners are expected to provide a safe, welcoming environment for children and parents. GoBela reserves the right to remove any listing that receives consistent negative feedback or violates these terms.",
						},
						{
							n: "9",
							title: "Termination",
							body: "Either party may end the partnership at any time with written notice to hello@gobela.sg. Any outstanding unredeemed vouchers sold prior to termination must still be honoured or refunded to the parent.",
						},
						{
							n: "10",
							title: "Governing Law",
							body: "These terms are governed by the laws of Singapore.",
						},
					].map((clause) => (
						<div
							key={clause.n}
							style={{
								background: "#fff",
								border: `1px solid ${C.border}`,
								borderRadius: 16,
								padding: "28px 32px",
								display: "flex",
								gap: 24,
							}}
						>
							<div
								style={{
									flexShrink: 0,
									width: 36,
									height: 36,
									borderRadius: 10,
									background: C.bg2,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: 13,
									fontWeight: 700,
									color: C.coral,
								}}
							>
								{clause.n}
							</div>
							<div>
								<h2
									style={{
										fontSize: 16,
										fontWeight: 700,
										color: C.navy,
										marginBottom: 8,
									}}
								>
									{clause.title}
								</h2>
								<p
									style={{
										fontSize: 14,
										color: C.muted,
										lineHeight: 1.75,
										margin: 0,
									}}
								>
									{clause.body}
								</p>
							</div>
						</div>
					))}
				</div>

				{/* Footer CTA */}
				<div
					style={{
						marginTop: 48,
						padding: "32px",
						background: "#fff",
						border: `1px solid ${C.border}`,
						borderRadius: 16,
						textAlign: "center",
					}}
				>
					<p
						style={{
							fontSize: 14,
							color: C.muted,
							marginBottom: 20,
							lineHeight: 1.7,
						}}
					>
						Questions about these terms? Reach us at{" "}
						<a
							href="mailto:hello@gobela.sg"
							style={{ color: C.navy, fontWeight: 600, textDecoration: "none" }}
						>
							hello@gobela.sg
						</a>
					</p>
					<a
						href="/partners"
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 8,
							background: C.coral,
							color: C.navy,
							border: "none",
							padding: "12px 28px",
							borderRadius: 10,
							fontSize: 14,
							fontWeight: 600,
							textDecoration: "none",
						}}
					>
						Apply to become a partner →
					</a>
				</div>
			</div>
		</div>
	);
}
