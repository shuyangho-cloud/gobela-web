// Produces a review artifact without touching databases, providers or channels.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),ts=require('typescript');
const root=path.resolve(__dirname,'../..'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'gobela-production-'));
try{
 for(const name of ['domain','marketing-research','marketing-catalogue','marketing','marketing-assets','marketing-production']){
  const source=fs.readFileSync(path.join(root,'lib/superbrain',name+'.ts'),'utf8');
  const compiled=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,resolveJsonModule:true,esModuleInterop:true}});
  fs.writeFileSync(path.join(temp,name+'.js'),compiled.outputText);
 }
 fs.copyFileSync(path.join(root,'lib/superbrain/marketing-assets.json'),path.join(temp,'marketing-assets.json'));
 const {marketingBriefing,campaignFromProposal}=require(path.join(temp,'marketing.js'));
 const {productionPacket}=require(path.join(temp,'marketing-production.js'));
 const rows=JSON.parse(fs.readFileSync(path.join(root,'docs/superbrain/review-data/public-partners-2026-10-24.json')));
 const brief=marketingBriefing({listings:[],outcomes:[],campaigns:[],canonical:rows});
 const first=brief.proposals.find(p=>p.id==='weekend-discovery');
 const packet=productionPacket(first,{...campaignFromProposal(first),tracking_code:'pending-local-campaign-code'});
 packet.attribution.destination=null;packet.attribution.limitation='Offline review preview. Generate the saved packet inside the founder workspace to attach its real campaign code.';
 packet.revision_status='Offline preview uses the source snapshot; current database state was not verified by this export.';
 const out=path.resolve(process.argv[2]||path.join(os.tmpdir(),'gobela-weekend-production-preview.json'));
 fs.writeFileSync(out,JSON.stringify(packet,null,2)+'\n');console.log(out);
}finally{fs.rmSync(temp,{recursive:true,force:true});}
