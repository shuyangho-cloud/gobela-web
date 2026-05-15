'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Navbar from '@/components/Navbar'

const C = {
  coral:      '#FFB020',
  coralLight: 'rgba(255,176,32,0.10)',
  coralBdr:   'rgba(255,176,32,0.25)',
  navy:       '#0D2137',
  gold:       '#FFB020',
  cream:      '#FFFBF5',
  bg2:        '#F8F4F0',
  border:     '#EDE5DB',
  muted:      '#64748B',
  white:      '#FFFFFF',
}

const S: Record<string, React.CSSProperties> = {
  btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: 8, background: C.coral, color: '#fff', border: 'none', padding: '11px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.15s', textDecoration: 'none' },
  btnSecondary: { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, padding: '11px 24px', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' },
  input: { width: '100%', padding: '11px 14px', border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 14, fontFamily: 'inherit', background: C.white, color: C.navy, outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box' },
  card: { background: C.white, border: `1px solid ${C.border}`, borderRadius: 16 },
  section: { padding: '72px 24px' },
  container: { maxWidth: 960, margin: '0 auto' },
  eyebrow: { fontSize: 11, fontWeight: 600, color: C.coral, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 },
  h2: { fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, color: C.navy, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 14 },
  lead: { fontSize: 15, color: C.muted, lineHeight: 1.7 },
}

function useCountdown(targetDate: string) {
  const calc = useCallback(() => {
    const diff = Math.max(0, new Date(targetDate).getTime() - Date.now())
    return { d: Math.floor(diff / 86400000), h: Math.floor(diff / 3600000) % 24, m: Math.floor(diff / 60000) % 60, s: Math.floor(diff / 1000) % 60 }
  }, [targetDate])
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 })
  useEffect(() => { setTime(calc()); const id = setInterval(() => setTime(calc()), 1000); return () => clearInterval(id) }, [calc])
  return time
}


function HeroSection({ onJoin, onTryBela }: { onJoin: () => void; onTryBela: () => void }) {
  const scenarios = [
    { icon: '🌧️', title: 'Rainy Sunday at home?', desc: 'Bela finds 5 indoor activities near you, filtered by age and budget' },
    { icon: '🍳', title: 'Nothing in the fridge?', desc: 'Instant meal plans from NTUC basics — chicken rice, mee goreng, nasi lemak' },
    { icon: '⚡', title: 'Kids full of energy?', desc: 'East Coast Park, Bedok Reservoir, Gardens by the Bay — all near MRT' },
  ]
  return (
    <section style={{ background: C.cream, padding: '80px 24px 64px' }}>
      <style>{`@keyframes gb-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.4)}}@keyframes gb-typing{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}`}</style>
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.coralLight, border: `1px solid ${C.coralBdr}`, color: C.coral, borderRadius: 999, padding: '5px 16px', fontSize: 12, fontWeight: 600, marginBottom: 24 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.coral, animation: 'gb-pulse 1.5s infinite' }} />
          🚀 Launching 2026 · <strong>847 Singapore families</strong> already in
        </div>
        <h1 style={{ fontSize: 'clamp(32px,5.5vw,58px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.025em', color: C.navy, marginBottom: 18 }}>
          Stop spending Sundays <span style={{ color: C.coral }}>deciding.</span><br />Start enjoying them.
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.75, color: C.muted, maxWidth: 520, margin: '0 auto 32px' }}>
          GoBela is Singapore&apos;s AI parenting co-pilot — meal plans, hawker discoveries, family activities, and weekend plans personalised to your kids.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
          <button style={{ ...S.btnPrimary, fontSize: 15, padding: '13px 28px' }} onClick={onJoin}>✨ Join early access — free</button>
          <button style={{ ...S.btnSecondary, fontSize: 15, padding: '13px 28px' }} onClick={onTryBela}>💬 Try Bela now</button>
        </div>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', fontSize: 13, color: C.muted }}>
          {['🇸🇬 Built for Singapore', '🔒 No spam, ever', '⭐ Free to join', '📱 iOS & Android ready'].map(t => <span key={t}>{t}</span>)}
        </div>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 52 }}>
          {scenarios.map(({ icon, title, desc }) => (
            <div key={title} style={{ ...S.card, padding: 20, maxWidth: 190, textAlign: 'left', flex: '0 1 190px' }}>
              <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatCheckItem({ color, title, desc }: { color: string; title: string; desc: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
      <svg width="18" height="18" viewBox="0 0 18 18" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true">
        <circle cx="9" cy="9" r="9" fill={color} opacity="0.15" />
        <path d="M5 9l3 3 5-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.55 }}>{desc}</div>
      </div>
    </div>
  )
}

function FeatMetrics({ metrics }: { metrics: { value: string; label: string }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, margin: '20px 0' }}>
      {metrics.map(({ value, label }) => (
        <div key={label} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.navy }}>{value}</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{label}</div>
        </div>
      ))}
    </div>
  )
}

