import { publishGoBelaFacebook } from './meta';
import { reviewReceipt } from './test-adapter';
import { Problem } from './domain';
export interface Receipt { receipt_id: string; actual_cost_cents: number }
// A trusted adapter must enforce Idempotency-Key and provide reconciliation by key.
// No user-supplied URL, redirect, HTML execution or arbitrary tool calls are accepted.
export async function dispatch(action: { id: string; payload: unknown; reserved_cents: number; status?: string }): Promise<Receipt> {
  if (process.env.SUPERBRAIN_ADAPTER_MODE === 'test' && process.env.SUPERBRAIN_EXECUTION_ENABLED === 'true') {
    return reviewReceipt({action_id:action.id,payload:action.payload,maximum_cost_cents:action.reserved_cents},action.id);
  }
  if(process.env.SUPERBRAIN_ADAPTER_MODE==='meta')return publishGoBelaFacebook(action);
  const endpoint = process.env.SUPERBRAIN_DISPATCH_URL;
  const secret = process.env.SUPERBRAIN_DISPATCH_SECRET;
  if (process.env.SUPERBRAIN_EXECUTION_ENABLED !== 'true' || !endpoint || !secret) throw new Problem(503, 'Execution disabled');
  const url = new URL(endpoint);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Problem(503, 'Invalid connector configuration');
  const response = await fetch(url, {
    method: 'POST', redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(15000),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}`, 'Idempotency-Key': action.id },
    body: JSON.stringify({ action_id: action.id, payload: action.payload, maximum_cost_cents: action.reserved_cents }),
  });
  if (!response.ok) throw new Problem(502, 'Delivery outcome uncertain; reconcile before retrying');
  const receipt = await response.json() as Receipt;
  if (typeof receipt.receipt_id !== 'string' || !receipt.receipt_id || receipt.receipt_id.length > 500 || !Number.isSafeInteger(receipt.actual_cost_cents) || receipt.actual_cost_cents < 0) throw new Problem(502, 'Delivery outcome uncertain; invalid receipt');
  return receipt;
}
