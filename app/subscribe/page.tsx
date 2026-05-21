'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const PLANS = {
  plus: {
    name: 'GoBela Plus',
    price: 'S$6.99 / month',
    features: [
      'Unlimited Bela AI chat',
      'Priority class bookings',
      'Exclusive member deals',
      'Early access to new features',
    ],
    stripeUrl: 'https://buy.stripe.com/7sY8wP7YNdnU3mJ5lA2VG00',
    color: '#0D9488',
    badge: '⭐',
  },
  family: {
    name: 'GoBela Family',
    price: 'S$12.99 / month',
    features: [
      'Everything in Plus',
      'Up to 4 child profiles',
      'Family itinerary planner',
      'Exclusive family events',
    ],
    stripeUrl: 'https://buy.stripe.com/dRm8wPenb83A3mJ8xM2VG01',
    color: '#F59E0B',
    badge: '👨‍👩‍👧',
  },
}

const S: Record<string, React.CSSProperties> = {
  page:    { minHeight: '100vh', background: '#F9F6F1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' },
  card:    { background: '#fff', borderRadius: 24, padding: '36px 28px', maxWidth: 420, width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' },
  badge:   { fontSize: 48, textAlign: 'center', marginBottom: 16 },
  title:   { fontSize: 26, fontWeight: 800, color: '#0D2137', letterSpacing: '-0.02em', textAlign: 'center', marginBottom: 4 },
  price:   { fontSize: 15, color: '#64748B', textAlign: 'center', marginBottom: 28 },
  list:    { listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 12 },
  item:    { display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#0D2137' },
  check:   { width: 20, height: 20, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, color: '#fff', fontWeight: 700 },
  btn:     { display: 'block', width: '100%', padding: '15px 0', borderRadius: 14, fontSize: 16, fontWeight: 700, color: '#fff', border: 'none', cursor: 'pointer', textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box' },
  note:    { fontSize: 12, color: '#94A3B8', textAlign: 'center', marginTop: 14 },
  logo:    { fontSize: 13, fontWeight: 700, color: '#0D2137', textAlign: 'center', marginBottom: 28, letterSpacing: '-0.02em' },
}

function SubscribePage() {
  const params = useSearchParams()
  const planKey = (params.get('plan') ?? 'plus') as keyof typeof PLANS
  const plan = PLANS[planKey] ?? PLANS.plus

  return (
    <div style={S.page}>
      <div style={S.logo}>🐾 GoBela</div>
      <div style={S.card}>
        <div style={S.badge}>{plan.badge}</div>
        <div style={S.title}>{plan.name}</div>
        <div style={S.price}>{plan.price} · Cancel anytime</div>

        <ul style={S.list}>
          {plan.features.map((f) => (
            <li key={f} style={S.item}>
              <span style={{ ...S.check, background: plan.color }}>✓</span>
              {f}
            </li>
          ))}
        </ul>

        <a href={plan.stripeUrl} style={{ ...S.btn, background: plan.color }}>
          Subscribe now →
        </a>

        <div style={S.note}>
          Secure payment via Stripe · Auto-renews monthly<br />
          Manage or cancel anytime in the GoBela app
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense>
      <SubscribePage />
    </Suspense>
  )
}
