export function paymentAmount(amount: number, currency: string) {
  const formatter = new Intl.NumberFormat('en-SG',{style:'currency',currency:currency.toUpperCase()});
  const digits = formatter.resolvedOptions().maximumFractionDigits ?? 2;
  // Stripe retains two-decimal API representation for these legacy currencies.
  const divisor = ['isk','ugx'].includes(currency.toLowerCase()) ? 100 : 10 ** digits;
  return formatter.format(amount/divisor);
}

import type {PaymentSnapshot} from './payments';
export function paymentPriority(snapshot: PaymentSnapshot): string {
  if (!snapshot.account.paymentsEnabled || !snapshot.account.payoutsEnabled || snapshot.account.overdueRequirements>0) return 'Next: review the Stripe account requirements before accepting more bookings.';
  if (snapshot.rows.some(row=>/^(Declined|Blocked|Payment error)/.test(row.assessment))) return 'Next: review the payment errors in Stripe and match them to bookings. Do not retry charges automatically.';
  if (snapshot.rows.some(row=>row.status==='requires_capture')) return 'Next: review pending authorizations against confirmed bookings before deciding on capture.';
  if (snapshot.rows.some(row=>row.status==='requires_action')) return 'Next: check the bookings awaiting customer authentication.';
  const unfinished=snapshot.rows.filter(row=>row.status==='requires_payment_method');
  if (unfinished.length && unfinished.every(row=>row.founderLinked)) return 'Next: review the founder-linked unfinished attempts first. Their purpose is unverified; keep them separate from customer declines.';
  if (unfinished.length) return 'Next: match unfinished checkouts to booking records before deciding whether any customer follow-up is appropriate.';
  return 'Next: check booking fulfilment separately. This scan does not establish that every paid booking was fulfilled.';
}
