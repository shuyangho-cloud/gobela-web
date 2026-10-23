import {readFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import manifest from './marketing-assets.json';
import {Problem} from './domain';
export const marketingAssets=manifest;
export async function assetInventory(){
 return Promise.all(manifest.map(async asset=>{
  let available=false;const root=process.env.SUPERBRAIN_MARKETING_ASSET_ROOT;
  if(root)try{available=(await stat(join(root,asset.filename))).size===asset.bytes;}catch{/* Not provisioned. */}
  return {...asset,available};
 }));
}
export async function marketingAssetResponse(id:string){
 const asset=manifest.find(item=>item.id===id);if(!asset)throw new Problem(404,'Asset not found');
 const root=process.env.SUPERBRAIN_MARKETING_ASSET_ROOT;if(!root)throw new Problem(503,'Reference assets are not provisioned');
 let data:Buffer;try{data=await readFile(join(root,asset.filename));}catch{throw new Problem(503,'Reference asset unavailable');}
 if(createHash('sha256').update(data).digest('hex')!==asset.sha256)throw new Problem(409,'Reference asset changed; review required');
 return new Response(new Uint8Array(data),{headers:{'Content-Type':asset.mime,'Content-Length':String(data.length),'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Disposition':`inline; filename="${asset.filename}"`}});
}
