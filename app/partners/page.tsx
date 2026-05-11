'use client'

import { useState } from 'react'

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
  green:      '#16A34A',
}

const S = {
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: C.coral, color: C.navy, border: 'none',
    padding: '11px 24px', borderRadius: 10,
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
    fontFamily: 'inherit', transition: 'opacity 0.15s', textDecoration: 'none',
  } as React.CSSProperties,
  btnSecondary: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'transparent', color: C.muted,
    border: `1px solid ${C.border}`, padding: '11px 24px',
    borderRadius: 10, fontSize: 14, fontWeight: 500,
    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
  } as React.CSSProperties,
  input: {
    width: '100%', padding: '11px 14px',
    border: `1px solid ${C.border}`, borderRadius: 10,
    fontSize: 14, fontFamily: 'inherit',
    background: C.white, color: C.navy, outline: 'none',
    transition: 'border-color 0.15s', boxSizing: 'border-box',
  } as React.CSSProperties,
  card: {
    background: C.white, border: `1px solid ${C.border}`, borderRadius: 16,
  } as React.CSSProperties,
  section: { padding: '72px 24px' } as React.CSSProperties,
  container: { maxWidth: 960, margin: '0 auto' } as React.CSSProperties,
  eyebrow: {
    fontSize: 11, fontWeight: 600, color: C.coral,
    textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 10,
  } as React.CSSProperties,
  h2: {
    fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, color: C.navy,
    letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 14,
  } as React.CSSProperties,
  lead: { fontSize: 15, color: C.muted, lineHeight: 1.7 } as React.CSSProperties,
  label: {
    display: 'block', fontSize: 13, fontWeight: 600,
    color: C.navy, marginBottom: 6,
  } as React.CSSProperties,
}

function Nav() {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255,251,245,0.95)', backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${C.border}`, padding: '0 24px',
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', height: 60, gap: 24 }}>
        <a href="/" style={{ fontSize: 20, fontWeight: 700, color: C.navy, textDecoration: 'none', marginRight: 'auto' }}>
          Go<span style={{ color: C.coral }}>Bela</span>
        </a>
        {([['Features', '/#features'], ['How it works', '/#how-it-works'], ['About', '/about']] as [string, string][]).map(([l, h]) => (
          <a key={l} href={h} style={{ fontSize: 13, color: C.muted, textDecoration: 'none' }}>{l}</a>
        ))}
        <a href="/partners" style={{ fontSize: 13, color: C.coral, fontWeight: 600, textDecoration: 'none' }}>Partners</a>
        <a href="/#waitlist" style={{ ...S.btnPrimary, padding: '9px 18px', fontSize: 13 }}>
          Get early access
        </a>
      </div>
    </nav>
  )
}

