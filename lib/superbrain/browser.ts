'use client';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
let singleton: SupabaseClient | undefined;
export function browserClient() {
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL; const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Connect the GoBela database to continue.');
  singleton ??= createClient(url,key,{auth:{persistSession:false,autoRefreshToken:true,detectSessionInUrl:false}});
  return singleton;
}
export async function call(path:string,method='GET',body?:unknown,signal?:AbortSignal):Promise<any> {
  const { data }=await browserClient().auth.getSession();
  if (!data.session) throw new Error('Please sign in.');
  const response=await fetch(`/api/superbrain/${path}`,{method,cache:'no-store',signal,headers:{Authorization:`Bearer ${data.session.access_token}`,...(body ? {'Content-Type':'application/json'} : {})},body:body ? JSON.stringify(body) : undefined});
  const result=await response.json();
  if (!response.ok) throw new Error(result.error || 'Request failed');
  return result.data;
}
