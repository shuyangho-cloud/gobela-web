import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'About — GoBela',
  description: 'GoBela was built by a Singapore dad who got tired of spending Sunday mornings deciding instead of enjoying them.',
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", background: '#FFFBF5', color: '#0D2137' }}>

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section style={{ padding: 'clamp(60px,8vw,96px) 24px 0', background: '#FFFBF5' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>

            {/* Eyebrow */}
            <div style={{ fontSize: 11, fontWeight: 700, color: '#FFB020', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
              The story
            </div>

            {/* Headline */}
            <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#0D2137', marginBottom: 0, maxWidth: 680 }}>
              I didn&apos;t plan to build GoBela.
              <br />
              <span style={{ color: '#FFB020' }}>She made me.</span>
            </h1>

            {/* Two-column layout: story + photo */}
            <div style={{ display: 'flex', gap: 'clamp(32px,6vw,72px)', alignItems: 'flex-start', marginTop: 48, flexWrap: 'wrap' }}>

              {/* Left: story */}
              <div style={{ flex: '1 1 380px', minWidth: 0 }}>
                <p style={{ fontSize: 18, lineHeight: 1.8, color: '#64748B', marginBottom: 24 }}>
                  Every Sunday, same routine. Wake up, make breakfast, then start the negotiation.
                </p>
                <p style={{ fontSize: 16, lineHeight: 1.8, color: '#64748B', marginBottom: 24 }}>
                  <em>&ldquo;What are we doing today?&rdquo;</em>
                </p>
                <p style={{ fontSize: 16, lineHeight: 1.8, color: '#64748B', marginBottom: 24 }}>
                  Five apps open. Three Facebook groups checked. Two WhatsApp messages sent to other parents. Forty minutes later, we&apos;re at the same mall we always end up at.
                </p>
                <p style={{ fontSize: 16, lineHeight: 1.8, color: '#64748B', marginBottom: 24 }}>
                  I&apos;m a software engineer. I build things for a living. And I kept thinking: why hasn&apos;t someone built the thing that solves this?
                </p>
                <p style={{ fontSize: 16, lineHeight: 1.8, color: '#0D2137', fontWeight: 600, marginBottom: 0 }}>
                  So I stopped waiting.
                </p>
              </div>

              {/* Right: photo */}
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                <div style={{ borderRadius: 24, overflow: 'hidden', border: '3px solid #EDE5DB', boxShadow: '0 12px 48px rgba(13,33,55,0.12)', maxWidth: 320, width: '100%' }}>
                  <img
                    src="/about/founder.jpg"
                    alt="Shuyang and his daughter — the reason GoBela exists"
                    style={{ width: '100%', display: 'block', objectFit: 'cover', objectPosition: 'center 30%', aspectRatio: '3/4' }}
                  />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0D2137' }}>Shuyang Ho</div>
                  <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>Founder · GoBela</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── DAUGHTER SECTION ─────────────────────────────────────────── */}
        <section style={{ padding: '80px 24px', background: '#F8F4F0' }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#FFB020', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
              Chief experience officer
            </div>
            <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.15, color: '#0D2137', marginBottom: 24 }}>
              She doesn&apos;t know she&apos;s the product manager.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: '#64748B', marginBottom: 20 }}>
              My daughter has no idea she&apos;s the Chief Experience Officer of GoBela. She&apos;s 5. She has strong opinions about everything — which is exactly what good product feedback sounds like.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: '#64748B', marginBottom: 20 }}>
              Every feature in this app exists because of a real moment with her. The swimming trial she hated but stuck with. The fencing class that turned her into a fierce competitor. The Saturday mornings we finally stopped wasting on indecision.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: '#64748B' }}>
              Without her, I would never have built this. I would have kept downloading the same apps, checking the same Facebook groups, and having the same Sunday morning argument.
            </p>

            {/* Quote pull */}
            <div style={{ background: '#0D2137', borderRadius: 16, padding: '28px 32px', marginTop: 36 }}>
              <p style={{ fontSize: 18, fontWeight: 600, color: '#FFB020', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                &ldquo;Not because of her, I would not build this app.&rdquo;
              </p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 12, marginBottom: 0 }}>— Shuyang, Founder</p>
            </div>
          </div>
        </section>

        {/* ── WHAT WE'VE BUILT ─────────────────────────────────────────── */}
        <section style={{ padding: '80px 24px', background: '#FFFBF5' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#FFB020', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
                What we&apos;ve built
              </div>
              <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.15, color: '#0D2137', marginBottom: 16 }}>
                A live product. Real partners. Honest model.
              </h2>
              <p style={{ fontSize: 16, color: '#64748B', lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
                GoBela isn&apos;t a concept or a waitlist. It&apos;s a working app that Singapore families are using today.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {[
                { icon: '📱', title: 'Live on iOS & Android', desc: 'App Store and Google Play — download today, no waitlist.' },
                { icon: '🤝', title: '8 verified partners', desc: 'Personally onboarded studios — swim, fencing, dance, sports, yoga, and more.' },
                { icon: '💸', title: 'S$5 flat platform fee', desc: 'Parents pay no subscription. We earn a small fee per booking. That\'s it.' },
                { icon: '🤖', title: 'AI at the core', desc: 'Bela plans meals, recommends classes, and suggests weekends — personalised to your kids.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} style={{ background: '#fff', border: '1px solid #EDE5DB', borderRadius: 16, padding: '24px 20px' }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0D2137', marginBottom: 6 }}>{title}</div>
                  <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── VISION ───────────────────────────────────────────────────── */}
        <section style={{ padding: '80px 24px', background: '#0D2137' }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#FFB020', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
              Where this goes
            </div>
            <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.15, color: '#fff', marginBottom: 28 }}>
              Singapore is the proof.<br />Southeast Asia is the opportunity.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.65)', marginBottom: 20 }}>
              Every parent in Malaysia, Indonesia, Thailand, and Vietnam faces the same Sunday morning problem. Different hawkers. Different enrichment centres. Same decision fatigue. Same mental load.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.65)', marginBottom: 20 }}>
              We&apos;re building GoBela correctly in Singapore first — with real partners, real bookings, and real families — before expanding to a region of 60 million families who face the same problem.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: '#FFB020', fontWeight: 600 }}>
              GoBela starts here. It doesn&apos;t end here.
            </p>

            {/* Regional flags */}
            <div style={{ display: 'flex', gap: 16, marginTop: 36, flexWrap: 'wrap' }}>
              {[
                { flag: '🇸🇬', country: 'Singapore', status: 'Live now' },
                { flag: '🇲🇾', country: 'Malaysia', status: 'Coming next' },
                { flag: '🇮🇩', country: 'Indonesia', status: 'On the roadmap' },
                { flag: '🇹🇭', country: 'Thailand', status: 'On the roadmap' },
              ].map(({ flag, country, status }) => (
                <div key={country} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px', textAlign: 'center', flex: '1 1 120px' }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{flag}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{country}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{status}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ──────────────────────────────────────────────────── */}
        <section style={{ padding: '80px 24px', background: '#F8F4F0' }}>
          <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#FFB020', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
              Get in touch
            </div>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 700, letterSpacing: '-0.025em', color: '#0D2137', marginBottom: 16 }}>
              Want to partner, invest, or just say hi?
            </h2>
            <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.75, marginBottom: 32 }}>
              We&apos;re always looking for enrichment and activity partners, and we&apos;re happy to talk to investors who believe in the family tech opportunity in Southeast Asia.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
              <a href="mailto:hello@gobela.sg" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0D2137', color: '#fff', borderRadius: 12, padding: '13px 24px', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
                ✉️ hello@gobela.sg
              </a>
              <a href="/partners" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: '#64748B', border: '1.5px solid #EDE5DB', borderRadius: 12, padding: '13px 24px', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
                Become a partner →
              </a>
            </div>
            <p style={{ fontSize: 12, color: '#94A3B8' }}>GoBela Pte. Ltd. · UEN 202620732H · Singapore</p>
          </div>
        </section>

        {/* ── DOWNLOAD CTA ─────────────────────────────────────────────── */}
        <section style={{ padding: '72px 24px', background: '#FFB020' }}>
          <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 700, letterSpacing: '-0.025em', color: '#0D2137', marginBottom: 12 }}>
              Try GoBela for free
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(13,33,55,0.65)', lineHeight: 1.7, marginBottom: 28 }}>
              Available now on iOS and Android. No subscription. No credit card. Just better weekends.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://apps.apple.com/sg/app/gobela/id6767062415" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0D2137', color: '#fff', borderRadius: 12, padding: '13px 24px', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                App Store
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.gobela.app" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(13,33,55,0.12)', color: '#0D2137', border: '1.5px solid rgba(13,33,55,0.2)', borderRadius: 12, padding: '13px 24px', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3.18 23.76c.37.21.8.22 1.2.04l12.44-6.87-2.84-2.84-10.8 9.67zm-.96-20.7C2.07 3.36 2 3.67 2 4v16c0 .33.07.64.22.93l.08.08 8.97-8.97v-.21L2.3 3.06l-.08.1zM19.37 9.76l-2.55-1.41-3.18 3.18 3.18 3.18 2.58-1.42c.73-.41.73-1.11-.03-1.53zM4.38.24C3.98.06 3.55.07 3.18.28l10.8 9.71 2.84-2.84L4.38.24z"/></svg>
                Google Play
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
