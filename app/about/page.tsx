import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const values = [
  { icon: "🧠", title: "Bela-first thinking", desc: "Every feature is designed around one question: does Bela make family life simpler? If not, we don't ship it." },
  { icon: "🌱", title: "Local roots", desc: "We are built in Singapore, for Singapore. Hawker culture, school terms, monsoon seasons — Bela gets all of it." },
  { icon: "🤝", title: "Community over algorithm", desc: "Real parent reviews beat AI recommendations every time. We build tools that amplify the community, not replace it." },
  { icon: "🔒", title: "Privacy by design", desc: "Your family data is yours. We never sell it. We never share it. We use it only to make Bela better for you." },
];

const team = [
  { name: "Shuyang", role: "Founder & CEO", emoji: "👨‍💻" },
  { name: "Endria", role: "Chief Inspiration Officer", emoji: "👧" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 flex flex-col">

        {/* Hero */}
        <section className="bg-[#F8F9FA] py-20">
          <div className="max-w-3xl mx-auto px-5 text-center">
            <p className="text-[#2FB7A8] font-semibold text-sm uppercase tracking-widest mb-4">Our Story</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1A2C4E] mb-6 leading-tight">
              Built by a parent,<br />for parents
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              GoBela started with a simple frustration: every Sunday evening, the same question —
              &ldquo;What are we doing this weekend?&rdquo; — followed by 45 minutes of scrolling group chats,
              Google, and Instagram, and still ending up at the same mall.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-5 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-[#1A2C4E] mb-5">Our mission</h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                We believe the mental load of parenting is underestimated. Deciding what to cook,
                where to bring your kids, which class to enrol them in — it adds up. GoBela exists
                to take that load off.
              </p>
              <p className="text-gray-500 leading-relaxed mb-4">
                We are building the operating system for modern parenting — a single AI-powered app
                that knows your family, learns what works, and proactively plans so you don&apos;t have to.
              </p>
              <p className="text-gray-500 leading-relaxed">
                We started in Singapore because we are Singaporean parents. But the problem is
                universal — and so is our ambition.
              </p>
            </div>
            <div className="bg-[#1A2C4E] rounded-3xl p-8 text-white">
              <p className="text-[#FFB703] font-semibold text-sm uppercase tracking-widest mb-3">The GoBela promise</p>
              <ul className="space-y-4">
                {[
                  "One app instead of ten",
                  "Recommendations that actually know your kids",
                  "Zero decision fatigue on the weekend",
                  "More time connecting, less time planning",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-[#FFB703] font-bold text-lg leading-none mt-0.5">✓</span>
                    <span className="text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-[#F8F9FA]">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-extrabold text-[#1A2C4E] mb-3">What we believe in</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v) => (
                <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="text-3xl mb-4">{v.icon}</div>
                  <h3 className="font-bold text-[#1A2C4E] mb-2">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-5 text-center">
            <h2 className="text-3xl font-extrabold text-[#1A2C4E] mb-10">The team</h2>
            <div className="flex flex-wrap justify-center gap-8">
              {team.map((member) => (
                <div key={member.name} className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-[#F8F9FA] rounded-full flex items-center justify-center text-4xl mb-3 border-2 border-[#FFB703]">
                    {member.emoji}
                  </div>
                  <p className="font-bold text-[#1A2C4E]">{member.name}</p>
                  <p className="text-gray-500 text-sm">{member.role}</p>
                </div>
              ))}
            </div>
            <p className="mt-10 text-gray-400 text-sm">
              We are a small team with a big vision. If you want to help build the future of
              family tech in Southeast Asia, we&apos;d love to hear from you.
            </p>
            <a
              href="mailto:hello@gobela.sg"
              className="inline-block mt-4 text-[#2FB7A8] font-semibold hover:underline"
            >
              hello@gobela.sg
            </a>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#FFB703] py-16">
          <div className="max-w-xl mx-auto px-5 text-center">
            <h2 className="text-3xl font-extrabold text-[#1A2C4E] mb-4">Join the GoBela family</h2>
            <p className="text-[#1A2C4E]/70 mb-8">
              Download the app and experience family life — simplified.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://apps.apple.com"
                className="bg-[#1A2C4E] text-white font-bold px-8 py-3 rounded-full hover:bg-[#243d6b] transition-colors"
              >
                Download GoBela
              </a>
              <Link
                href="/partners"
                className="border border-[#1A2C4E] text-[#1A2C4E] font-semibold px-8 py-3 rounded-full hover:bg-[#1A2C4E]/5 transition-colors"
              >
                Partner with us
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
