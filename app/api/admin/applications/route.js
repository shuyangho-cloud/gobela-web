import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function auth(request) {
  return request.headers.get('x-admin-key') === process.env.ADMIN_PASSWORD
}

export async function GET(request) {
  if (!auth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  )

  const status = new URL(request.url).searchParams.get('status') || 'pending'
  const { data, error } = await supabase
    .from('partner_applications')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ applications: data })
}
