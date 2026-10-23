import { handle } from '../../../../lib/superbrain/api';
export const runtime = 'nodejs';
export const maxDuration = 45;
type Context = { params: Promise<{ path: string[] }> };
async function route(request: Request, context: Context) {
  return handle(request,(await context.params).path);
}
export { route as GET, route as POST, route as PATCH, route as DELETE };
