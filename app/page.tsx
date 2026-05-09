import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

const features = [
  {
    icon: "🍳",
    title: "Cook at Home",
    desc: "Weekly meal plans built around what's in season in Singapore. AI-powered recipes your kids will actually eat.",
    color: "#FF8C66",
  },
  {
    icon: "🍜",
    title: "Dine Out",
    desc: "Curated family-friendly restaurants. Real reviews from Singapore parents. No more \"where should we eat?\"",
    color: "#2FB7A8",
  },
  {
    icon: "🎡",
    title: "Play & Discover",
    desc: "Classes, events, and weekend plans from Klook, Peatix, Fever and local partners — all in one place.",
    color: "#FFB703",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Community",
    desc: "Share milestones, swap tips, and find your parenting tribe. Because raising kids is a team sport.",
    color: "#1A2C4E",
  },
];

const steps = [
  { num: "01", title: "Tell Bela about your family", desc: "Ages, dietary needs, energy levels today. 30 seconds." },
  { num: "02", title: "Get a personalised plan", desc: "Bela, your AI parenting co-pilot, suggests what to cook, where to go, and what to book." },
  { num: "03", title: "Enjoy your weekend", desc: "Book directly in-app, save favourites, and discover something new every week." },
];

const stats = [
  { val: "500+", label: "Partner Venues" },
  { val: "1,200+", label: "Recipes" },
  { val: "10,000+", label: "Families" },
  { val: "4.9★", label: "App Rating" },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col pt-16">

        {/* Hero */}
        <section className="relative bg-[#1A2C4E] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #FFB703 0%, transparent 60%)" }} />
          <div className="max-w-6xl mx-auto px-5 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <p className="text-[#FFB703] font-semibold text-sm uppercase tracking-widest mb-4">
                Singapore&apos;s #1 Family App
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
                The Operating System<br />for Modern Parenting
              </h1>
              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-md">
                Cook smarter. Dine better. Play more. GoBela brings AI-powered meal planning,
                family dining, activities, and community together — so you can spend less time
                deciding and more time connecting.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  id="download"
                  href="https://apps.apple.com"
                  className="bg-[#FFB703] text-[#1A2C4E] font-bold px-6 py-3 rounded-full hover:bg-yellow-400 transition-colors"
                >
                  Download on App Store
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

        {/* Stats bar */}
        <section className="bg-[#FFB703]">
          <div className="max-w-6xl mx-auto px-5 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-[#1A2C4E] text-2xl font-extrabold">{s.val}</p>
                <p className="text-[#1A2C4E]/70 text-sm font-medium">{s.label}</p>
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
                One app that handles the hardest questions of family life — what to eat, where to go, and how to grow.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f) => (
                <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                    style={{ background: f.color + "20" }}
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

        {/* App Screenshots */}
        <section className="bg-[#F8F9FA] py-20">
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
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
                Meet Bela, your AI<br />parenting co-pilot
              </h2>
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

        {/* Partner CTA */}
        <section className="py-20 bg-[#F8F9FA]">
          <div className="max-w-3xl mx-auto px-5 text-center">
            <div className="text-4xl mb-4">🤝</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2C4E] mb-4">
              Reach 10,000+ Singapore families
            </h2>
            <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
              GoBela connects activity providers, restaurants, and enrichment centres directly with parents who are already looking for you.
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

        {/* Download CTA */}
        <section className="bg-[#FFB703] py-16">
          <div className="max-w-3xl mx-auto px-5 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2C4E] mb-4">
              Ready to simplify family life?
            </h2>
            <p className="text-[#1A2C4E]/70 mb-8">
              Join thousands of Singapore families who have made weekends effortless.
            </p>
            <a
              href="https://apps.apple.com"
              className="inline-block bg-[#1A2C4E] text-white font-bold px-8 py-4 rounded-full hover:bg-[#243d6b] transition-colors text-lg"
            >
              Download GoBela — Free
            </a>
            <p className="text-[#1A2C4E]/50 text-sm mt-4">iOS · Android coming soon</p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
