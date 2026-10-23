import {it,expect,vi,afterEach} from 'vitest';
import {publishGoBelaFacebook} from '../../lib/superbrain/meta';
afterEach(()=>vi.unstubAllEnvs());
it('verifies exact account, public audience and published receipt',async()=>{
 vi.stubEnv('SUPERBRAIN_META_ENABLED','true');vi.stubEnv('SUPERBRAIN_EXECUTION_ENABLED','true');vi.stubEnv('SUPERBRAIN_META_PAGE_ID','123');vi.stubEnv('SUPERBRAIN_META_PAGE_TOKEN','local-test-token');vi.stubEnv('SUPERBRAIN_META_API_VERSION','v25.0');
 const transport=vi.fn().mockResolvedValueOnce(Response.json({id:'123'})).mockResolvedValueOnce(Response.json({id:'123_456'})).mockResolvedValueOnce(Response.json({id:'123_456',message:'Approved copy',is_published:true,permalink_url:'https://facebook.com/123_456'}));
 const action={id:'11111111-1111-4111-8111-111111111111',status:'executing',reserved_cents:0,payload:{channel:'facebook',content:'Approved copy',audience:'facebook:123:public',campaign_id:'11111111-1111-4111-8111-111111111111'}};
 expect(await publishGoBelaFacebook(action,transport)).toEqual({receipt_id:'facebook:123_456',actual_cost_cents:0});
 await expect(publishGoBelaFacebook({...action,reserved_cents:1},transport)).rejects.toThrow('Exact organic');
 expect(transport).toHaveBeenCalledTimes(3);
});
