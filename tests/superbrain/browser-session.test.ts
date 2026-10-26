import {afterEach,beforeEach,it,expect,vi} from 'vitest';
const state=vi.hoisted(()=>({owner:'A' as string|null,token:'fixture-A'}));
vi.mock('@supabase/supabase-js',()=>({createClient:()=>({auth:{getSession:async()=>({data:{session:state.owner?{user:{id:state.owner},access_token:state.token}:null}})}})}));
import {call} from '../../lib/superbrain/browser';
beforeEach(()=>{state.owner='A';state.token='fixture-A';vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL','https://fixture.supabase.co');vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY','fixture-key');});
afterEach(()=>{vi.unstubAllEnvs();vi.unstubAllGlobals();});
it('rejects a late private response after an account switch',async()=>{
 vi.stubGlobal('fetch',vi.fn(async()=>{state.owner='B';return Response.json({data:{private_record:'Account A fixture'}});}));
 await expect(call('parent/health')).rejects.toThrow('Account changed');
});
it('rejects a late private response after logout',async()=>{
 vi.stubGlobal('fetch',vi.fn(async()=>{state.owner=null;return Response.json({data:{private_record:'Account A fixture'}});}));
 await expect(call('parent/export')).rejects.toThrow('Account changed');
});
it('allows token refresh for the same account and preserves authenticated no-store requests',async()=>{
 const transport=vi.fn(async(_url,options)=>{expect(options.cache).toBe('no-store');expect(options.headers.Authorization).toBe('Bearer fixture-A');state.token='refreshed-A';return Response.json({data:{ok:true}});});
 vi.stubGlobal('fetch',transport);expect(await call('parent/children')).toEqual({ok:true});expect(transport).toHaveBeenCalledOnce();
});
