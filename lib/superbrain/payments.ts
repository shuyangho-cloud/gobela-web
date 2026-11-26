import { Problem } from './domain';

export type PaymentRow = {
  id: string; amount: number; currency: string; created: string; status: string;
  assessment: string; founderLinked: boolean; partner: string | null;
};
export type PaymentSnapshot = {
  checkedAt: string; complete: boolean; scanned: number; rows: PaymentRow[];
  account: { paymentsEnabled: boolean; payoutsEnabled: boolean; overdueRequirements: number; pendingRequirements: number };
};
type StripeObject = Record<string, any>;
const statuses = new Set(['succeeded','canceled','processing','requires_capture','requires_action','requires_confirmation','requires_payment_method']);
function malformed(): never { throw new Problem(502, 'Stripe returned incomplete data. Payment coverage is unavailable.'); }
export function assessPayment(p: StripeObject, founderId: string, now: number): PaymentRow {
  if (!p || typeof p !== 'object' || (p.latest_charge != null && typeof p.latest_charge !== 'object') || !/^pi_[a-zA-Z0-9]+$/.test(p.id) || !Number.isSafeInteger(p.amount) || p.amount < 0 || !/^[a-z]{3}$/.test(p.currency) || !Number.isFinite(p.created) || p.created < 0 || !statuses.has(p.status) || p.livemode !== true) malformed();
  const created = new Date(p.created * 1000);
  if (!Number.isFinite(created.getTime())) malformed();
  const charge = p.latest_charge && typeof p.latest_charge === 'object' ? p.latest_charge : null;
  let assessment: string;
  if (p.status === 'succeeded') assessment = 'Paid — booking fulfilment not checked';
  else if (p.status === 'canceled') assessment = 'Canceled';
  else if (charge?.outcome?.type === 'blocked') assessment = 'Blocked — review in Stripe';
  else if (p.last_payment_error?.code === 'card_declined' || p.last_payment_error?.decline_code) assessment = 'Declined — review in Stripe';
  else if (p.last_payment_error) assessment = 'Payment error — review in Stripe';
  else if (p.status === 'requires_payment_method') assessment = now-created.getTime() >= 86400000 ? 'Stale — awaiting payment method (not a confirmed decline)' : 'Awaiting payment method';
  else if (p.status === 'requires_action') assessment = 'Customer authentication required';
  else if (p.status === 'requires_capture') assessment = 'Authorized — capture pending';
  else assessment = p.status === 'processing' ? 'Processing' : 'Confirmation pending';
  const partner = typeof p.metadata?.partner_name === 'string' ? p.metadata.partner_name.slice(0,120) : null;
  return { id:p.id, amount:p.amount, currency:p.currency, created:created.toISOString(), status:p.status, assessment, partner, founderLinked:p.metadata?.user_id === founderId };
}
export async function paymentSnapshot(founderId: string, fetcher: typeof fetch = fetch): Promise<PaymentSnapshot> {
  if (process.env.SUPERBRAIN_PAYMENTS_READ_ENABLED !== 'true') throw new Problem(503, 'Payment monitoring is not enabled. No Stripe data was read.');
  const key = process.env.SUPERBRAIN_STRIPE_READ_KEY;
  const expected = process.env.SUPERBRAIN_STRIPE_ACCOUNT_ID;
  if (!key?.startsWith('rk_live_') || !expected || !/^acct_[a-zA-Z0-9]+$/.test(expected)) throw new Problem(503, 'Payment monitoring needs its dedicated live read key and verified account configuration.');
  // One shared deadline bounds the entire request, including pagination.
  const signal = AbortSignal.timeout(20000);
  async function read(path: string): Promise<StripeObject> {
    try {
      const response = await fetcher(`https://api.stripe.com/v1/${path}`, {method:'GET', cache:'no-store', redirect:'error', signal, headers:{Authorization:`Bearer ${key}`, 'Stripe-Version':'2026-10-28.endive'}});
      if (!response.ok) throw new Error('Unavailable');
      const data = await response.json();
      if (!data || typeof data !== 'object') malformed();
      return data;
    } catch { throw new Problem(502, 'Stripe could not be verified. No current payment-health conclusion is available.'); }
  }
  const account = await read('account');
  if (account.id !== expected || typeof account.charges_enabled !== 'boolean' || typeof account.payouts_enabled !== 'boolean' || !Array.isArray(account.requirements?.past_due) || !Array.isArray(account.requirements?.currently_due)) malformed();
  const rows: PaymentRow[] = [];
  const seen = new Set<string>();
  let more = true, cursor = '';
  const now = Date.now();
  for (let page=0; page<2 && more; page++) {
    const query = new URLSearchParams({limit:'100', 'expand[]':'data.latest_charge'});
    if (cursor) query.set('starting_after', cursor);
    const list = await read(`payment_intents?${query}`);
    if (list.object !== 'list' || !Array.isArray(list.data) || list.data.length>100 || typeof list.has_more !== 'boolean' || (list.has_more && !list.data.length)) malformed();
    for (const p of list.data) {
      const row = assessPayment(p, founderId, now);
      if (seen.has(row.id)) malformed();
      seen.add(row.id); rows.push(row);
    }
    more = list.has_more;
    cursor = rows.at(-1)?.id ?? '';
  }
  return {checkedAt:new Date().toISOString(), complete:!more, scanned:rows.length, rows, account:{paymentsEnabled:account.charges_enabled,payoutsEnabled:account.payouts_enabled,overdueRequirements:account.requirements.past_due.length,pendingRequirements:account.requirements.currently_due.length}};
}
