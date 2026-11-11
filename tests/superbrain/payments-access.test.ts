import {it,expect,vi,afterEach} from 'vitest';
import {Problem} from '../../lib/superbrain/domain';
const mocks=vi.hoisted(()=>({authenticate:vi.fn(),founder:vi.fn(),read:vi.fn()}));
vi.mock('../../lib/superbrain/db',()=>({authenticate:mocks.authenticate,founder:mocks.founder,checked:vi.fn(),command:vi.fn()}));
vi.mock('../../lib/superbrain/payments',()=>({paymentSnapshot:mocks.read}));
import {handle} from '../../lib/superbrain/api';
afterEach(()=>vi.resetAllMocks());
it('denies signed-out and non-founder callers before Stripe access',async()=>{
 mocks.authenticate.mockRejectedValueOnce(new Problem(401,'Sign in'));
 expect((await handle(new Request('https://test'),['founder','payments'])).status).toBe(401);
 mocks.authenticate.mockResolvedValue({db:{},user:{id:'parent',user_metadata:{founder:true}}});mocks.founder.mockRejectedValue(new Problem(403,'Founder required'));
 expect((await handle(new Request('https://test'),['founder','payments'])).status).toBe(403);expect(mocks.read).not.toHaveBeenCalled();
});
it('allows verified founder GET only, returns no-store, and rejects mutation/extra path',async()=>{
 mocks.authenticate.mockResolvedValue({db:{},user:{id:'verified'}});mocks.founder.mockResolvedValue(undefined);mocks.read.mockResolvedValue({rows:[]});
 const response=await handle(new Request('https://test'),['founder','payments']);expect(response.status).toBe(200);expect(response.headers.get('cache-control')).toBe('no-store');expect(mocks.read).toHaveBeenCalledWith('verified');
 mocks.read.mockClear();expect((await handle(new Request('https://test',{method:'POST',body:'{}'}),['founder','payments'])).status).toBe(404);
 expect((await handle(new Request('https://test'),['founder','payments','extra'])).status).toBe(404);expect(mocks.read).not.toHaveBeenCalled();
});
