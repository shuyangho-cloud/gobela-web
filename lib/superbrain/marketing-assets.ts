import type {SupabaseClient} from '@supabase/supabase-js';
import {readFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
const rootPath=()=>process.env.SUPERBRAIN_MARKETING_ASSET_ROOT||(process.env.SUPERBRAIN_BUNDLED_ASSETS==='true'?join(process.cwd(),'.private-superbrain-assets'):undefined);
import manifest from './marketing-assets.json';
import publishingManifest from './publishing-media.json';
import {Problem} from './domain';
export const marketingAssets=manifest;
// Content-addressed brand references only; authorization is checked before every API call.
const remoteCache=new Map<string,{expires:number;data:Buffer}>();
const remotePath=(asset:typeof manifest[number])=>`${asset.sha256}/${asset.filename}`;
async function remoteBytes(asset:typeof manifest[number],db:SupabaseClient,fresh=false){
 const key=remotePath(asset);const cached=remoteCache.get(key);if(!fresh&&cached&&cached.expires>Date.now())return cached.data;
 const result=await db.storage.from('gb-marketing-references').download(key);
 if(result.error||!result.data)throw new Problem(503,'Reference asset unavailable');
 const data=Buffer.from(await result.data.arrayBuffer());
 if(data.length!==asset.bytes||createHash('sha256').update(data).digest('hex')!==asset.sha256)throw new Problem(409,'Reference asset changed; review required');
 remoteCache.set(key,{expires:Date.now()+300000,data});return data;
}
export async function assetInventory(db?:SupabaseClient,collection:typeof manifest=manifest){
 return Promise.all(collection.map(async asset=>{
  let available=false;const root=rootPath();
  if(process.env.SUPERBRAIN_ASSET_STORAGE==='private-supabase'){
   if(db)try{await remoteBytes(asset,db);available=true;}catch{/* Fail closed. */}
   return {...asset,available};
  }
  if(root)try{const file=join(root,asset.filename);available=(await stat(file)).size===asset.bytes&&createHash('sha256').update(await readFile(file)).digest('hex')===asset.sha256;}catch{/* Not provisioned. */}
  return {...asset,available};
 }));
}
export async function marketingAssetResponse(id:string,range?:string|null,db?:SupabaseClient){
 return assetResponse(manifest.find(item=>item.id===id),range,db);
}
export async function publishingAssetResponse(id:string,range?:string|null,db?:SupabaseClient){
 return assetResponse(publishingManifest.find(item=>item.id===id),range,db);
}
async function assetResponse(asset:typeof manifest[number]|undefined,range?:string|null,db?:SupabaseClient){
 if(!asset)throw new Problem(404,'Asset not found');
 let data:Buffer;
 if(process.env.SUPERBRAIN_ASSET_STORAGE==='private-supabase'){
  if(!db)throw new Problem(503,'Authenticated asset storage required');data=await remoteBytes(asset,db);
 }else{const root=rootPath();if(!root)throw new Problem(503,'Reference assets are not provisioned');
  try{data=await readFile(join(root,asset.filename));}catch{throw new Problem(503,'Reference asset unavailable');}}

 if(createHash('sha256').update(data).digest('hex')!==asset.sha256)throw new Problem(409,'Reference asset changed; review required');
 const headers:Record<string,string>={'Accept-Ranges':'bytes'};let status=200;
 if(range){const match=/^bytes=(\d+)-(\d*)$/.exec(range);const start=match?Number(match[1]):-1;const requestedEnd=match&&match[2]?Number(match[2]):data.length-1;
  if(!Number.isSafeInteger(start)||!Number.isSafeInteger(requestedEnd)||start<0||start>=data.length||requestedEnd<start)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${data.length}`,'Cache-Control':'private, no-store'}});
  const end=Math.min(requestedEnd,data.length-1,start+1024*1024-1);headers['Content-Range']=`bytes ${start}-${end}/${data.length}`;data=data.subarray(start,end+1);status=206;
 }else if(data.length>4*1024*1024){return new Response(null,{status:416,headers:{'Accept-Ranges':'bytes','Content-Range':`bytes */${data.length}`,'Cache-Control':'private, no-store'}});}
 return new Response(new Uint8Array(data),{status,headers:{...headers,'Content-Type':asset.mime,'Content-Length':String(data.length),'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Disposition':`inline; filename="${asset.filename}"`}});
}

// Called only for the exact immutable, founder-approved action after claim.
// The signed read capability is sent server-to-server to Meta, never persisted.
export async function signPublishingVideo(id:string,sha256:string,db:SupabaseClient){
 const asset=publishingManifest.find(item=>item.id===id&&item.sha256===sha256);
 if(!asset||process.env.SUPERBRAIN_ASSET_STORAGE!=='private-supabase')throw new Problem(503,'Reviewed publishing media is not provisioned');
 await remoteBytes(asset,db,true);
 const result=await db.storage.from('gb-marketing-references').createSignedUrl(remotePath(asset),600);
 if(result.error||!result.data)throw new Problem(503,'Reviewed publishing media unavailable');
 return result.data.signedUrl;
}

export const publishingMediaInventory=(db:SupabaseClient)=>assetInventory(db,publishingManifest);
