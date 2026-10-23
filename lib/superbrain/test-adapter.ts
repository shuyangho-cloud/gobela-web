import { createHash } from 'node:crypto';
import { actionPayload, integer, object, Problem, uuid } from './domain';
// Deliberately cannot publish. Content-addressed receipts are stable across restarts.
export function reviewReceipt(input: unknown, idempotencyKey: string | null) {
 const body=object(input); const id=uuid(body.action_id);
 if(idempotencyKey!==id)throw new Problem(400,'Idempotency key mismatch');
 const payload=actionPayload(body.payload);
 integer(body.maximum_cost_cents,'maximum cost');
 if(payload.audience!=='gobela-development-review-only')throw new Problem(403,'Test audience required');
 const fingerprint=createHash('sha256').update(JSON.stringify(payload)).digest('hex');
 return {receipt_id:`test-only:${id}:${fingerprint}`,actual_cost_cents:0,mode:'non-sending'};
}
