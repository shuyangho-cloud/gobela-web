import { it,expect } from 'vitest';
import { handle } from '../../lib/superbrain/api';
it('all API surfaces require a signed-in account before touching data',async()=>{
 for(const path of [['founder','summary'],['parent','health'],['parent','recommend'],['circle','posts']]) {
  const response=await handle(new Request('https://gobela.test/api/superbrain/'+path.join('/')),path);
  expect(response.status).toBe(401);expect(response.headers.get('cache-control')).toBe('no-store');
 }
});
it('untrusted admin headers and malformed Bearer headers cannot authenticate',async()=>{
 const attempts:Record<string,string>[]=[{'x-admin-key':'anything'},{authorization:'Bearer fake extra'},{authorization:'Basic abc'}];
 for(const headers of attempts){
  const response=await handle(new Request('https://gobela.test',{headers}),['founder','summary']);
  expect(response.status).toBe(401);
 }
});
