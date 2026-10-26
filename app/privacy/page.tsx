import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function PrivacyPage() {
	return (
		<>
			<Navbar />
			<main className="pt-16">
				<div className="max-w-3xl mx-auto px-5 py-16">
					<h1 className="text-3xl font-extrabold text-[#1A2C4E] mb-2">
						Privacy Policy
					</h1>
					<p className="text-gray-400 text-sm mb-10">Last updated: 27 October 2026</p>

					{[
						{
							title: "1. Information We Collect",
							body: "We collect information you choose to provide, including your name, email address, children’s ages and preferences, bookings and community contributions. If you use private family features, you may also enter child names or birth dates, measurements, health notes and reminder details. Usage information may be collected as described below.",
						},
						{
							title: "2. How We Use Your Information",
							body: "We use your information to provide GoBela services, respond to enquiries, provide activity recommendations and improve the app. Private family records help you organise information you enter; they are kept separate from founder business analytics and marketing queries. We never sell your personal data.",
						},
						{
							title: "3. Data Sharing",
							body: "We do not sell, trade, or rent your personal information. We may share anonymised, aggregated data with partners for analytics. Where available, optional app measurement is off by default. If you enable it in GoBela App Settings, selected app activity (app activations, listing views, trial taps and checkout starts), app/device identifiers, and device/network information and SDK diagnostics are shared with Meta to measure advertising. GoBela does not attach child profiles, names, contact details, searches, booking identifiers or payment details to these events. On iOS, system tracking permission is also required. You may turn this off at any time in App Settings to stop future GoBela event logging; doing so does not delete data already received by Meta. Meta processes received information under its own privacy policy.",
						},
						{
							title: "4. Data Security",
							body: "We use authenticated access, per-account permissions and HTTPS for our hosted services. Supabase provides account and hosted data services; Vercel hosts the website and its APIs. Files you export to your own device are under your control.",
						},
						{
							title: "5. Children's Privacy",
							body: "Child names, birth dates, dietary needs and health notes can identify a child and are personal data. Enter information only for children whose information you are authorised to manage. Private family records are accessible to the signed-in account that created them; sharing between guardian accounts is not currently provided.",
						},
						{
							title: "6. Private Family Records and Consent",
                            body: "Private family records require your consent. Withdrawing consent stops new child, health and reminder records while preserving access to export and delete existing records. Deleting a child removes the family health and reminder records linked to that child. These features organise user-entered records; they do not diagnose, prescribe, interpret growth measurements or determine vaccination schedules. Web reminders are records only and do not send background notifications.",
                        },
                        {
                            title: "7. Hosting and Processing Locations",
                            body: "GoBela data is not limited to Singapore. The production Supabase database is currently hosted in Japan, and website/API processing includes the United States. Hosting providers may use additional locations for their operations and subprocessors. Contact hello@gobela.sg for current processing and retention details before entering information you do not wish to store in these services.",
                        },
                        {
                            title: "8. Retention and Deletion",
                            body: "Private family records remain in your account until you delete the record, the linked child or the account through the applicable deletion process. Withdrawing consent does not automatically delete existing records. Backup and security-log copies are handled separately from the live database, so deleting online records does not imply immediate erasure of every recovery copy. Contact us for current backup/log retention details. Financial or transaction records may be retained where applicable requirements or unresolved disputes require them.",
                        },
                        {
                            title: "9. Your Rights",
							body: "You may request access to, correction of, or deletion of your personal data at any time by contacting us at hello@gobela.sg. We will respond within 30 days.",
						},
						{
							title: "10. Contact Us",
							body: "If you have any questions about this Privacy Policy, please contact us at hello@gobela.sg.",
						},
					].map((section) => (
						<div key={section.title} className="mb-8">
							<h2 className="text-lg font-bold text-[#1A2C4E] mb-2">
								{section.title}
							</h2>
							<p className="text-gray-500 leading-relaxed">{section.body}</p>
						</div>
					))}
				</div>
			</main>
			<Footer />
		</>
	);
}
