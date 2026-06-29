import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const provider = searchParams.get('provider')

  if (!provider) {
    return new Response('Missing provider param', { status: 400 })
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/create-connect-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ provider_name: provider }),
    })

    const data = await res.json()

    if (!res.ok || !data.onboarding_url) {
      console.error('stripe-onboard error:', data)
      return new Response(data.error ?? 'Failed to generate Stripe link', { status: 500 })
    }

    return NextResponse.redirect(data.onboarding_url)
  } catch (err) {
    console.error('stripe-onboard exception:', err)
    return new Response('Internal error', { status: 500 })
  }
}
