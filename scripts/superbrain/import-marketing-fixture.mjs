// Local development only. No production credentials or mutations are supported.
import {readFileSync} from 'node:fs';
import {createClient} from '@supabase/supabase-js';
const config=JSON.parse(readFileSync('/tmp/gobela-integration-review/local-supabase.json','utf8'));
if(config.API_URL!=='http://127.0.0.1:56321')throw Error('Isolated local Supabase instance required');
const rows=JSON.parse(readFileSync(new URL('../../docs/superbrain/review-data/public-partners-2026-10-24.json',import.meta.url),'utf8'));
const db=createClient(config.API_URL,config.SERVICE_ROLE_KEY,{auth:{persistSession:false},global:{fetch:(url,init)=>fetch(url,{...init,signal:AbortSignal.timeout(20000)})}});
const result=await db.from('enrichment_classes').upsert(rows,{onConflict:'id'}).select('id');if(result.error)throw Error('Local fixture import failed: '+result.error.message);
console.log(`Imported ${result.data.length} public records into the isolated fixture. No production changes.`);
