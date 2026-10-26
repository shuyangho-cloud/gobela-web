import {readFileSync} from 'node:fs';
import {createClient} from '@supabase/supabase-js';
import ts from 'typescript';
import {expect,it} from 'vitest';

it.skipIf(process.env.RUN_SUPERBRAIN_CANONICAL_LIVE!=='1')('account deletion authenticates owner, protects founder and removes nested private photos and canonical data',async()=>{
 const cfg=JSON.parse(readFileSync('/tmp/gobela-integration-review/canonical-supabase.json','utf8'));
 expect(cfg.API_URL).toBe('http://127.0.0.1:56421');
 const env={SUPABASE_URL:cfg.API_URL,SUPABASE_ANON_KEY:cfg.ANON_KEY,SUPABASE_SERVICE_ROLE_KEY:cfg.SERVICE_ROLE_KEY};
 // Execute the unchanged edge handler with a local Deno.serve/env shim and the
 // pinned SDK. Auth, REST, cascading deletes and Storage are real local services.
 const source=readFileSync('../childassist/supabase/functions/delete-account/index.ts','utf8').replace(/^import .*\n/,'');
 let handler:(r:Request)=>Promise<Response>;
 new Function('createClient','Deno',ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText)(createClient,{env:{get:(key:keyof typeof env)=>env[key]},serve:(fn:typeof handler)=>{handler=fn;}});
 const admin=createClient(cfg.API_URL,cfg.SERVICE_ROLE_KEY,{auth:{persistSession:false}});
 const users=[];const ok=(r:any)=>{if(r.error)throw new Error(r.error.message);return r.data;};
 try{
 for(const role of ['founder','delete','retained']){
  const email=`${role}-${crypto.randomUUID()}@test.invalid`,password=crypto.randomUUID()+'Az!';
  const user=ok(await admin.auth.admin.createUser({email,password,email_confirm:true})).user;
  const client=createClient(cfg.API_URL,cfg.ANON_KEY,{auth:{persistSession:false}});
  const session=ok(await client.auth.signInWithPassword({email,password})).session;
  users.push({id:user.id,token:session.access_token,client});
  ok(await admin.from('profiles').upsert({id:user.id,name:role}));
 }
 const [f,p,o]=users;
 ok(await admin.from('gb_founders').insert({user_id:f.id}));
 const runtime=process.env.RUN_SUPERBRAIN_EDGE_RUNTIME==='1';
 const invoke=(token?:string,method='POST',body?:unknown)=>{
  const init={method,headers:{apikey:cfg.ANON_KEY,...(token?{Authorization:`Bearer ${token}`}:{ }), 'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)};
  return runtime?fetch(`${cfg.API_URL}/functions/v1/delete-account`,init):handler!(new Request('http://local/delete-account',init));
 };
 expect((await invoke(cfg.ANON_KEY,'GET')).status).toBe(405);
 expect((await invoke()).status).toBe(401);
 expect((await invoke('invalid')).status).toBe(401);
 expect((await invoke(f.token)).status).toBe(409);
 expect(ok(await admin.auth.admin.getUserById(f.id)).user.id).toBe(f.id);
 const review=crypto.randomUUID();
 ok(await admin.from('gobela_reviews').insert({id:review,profile_id:p.id,type:'play',tip:'Delete owned review'}));
 ok(await admin.from('child_profiles').insert({user_id:p.id,name:'Synthetic child'}));
 const child=ok(await admin.from('gb_children').insert({owner_id:p.id,name:'Synthetic private child',birth_date:'2020-01-01'}).select('id').single());
 ok(await admin.from('gb_health').insert({owner_id:p.id,child_id:child.id,kind:'note',value:'Synthetic private note',recorded_at:new Date().toISOString()}));
 ok(await admin.from('gb_reminders').insert({owner_id:p.id,child_id:child.id,kind:'appointment',title:'Synthetic reminder',due_at:new Date(Date.now()+86400000).toISOString()}));
 ok(await admin.from('gb_memory').insert({owner_id:p.id,fact:'Synthetic preference'}));
 const file=Buffer.from('private synthetic fixture');
 for(const path of [`${p.id}/top.png`,`${p.id}/nested/deeper/photo.png`,`${o.id}/retained.png`])ok(await admin.storage.from('gb-circle').upload(path,file,{contentType:'image/png'}));
 // Body is untrusted; only the verified JWT can select the account for deletion.
 const response=await invoke(p.token,'POST',{user_id:o.id});
 expect(response.status).toBe(200);
 expect((await admin.auth.admin.getUserById(p.id)).error).not.toBeNull();
 expect(ok(await admin.auth.admin.getUserById(o.id)).user.id).toBe(o.id);
 expect(ok(await admin.from('gobela_reviews').select('id').eq('id',review))).toHaveLength(0);
 expect(ok(await admin.from('child_profiles').select('id').eq('user_id',p.id))).toHaveLength(0);
 for(const table of ['gb_children','gb_health','gb_reminders','gb_memory'])expect(ok(await admin.from(table).select('id').eq('owner_id',p.id))).toHaveLength(0);
 expect((await admin.storage.from('gb-circle').download(`${p.id}/nested/deeper/photo.png`)).error).not.toBeNull();
 ok(await admin.storage.from('gb-circle').download(`${o.id}/retained.png`));
 }finally{
  for(const u of users){
   await admin.storage.from('gb-circle').remove([`${u.id}/top.png`,`${u.id}/nested/deeper/photo.png`,`${u.id}/retained.png`]);
   await admin.from('gobela_reviews').delete().eq('profile_id',u.id);
   await admin.from('gb_founders').delete().eq('user_id',u.id);
   await u.client.auth.signOut({scope:'local'});await admin.auth.admin.deleteUser(u.id);
  }
 }
},120000);
