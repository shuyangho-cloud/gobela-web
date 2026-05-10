import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

const features = [
  {
    icon: "🍳",
    title: "Cook at Home",
    desc: "Weekly meal plans built around what's in season in Singapore. AI-powered recipes your kids will actually eat.",
    iconBgClass: "feature-icon-coral",
  },
  {
    icon: "🍜",
    title: "Dine Out",
    desc: "Curated family-friendly restaurants. Real reviews from Singapore parents. No more \"where should we eat?\"",
    iconBgClass: "feature-icon-teal",
  },
  {
    icon: "🎡",
    title: "Play & Discover",
    desc: "Classes, events, and weekend plans from Klook, Peatix, Fever and local partners — all in one place.",
    iconBgClass: "feature-icon-amber",
  },
  {
    icon: "📅",
    title: "Weekend Planning",
    desc: "Bela curates your weekend based on the kids' mood, weather, and budget. Less searching. More doing.",
    iconBgClass: "feature-icon-navy",
  },
];

const steps = [
  { num: "01", title: "Tell Bela about your family", desc: "Ages, dietary needs, energy levels today. 30 seconds." },
  { num: "02", title: "Get a personalised plan", desc: "Bela, your AI parenting co-pilot, suggests what to cook, where to go, and what to book." },
  { num: "03", title: "Enjoy your weekend", desc: "Book directly in-app, save favourites, and discover something new every week." },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col pt-16">

        {/* Hero */}
        <section className="relative bg-[#1A2C4E] text-white overflow-hidden">
          <div className="hero-glow absolute inset-0 opacity-10" />
          <div className="max-w-6xl mx-auto px-5 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <p className="text-[#FFB703] font-semibold text-sm uppercase tracking-widest mb-4">
                Launching Soon in Singapore
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
                The Operating System<br />for Modern Parenting
              </h1>
              <p className="text-white/90 text-lg leading-relaxed mb-3 max-w-md font-medium">
                No more spending 45 minutes deciding where to bring the kids on a rainy Sunday.
              </p>
              <p className="text-white/60 text-base leading-relaxed mb-8 max-w-md">
                GoBela brings AI-powered meal planning, family dining, activities, and weekend planning together — so you spend less time deciding and more time connecting.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#waitlist"
                  className="bg-[#FFB703] text-[#1A2C4E] font-bold px-6 py-3 rounded-full hover:bg-yellow-400 transition-colors"
                >
                  Get Early Access — Free
                </a>
                <Link
                  href="/partners"
                  className="border border-white/30 text-white px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
                >
                  Become a Partner →
                </Link>
              </div>
            </div>

            {/* Mascot */}
            <div className="flex justify-center">
              <Image
                src="/mascot/transparent/Happy.png"
                alt="Bela mascot"
                width={220}
                height={240}
                className="drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </section>

        {/* Launch status bar */}
        <section className="bg-[#FFB703]">
          <div className="max-w-6xl mx-auto px-5 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🇸🇬", label: "Built for Singapore families" },
              { icon: "🤖", label: "AI-powered family discovery" },
              { icon: "🆓", label: "Free to join early access" },
              { icon: "🚀", label: "Launching 2026" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className="text-[#1A2C4E]/80 text-sm font-semibold">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-[#F8F9FA] py-20">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2C4E] mb-4">
                Everything your family needs
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                One app that handles the hardest questions of family life — what to eat, where to go, and how to spend your weekend.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f) => (
                <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${f.iconBgClass}`}
                  >
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-[#1A2C4E] mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2C4E] mb-4">
                How GoBela works
              </h2>
              <p className="text-gray-500 max-w-lg mx-auto">
                Bela learns your family&apos;s preferences and curates a personalised experience every day.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((s) => (
                <div key={s.num} className="flex flex-col items-start">
                  <span className="text-5xl font-extrabold text-[#FFB703] mb-4">{s.num}</span>
                  <h3 className="font-bold text-[#1A2C4E] text-lg mb-2">{s.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Waitlist */}
        <section id="waitlist" className="py-20 bg-[#F8F9FA]">
          <div className="max-w-xl mx-auto px-5">
            <div className="text-center mb-10">
              <p className="text-[#2FB7A8] font-semibold text-sm uppercase tracking-widest mb-3">Early Access</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2C4E] mb-4">
                Be first to try GoBela
              </h2>
              <p className="text-gray-500">
                Join Singapore parents getting early access. We&apos;ll notify you the moment GoBela is ready.
              </p>
            </div>
            <form
              action="https://formsubmit.co/hello@gobela.sg"
              method="POST"
              className="bg-white rounded-3xl shadow-sm p-8 flex flex-col gap-4"
            >
              <input type="hidden" name="_subject" value="New GoBela Early Access Request" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_next" value="https://gobela.sg/?joined=1" />

              <div>
                <label className="block text-sm font-semibold text-[#1A2C4E] mb-1">Your Name *</label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Sarah"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FB7A8]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1A2C4E] mb-1">Email Address *</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FB7A8]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1A2C4E] mb-1">Child&apos;s Age Range</label>
                <select
                  name="child_age"
                  title="Child's age range"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FB7A8] bg-white"
                >
                  <option value="">Select an age range</option>
                  <option value="0-2">0–2 years (Infant / Toddler)</option>
                  <option value="3-5">3–5 years (Preschool)</option>
                  <option value="6-9">6–9 years (Primary school)</option>
                  <option value="10+">10+ years (Upper primary)</option>
                  <option value="multiple">Multiple children</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-[#FFB703] text-[#1A2C4E] font-bold py-4 rounded-full hover:bg-yellow-400 transition-colors text-base mt-2"
              >
                Join the GoBela Waitlist →
              </button>
              <p className="text-xs text-gray-400 text-center">No spam, ever. We&apos;ll only reach out when GoBela launches.</p>
            </form>
          </div>
        </section>

        {/* App Screenshots */}
        <section className="bg-white py-20">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2C4E] mb-4">
                See GoBela in action
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Everything your family needs, in one beautifully simple app.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {[
                { src: "/screenshots/home.png",    label: "Home" },
                { src: "/screenshots/meal.png",    label: "Meal Planning" },
                { src: "/screenshots/discover.png",label: "Discover" },
                { src: "/screenshots/bela.png",    label: "Chat with Bela" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-3">
                  <div className="relative w-[200px] h-[420px] rounded-[36px] overflow-hidden border-[6px] border-[#1A2C4E] shadow-2xl bg-[#1A2C4E]">
                    <Image
                      src={s.src}
                      alt={`GoBela ${s.label} screen`}
                      fill
                      sizes="200px"
                      className="object-cover object-top"
                    />
                  </div>
                  <span className="text-sm font-semibold text-[#1A2C4E]">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI moat */}
        <section className="bg-[#1A2C4E] py-20 text-white">
          <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#FFB703] font-semibold text-sm uppercase tracking-widest mb-3">
                Powered by AI
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                Meet Bela, your AI<br />parenting co-pilot
              </h2>
              <p className="text-white/60 mb-6">Helping parents make better family decisions faster.</p>
              <ul className="space-y-4 text-white/80">
                {[
                  "Learns your kids' tastes and energy patterns over time",
                  "Suggests in-season Singapore ingredients for cheaper, fresher meals",
                  "Matches activities to your child's current mood — calm, hyper, or bored",
                  "Remembers what worked and personalises every recommendation",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-[#2FB7A8] font-bold text-lg leading-none mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative">
              <Image
                src="/mascot/transparent/Recommending.png"
                alt="Bela recommending"
                width={120}
                height={120}
                className="absolute -top-12 -right-16 drop-shadow-xl"
              />
              <p className="text-[#FFB703] font-semibold text-xs uppercase tracking-widest mb-4">Bela in action</p>
              {[
                { role: "parent", msg: "Endria is hyper today and it's raining 🌧️" },
                { role: "bela", msg: "Perfect — I found 3 indoor play spaces near you with slots this afternoon. Polliwogs at VivoCity has a 2pm opening. Want me to check availability?" },
                { role: "parent", msg: "Yes please!" },
                { role: "bela", msg: "Booked! I've also added a quick pasta recipe for tonight — all ingredients are things you likely already have 🍝" },
              ].map((m, i) => (
                <div key={i} className={`mb-3 flex ${m.role === "parent" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                    m.role === "parent"
                      ? "bg-[#FFB703] text-[#1A2C4E] font-medium"
                      : "bg-white/10 text-white"
                  }`}>
                    {m.msg}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Founder Story */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-5 text-center">
            <p className="text-[#2FB7A8] font-semibold text-sm uppercase tracking-widest mb-3">Why We Built GoBela</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2C4E] mb-10">
              Built from real parenting frustrations in Singapore
            </h2>
            <div className="bg-[#F8F9FA] rounded-3xl p-8 text-left">
              <p className="text-gray-600 leading-relaxed text-lg mb-5 italic">
                &ldquo;Every weekend, my wife and I would spend 45 minutes deciding what to do with the kids — then give up and go to the same mall again.&rdquo;
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                GoBela was born from that exhaustion. We didn&apos;t want another app that shows you a list of activities. We wanted something that actually understands your child&apos;s mood today, what&apos;s in your fridge, and your budget — and gives you one clear answer.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We&apos;re building Singapore&apos;s family decision engine. Because your weekends deserve more than a Google search.
              </p>
              <div className="mt-6 pt-6 border-t border-gray-200 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1A2C4E] flex items-center justify-center text-white font-bold text-sm">S</div>
                <div>
                  <p className="font-bold text-[#1A2C4E]">Shuyang</p>
                  <p className="text-sm text-gray-400">Founder, GoBela · Singapore</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partner CTA */}
        <section className="py-20 bg-[#F8F9FA]">
          <div className="max-w-3xl mx-auto px-5 text-center">
            <div className="text-4xl mb-4">🤝</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2C4E] mb-4">
              Connect with Singapore families<br />at the moment of decision
            </h2>
            <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
              GoBela connects activity providers, restaurants, and enrichment centres directly with parents who are actively searching for you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/partners"
                className="bg-[#1A2C4E] text-white font-bold px-8 py-3 rounded-full hover:bg-[#243d6b] transition-colors"
              >
                Become a Partner
              </Link>
              <Link
                href="/contact"
                className="border border-[#1A2C4E] text-[#1A2C4E] font-semibold px-8 py-3 rounded-full hover:bg-[#1A2C4E]/5 transition-colors"
              >
                Talk to us
              </Link>
            </div>
          </div>
        </section>

        {/* Waitlist CTA */}
        <section className="bg-[#FFB703] py-16">
          <div className="max-w-3xl mx-auto px-5 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2C4E] mb-4">
              Ready for less deciding,<br />more family time?
            </h2>
            <p className="text-[#1A2C4E]/70 mb-8">
              Be among the first Singapore families to get GoBela. Early access is free.
            </p>
            <a
              href="#waitlist"
              className="inline-block bg-[#1A2C4E] text-white font-bold px-8 py-4 rounded-full hover:bg-[#243d6b] transition-colors text-lg"
            >
              Join the Waitlist — Free
            </a>
            <p className="text-[#1A2C4E]/50 text-sm mt-4">iOS · Android coming soon</p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
