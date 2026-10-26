// Operator-only, additive provisioning. Never used by the web application.
import {readFileSync} from 'node:fs';
import {resolve,sep} from 'node:path';
import {createHash} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
const sourceRoot=resolve(process.argv[2]||'');
if(!process.argv[2]||!process.argv.includes('--apply'))throw Error('Supply the authorized source repository and --apply');
if(process.env.NEXT_PUBLIC_SUPABASE_URL!=='https://mcyvyqieygpbtcheouzr.supabase.co'||!process.env.SUPABASE_SERVICE_ROLE_KEY)throw Error('Load the existing secure production operator environment');
const manifest=JSON.parse(readFileSync(new URL('../../lib/superbrain/marketing-assets.json',import.meta.url)));
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const bucket=db.storage.from('gb-marketing-references');
const hash=data=>createHash('sha256').update(data).digest('hex');
for(const asset of manifest){
 const source=resolve(sourceRoot,asset.source_path);
 if(!source.startsWith(sourceRoot+sep))throw Error('Invalid source path');
 const bytes=readFileSync(source);
 if(bytes.length!==asset.bytes||hash(bytes)!==asset.sha256)throw Error('Source requires review: '+asset.id);
 const path=asset.sha256+'/'+asset.filename;
 let existing=await bucket.download(path);
 if(existing.error){
  if(!['404','400'].includes(String(existing.error.statusCode)))throw Error('Cannot verify existing reference: '+asset.id);
  const upload=await bucket.upload(path,bytes,{contentType:asset.mime,upsert:false,cacheControl:'0'});
  if(upload.error)throw Error('Reference provisioning failed: '+asset.id);
  existing=await bucket.download(path);
 }
 if(existing.error||!existing.data)throw Error('Reference verification failed: '+asset.id);
 const verified=Buffer.from(await existing.data.arrayBuffer());
 if(verified.length!==asset.bytes||hash(verified)!==asset.sha256)throw Error('Stored reference differs; refusing overwrite: '+asset.id);
 console.log('VERIFIED '+asset.id+' '+asset.sha256);
}
