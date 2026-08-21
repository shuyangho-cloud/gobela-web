import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

// Wraps Supabase's own /auth/v1/verify endpoint under our own domain, so
// links we send to partners show gobela.sg instead of the raw
// <project-ref>.supabase.co address (looks untrustworthy / phishing-like).
// Also hardcodes the correct redirect_to ourselves rather than trusting
// Supabase's admin generate_link response, which has been observed to
// silently truncate a redirect_to path back to the bare site root.
export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  const type = searchParams.get('type')

  if (!token || !type) {
    return new Response('Missing token or type', { status: 400 })
  }

  const target = new URL(`${SUPABASE_URL}/auth/v1/verify`)
  target.searchParams.set('token', token)
  target.searchParams.set('type', type)
  target.searchParams.set('redirect_to', 'https://gobela.sg/reset-password')

  return NextResponse.redirect(target.toString())
}
