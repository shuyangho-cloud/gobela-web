import {readFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
const rootPath=()=>process.env.SUPERBRAIN_MARKETING_ASSET_ROOT||(process.env.SUPERBRAIN_BUNDLED_ASSETS==='true'?join(process.cwd(),'.private-superbrain-assets'):undefined);
import manifest from './marketing-assets.json';
import {Problem} from './domain';
export const marketingAssets=manifest;
export async function assetInventory(){
 return Promise.all(manifest.map(async asset=>{
  let available=false;const root=rootPath();
  if(root)try{const file=join(root,asset.filename);available=(await stat(file)).size===asset.bytes&&createHash('sha256').update(await readFile(file)).digest('hex')===asset.sha256;}catch{/* Not provisioned. */}
  return {...asset,available};
 }));
}
export async function marketingAssetResponse(id:string,range?:string|null){
 const asset=manifest.find(item=>item.id===id);if(!asset)throw new Problem(404,'Asset not found');
 const root=rootPath();if(!root)throw new Problem(503,'Reference assets are not provisioned');
 let data:Buffer;try{data=await readFile(join(root,asset.filename));}catch{throw new Problem(503,'Reference asset unavailable');}
 if(createHash('sha256').update(data).digest('hex')!==asset.sha256)throw new Problem(409,'Reference asset changed; review required');
 const headers:Record<string,string>={'Accept-Ranges':'bytes'};let status=200;
 if(range){const match=/^bytes=(\d+)-(\d*)$/.exec(range);const start=match?Number(match[1]):-1;const requestedEnd=match&&match[2]?Number(match[2]):data.length-1;
  if(!Number.isSafeInteger(start)||!Number.isSafeInteger(requestedEnd)||start<0||start>=data.length||requestedEnd<start)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${data.length}`,'Cache-Control':'private, no-store'}});
  const end=Math.min(requestedEnd,data.length-1,start+1024*1024-1);headers['Content-Range']=`bytes ${start}-${end}/${data.length}`;data=data.subarray(start,end+1);status=206;
 }else if(data.length>4*1024*1024){return new Response(null,{status:416,headers:{'Accept-Ranges':'bytes','Content-Range':`bytes */${data.length}`,'Cache-Control':'private, no-store'}});}
 return new Response(new Uint8Array(data),{status,headers:{...headers,'Content-Type':asset.mime,'Content-Length':String(data.length),'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Disposition':`inline; filename="${asset.filename}"`}});
}
