// Read-only verification of the reviewed integration migration files. No DB or deployment access.
import {readFileSync,realpathSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
const manifest=JSON.parse(readFileSync(new URL('../../docs/superbrain/deployment-migrations.json',import.meta.url),'utf8'));
if(!process.argv[2])throw Error('Supply the isolated childassist repository root');
const root=realpathSync(process.argv[2]);
if(manifest.migrations.length!==11)throw Error('Unexpected reviewed migration count');
const seen=new Set();let previous='';
for(const item of manifest.migrations){
 if(!/^supabase\/migrations\/\d{14}_[a-z0-9_]+\.sql$/.test(item.path)||seen.has(item.path)||item.path<=previous)throw Error('Invalid migration manifest');
 seen.add(item.path);previous=item.path;
 const bytes=readFileSync(resolve(root,item.path));
 if(createHash('sha256').update(bytes).digest('hex')!==item.sha256)throw Error('Review required: migration changed: '+item.path);
 console.log('MATCH '+item.path);
}
console.log('Eleven reviewed migration files match. Production schema rehearsal, founder bootstrap and deployment are NOT performed by this check.');