function FeatPartnerCallout({ bg, bdr, textColor, titleColor, title, body }: { bg: string; bdr: string; textColor: string; titleColor: string; title: string; body: string }) {
  return (
    <div style={{ background: bg, border: `1px solid ${bdr}`, borderRadius: 14, padding: 18, marginTop: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: titleColor, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        {title}
      </div>
      <p style={{ fontSize: 13, color: textColor, lineHeight: 1.65, margin: '0 0 12px' }}>{body}</p>
      <a href="/partners" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: titleColor, textDecoration: 'none' }}>Apply to partner →</a>
    </div>
  )
}

function FeatPhone({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: 164, height: 326, borderRadius: 28, border: `1.5px solid ${C.border}`, background: C.white, overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 9, left: '50%', transform: 'translateX(-50%)', width: 40, height: 5, borderRadius: 3, background: C.border, zIndex: 5 }} />
      <div style={{ paddingTop: 20, height: '100%', overflow: 'hidden' }}>{children}</div>
    </div>
  )
}

function ExplorePhoneScreen() {
  const items = [
    { name: 'Piano · Yamaha, Tampines', detail: 'Age 5–12 · Trial S$25', time: 'Sat 10am', free: false },
    { name: 'Swimming · Swimwerks, Bedok', detail: 'Age 4–10 · Trial S$18', time: 'Various slots', free: false },
    { name: 'Coding · Tinkercad, Orchard', detail: 'Age 7–12 · Trial FREE', time: 'Sun 2pm', free: true },
  ]
  return (
    <div style={{ height: '100%', background: C.cream, fontSize: 11 }}>
      <div style={{ background: C.coral, padding: '9px 10px', color: C.navy }}>
        <div style={{ fontSize: 10, opacity: 0.75 }}>BelaExplore</div>
        <div style={{ fontSize: 12, fontWeight: 700 }}>200+ classes near you</div>
      </div>
      <div style={{ display: 'flex', gap: 4, padding: '6px 8px', borderBottom: `1px solid ${C.border}` }}>
        {(['All', 'Sports', 'Music', 'Arts'] as const).map((label, i) => (
          <div key={label} style={{ flexShrink: 0, borderRadius: 999, padding: '2px 7px', fontSize: 10, background: i === 0 ? C.coral : C.bg2, color: i === 0 ? C.navy : C.muted, border: i === 0 ? 'none' : `1px solid ${C.border}`, fontWeight: i === 0 ? 600 : 400 }}>{label}</div>
        ))}
      </div>
      <div style={{ padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {items.map(({ name, detail, time, free }) => (
          <div key={name} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: '6px 8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 4 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: C.navy, lineHeight: 1.3 }}>{name}</div>
                <div style={{ fontSize: 10, color: C.muted }}>{detail}</div>
                <div style={{ fontSize: 10, color: C.muted }}>{time}</div>
              </div>
              {free && <div style={{ fontSize: 9, background: '#EAF3DE', color: '#27500A', borderRadius: 4, padding: '1px 4px', fontWeight: 600, flexShrink: 0 }}>FREE</div>}
            </div>
            <div style={{ marginTop: 5, background: C.coral, color: C.navy, borderRadius: 5, padding: '3px 7px', fontSize: 10, fontWeight: 600, display: 'inline-block' }}>Book trial</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MealPhoneScreen() {
  const days = [
    { d: 'MON', m: 'Chicken Rice', s: 'Home · 25 min' },
    { d: 'TUE', m: 'Maxwell Hawker', s: 'Nearby · til 10pm' },
    { d: 'WED', m: 'Aglio Olio', s: '15 min · NTUC items' },
    { d: 'THU', m: 'Nasi Lemak 🥚', s: '45 min · Kids fave' },
    { d: 'FRI', m: 'Pizza Night 🍕', s: '20 min · Easy' },
  ]
  return (
    <div style={{ height: '100%', background: C.cream, fontSize: 11, display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: C.navy, padding: '9px 10px', color: '#fff', flexShrink: 0 }}>
        <div style={{ fontSize: 10, opacity: 0.65 }}>This week&apos;s meals</div>
        <div style={{ fontSize: 12, fontWeight: 700 }}>May 2026 · 5 planned</div>
      </div>
      <div style={{ padding: '4px 8px', flex: 1 }}>
        {days.map(({ d, m, s }, i) => (
          <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', borderBottom: i < days.length - 1 ? `1px solid ${C.border}` : 'none' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.coral, width: 26, flexShrink: 0 }}>{d}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m}</div>
              <div style={{ fontSize: 10, color: C.muted }}>{s}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '5px 8px', flexShrink: 0 }}>
        <div style={{ background: '#E1F5EE', border: '1px solid #9FE1CB', borderRadius: 8, padding: '6px 8px' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#085041' }}>🛒 NTUC shopping list</div>
          <div style={{ fontSize: 10, color: '#0F6E56' }}>14 items · Auto-generated</div>
        </div>
      </div>
      <div style={{ padding: '5px 8px 8px', flexShrink: 0 }}>
        <div style={{ background: C.coral, color: C.navy, borderRadius: 8, padding: '6px', textAlign: 'center', fontSize: 10, fontWeight: 700 }}>✨ Regenerate plan</div>
      </div>
    </div>
  )
}

function FeaturesSection() {
  const [active, setActive] = useState(0)
  const tabStyle = (i: number): React.CSSProperties => ({
    flex: 1, padding: '10px 16px', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 500,
    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
    background: i === active ? C.white : 'transparent',
    color: i === active ? C.navy : C.muted,
    boxShadow: i === active ? `0 0 0 1px ${C.border}` : 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  })
  return (
    <section id="features" style={{ ...S.section, background: C.white }}>
      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={S.eyebrow}>Our two strongest features</div>
          <h2 style={S.h2}>The reasons families (and partners) choose GoBela</h2>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, maxWidth: 500, margin: '0 auto' }}>
            These aren&apos;t just features — they&apos;re the two biggest problems Singapore parents face every week.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 4, background: C.bg2, padding: 4, borderRadius: 14, maxWidth: 560, margin: '0 auto 40px' }}>
          <button style={tabStyle(0)} onClick={() => setActive(0)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
            BelaExplore
          </button>
          <button style={tabStyle(1)} onClick={() => setActive(1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Family meal planning
          </button>
        </div>

        {active === 0 && (
          <div id="belaexplore" style={{ display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 340px', minWidth: 0 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FAEEDA', border: '1px solid #FAC775', color: '#854F0B', borderRadius: 999, padding: '4px 14px', fontSize: 11, fontWeight: 600, marginBottom: 16 }}>
                ⚡ BelaExplore · Strongest hook for activity partners
              </div>
              <h3 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, color: C.navy, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 12 }}>
                Try any class.<br />Cancel anytime.
              </h3>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
                One subscription unlocks trial sessions at 200+ enrichment centres, sports academies, arts studios, and coding schools across Singapore — with zero full-term commitment required.
              </p>
              <FeatCheckItem color="#1D9E75" title="1-session trials before committing to a term" desc="No more guessing if your child will enjoy piano, football, or coding — try it first" />
              <FeatCheckItem color="#1D9E75" title="Filtered by age, area, and category" desc="Enrichment, sports, music, arts, dance, coding — all near your MRT station" />
              <FeatCheckItem color="#1D9E75" title="One-tap booking via Klook, Peatix, Fever, or direct" desc="No phone calls, no deposits — instant slot confirmation in the app" />
              <FeatCheckItem color="#1D9E75" title="Bela recommends classes personalised to each child" desc="Age, past trials, interests, and schedule all factor into what Bela suggests" />
              <FeatMetrics metrics={[{ value: '200+', label: 'Classes listed' }, { value: '12', label: 'Categories' }, { value: 'S$0', label: 'To get listed' }]} />
              <FeatPartnerCallout bg="#FAEEDA" bdr="#FAC775" textColor="#633806" titleColor="#412402" title="For activity providers" body="Get in front of trial-ready Singapore families before they commit to a competitor. Zero commission on first-session bookings. Free listing tier, 3–5 day onboarding, dedicated partner portal launching 2026." />
            </div>
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ background: C.bg2, borderRadius: 20, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <FeatPhone><ExplorePhoneScreen /></FeatPhone>
                <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>BelaExplore in the app</div>
              </div>
            </div>
          </div>
        )}

        {active === 1 && (
          <div id="mealplan" style={{ display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 340px', minWidth: 0 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#E1F5EE', border: '1px solid #9FE1CB', color: '#085041', borderRadius: 999, padding: '4px 14px', fontSize: 11, fontWeight: 600, marginBottom: 16 }}>
                ⚡ Strongest hook for food and supply partners
              </div>
              <h3 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, color: C.navy, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 12 }}>
                Your family&apos;s meals,<br />sorted for the week.
              </h3>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
                AI-powered weekly meal plans built around your kids&apos; tastes, dietary needs, and what&apos;s at NTUC FairPrice, Cold Storage, or the nearest hawker centre.
              </p>
              <FeatCheckItem color={C.coral} title="Weekly meal calendar with one-tap regeneration" desc="5 dinners planned in seconds — hawker night, easy home cook, or delivery" />
              <FeatCheckItem color={C.coral} title="Auto-generates your NTUC or Cold Storage shopping list" desc="Exact quantities, ticked off as you shop — no more over-buying or forgotten items" />
              <FeatCheckItem color={C.coral} title="Fussy-eater mode and full allergy filters" desc="Plans adapt to each child's preferences — never suggests what they'll refuse" />
              <FeatCheckItem color={C.coral} title="Hawker + home cook balance you control" desc="Maxwell, Old Airport Rd, Lau Pa Sat mixed with simple 15–30 min recipes" />
              <FeatMetrics metrics={[{ value: '5', label: 'Meals per week' }, { value: 'Auto', label: 'Shopping list' }, { value: '847+', label: 'Families planning' }]} />
              <FeatPartnerCallout bg="#E1F5EE" bdr="#9FE1CB" textColor="#085041" titleColor="#04342C" title="For F&B brands, hawkers, and suppliers" body="Get featured directly in weekly meal plans and auto-generated NTUC shopping lists. Placement in 847+ family kitchens from day one — hawker stalls, NTUC products, meal kits, and restaurants." />
            </div>
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ background: C.bg2, borderRadius: 20, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <FeatPhone><MealPhoneScreen /></FeatPhone>
                <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>Meal planning in the app</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

const BELA_PROMPTS = [
  { label: '🌧️ Raining, kid bored', text: "It's raining and my 5-year-old is bored at home — what can we do?" },
  { label: '🍜 Dinner near Tampines', text: 'Family dinner near Tampines tonight, kids aged 4 and 7' },
  { label: '🛒 Cook with NTUC basics', text: "What can I cook for dinner using NTUC basics? My kids are fussy eaters" },
  { label: '🌳 Free weekend, Jurong', text: 'Free weekend activities near Jurong for a 6-year-old' },
]

type Msg = { role: 'user' | 'assistant'; content: string }

function BelaChatSection() {
  const [messages, setMessages] = useState<Msg[]>([{ role: 'assistant', content: "Hi! I'm Bela 👋 Tell me about your family's day and I'll help plan something great. Try a suggestion below or type your own!" }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const histRef = useRef<Msg[]>([])

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight }, [messages, loading])

  const send = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || loading) return
    setInput(''); setLoading(true)
    const userMsg: Msg = { role: 'user', content }
    histRef.current = [...histRef.current, userMsg]
    setMessages(p => [...p, userMsg])
    try {
      const res = await fetch('/api/bela', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: histRef.current }) })
      const data = await res.json()
      const reply = data.reply || "Hmm, let me think — can you tell me a bit more?"
      const aMsg: Msg = { role: 'assistant', content: reply }
      histRef.current = [...histRef.current, aMsg]
      setMessages(p => [...p, aMsg])
    } catch {
      setMessages(p => [...p, { role: 'assistant', content: 'Oops! Something went wrong. Try again in a moment 🙏' }])
    } finally { setLoading(false) }
  }

  return (
    <section id="bela-chat" style={{ ...S.section, background: C.bg2 }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={S.eyebrow}>Try Bela live</div>
          <h2 style={S.h2}>Tell Bela about your day ✨</h2>
          <p style={S.lead}>Type any parenting scenario and see Bela plan your next move with real Singapore suggestions.</p>
        </div>
        <div style={{ ...S.card, padding: 0, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
          <div style={{ background: C.navy, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/mascot/transparent/Happy.png" alt="Bela" style={{ width: 40, height: 40, objectFit: 'contain', flexShrink: 0 }} />
            <div><div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Bela</div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Your AI parenting co-pilot</div></div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80' }} /> Online
            </div>
          </div>
          <div ref={chatRef} style={{ height: 320, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end' }}>
                {msg.role === 'assistant' && <img src="/mascot/transparent/Happy.png" alt="Bela" style={{ width: 28, height: 28, objectFit: 'contain', flexShrink: 0 }} />}
                <div style={{ padding: '10px 14px', fontSize: 14, lineHeight: 1.6, maxWidth: '78%', borderRadius: 14, borderBottomLeftRadius: msg.role === 'assistant' ? 3 : 14, borderBottomRightRadius: msg.role === 'user' ? 3 : 14, background: msg.role === 'user' ? C.coral : C.bg2, color: msg.role === 'user' ? '#fff' : C.navy, border: msg.role === 'assistant' ? `1px solid ${C.border}` : 'none' }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <img src="/mascot/transparent/Happy.png" alt="Bela" style={{ width: 28, height: 28, objectFit: 'contain', flexShrink: 0 }} />
                <div style={{ padding: '12px 16px', borderRadius: '14px 14px 14px 3px', background: C.bg2, border: `1px solid ${C.border}`, display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: C.coral, animation: `gb-typing 1s ${i*0.2}s infinite` }} />)}
                </div>
              </div>
            )}
          </div>
          <div style={{ padding: '12px 20px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {BELA_PROMPTS.map(({ label, text }) => (
              <button key={label} onClick={() => send(text)} style={{ background: C.bg2, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 999, padding: '5px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>{label}</button>
            ))}
          </div>
          <div style={{ padding: '10px 20px 18px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8 }}>
            <input style={{ ...S.input, flex: 1 }} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Tell Bela about your family's day..." disabled={loading} />
            <button style={{ ...S.btnPrimary, padding: '10px 18px', flexShrink: 0, opacity: (!input.trim() || loading) ? 0.5 : 1 }} onClick={() => send()} disabled={loading || !input.trim()}>↑</button>
          </div>
        </div>
      </div>
    </section>
  )
}

function HomeScreen() {
  return (
    <div style={{ height: '100%', background: C.cream, fontSize: 10, display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: C.coral, padding: 10, color: '#fff', flexShrink: 0 }}>
        <div style={{ fontSize: 10, opacity: 0.75 }}>Good morning, Mei ☀️</div>
        <div style={{ fontSize: 12, fontWeight: 700 }}>Saturday · Sunny · 31°C</div>
      </div>
      <div style={{ display: 'flex', gap: 5, padding: 8, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        {['🍳 Cook','🍜 Dine','🎡 Play'].map(l => <div key={l} style={{ flex: 1, background: C.white, border: `1px solid ${C.border}`, borderRadius: 7, padding: '5px 3px', textAlign: 'center', fontSize: 10, fontWeight: 600 }}>{l}</div>)}
      </div>
      <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: C.muted }}>Bela suggests today</div>
        <div style={{ background: C.coralLight, border: `1px solid ${C.coralBdr}`, borderRadius: 8, padding: '7px 8px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.coral }}>🚲 East Coast Park cycling</div>
          <div style={{ fontSize: 10, color: C.muted }}>Free · Perfect weather · 2–3 hrs</div>
        </div>
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: '7px 8px' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.navy }}>🍲 Tonight: Nasi Lemak</div>
          <div style={{ fontSize: 10, color: C.muted }}>25 min · Items at home</div>
        </div>
      </div>
    </div>
  )
}

function MealScreen() {
  const meals = [['Mon','Chicken Rice','25 min'],['Tue','Aglio Olio','15 min'],['Wed','Char Kway Teow','30 min'],['Thu','Nasi Lemak 🥚','45 min'],['Fri','Pizza Night 🍕','20 min']]
  return (
    <div style={{ height: '100%', background: C.cream }}>
      <div style={{ background: C.navy, padding: 10, color: '#fff' }}>
        <div style={{ fontSize: 11, fontWeight: 700 }}>This week&apos;s meals</div>
        <div style={{ fontSize: 10, opacity: 0.55, marginTop: 1 }}>May 2026 · 5 plans</div>
      </div>
      <div style={{ padding: '6px 8px' }}>
        {meals.map(([day,meal,time]) => (
          <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 0', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.muted, width: 22 }}>{day}</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 10, fontWeight: 600, color: C.navy }}>{meal}</div><div style={{ fontSize: 10, color: C.muted }}>{time}</div></div>
            <span style={{ color: C.muted }}>›</span>
          </div>
        ))}
        <div style={{ marginTop: 8, background: C.coral, color: '#fff', borderRadius: 8, padding: 6, textAlign: 'center', fontSize: 10, fontWeight: 700 }}>✨ Regenerate plan</div>
      </div>
    </div>
  )
}

function DiscoverScreen() {
  const places = [{ name: 'Polliwogs', detail: '★4.8 · Ages 2–8', price: '$22' }, { name: 'Messy Playtime', detail: '★4.6 · Ages 3–7', price: '$18' }, { name: 'Bedok Reservoir', detail: '★4.9 · All ages', price: 'Free' }]
  return (
    <div style={{ height: '100%', background: C.cream }}>
      <div style={{ background: C.navy, padding: 10, color: '#fff' }}>
        <div style={{ fontSize: 11, fontWeight: 700 }}>📍 Near Tampines</div>
        <div style={{ fontSize: 10, opacity: 0.55, marginTop: 1 }}>Weekend · Budget $30</div>
      </div>
      <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
        {places.map(({ name, detail, price }) => (
          <div key={name} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: '7px 8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div><div style={{ fontSize: 10, fontWeight: 600, color: C.navy }}>{name}</div><div style={{ fontSize: 10, color: C.muted }}>{detail}</div></div>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.coral }}>{price}</div>
            </div>
          </div>
        ))}
        <div style={{ fontSize: 10, color: C.coral, textAlign: 'center', fontWeight: 600, marginTop: 2 }}>+ 12 more nearby</div>
      </div>
    </div>
  )
}

function ChatScreen() {
  return (
    <div style={{ height: '100%', background: C.cream, display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: C.navy, padding: '8px 10px', color: '#fff', display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
        <div style={{ width: 22, height: 22, borderRadius: '50%', background: C.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>🤖</div>
        <div><div style={{ fontSize: 11, fontWeight: 700 }}>Bela</div><div style={{ fontSize: 10, opacity: 0.5 }}>AI co-pilot</div></div>
      </div>
      <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        {[{ s:'bela', t:"Hi! Tell me your family's day and I'll plan something great." },{ s:'user', t:'Kids hyper, raining outside' },{ s:'bela', t:"Found 3 indoor spots! Polliwogs at VivoCity has a 2pm slot — shall I check?" }].map((m,i) => (
          <div key={i} style={{ background: m.s==='user'?C.coral:C.white, border: m.s==='bela'?`1px solid ${C.border}`:'none', borderRadius:10, borderBottomLeftRadius:m.s==='bela'?2:10, borderBottomRightRadius:m.s==='user'?2:10, padding:'7px 8px', fontSize:10, color:m.s==='user'?'#fff':C.navy, alignSelf:m.s==='user'?'flex-end':'flex-start', maxWidth:'85%', lineHeight:1.45 }}>{m.t}</div>
        ))}
      </div>
      <div style={{ padding:'6px 8px', borderTop:`1px solid ${C.border}`, display:'flex', gap:4, flexShrink:0 }}>
        <div style={{ flex:1, background:C.white, border:`1px solid ${C.border}`, borderRadius:7, padding:'5px 8px', fontSize:10, color:C.muted }}>Message Bela...</div>
        <div style={{ background:C.coral, borderRadius:7, padding:'5px 8px', fontSize:10, color:'#fff', fontWeight:700 }}>↑</div>
      </div>
    </div>
  )
}

const SCREENS = [
  { label: 'Home', Component: HomeScreen },
  { label: 'Meal planning', Component: MealScreen },
  { label: 'Discover', Component: DiscoverScreen },
  { label: 'Chat with Bela', Component: ChatScreen },
]

function ScreenshotsSection() {
  const [active, setActive] = useState(0)
  useEffect(() => { const id = setInterval(() => setActive(a => (a+1)%SCREENS.length), 3500); return () => clearInterval(id) }, [])
  return (
    <section id="how-it-works" style={{ ...S.section, background: C.white }}>
      <div style={{ ...S.container, textAlign: 'center' }}>
        <div style={S.eyebrow}>The app</div>
        <h2 style={S.h2}>Everything your family needs</h2>
        <p style={{ ...S.lead, marginBottom: 48 }}>Four screens. One seamless family experience.</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 24 }}>
          {SCREENS.map(({ label, Component }, i) => {
            const on = i === active
            return (
              <div key={label} style={{ textAlign: 'center' }}>
                <div onClick={() => setActive(i)} style={{ width:148, height:290, borderRadius:26, border:`1.5px solid ${on?C.coral:C.border}`, background:C.white, overflow:'hidden', position:'relative', cursor:'pointer', transition:'all 0.25s', boxShadow:on?`0 0 0 3px ${C.coralLight}`:'none', transform:on?'translateY(-8px)':'none' }}>
                  <div style={{ position:'absolute', top:8, left:'50%', transform:'translateX(-50%)', width:36, height:4, borderRadius:2, background:C.border, zIndex:5 }} />
                  <div style={{ paddingTop:18, height:'100%', overflow:'hidden' }}><Component /></div>
                </div>
                <div style={{ marginTop:10, fontSize:13, fontWeight:500, color:on?C.coral:C.muted, transition:'color 0.25s' }}>{label}</div>
              </div>
            )
          })}
        </div>
        <div style={{ display:'flex', gap:6, justifyContent:'center' }}>
          {SCREENS.map((_,i) => <button key={i} onClick={() => setActive(i)} aria-label={`Screen ${i+1}`} style={{ width:i===active?24:8, height:8, borderRadius:4, border:'none', padding:0, background:i===active?C.coral:C.border, cursor:'pointer', transition:'all 0.25s' }} />)}
        </div>
      </div>
    </section>
  )
}

function WaitlistSection() {
  const [form, setForm] = useState({ name:'', email:'', age:'' })
  const [submitted, setSubmitted] = useState(false)
  const cd = useCountdown('2026-09-01T00:00:00+08:00')
  const CLAIMED=847, TOTAL=1000, pct=(CLAIMED/TOTAL)*100
  const pad = (n: number) => String(n).padStart(2,'0')
  const darkInput: React.CSSProperties = { ...S.input, background:'rgba(255,255,255,0.08)', borderColor:'rgba(255,255,255,0.15)', color:'#fff' }
  return (
    <section id="waitlist" style={{ ...S.section, background:C.navy, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:-80, right:-80, width:320, height:320, borderRadius:'50%', background:'rgba(255,176,32,0.08)', pointerEvents:'none' }} />
      <div style={{ maxWidth:580, margin:'0 auto', position:'relative' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(255,176,32,0.2)', border:'1px solid rgba(255,176,32,0.4)', color:'#FFD060', borderRadius:999, padding:'5px 16px', fontSize:12, fontWeight:600, marginBottom:16 }}>⚡ Early access · limited spots</div>
          <h2 style={{ ...S.h2, color:'#fff', marginBottom:12 }}>Be first. Get more. 🎉</h2>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.65)', lineHeight:1.65 }}>First {TOTAL.toLocaleString()} families get <strong style={{ color:C.gold }}>Premium free for 6 months</strong> when GoBela launches.</p>
        </div>
        <div style={{ display:'flex', gap:10, justifyContent:'center', marginBottom:28 }}>
          {([['Days',cd.d],['Hours',cd.h],['Min',cd.m],['Sec',cd.s]] as [string,number][]).map(([label,val]) => (
            <div key={label} style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, padding:'14px 10px', textAlign:'center', minWidth:68 }}>
              <div style={{ fontSize:28, fontWeight:700, color:'#fff', lineHeight:1 }}>{pad(val)}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', marginTop:4, textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom:28 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:7 }}>
            <span style={{ fontSize:13, color:'rgba(255,255,255,0.65)' }}>🔥 <strong style={{ color:'#fff' }}>{CLAIMED}</strong> of {TOTAL} spots claimed</span>
            <span style={{ fontSize:13, color:C.gold, fontWeight:600 }}>{Math.round(pct)}% full</span>
          </div>
          <div style={{ height:6, background:'rgba(255,255,255,0.12)', borderRadius:3, overflow:'hidden' }}>
            <div style={{ width:`${pct}%`, height:'100%', background:C.coral, borderRadius:3 }} />
          </div>
        </div>
        {submitted ? (
          <div style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:16, padding:36, textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🎉</div>
            <h3 style={{ fontSize:24, fontWeight:700, color:'#fff', marginBottom:10 }}>You&apos;re on the list!</h3>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.65)', lineHeight:1.65 }}>You&apos;re spot <strong style={{ color:C.gold }}>#{CLAIMED+1}</strong> on the GoBela waitlist.<br />We&apos;ll ping you the moment we launch. Better weekends incoming! 🚀</p>
          </div>
        ) : (
          <div style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:16, padding:24, display:'flex', flexDirection:'column', gap:12 }}>
            <input style={darkInput} placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name:e.target.value }))} />
            <input style={darkInput} placeholder="Email address" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email:e.target.value }))} />
            <select aria-label="Child's age range" style={darkInput} value={form.age} onChange={e => setForm(f => ({ ...f, age:e.target.value }))}>
              <option value="">Child&apos;s age range</option>
              <option>0–2 years (Infant / Toddler)</option>
              <option>3–5 years (Preschool)</option>
              <option>6–9 years (Primary school)</option>
              <option>10+ years (Upper primary)</option>
              <option>Multiple children</option>
            </select>
            <button style={{ ...S.btnPrimary, width:'100%', justifyContent:'center', fontSize:15, padding:14, opacity:(!form.name.trim()||!form.email.trim())?0.6:1 }} onClick={async () => {
              if (!form.name.trim() || !form.email.trim()) return
              try {
                await fetch('/api/waitlist', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ name:form.name, email:form.email, child_age:form.age }) })
              } catch {}
              setSubmitted(true)
            }} disabled={!form.name.trim()||!form.email.trim()}>
              🚀 Join the GoBela waitlist — free
            </button>
            <p style={{ textAlign:'center', fontSize:12, color:'rgba(255,255,255,0.4)', margin:0 }}>🔒 No spam, ever. Unsubscribe anytime.</p>
          </div>
        )}
      </div>
    </section>
  )
}

function Footer() {
  const cols = [
    { heading:'App', links:[['Features','/#features'],['How it works','/#how-it-works'],['Early access','/#waitlist']] },
    { heading:'Partners', links:[['Become a partner','/partners'],['Partner types','/partners#types'],['FAQ','/partners#faq']] },
    { heading:'Company', links:[['About','/about'],['Contact','mailto:hello@gobela.sg'],['Privacy policy','/privacy'],['Terms of service','/support'],['Child safety policy','/child-safety']] },
  ]
  return (
    <footer style={{ background:'#060F18', padding:'48px 24px 20px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth:960, margin:'0 auto' }}>
        <div style={{ display:'flex', flexWrap:'wrap', gap:32, marginBottom:40 }}>
          <div style={{ flex:'1 1 200px' }}>
            <a href="/" style={{ fontSize:20, fontWeight:700, color:'#fff', textDecoration:'none' }}>Go<span style={{ color:C.coral }}>Bela</span></a>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:1.7, maxWidth:200, marginTop:10 }}>The operating system for modern parenting. Singapore · 2026.</p>
          </div>
          {cols.map(({ heading, links }) => (
            <div key={heading} style={{ flex:'0 1 140px' }}>
              <div style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:14 }}>{heading}</div>
              {links.map(([label,href]) => <div key={label} style={{ marginBottom:8 }}><a href={href} style={{ fontSize:13, color:'rgba(255,255,255,0.5)', textDecoration:'none' }}>{label}</a></div>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:20, display:'flex', flexWrap:'wrap', gap:12, justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)' }}>© 2026 GoBela Pte Ltd. All rights reserved.</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)' }}>Made with ❤️ for Singapore families 🇸🇬</div>
        </div>
      </div>
    </footer>
  )
}

function PartnerSpotlightSection() {
  const partners = [
    {
      name: 'Penguin Swim School',
      category: '🏊 Swimming',
      tagline: 'Singapore\'s highest-rated home swim school',
      description: 'Coach comes to your condo pool. 40+ certified coaches island-wide. Gentle water confidence for babies through competitive squad.',
      ageRange: '6 months – 14 yrs',
      trial: 'Trial from S$45',
      rating: '4.9',
      reviews: '318',
      tags: ['Islandwide', 'Flexible schedule', 'Parent-in-pool option'],
    },
    {
      name: 'Fencing Masters',
      category: '🤺 Fencing',
      tagline: 'Olympic-standard fencing for kids & teens',
      description: 'Led by IOC-certified coaches with 50+ years experience. Free trial class — equipment provided. 177 Ubi Ave 4 · SSC Sport Enrichment programme.',
      ageRange: '7–18 yrs',
      trial: 'FREE trial class',
      rating: '4.8',
      reviews: '42',
      tags: ['Free trial', 'Equipment provided', 'IOC certified coaches'],
    },
  ]
  return (
    <section id="partners" style={{ ...S.section, background: C.bg2 }}>
      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={S.eyebrow}>GoBela Verified Partners</div>
          <h2 style={S.h2}>Real classes. Real coaches. Real results.</h2>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, maxWidth: 500, margin: '0 auto' }}>
            Every GoBela Verified partner is personally onboarded and vetted — not scraped from a directory.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          {partners.map((p) => (
            <div key={p.name} style={{ ...S.card, padding: 28, flex: '1 1 320px', maxWidth: 440 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 4 }}>{p.category}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, letterSpacing: '-0.02em' }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>{p.tagline}</div>
                </div>
                <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, background: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: 999, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: '#166534', whiteSpace: 'nowrap' }}>
                  ✓ GoBela Verified
                </div>
              </div>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, marginBottom: 16 }}>{p.description}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {p.tags.map(tag => (
                  <div key={tag} style={{ background: C.coralLight, border: `1px solid ${C.coralBdr}`, borderRadius: 999, padding: '3px 10px', fontSize: 12, color: '#854F0B', fontWeight: 500 }}>{tag}</div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: C.muted }}>Ages</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{p.ageRange}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: C.muted }}>Trial</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#166534' }}>{p.trial}</div>
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: C.muted }}>Rating</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>⭐ {p.rating} <span style={{ color: C.muted, fontWeight: 400 }}>({p.reviews})</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <a href="/partners" style={{ ...S.btnSecondary, fontSize: 14, padding: '11px 24px', display: 'inline-flex' }}>Are you an activity provider? Apply to partner →</a>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const waitlistRef = useRef<HTMLDivElement>(null)
  const belaRef     = useRef<HTMLDivElement>(null)
  const scrollTo    = (ref: React.RefObject<HTMLDivElement | null>) => ref.current?.scrollIntoView({ behavior:'smooth' })
  return (
    <main style={{ fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", minHeight:'100vh', background:C.cream, color:C.navy }}>
      <Navbar />
      <HeroSection onJoin={() => scrollTo(waitlistRef)} onTryBela={() => scrollTo(belaRef)} />
      <FeaturesSection />
      <PartnerSpotlightSection />
      <div ref={belaRef}><BelaChatSection /></div>
      <ScreenshotsSection />
      <div ref={waitlistRef}><WaitlistSection /></div>
      <Footer />
    </main>
  )
}
