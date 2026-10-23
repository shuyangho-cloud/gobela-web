import { adminAccess } from '@/lib/superbrain/admin';
export async function POST(request: Request) {
 const denied=await adminAccess(request); if(denied)return denied;
 return Response.json({error:'Use a reviewed Superbrain action. Legacy direct broadcast is retired.'},{status:410});
}
