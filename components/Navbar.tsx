'use client'

const C = {
  navy:   '#0D2137',
  coral:  '#FFB020',
  muted:  '#64748B',
  cream:  '#FFFBF5',
  border: '#EDE5DB',
}

export default function Navbar() {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255,251,245,0.95)', backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${C.border}`, padding: '0 24px',
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', height: 60, gap: 24 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginRight: 'auto' }}>
          <img src="/mascot/transparent/Happy.png" alt="Bela mascot" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          <span style={{ fontSize: 20, fontWeight: 700, color: C.navy }}>Go<span style={{ color: C.coral }}>Bela</span></span>
        </a>
        {([
          ['Features',    '/#features'],
          ['How it works','/#how-it-works'],
          ['About',       '/about'],
          ['Partners',    '/partners'],
        ] as [string, string][]).map(([label, href]) => (
          <a key={label} href={href} style={{ fontSize: 13, color: C.muted, textDecoration: 'none' }}>{label}</a>
        ))}
        <a href="/#waitlist" style={{
          display: 'inline-flex', alignItems: 'center',
          background: C.coral, color: C.navy, border: 'none',
          padding: '9px 18px', borderRadius: 10,
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
          textDecoration: 'none', whiteSpace: 'nowrap',
        }}>
          Join waitlist — free
        </a>
      </div>
    </nav>
  )
}
