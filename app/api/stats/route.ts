import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const revalidate = 300 // cache for 5 minutes

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const { count } = await supabase
      .from('trial_bookings')
      .select('*', { count: 'exact', head: true })
      .not('status', 'in', '(cancelled,expired)')

    return NextResponse.json({ bookings: count ?? 0 })
  } catch {
    return NextResponse.json({ bookings: 0 })
  }
}
