import {actionPayload,Problem} from './domain';
import publishingMedia from './publishing-media.json';
import type {Receipt} from './connector';
export type InstagramAction={id:string;payload:unknown;reserved_cents:number;status:string;claimed_at?:string};
export type InstagramJob={action_id:string;instagram_id:string;phase:'creating'|'processing'|'ready'|'publishing'|'verifying'|'confirmed'|'uncertain';container_id:string|null;media_id:string|null;lease:string;lease_until:string;next_check_at:string|null;checks:number;created_at:string;deferred?:boolean};
export type InstagramCheckpoint=(op:string,args:Record<string,unknown>)=>Promise<InstagramJob>;
export type InstagramProgress={pending:true;phase:string;next_check_at:string|null;message:string}|Receipt;
/** Each call performs one bounded upload/poll/publish/verify step. No timer,
 * worker, ads or automatic retry. The database commits a mutation checkpoint
 * before each external POST; interrupted writes must be reconciled. */
export async function advanceInstagramReel(action:InstagramAction,start:boolean,checkpoint:InstagramCheckpoint,signVideo:(id:string,sha:string)=>Promise<string>,transport:typeof fetch=fetch,now=Date.now()):Promise<InstagramProgress>{
 if(process.env.SUPERBRAIN_INSTAGRAM_ADAPTER_ENABLED!=='true'||process.env.SUPERBRAIN_META_ENABLED!=='true'||process.env.SUPERBRAIN_EXECUTION_ENABLED!=='true'||process.env.SUPERBRAIN_ADAPTER_MODE!=='meta')throw new Problem(503,'Instagram publication disabled');
 const page=process.env.SUPERBRAIN_META_PAGE_ID??'',instagram=process.env.SUPERBRAIN_META_INSTAGRAM_ID??'',username=process.env.SUPERBRAIN_META_INSTAGRAM_USERNAME??'',version=process.env.SUPERBRAIN_META_API_VERSION??'',token=process.env.SUPERBRAIN_META_PAGE_TOKEN;
 if(!/^\d+$/.test(page)||!/^\d+$/.test(instagram)||username!=='gobelaapp'||!/^v\d+\.\d+$/.test(version)||!token)throw new Problem(503,'Verified GoBela Instagram configuration required');
 const payload=actionPayload(action.payload),media=payload.media;
 if(!['executing','uncertain'].includes(action.status)||action.reserved_cents!==0||payload.channel!=='instagram'||payload.audience!==`instagram:${instagram}:public`||payload.content.length>2200||!media?.reuse_approved||!publishingMedia.some(item=>item.id===media.asset_id&&item.sha256===media.sha256))throw new Problem(403,'Exact claimed organic action and approved media reuse required');
 const base=`https://graph.facebook.com/${version}`;
 async function graph(path:string,method='GET',body?:URLSearchParams){
  const response=await transport(`${base}/${path}`,{method,redirect:'error',cache:'no-store',signal:AbortSignal.timeout(8000),headers:{Authorization:`Bearer ${token}`,...(body?{'Content-Type':'application/x-www-form-urlencoded'}:{})},body});
  if(!response.ok)throw new Problem(502,'Instagram request failed; do not repeat a publication attempt');
  return response.json();
 }
 // A Page token must identify the configured Page and its exact linked IG user.
 const identity=await graph('me?fields=id,instagram_business_account{id,username}');
 if(identity.id!==page||identity.instagram_business_account?.id!==instagram||identity.instagram_business_account?.username!==username)throw new Problem(403,'Meta token or linked Instagram account differs from GoBela');
 const pending=(job:InstagramJob,message:string):InstagramProgress=>({pending:true,phase:job.phase,next_check_at:job.next_check_at,message});
 const uncertain=async()=>{await checkpoint('uncertain',{id:action.id}).catch(()=>undefined);};
 let job:InstagramJob;
 if(start){
  if(action.status!=='executing')throw new Problem(409,'New Reel upload requires an executing approved action');
  // Validate bytes and obtain the capability before the one-shot external lease.
  const video=await signVideo(media.asset_id,media.sha256);
  job=await checkpoint('start',{id:action.id,instagram_id:instagram});
  try{
   const created=await graph(`${instagram}/media`,'POST',new URLSearchParams({media_type:'REELS',video_url:video,caption:payload.content,share_to_feed:'false'}));
   if(typeof created.id!=='string'||!/^\d+$/.test(created.id))throw new Problem(502,'Instagram container checkpoint uncertain');
   job=await checkpoint('created',{id:action.id,lease:job.lease,container_id:created.id});
   return pending(job,'Video submitted for processing. A container is not a published post. Check again after the indicated time.');
  }catch{await uncertain();throw new Problem(502,'Upload outcome uncertain. Inspect the saved action; do not create another container automatically.');}
 }
 job=await checkpoint('read',{id:action.id});
 if(job.instagram_id!==instagram)throw new Problem(403,'Saved Instagram account differs from configured account');
 if(job.phase==='confirmed'){
  if(!job.media_id)throw new Problem(409,'Published media checkpoint missing');
  return {receipt_id:`instagram:${job.media_id}`,actual_cost_cents:0};
 }
 if(job.phase==='creating'||job.phase==='publishing'){
  if(Date.parse(job.lease_until)<=now){await uncertain();throw new Problem(409,'An external request was interrupted. Reconcile before any further publication.');}
  return pending(job,'An external request is in progress. This call will not repeat it.');
 }
 if(job.phase==='processing'){
  if(action.status!=='executing')throw new Problem(409,'Uncertain action requires reconciliation; publication is held');
  job=await checkpoint('poll',{id:action.id});
  if(job.deferred)return pending(job,'Instagram is processing the video; wait until the next check time.');
  const status=await graph(`${job.container_id}?fields=id,status_code`);
  if(status.id!==job.container_id||!['IN_PROGRESS','FINISHED'].includes(status.status_code)){
   await uncertain();throw new Problem(409,'Container state requires reconciliation; no new container or publication was attempted');
  }
  job=await checkpoint('polled',{id:action.id,lease:job.lease,status_code:status.status_code});
  return pending(job,job.phase==='ready'?'Video is ready. Continue the approved publication when you are ready.':'Video is still processing. No publication has occurred.');
 }
 if(job.phase==='ready'){
  if(action.status!=='executing')throw new Problem(409,'Uncertain action requires reconciliation; publication is held');
  job=await checkpoint('publish',{id:action.id});
  try{
   const published=await graph(`${instagram}/media_publish`,'POST',new URLSearchParams({creation_id:job.container_id!}));
   if(typeof published.id!=='string'||!/^\d+$/.test(published.id)||published.id===job.container_id)throw new Problem(502,'Actual Instagram media receipt missing');
   job=await checkpoint('published',{id:action.id,lease:job.lease,media_id:published.id});
   return pending(job,'Publication returned a media ID. Continue to verify the actual post before recording success.');
  }catch{await uncertain();throw new Problem(502,'Publication outcome uncertain. Do not publish again; reconcile the existing attempt.');}
 }
 if((job.phase==='verifying'||job.phase==='uncertain')&&job.media_id){
  const receipt=await graph(`${job.media_id}?fields=id,owner,caption,media_type,media_product_type,permalink,timestamp`);
  let permalink=false;try{const url=new URL(receipt.permalink);permalink=url.protocol==='https:'&&['instagram.com','www.instagram.com'].includes(url.hostname)&&/^\/(reel|p)\/[A-Za-z0-9_-]+\/?$/.test(url.pathname)&&!url.username&&!url.password;}catch{}
  const published=Date.parse(receipt.timestamp),created=Date.parse(job.created_at);
  const owner=typeof receipt.owner==='string'?receipt.owner:receipt.owner?.id;
  if(receipt.id!==job.media_id||owner!==instagram||receipt.caption!==payload.content||receipt.media_type!=='VIDEO'||receipt.media_product_type!=='REELS'||!permalink||!Number.isFinite(published)||published<created-60000||published>now+60000)throw new Problem(502,'Instagram publication cannot yet be verified; no resend was attempted');
  job=await checkpoint('confirmed',{id:action.id,media_id:job.media_id});
  return {receipt_id:`instagram:${job.media_id}`,actual_cost_cents:0};
 }
 throw new Problem(409,'Instagram outcome requires owner reconciliation. No publication was retried.');
}
