import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function TermsPage() {
	return (
		<>
			<Navbar />
			<main className="pt-16">
				<div className="max-w-3xl mx-auto px-5 py-16">
					<h1 className="text-3xl font-extrabold text-[#1A2C4E] mb-2">
						Terms of Use
					</h1>
					<p className="text-gray-400 text-sm mb-10">Last updated: June 2026</p>

					{[
						{
							title: "1. Acceptance of Terms",
							body: "By downloading or using the GoBela app, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the app.",
						},
						{
							title: "2. Description of Service",
							body: "GoBela is a platform that helps parents discover and book enrichment classes and activities for their children in Singapore. We connect parents with enrichment providers and facilitate trial class bookings.",
						},
						{
							title: "3. User Accounts",
							body: "You must create an account to use GoBela. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when creating your account.",
						},
						{
							title: "4. Bookings and Payments",
							body: "Trial class bookings are subject to availability and partner confirmation. GoBela charges a S$5 platform fee per booking. Payments are processed securely via Stripe. Full refunds are available for cancellations made at least 24 hours before the scheduled class.",
						},
						{
							title: "5. Subscriptions",
							body: "GoBela may offer auto-renewable subscription plans that provide access to premium features. Subscriptions are billed on a recurring basis (monthly or annually) at the price shown at the time of purchase. Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current billing period. You can manage and cancel your subscription in your device's App Store account settings.",
						},
						{
							title: "6. Cancellation and Refunds",
							body: "You may cancel your subscription at any time through your App Store account settings. Cancellation takes effect at the end of the current billing period. Refunds for subscriptions are subject to the App Store's refund policy.",
						},
						{
							title: "7. User Conduct",
							body: "You agree not to misuse the GoBela platform. Prohibited activities include submitting false information, attempting to circumvent our booking system, or using the platform for any unlawful purpose.",
						},
						{
							title: "8. Partner Listings",
							body: "GoBela lists enrichment classes provided by third-party partners. We do not guarantee the accuracy of partner-provided information. Parents should verify class details directly with the enrichment provider before booking.",
						},
						{
							title: "9. Limitation of Liability",
							body: "GoBela provides the platform on an 'as is' basis. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform, including any disputes between parents and enrichment providers.",
						},
						{
							title: "10. Changes to Terms",
							body: "We may update these Terms of Use from time to time. Continued use of the app after changes constitutes acceptance of the new terms. We will notify users of significant changes via the app or email.",
						},
						{
							title: "11. Governing Law",
							body: "These Terms of Use are governed by the laws of Singapore. Any disputes shall be subject to the exclusive jurisdiction of the courts of Singapore.",
						},
						{
							title: "12. Contact Us",
							body: "If you have any questions about these Terms of Use, please contact us at hello@gobela.sg.",
						},
					].map((section) => (
						<div key={section.title} className="mb-8">
							<h2 className="text-lg font-bold text-[#1A2C4E] mb-2">
								{section.title}
							</h2>
							<p className="text-gray-600 leading-relaxed">{section.body}</p>
						</div>
					))}
				</div>
			</main>
			<Footer />
		</>
	);
}
