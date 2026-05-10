import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const partnerTypes = [
  {
    icon: "🎡",
    title: "Activity Providers",
    desc: "Enrichment centres, indoor playgrounds, sports academies, arts studios, and more. List your classes and events directly in the GoBela Discover feed.",
    perks: ["Instant booking integration", "Real-time slot management", "Targeted reach to parents by child age"],
  },
  {
    icon: "🍽️",
    title: "Restaurants & F&B",
    desc: "Family-friendly cafes, restaurants, and hawker stalls. Get featured in Bela's curated dining recommendations based on location and preferences.",
    perks: ["Curated placement in the Dine tab", "Menu and allergy tagging", "Parent-reviewed credibility boost"],
  },
  {
    icon: "🛒",
    title: "Suppliers & Brands",
    desc: "Fresh produce, pantry staples, meal kits, and family products. Partner with GoBela's Cook at Home feature to reach families during meal planning.",
    perks: ["In-recipe product placement", "Seasonal promotion slots", "Direct-to-family marketing channel"],
  },
];

const faqs = [
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
    q: "What platforms does GoBela support bookings from?",
    a: "We currently integrate with Klook, Peatix, and Fever, as well as direct booking links. Our direct partner integration (zero commission) is in beta.",
  },
  {
    q: "Is GoBela only for Singapore?",
    a: "For now, yes — we are hyper-focused on Singapore families. Regional expansion is planned for 2027.",
  },
];

export default function PartnersPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 flex flex-col">

        {/* Hero */}
        <section className="bg-[#1A2C4E] text-white py-20">
          <div className="max-w-3xl mx-auto px-5 text-center">
            <p className="text-[#FFB703] font-semibold text-sm uppercase tracking-widest mb-4">Partner with GoBela</p>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              Reach Singapore families<br />at the moment of decision
            </h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto">
              GoBela puts your venue, class, or product in front of parents exactly when they&apos;re
              deciding where to go, what to eat, and how to spend their weekend.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-[#FFB703] py-8">
          <div className="max-w-4xl mx-auto px-5 grid grid-cols-3 gap-4 text-center">
            {[
              { val: "🇸🇬", label: "Singapore families" },
              { val: "🤖", label: "AI-powered discovery" },
              { val: "S$0", label: "To get listed" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-[#1A2C4E] text-2xl font-extrabold">{s.val}</p>
                <p className="text-[#1A2C4E]/70 text-sm font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Partner types */}
        <section id="types" className="py-20 bg-[#F8F9FA]">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-extrabold text-[#1A2C4E] mb-3">Who we partner with</h2>
              <p className="text-gray-500">GoBela works with three categories of family-focused businesses.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {partnerTypes.map((p) => (
                <div key={p.title} className="bg-white rounded-2xl p-7 shadow-sm">
                  <div className="text-4xl mb-4">{p.icon}</div>
                  <h3 className="font-bold text-[#1A2C4E] text-lg mb-2">{p.title}</h3>
                  <p className="text-gray-500 text-sm mb-5 leading-relaxed">{p.desc}</p>
                  <ul className="space-y-2">
                    {p.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-[#2FB7A8] font-bold">✓</span>
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sign-up form */}
        <section className="py-20 bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-[#1A2C4E] mb-3">Apply to become a partner</h2>
              <p className="text-gray-500">Fill in the form and our team will reach out within 3 business days.</p>
            </div>

            <form
              action="https://formsubmit.co/hello@gobela.sg"
              method="POST"
              className="flex flex-col gap-5"
            >
              <input type="hidden" name="_subject" value="New GoBela Partner Application" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_next" value="https://gobela.sg/partners/thanks" />

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-[#1A2C4E] mb-1">Business Name *</label>
                  <input
                    name="business_name"
                    required
                    placeholder="e.g. Little Movers Dance Studio"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FB7A8]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1A2C4E] mb-1">Contact Name *</label>
                  <input
                    name="contact_name"
                    required
                    placeholder="Your name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FB7A8]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-[#1A2C4E] mb-1">Email *</label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="hello@yourbiz.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FB7A8]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1A2C4E] mb-1">Phone</label>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+65 9xxx xxxx"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FB7A8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A2C4E] mb-1">Partner Type *</label>
                <select
                  name="partner_type"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FB7A8] bg-white"
                >
                  <option value="">Select a category</option>
                  <option value="activity">Activity Provider (Classes, Events, Enrichment)</option>
                  <option value="restaurant">Restaurant / F&B</option>
                  <option value="supplier">Supplier / Brand / Product</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A2C4E] mb-1">Website or Instagram</label>
                <input
                  name="website"
                  placeholder="https:// or @handle"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FB7A8]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A2C4E] mb-1">Tell us about your business</label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="What do you offer? Who is your target audience? Any specific goals for the partnership?"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FB7A8] resize-none"
                />
              </div>

              <button
                type="submit"
                className="bg-[#FFB703] text-[#1A2C4E] font-bold py-4 rounded-full hover:bg-yellow-400 transition-colors text-base"
              >
                Submit Application
              </button>
              <p className="text-xs text-gray-400 text-center">
                By submitting, you agree to be contacted by the GoBela team. We do not spam.
              </p>
            </form>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 bg-[#F8F9FA]">
          <div className="max-w-3xl mx-auto px-5">
            <h2 className="text-3xl font-extrabold text-[#1A2C4E] mb-10 text-center">Frequently asked questions</h2>
            <div className="flex flex-col gap-4">
              {faqs.map((faq) => (
                <div key={faq.q} className="bg-white rounded-2xl p-6 shadow-sm">
                  <p className="font-bold text-[#1A2C4E] mb-2">{faq.q}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
