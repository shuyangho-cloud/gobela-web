import {it,expect,vi,afterEach} from 'vitest';
import {Problem} from '../../lib/superbrain/domain';
const mocks=vi.hoisted(()=>({auth:vi.fn(),founder:vi.fn(),reconcile:vi.fn()}));
vi.mock('../../lib/superbrain/db',()=>({authenticate:mocks.auth,founder:mocks.founder,checked:vi.fn(),command:vi.fn()}));
vi.mock('../../lib/superbrain/paid-ai',()=>({reconcileStoredAiBilling:mocks.reconcile,budgetedAiText:vi.fn()}));
import {handle} from '../../lib/superbrain/api';
afterEach(()=>vi.resetAllMocks());
it('requires verified founder authorization before reading billing receipts',async()=>{
 mocks.auth.mockRejectedValueOnce(new Problem(401,'Sign in'));
 expect((await handle(new Request('https://fixture'),['founder','billing-reconciliation'])).status).toBe(401);
 mocks.auth.mockResolvedValue({db:{},user:{id:'parent',user_metadata:{founder:true}}});mocks.founder.mockRejectedValue(new Problem(403,'Founder required'));
 expect((await handle(new Request('https://fixture'),['founder','billing-reconciliation'])).status).toBe(403);expect(mocks.reconcile).not.toHaveBeenCalled();
});
it('accepts only founder POSTs with an optional validated cursor and sanitizes failures',async()=>{
 mocks.auth.mockResolvedValue({db:{},user:{id:'founder'}});mocks.founder.mockResolvedValue(undefined);
 const post=(body:unknown)=>new Request('https://fixture',{method:'POST',body:JSON.stringify(body)});
 expect((await handle(new Request('https://fixture'),['founder','billing-reconciliation'])).status).toBe(404);
 expect((await handle(post({receipt:'caller-supplied'}),['founder','billing-reconciliation'])).status).toBe(400);expect(mocks.reconcile).not.toHaveBeenCalled();
 mocks.reconcile.mockResolvedValue({settled:0});const response=await handle(post({}),['founder','billing-reconciliation']);expect(response.status).toBe(200);expect(response.headers.get('Cache-Control')).toBe('no-store');
 expect((await handle(post({cursor:'not-a-uuid'}),['founder','billing-reconciliation'])).status).toBe(400);
 const cursor='00000000-0000-4000-8000-000000000001';
 expect((await handle(post({cursor}),['founder','billing-reconciliation'])).status).toBe(200);expect(mocks.reconcile).toHaveBeenLastCalledWith(cursor);
 mocks.reconcile.mockRejectedValue(new Error('secret backend details'));const failed=await handle(post({}),['founder','billing-reconciliation']);expect(failed.status).toBe(503);expect(await failed.text()).not.toContain('secret backend');
});
