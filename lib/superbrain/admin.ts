import { authenticate, founder } from './db';
import { safeError } from './domain';
export async function adminAccess(request: Request): Promise<Response | null> {
  try {
    const {db,user} = await authenticate(request);
    await founder(db,user.id);
    return null;
  } catch(error) {
    const failure=safeError(error);
    return Response.json({error:failure.message},{status:failure.status,headers:{'Cache-Control':'no-store'}});
  }
}
