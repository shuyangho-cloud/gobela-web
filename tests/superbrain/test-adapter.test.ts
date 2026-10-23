import {it,expect} from 'vitest';
import {reviewReceipt} from '../../lib/superbrain/test-adapter';
it('test adapter enforces exact review audience and returns stable non-sending receipts',()=>{
 const id='11111111-1111-4111-8111-111111111111';
 const request={action_id:id,maximum_cost_cents:0,payload:{campaign_id:id,channel:'email',content:'draft',audience:'gobela-development-review-only'}};
 expect(reviewReceipt(request,id)).toEqual(reviewReceipt(request,id));
 expect(reviewReceipt(request,id).receipt_id).toMatch(/^test-only:/);
 expect(()=>reviewReceipt(request,null)).toThrow('Idempotency');
 expect(()=>reviewReceipt({...request,payload:{...request.payload,audience:'parents'}},id)).toThrow('Test audience');
});
