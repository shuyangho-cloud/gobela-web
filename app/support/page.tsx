import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const faqs = [
  {
    q: "How do I get started with GoBela?",
    a: "Download GoBela from the App Store, create an account, and tell Bela about your family — your children's ages, dietary preferences, and interests. Bela will start personalising recommendations right away.",
  },
  {
    q: "What is Bela?",
    a: "Bela is GoBela's AI co-pilot. She learns your family's preferences over time and suggests what to cook, where to go, and what to book — so you spend less time deciding and more time enjoying.",
  },
  {
    q: "How does BelaExplore trial class booking work?",
    a: "Browse trial classes in the Discover tab, fill in your name, contact number, and preferred date, and submit. The activity provider will contact you within 24 hours to confirm your slot. No commitment required — try before you sign up for a full term.",
  },
  {
    q: "What is GoBela Pass?",
    a: "GoBela Pass is our subscription plan that unlocks more trial class bookings, priority confirmations, and exclusive partner deals. The Free plan includes 1 trial booking per month. Paid tiers (Plus and Family) are launching soon.",
  },
  {
    q: "How do I save events to My Weekend?",
    a: "Tap the bookmark icon on any event card in Weekend Mode or the Discover tab. Your saved events will appear in the 'My Weekend' section at the top of Weekend Mode.",
  },
  {
    q: "How do I make a restaurant reservation?",
    a: "In the Dine screen, tap any restaurant to view details, then tap 'Reserve via Chope' to book directly through Chope. You'll be taken to the restaurant's Chope booking page.",
  },
  {
    q: "Is GoBela available on Android?",
    a: "GoBela is currently available on iOS (iPhone and iPad). Android is on our roadmap and coming soon.",
  },
  {
    q: "How do I delete my account?",
    a: "To delete your account and all associated data, go to Profile → Settings → Delete Account. This action is permanent and cannot be undone. Alternatively, email us at privacy@gobela.sg and we will process the deletion within 7 business days.",
  },
  {
    q: "My app is crashing or not loading. What should I do?",
    a: "Try these steps: (1) Close and reopen the app. (2) Check your internet connection. (3) Update GoBela to the latest version from the App Store. (4) Restart your phone. If the issue persists, email us at hello@gobela.sg with your device model and iOS version.",
  },
  {
    q: "How do I update my family profile?",
    a: "Go to Profile (bottom navigation) and tap Edit Profile. You can update your children's ages, dietary needs, location district, and household preferences at any time.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. GoBela uses industry-standard encryption for all data in transit and at rest. We never sell your personal data to third parties. See our Privacy Policy for full details.",
  },
  {
    q: "How do I become a GoBela partner?",
    a: "If you run an activity centre, enrichment school, or family restaurant and want to reach Singapore families through GoBela, visit our Partners page or email hello@gobela.sg.",
  },
];

export default function SupportPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">

        {/* Hero */}
        <section className="bg-[#1A2C4E] text-white py-16">
          <div className="max-w-3xl mx-auto px-5 text-center">
            <p className="text-[#FFB703] font-semibold text-sm uppercase tracking-widest mb-3">Help Centre</p>
            <h1 className="text-4xl font-extrabold mb-4">How can we help?</h1>
            <p className="text-white/70 text-lg">
              Find answers below, or reach us directly at{" "}
              <a href="mailto:hello@gobela.sg" className="text-[#FFB703] hover:underline">
                hello@gobela.sg
              </a>
            </p>
          </div>
        </section>

        {/* Quick links */}
        <section className="bg-[#FFB703] py-6">
          <div className="max-w-3xl mx-auto px-5 flex flex-wrap justify-center gap-4">
            {[
              { label: "Email Support", href: "mailto:hello@gobela.sg" },
              { label: "Contact Form", href: "/contact" },
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Become a Partner", href: "/partners" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="bg-[#1A2C4E] text-white font-semibold px-5 py-2 rounded-full text-sm hover:bg-[#243d6b] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-[#F8F9FA]">
          <div className="max-w-3xl mx-auto px-5">
            <h2 className="text-2xl font-extrabold text-[#1A2C4E] mb-10 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <h3 className="font-bold text-[#1A2C4E] mb-2">{faq.q}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Still need help */}
        <section className="py-16 bg-white">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <div className="text-4xl mb-4">💬</div>
            <h2 className="text-2xl font-extrabold text-[#1A2C4E] mb-3">Still need help?</h2>
            <p className="text-gray-500 mb-8">
              Our team responds to every message, usually within one business day.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="bg-[#FFB703] text-[#1A2C4E] font-bold px-8 py-3 rounded-full hover:bg-yellow-400 transition-colors"
              >
                Send us a message
              </Link>
              <a
                href="mailto:hello@gobela.sg"
                className="border border-[#1A2C4E] text-[#1A2C4E] font-semibold px-8 py-3 rounded-full hover:bg-[#1A2C4E]/5 transition-colors"
              >
                hello@gobela.sg
              </a>
            </div>
            <p className="text-gray-400 text-sm mt-6">
              For account deletion or data requests:{" "}
              <a href="mailto:privacy@gobela.sg" className="text-[#FFB703] hover:underline">
                privacy@gobela.sg
              </a>
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
