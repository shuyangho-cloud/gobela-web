import {it,expect,vi} from 'vitest';
import {reconcileAiBilling} from '../../lib/superbrain/paid-ai';
const date=(offset:number)=>new Date(Date.now()+offset).toISOString();
function fixture(){
 const created=date(-7200000);
 const row={id:'00000000-0000-4000-8000-000000000001',created_at:created,pending_receipt:'gateway:gen_late',cost_contract:{version:1 as const,model:'provider/model',provider:'provider',evidence:'Historical reviewed test quote',reviewedAt:date(-7201000),expiresAt:date(-3600000),maximumUsdMicros:10000,sgdCentsPerUsdCeiling:150,maximumInputBytes:1000,maximumOutputTokens:600}};
 const bill={id:'gen_late',model:'provider/model',providerName:'provider',totalCost:0.002,isByok:false,createdAt:created};
 const deps={pending:vi.fn(async()=>({rows:[row],pending:1,manual_review:0,has_more:false})),billing:vi.fn(async()=>bill),settle:vi.fn(async()=>{})};
 return {row,bill,deps};
}
it('settles delayed evidence using the original expired quote without a new generation',async()=>{
 const {deps,row,bill}=fixture();
 expect(await reconcileAiBilling(deps)).toEqual({settled:1,unresolved:0,overruns:0,pendingAtStart:1,manualReview:0,nextCursor:null});
 expect(deps.billing).toHaveBeenCalledWith('gen_late');
 expect(deps.settle).toHaveBeenCalledWith(row.id,2000,row.pending_receipt,bill.createdAt);
});
it('preserves holds for unavailable, mismatched, BYOK and malformed billing',async()=>{
 for(const bad of [{id:'gen_other'},{model:'other/model'},{providerName:'other'},{isByok:true},{totalCost:NaN},{totalCost:-1},{createdAt:date(60000)},{createdAt:date(-7400000)}]){
  const {deps,bill}=fixture();deps.billing.mockResolvedValue({...bill,...bad});
  expect((await reconcileAiBilling(deps)).unresolved).toBe(1);expect(deps.settle).not.toHaveBeenCalled();
 }
 const {deps}=fixture();deps.billing.mockRejectedValue(new Error('Not yet indexed'));
 expect((await reconcileAiBilling(deps)).unresolved).toBe(1);expect(deps.settle).not.toHaveBeenCalled();
});
it('records verified overruns through the database instead of hiding the actual cost',async()=>{
 const {deps,bill}=fixture();deps.billing.mockResolvedValue({...bill,totalCost:0.2});
 expect((await reconcileAiBilling(deps)).overruns).toBe(1);
 expect(deps.settle).toHaveBeenCalledWith(expect.any(String),200000,expect.any(String),bill.createdAt);
});
it('does not release unknown receipts or invent zero-cost settlements',async()=>{
 const {deps}=fixture();deps.pending.mockResolvedValue({rows:[],pending:2,manual_review:2,has_more:false});
 expect((await reconcileAiBilling(deps)).manualReview).toBe(2);expect(deps.billing).not.toHaveBeenCalled();expect(deps.settle).not.toHaveBeenCalled();
});
it('advances beyond unresolved receipts without releasing their holds',async()=>{
 const {deps,row}=fixture();
 deps.pending.mockResolvedValue({rows:[row],pending:3,manual_review:0,has_more:true});
 deps.billing.mockRejectedValue(new Error('Billing not ready'));
 expect((await reconcileAiBilling(deps)).nextCursor).toBe(row.id);expect(deps.settle).not.toHaveBeenCalled();
 await reconcileAiBilling(deps,row.id);expect(deps.pending).toHaveBeenLastCalledWith(row.id);
});
it('rejects an oversized batch and retains a hold if database settlement fails',async()=>{
 const {deps,row}=fixture();deps.pending.mockResolvedValue({rows:[row,row,row],pending:3,manual_review:0,has_more:false});
 await expect(reconcileAiBilling(deps)).rejects.toThrow();expect(deps.billing).not.toHaveBeenCalled();
 const fresh=fixture();fresh.deps.settle.mockRejectedValue(new Error('Receipt conflict'));
 expect((await reconcileAiBilling(fresh.deps)).unresolved).toBe(1);
});
