import {actionPayload, Problem} from './domain';
import type {Receipt} from './connector';
/** Called only after the database atomically claims the immutable approved action.
 * A timeout is uncertain, never retried. No ads, targeting, DMs or scheduling. */
export async function publishGoBelaFacebook(action:{id:string;payload:unknown;reserved_cents:number;status?:string},transport:typeof fetch=fetch):Promise<Receipt>{
 if(process.env.SUPERBRAIN_META_ENABLED!=='true' || process.env.SUPERBRAIN_EXECUTION_ENABLED!=='true')throw new Problem(503,'Meta publication disabled');
 const page=process.env.SUPERBRAIN_META_PAGE_ID || '';
 const token=process.env.SUPERBRAIN_META_PAGE_TOKEN;
 const version=process.env.SUPERBRAIN_META_API_VERSION || '';
 if(!/^\d+$/.test(page) || !token || !/^v\d+\.\d+$/.test(version))throw new Problem(503,'Verified Meta configuration required');
 const payload=actionPayload(action.payload);
 if(action.status!=='executing' || action.reserved_cents!==0 || payload.channel!=='facebook' || payload.audience!==`facebook:${page}:public`)throw new Problem(403,'Exact organic Page audience and claimed action required');
 const base=`https://graph.facebook.com/${version}`;
 async function graph(path:string,method='GET',body?:URLSearchParams){
  const response=await transport(`${base}/${path}`,{method,redirect:'error',cache:'no-store',signal:AbortSignal.timeout(12000),headers:{Authorization:`Bearer ${token}`,...(body?{'Content-Type':'application/x-www-form-urlencoded'}:{})},body});
  if(!response.ok)throw new Problem(502,'Meta outcome uncertain; reconcile before retrying');
  return response.json();
 }
 const identity=await graph('me?fields=id,name');
 if(identity.id!==page)throw new Problem(403,'Meta token belongs to another account');
 // Graph creates a published Page post here; a container/job ID is never accepted.
 const published=await graph(`${page}/feed`,'POST',new URLSearchParams({message:payload.content,published:'true'}));
 if(typeof published.id!=='string' || !published.id.startsWith(`${page}_`))throw new Problem(502,'Meta publication receipt uncertain');
 const receipt=await graph(`${published.id}?fields=id,message,is_published,permalink_url`);
 if(receipt.id!==published.id || receipt.message!==payload.content || receipt.is_published!==true || typeof receipt.permalink_url!=='string')throw new Problem(502,'Meta publication confirmation uncertain');
 return {receipt_id:`facebook:${published.id}`,actual_cost_cents:0};
}
