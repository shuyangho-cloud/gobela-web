import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Problem } from './domain';
export function config(name: string) {
  const value = process.env[name];
  if (!value) throw new Problem(503, `Superbrain setup incomplete: ${name}`);
  return value;
}
export function client(token?: string) {
  return createClient(config('NEXT_PUBLIC_SUPABASE_URL'), config('NEXT_PUBLIC_SUPABASE_ANON_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  });
}
export async function authenticate(request: Request) {
  const match = /^Bearer (\S+)$/.exec(request.headers.get('authorization') || '');
  if (!match) throw new Problem(401, 'Sign in to continue');
  const db = client(match[1]);
  const { data, error } = await db.auth.getUser(match[1]);
  if (error || !data.user || data.user.is_anonymous) throw new Problem(401, 'Please sign in again');
  return { db, user: data.user };
}
export async function founder(db: SupabaseClient, userId: string) {
  const { data, error } = await db.from('gb_founders').select('user_id').eq('user_id', userId).maybeSingle();
  if (error) throw new Problem(503, 'Founder access is not configured');
  if (!data) throw new Problem(403, 'Founder access required');
}
export function checked<T>(result: { data: T; error: unknown }): NonNullable<T> {
  if (result.error) throw new Problem(409, 'The operation could not be completed. Check the record and try again.');
  if (result.data == null) throw new Problem(404, 'Record not found');
  return result.data;
}
export async function command(db: SupabaseClient, op: string, args: Record<string, unknown>) {
  const { data, error } = await db.rpc('gb_command', { op, args });
  if (error) {
    const messages = ['Paused', 'Approval expired', 'Budget exceeded', 'Invalid transition', 'Founder required', 'Action not found', 'Campaign not found', 'Invalid payload', 'Execution disabled'];
    const message = messages.find(item => error.message.includes(item));
    throw new Problem(409, message || 'Action could not be completed');
  }
  return data;
}
