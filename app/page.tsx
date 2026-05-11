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
          {['🇸🇬 Built for Singapore', '🔒 No spam, ever', '⭐ Free to join', '📱 iOS & Android coming'].map(t => <span key={t}>{t}</span>)}
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

function FeaturesSection() {
  const classes = [
    { icon: '🏊', label: 'Swimming', sub: 'From $18/trial' },
    { icon: '💻', label: 'Coding', sub: 'Ages 5–12' },
    { icon: '🎨', label: 'Art & Craft', sub: 'Drop-in sessions' },
    { icon: '🎵', label: 'Music', sub: 'Piano, violin, guitar' },
    { icon: '🤸', label: 'Gymnastics', sub: 'Ages 2–10' },
    { icon: '⚽', label: 'Sports', sub: 'Football, tennis, more' },
  ]
  const meals = [
    { day: 'Mon', name: 'Hainanese Chicken Rice', time: '25 min', tag: 'Kids fave' },
    { day: 'Tue', name: 'Aglio Olio with Sausages', time: '15 min', tag: 'Quick' },
    { day: 'Wed', name: 'Mee Goreng', time: '20 min', tag: 'Hawker-style' },
    { day: 'Thu', name: 'Nasi Lemak with Egg', time: '35 min', tag: 'Weekend prep' },
    { day: 'Fri', name: 'Homemade Pizza Night 🍕', time: '20 min', tag: 'Family fun' },
  ]
  return (
    <section id="features" style={{ background: C.cream, padding: '72px 24px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={S.eyebrow}>What GoBela does</div>
          <h2 style={S.h2}>Two things Singapore parents need most</h2>
          <p style={S.lead}>Find the right class. Plan the week&apos;s meals. Done.</p>
        </div>

        {/* ClassPass for kids */}
        <div style={{ display: 'flex', gap: 48, alignItems: 'center', flexWrap: 'wrap', marginBottom: 72 }}>
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: C.coralLight, border: `1px solid ${C.coralBdr}`, color: C.coral, borderRadius: 999, padding: '4px 14px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 18 }}>
              🎟️ Trial Classes
            </div>
            <h3 style={{ fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 700, color: C.navy, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 14 }}>
              Try any class.<br />No package needed.
            </h3>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.75, marginBottom: 20 }}>
              GoBela is Singapore&apos;s ClassPass for children. Book a single trial session at enrichment centres, sports schools, and arts studios — pay per class, skip the 10-lesson commitment.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {[
                '✅ 80+ partner studios across Singapore',
                '✅ Ages 2–14 · All skill levels welcome',
                '✅ One-tap booking · Instant confirmation',
                '✅ Loved it? Continue at member rates',
              ].map(t => <div key={t} style={{ fontSize: 14, color: C.navy }}>{t}</div>)}
            </div>
            <a href="/#waitlist" style={{ ...S.btnPrimary, textDecoration: 'none', display: 'inline-flex' }}>
              Browse trial classes
            </a>
          </div>
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ ...S.card, padding: 24, boxShadow: '0 8px 40px rgba(0,0,0,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Trial classes near you</div>
                <div style={{ fontSize: 12, color: C.coral, fontWeight: 600 }}>Tampines · this week</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {classes.map(({ icon, label, sub }) => (
                  <div key={label} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: '12px 8px', textAlign: 'center', cursor: 'pointer' }}>
                    <div style={{ fontSize: 24, marginBottom: 5 }}>{icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{label}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Meal Planning */}
        <div style={{ display: 'flex', gap: 48, alignItems: 'center', flexWrap: 'wrap', flexDirection: 'row-reverse' }}>
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: C.coralLight, border: `1px solid ${C.coralBdr}`, color: C.coral, borderRadius: 999, padding: '4px 14px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 18 }}>
              🍳 Meal Planning
            </div>
            <h3 style={{ fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 700, color: C.navy, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 14 }}>
              Never ask &ldquo;what&apos;s for dinner?&rdquo; again.
            </h3>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.75, marginBottom: 20 }}>
              Tell Bela what&apos;s in your fridge and your kids&apos; favourites. She generates a full week of meals from NTUC basics — Singaporean dishes your family actually eats, with a shopping list included.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {[
                '✅ Weekly meal calendar in one tap',
                '✅ Hawker spots near you when you need a break',
                '✅ Fussy eater profiles per child',
                '✅ Auto shopping list by NTUC aisle',
              ].map(t => <div key={t} style={{ fontSize: 14, color: C.navy }}>{t}</div>)}
            </div>
            <a href="/#waitlist" style={{ ...S.btnPrimary, textDecoration: 'none', display: 'inline-flex' }}>
              Plan this week&apos;s meals
            </a>
          </div>
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ ...S.card, padding: 24, boxShadow: '0 8px 40px rgba(0,0,0,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>This week&apos;s meal plan</div>
                <div style={{ fontSize: 12, color: C.coral, fontWeight: 600 }}>Bela generated ✨</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {meals.map(({ day, name, time, tag }) => (
                  <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 12px', background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.coral, minWidth: 28 }}>{day}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{name}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{time}</div>
                    </div>
                    <div style={{ background: C.coralLight, border: `1px solid ${C.coralBdr}`, color: C.coral, borderRadius: 999, padding: '2px 8px', fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap' }}>{tag}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, background: C.coral, color: C.navy, borderRadius: 8, padding: '8px 12px', textAlign: 'center', fontSize: 12, fontWeight: 700 }}>✨ Regenerate</div>
                <div style={{ flex: 1, background: C.bg2, border: `1px solid ${C.border}`, color: C.navy, borderRadius: 8, padding: '8px 12px', textAlign: 'center', fontSize: 12, fontWeight: 600 }}>🛒 Shopping list</div>
              </div>
            </div>
          </div>
        </div>
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
            <img src="/mascot/Happy.png" alt="Bela" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'contain', background: '#fff', flexShrink: 0 }} />
            <div><div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Bela</div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Your AI parenting co-pilot</div></div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80' }} /> Online
            </div>
          </div>
          <div ref={chatRef} style={{ height: 320, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end' }}>
                {msg.role === 'assistant' && <img src="/mascot/Happy.png" alt="Bela" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'contain', background: '#fff', flexShrink: 0 }} />}
                <div style={{ padding: '10px 14px', fontSize: 14, lineHeight: 1.6, maxWidth: '78%', borderRadius: 14, borderBottomLeftRadius: msg.role === 'assistant' ? 3 : 14, borderBottomRightRadius: msg.role === 'user' ? 3 : 14, background: msg.role === 'user' ? C.coral : C.bg2, color: msg.role === 'user' ? '#fff' : C.navy, border: msg.role === 'assistant' ? `1px solid ${C.border}` : 'none' }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <img src="/mascot/Happy.png" alt="Bela" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'contain', background: '#fff', flexShrink: 0 }} />
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
            <select style={darkInput} value={form.age} onChange={e => setForm(f => ({ ...f, age:e.target.value }))}>
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

export default function HomePage() {
  const waitlistRef = useRef<HTMLDivElement>(null)
  const belaRef     = useRef<HTMLDivElement>(null)
  const scrollTo    = (ref: React.RefObject<HTMLDivElement | null>) => ref.current?.scrollIntoView({ behavior:'smooth' })
  return (
    <main style={{ fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", minHeight:'100vh', background:C.cream, color:C.navy }}>
      <Navbar />
      <HeroSection onJoin={() => scrollTo(waitlistRef)} onTryBela={() => scrollTo(belaRef)} />
      <FeaturesSection />
      <div ref={belaRef}><BelaChatSection /></div>
      <ScreenshotsSection />
      <div ref={waitlistRef}><WaitlistSection /></div>
      <Footer />
    </main>
  )
}
