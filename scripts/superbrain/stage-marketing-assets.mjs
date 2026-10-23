// Copy only the manifest-approved brand references into private local staging.
import {readFileSync,mkdirSync,existsSync,copyFileSync,chmodSync} from 'node:fs';
import {resolve,join,sep} from 'node:path';import {createHash} from 'node:crypto';
if(!process.argv[2])throw Error('Supply the existing childassist repository root');
const sourceRoot=resolve(process.argv[2]);const destination=resolve(process.argv[3]||'.local-marketing-assets');
const manifest=JSON.parse(readFileSync(new URL('../../lib/superbrain/marketing-assets.json',import.meta.url),'utf8'));
const hash=file=>createHash('sha256').update(readFileSync(file)).digest('hex');
mkdirSync(destination,{recursive:true,mode:0o700});
for(const asset of manifest){const source=resolve(sourceRoot,asset.source_path);if(!source.startsWith(sourceRoot+sep)||hash(source)!==asset.sha256)throw Error('Source changed; review required: '+asset.id);const target=join(destination,asset.filename);if(existsSync(target)&&hash(target)!==asset.sha256)throw Error('Refusing to overwrite different staged work: '+asset.id);if(!existsSync(target))copyFileSync(source,target);chmodSync(target,0o600);}
console.log('Staged '+manifest.length+' checked private references. Set SUPERBRAIN_MARKETING_ASSET_ROOT to '+destination+'. No upload or generation occurred.');
