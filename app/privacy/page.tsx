import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <div className="max-w-3xl mx-auto px-5 py-16">
          <h1 className="text-3xl font-extrabold text-[#1A2C4E] mb-2">Privacy Policy</h1>
          <p className="text-gray-400 text-sm mb-10">Last updated: May 2026</p>

          {[
            {
              title: "1. Information We Collect",
              body: "We collect information you provide directly to us, such as your name, email address, children's ages and preferences. We also collect usage data to improve the app experience.",
            },
            {
              title: "2. How We Use Your Information",
              body: "We use your information to provide personalised recommendations through Bela, improve our services, and communicate with you about the app. We never sell your personal data.",
            },
            {
              title: "3. Data Sharing",
              body: "We do not sell, trade, or rent your personal information to third parties. We may share anonymised, aggregated data with partners for analytics purposes.",
            },
            {
              title: "4. Data Security",
              body: "We implement industry-standard security measures to protect your data. All data is encrypted in transit and at rest. We use Supabase for secure data storage.",
            },
            {
              title: "5. Children's Privacy",
              body: "We take children's privacy seriously. We collect only the minimum information needed (age ranges, dietary needs) to personalise recommendations. We do not collect personally identifiable information about children.",
            },
            {
              title: "6. Your Rights",
              body: "You may request access to, correction of, or deletion of your personal data at any time by contacting us at hello@gobela.sg. We will respond within 30 days.",
            },
            {
              title: "7. Contact Us",
              body: "If you have any questions about this Privacy Policy, please contact us at hello@gobela.sg.",
            },
          ].map((section) => (
            <div key={section.title} className="mb-8">
              <h2 className="text-lg font-bold text-[#1A2C4E] mb-2">{section.title}</h2>
              <p className="text-gray-500 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