function PartnerHero() {
  return (
    <section style={{ background: C.navy, padding: '80px 24px 64px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,176,32,0.2)', border: '1px solid rgba(255,176,32,0.4)', color: '#FFD060', borderRadius: 999, padding: '5px 16px', fontSize: 12, fontWeight: 600, marginBottom: 24 }}>
          🤝 Partner with GoBela
        </div>
        <h1 style={{ fontSize: 'clamp(30px,5vw,52px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.025em', color: '#fff', marginBottom: 18 }}>
          Reach Singapore families{' '}
          <span style={{ color: C.coral }}>at the moment of decision</span>
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.75, color: 'rgba(255,255,255,0.65)', maxWidth: 520, margin: '0 auto 36px' }}>
          GoBela puts your venue, class, or product in front of parents exactly when they&apos;re deciding where to go, what to eat, and how to spend their weekend.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#apply" style={{ ...S.btnPrimary, fontSize: 15, padding: '13px 28px' }}>
            Apply to partner — free
          </a>
          <a href="mailto:partnerships@gobela.sg" style={{ ...S.btnSecondary, fontSize: 15, padding: '13px 28px', color: 'rgba(255,255,255,0.65)', borderColor: 'rgba(255,255,255,0.2)' }}>
            Talk to us first
          </a>
        </div>

        <div style={{ display: 'flex', gap: 0, justifyContent: 'center', marginTop: 52, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 32 }}>
          {[
            { value: '847+', label: 'Families on waitlist' },
            { value: 'S$0', label: 'To get listed' },
            { value: '3–5', label: 'Days to onboard' },
          ].map(({ value, label }, i, arr) => (
            <div key={label} style={{ flex: 1, textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none', padding: '0 20px' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>{value}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const PARTNER_TYPES = [
  {
    emoji:    '🎡',
    type:     'Activity providers',
    subtitle: 'Enrichment centres, indoor playgrounds, sports academies, arts studios, and more.',
    benefits: ['Instant booking integration', 'Real-time slot management', 'Targeted reach by child age'],
    color:    C.coral,
  },
  {
    emoji:    '🍽️',
    type:     'Restaurants & F&B',
    subtitle: 'Family-friendly cafés, restaurants, and hawker stalls. Featured in Bela\'s curated dining picks.',
    benefits: ['Curated placement in the Dine tab', 'Menu and allergy tagging', 'Parent-reviewed credibility boost'],
    color:    C.navy,
  },
  {
    emoji:    '🛒',
    type:     'Suppliers & brands',
    subtitle: 'Fresh produce, pantry staples, meal kits, and family products. Partner with Cook at Home.',
    benefits: ['In-recipe product placement', 'Seasonal promotion slots', 'Direct-to-family marketing channel'],
    color:    '#16A34A',
  },
]

function PartnerTypes() {
  return (
    <section id="types" style={{ ...S.section, background: C.bg2 }}>
      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={S.eyebrow}>Who we work with</div>
          <h2 style={S.h2}>Three types of family-focused partners</h2>
          <p style={{ ...S.lead, maxWidth: 500, margin: '0 auto' }}>
            GoBela works with businesses that genuinely improve family life in Singapore.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          {PARTNER_TYPES.map(({ emoji, type, subtitle, benefits, color }) => (
            <div key={type} style={{ ...S.card, padding: 28, flex: '1 1 260px', maxWidth: 300 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16 }}>
                {emoji}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: C.navy, marginBottom: 8 }}>{type}</h3>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, marginBottom: 18 }}>{subtitle}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {benefits.map(b => (
                  <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: C.navy }}>
                    <span style={{ color, fontWeight: 700, marginTop: 1, flexShrink: 0 }}>✓</span>
                    {b}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

interface FormState {
  businessName: string
  contactName:  string
  email:        string
  phone:        string
  partnerType:  string
  website:      string
  instagram:    string
  description:  string
}

const EMPTY_FORM: FormState = {
  businessName: '',
  contactName:  '',
  email:        '',
  phone:        '',
  partnerType:  '',
  website:      '',
  instagram:    '',
  description:  '',
}

function PartnerForm() {
  const [form, setForm]           = useState<FormState>(EMPTY_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [errors, setErrors]       = useState<Record<string, string>>({})

  const update = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.businessName.trim()) e.businessName = 'Business name is required'
    if (!form.contactName.trim())  e.contactName  = 'Contact name is required'
    if (!form.email.trim())        e.email        = 'Email is required'
    if (!form.partnerType)         e.partnerType  = 'Please select a partner type'
    if (!form.website.trim() && !form.instagram.trim()) {
      e.online = 'Please provide either a website or Instagram handle (or both)'
    }
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    setLoading(true)
    try {
      await fetch('/api/partner-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  const fieldStyle = (field: string): React.CSSProperties => ({
    ...S.input,
    borderColor: errors[field] ? '#EF4444' : C.border,
  })

  const Label = ({ children, optional }: { children: React.ReactNode; optional?: boolean }) => (
    <label style={S.label}>
      {children}{' '}
      {optional && <span style={{ fontSize: 12, fontWeight: 400, color: C.muted }}>(optional)</span>}
    </label>
  )

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? <p style={{ fontSize: 12, color: '#EF4444', margin: '5px 0 0' }}>{errors[field]}</p> : null

  return (
    <section id="apply" style={{ ...S.section, background: C.white }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={S.eyebrow}>Apply to become a partner</div>
          <h2 style={S.h2}>Let&apos;s work together</h2>
          <p style={{ ...S.lead, maxWidth: 480, margin: '0 auto' }}>
            Fill in the form and our team will reach out within 3 business days.
          </p>
        </div>

        {submitted ? (
          <div style={{ ...S.card, padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>🎉</div>
            <h3 style={{ fontSize: 24, fontWeight: 700, color: C.navy, marginBottom: 10 }}>
              Application received!
            </h3>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.65, maxWidth: 380, margin: '0 auto 24px' }}>
              Thanks for applying, <strong>{form.contactName || 'there'}</strong>. Our team will review your application and get back to you within 3 business days.
            </p>
            <a href="mailto:partnerships@gobela.sg" style={{ ...S.btnSecondary, margin: '0 auto' }}>
              partnerships@gobela.sg
            </a>
          </div>
        ) : (
          <div style={{ ...S.card, padding: 36 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 20 }}>

              <div>
                <Label>Business name</Label>
                <input style={fieldStyle('businessName')} placeholder="Little Stars Enrichment Centre" value={form.businessName} onChange={update('businessName')} />
                <FieldError field="businessName" />
              </div>

              <div>
                <Label>Contact name</Label>
                <input style={fieldStyle('contactName')} placeholder="Sarah Tan" value={form.contactName} onChange={update('contactName')} />
                <FieldError field="contactName" />
              </div>

              <div>
                <Label>Email</Label>
                <input style={fieldStyle('email')} type="email" placeholder="hello@yourbusiness.com" value={form.email} onChange={update('email')} />
                <FieldError field="email" />
              </div>

              <div>
                <Label optional>Phone</Label>
                <input style={S.input} type="tel" placeholder="+65 9123 4567" value={form.phone} onChange={update('phone')} />
              </div>

            </div>

            <div style={{ marginBottom: 20 }}>
              <Label>Partner type</Label>
              <select style={fieldStyle('partnerType')} value={form.partnerType} onChange={update('partnerType')}>
                <option value="">Select a category</option>
                <option value="activity">Activity provider (classes, events, enrichment)</option>
                <option value="fnb">Restaurant / F&amp;B</option>
                <option value="supplier">Supplier / brand / product</option>
                <option value="other">Other</option>
              </select>
              <FieldError field="partnerType" />
            </div>

            <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 4 }}>
                Online presence
              </p>
              <p style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>
                Share either or both — whatever applies to your business.
                {errors.online && <span style={{ color: '#EF4444', marginLeft: 8 }}>{errors.online}</span>}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>

                <div>
                  <Label optional>Website</Label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                      fontSize: 13, color: C.muted, pointerEvents: 'none', userSelect: 'none',
                    }}>
                      https://
                    </span>
                    <input
                      style={{ ...S.input, paddingLeft: 72, borderColor: errors.online ? '#EF4444' : C.border }}
                      placeholder="yourbusiness.com"
                      value={form.website}
                      onChange={update('website')}
                      type="url"
                      autoComplete="url"
                    />
                  </div>
                </div>

                <div>
                  <Label optional>Instagram handle</Label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                      fontSize: 14, color: C.muted, pointerEvents: 'none', userSelect: 'none',
                      fontWeight: 500,
                    }}>
                      @
                    </span>
                    <input
                      style={{ ...S.input, paddingLeft: 28, borderColor: errors.online ? '#EF4444' : C.border }}
                      placeholder="yourbusiness"
                      value={form.instagram}
                      onChange={e => setForm(f => ({ ...f, instagram: e.target.value.replace(/^@/, '') }))}
                      autoComplete="off"
                    />
                  </div>
                </div>

              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Label optional>Tell us about your business</Label>
              <textarea
                style={{ ...S.input, minHeight: 100, resize: 'vertical', lineHeight: 1.6 }}
                placeholder="What do you offer, who do you serve, and why would GoBela families love you?"
                value={form.description}
                onChange={update('description')}
              />
            </div>

            <button
              style={{ ...S.btnPrimary, width: '100%', justifyContent: 'center', fontSize: 15, padding: '14px', opacity: loading ? 0.7 : 1 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Submitting…' : 'Submit application →'}
            </button>
            <p style={{ textAlign: 'center', fontSize: 12, color: C.muted, marginTop: 12 }}>
              By submitting, you agree to be contacted by the GoBela team. We do not spam.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

const FAQS = [
  {
    q: 'How much does it cost to partner with GoBela?',
    a: 'We offer a free listing tier for all partners. Premium placement, booking integrations, and promotional slots are available as paid add-ons. Contact us for current pricing.',
  },
  {
    q: 'How quickly can I get listed?',
    a: 'Once you submit the form, our team reviews and onboards within 3–5 business days. Premium partners get a dedicated onboarding session.',
  },
  {
    q: 'Can I manage my own listings?',
    a: 'Yes. The GoBela Partner Portal (coming soon) lets you update listings, manage booking slots, view analytics, and respond to enquiries in real time.',
  },
  {
    q: 'What booking platforms does GoBela support?',
    a: 'We currently integrate with Klook, Peatix, and Fever, as well as direct booking links. Our zero-commission direct partner integration is in beta.',
  },
  {
    q: 'Is GoBela only for Singapore?',
    a: 'For now, yes — we are hyper-focused on Singapore families. Regional expansion is planned for 2027.',
  },
]

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="faq" style={{ ...S.section, background: C.bg2 }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={S.eyebrow}>FAQ</div>
          <h2 style={S.h2}>Frequently asked questions</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FAQS.map(({ q, a }, i) => (
            <div key={i} style={{ ...S.card, overflow: 'hidden' }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', padding: '18px 20px', background: 'none', border: 'none',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  gap: 12, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{q}</span>
                <span style={{ fontSize: 18, color: C.coral, flexShrink: 0, transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
              </button>
              {open === i && (
                <div style={{ padding: '0 20px 18px' }}>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, margin: 0 }}>{a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const cols: { heading: string; links: [string, string][] }[] = [
    { heading: 'App',      links: [['Features', '/#features'], ['How it works', '/#how-it-works'], ['Early access', '/#waitlist']] },
    { heading: 'Partners', links: [['Become a partner', '/partners'], ['Partner types', '/partners#types'], ['FAQ', '/partners#faq']] },
    {
      heading: 'Company',
      links: [
        ['About', '/about'],
        ['Contact', 'mailto:hello@gobela.sg'],
        ['Privacy policy', '/privacy'],
        ['Terms of service', '/support'],
        ['Child safety policy', '/child-safety'],
      ],
    },
  ]
  return (
    <footer style={{ background: '#060F18', padding: '48px 24px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, marginBottom: 40 }}>
          <div style={{ flex: '1 1 200px' }}>
            <a href="/" style={{ fontSize: 20, fontWeight: 700, color: '#fff', textDecoration: 'none' }}>
              Go<span style={{ color: C.coral }}>Bela</span>
            </a>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: 200, marginTop: 10 }}>
              The operating system for modern parenting. Singapore · 2026.
            </p>
          </div>
          {cols.map(({ heading, links }) => (
            <div key={heading} style={{ flex: '0 1 140px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>
                {heading}
              </div>
              {links.map(([label, href]) => (
                <div key={label} style={{ marginBottom: 8 }}>
                  <a href={href} style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>{label}</a>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>© 2026 GoBela Pte Ltd. All rights reserved.</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Made with ❤️ for Singapore families 🇸🇬</div>
        </div>
      </div>
    </footer>
  )
}

export default function PartnersPage() {
  return (
    <main style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", minHeight: '100vh', background: C.cream, color: C.navy }}>
      <Nav />
      <PartnerHero />
      <PartnerTypes />
      <PartnerForm />
      <FAQ />
      <Footer />
    </main>
  )
}
