import {it,expect} from 'vitest';
import {adminAccess} from '../../lib/superbrain/admin';
it('legacy shared passwords cannot grant admin access',async()=>{
 const response=await adminAccess(new Request('https://gobela.test',{headers:{'x-admin-key':'old-shared-key'}}));
 expect(response?.status).toBe(401);
});
