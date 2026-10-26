import {readFileSync} from 'node:fs';
import {createClient} from '@supabase/supabase-js';
import {expect,it} from 'vitest';
import {handle} from '../../lib/superbrain/api';

it.skipIf(process.env.RUN_SUPERBRAIN_CANONICAL_LIVE!=='1')('canonical Circle real Auth, legacy interoperability and private Storage lifecycle',async()=>{
 const cfg=JSON.parse(readFileSync('/tmp/gobela-integration-review/canonical-supabase.json','utf8'));
 expect(cfg.API_URL).toBe('http://127.0.0.1:56421');
 Object.assign(process.env,{NEXT_PUBLIC_SUPABASE_URL:cfg.API_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY:cfg.ANON_KEY,SUPERBRAIN_CIRCLE_CANONICAL_ENABLED:'true',SUPERBRAIN_CIRCLE_PREVIEW_ENABLED:'true',SUPERBRAIN_EXECUTION_ENABLED:'false',SUPERBRAIN_AI_ENABLED:'false',SUPERBRAIN_META_ENABLED:'false'});
 const admin=createClient(cfg.API_URL,cfg.SERVICE_ROLE_KEY,{auth:{persistSession:false}});
 const users=[];
 const ok=(r:any)=>{if(r.error)throw new Error(r.error.message);return r.data;};
 try{
 for(const role of ['founder','parent','other']){
  const email=`${role}-${crypto.randomUUID()}@test.invalid`,password=crypto.randomUUID()+'Az!';
  const user=ok(await admin.auth.admin.createUser({email,password,email_confirm:true})).user;
  const client=createClient(cfg.API_URL,cfg.ANON_KEY,{auth:{persistSession:false}});
  const session=ok(await client.auth.signInWithPassword({email,password})).session;
  users.push({id:user.id,client,token:session.access_token});
  ok(await admin.from('profiles').upsert({id:user.id,name:role}));
 }
 const [f,p,o]=users;
 ok(await admin.from('gb_founders').insert({user_id:f.id}));
 async function call(u:typeof p,path:string,method='GET',body?:unknown){
  const response=await handle(new Request('http://local/api/superbrain/'+path,{method,headers:{Authorization:`Bearer ${u.token}`,'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)}),path.split('/'));
  const json=await response.json();if(!response.ok)throw new Error(`${path}: ${response.status} ${json.error}`);return json.data;
 }
 const legacy=crypto.randomUUID();
 ok(await p.client.from('gobela_reviews').insert({id:legacy,profile_id:p.id,type:'play',tip:'Original body',is_hidden:false}));
 const mapping=ok(await p.client.from('gb_circle_meta').select('id').eq('review_id',legacy).single());
 expect((await call(o,'circle/posts')).posts.some((r:any)=>r.id===mapping.id&&r.body==='Original body')).toBe(true);
 ok(await p.client.from('gobela_reviews').update({is_hidden:true}).eq('id',legacy));
 ok(await p.client.from('gobela_reviews').update({is_hidden:false}).eq('id',legacy));
 await call(o,`circle/votes/${mapping.id}`,'POST',{});
 ok(await p.client.from('review_helpful').insert({review_id:legacy,profile_id:p.id}));
 expect((await call(o,'circle/posts')).votes[mapping.id]).toBe(2);
 await call(o,`circle/reports/${mapping.id}`,'POST',{reason:'Please review'});
 await call(o,`circle/reports/${mapping.id}`,'POST',{reason:'Please review again'});
 expect(ok(await admin.from('user_reports').select('id').eq('review_id',legacy))).toHaveLength(1);
 await call(f,'founder/moderate','POST',{id:mapping.id,status:'hidden'});
 expect((await p.client.from('gobela_reviews').update({is_hidden:false}).eq('id',legacy)).error).not.toBeNull();
 expect(ok(await admin.from('user_reports').select('status').eq('review_id',legacy))[0].status).toBe('reviewed');
 await call(f,'founder/moderate','POST',{id:mapping.id,status:'published'});
 const upload=await call(p,'circle/upload','POST',{extension:'png'});
 expect(upload.authenticated).toBe(true);
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aWQAAAABJRU5ErkJggg==','base64');
 expect((await p.client.storage.from('gb-circle').createSignedUploadUrl(upload.path)).error).not.toBeNull();
 ok(await p.client.storage.from('gb-circle').upload(upload.path,png,{contentType:'image/png'}));
 expect((await f.client.storage.from('gb-circle').download(upload.path)).error).not.toBeNull();
 const post=await call(p,'circle/posts','POST',{category:'play',title:'Private review',body:'One primary body',photo_path:upload.path});
 expect((await call(o,'circle/posts')).posts.some((r:any)=>r.id===post.id)).toBe(false);
 expect((await o.client.storage.from('gb-circle').download(upload.path)).error).not.toBeNull();
 ok(await f.client.storage.from('gb-circle').download(upload.path));
 expect((await p.client.storage.from('gb-circle').upload(upload.path,png,{upsert:true,contentType:'image/png'})).error).not.toBeNull();
 await expect(call(o,`circle/consents/${post.id}`,'POST',{purpose:'Campaign test',granted:true})).rejects.toThrow();
 await call(p,`circle/consents/${post.id}`,'POST',{purpose:'Campaign test',granted:true});
 await call(p,`circle/consents/${post.id}`,'POST',{purpose:'Campaign test',granted:false});
 expect(ok(await p.client.from('gb_circle_reuse_consents').select('granted').eq('review_id',post.legacy_id))[0].granted).toBe(false);
 await call(f,'founder/moderate','POST',{id:post.id,status:'published'});
 ok(await o.client.storage.from('gb-circle').download(upload.path));
 // The shipped legacy client deletes the primary row. Founder cleanup must
 // remove the now-orphaned file without granting download access to it.
 ok(await p.client.from('gobela_reviews').delete().eq('id',post.legacy_id));
 expect((await f.client.storage.from('gb-circle').download(upload.path)).error).not.toBeNull();
 await expect(call(o,'founder/circle-cleanup','POST',{})).rejects.toThrow();
 const cleanup=await call(f,'founder/circle-cleanup','POST',{});
 expect(cleanup.cleaned).toBe(1);expect(cleanup.failed).toBe(0);
 expect((await p.client.storage.from('gb-circle').download(upload.path)).error).not.toBeNull();
 const discarded=await call(p,'circle/upload','POST',{extension:'png'});
 ok(await p.client.storage.from('gb-circle').upload(discarded.path,png,{contentType:'image/png'}));
 await call(p,'circle/upload','DELETE',{path:discarded.path});
 expect(ok(await p.client.from('gb_circle_upload_leases').select('path').eq('path',discarded.path))).toHaveLength(0);
 const orphan=await call(p,'circle/upload','POST',{extension:'png'});
 ok(await p.client.storage.from('gb-circle').upload(orphan.path,png,{contentType:'image/png'}));
 expect((await call(f,'founder/circle-cleanup','POST',{})).cleaned).toBe(0);
 ok(await admin.from('gb_circle_cleanup').update({eligible_at:'2020-01-01T00:00:00Z'}).eq('photo_path',orphan.path));
 expect((await f.client.storage.from('gb-circle').download(orphan.path)).error).not.toBeNull();
 expect((await call(f,'founder/circle-cleanup','POST',{})).cleaned).toBe(1);
 const plain=await call(p,'circle/posts','POST',{category:'learn',title:'Evidence review',body:'No photo'});
 await expect(call(o,'founder/verify-review','POST',{id:plain.id,kind:'booking',evidence:'Unauthorized reference'})).rejects.toThrow();
 await call(f,'founder/verify-review','POST',{id:plain.id,kind:'booking',evidence:'Synthetic private booking reference'});
 expect(JSON.stringify(await call(p,'circle/posts'))).not.toContain('Synthetic private booking reference');
 await call(p,`circle/posts/${plain.id}`,'DELETE');
 expect(ok(await admin.from('gobela_reviews').select('id').eq('id',plain.legacy_id))).toHaveLength(0);
 const anonymous=crypto.randomUUID();
 ok(await admin.from('gobela_reviews').insert({id:anonymous,type:'play',tip:'Anonymous legacy author',is_hidden:false}));
 const anonymousMeta=ok(await admin.from('gb_circle_meta').select('id').eq('review_id',anonymous).single());
 await call(o,`circle/reports/${anonymousMeta.id}`,'POST',{reason:'Check anonymous review'});
 expect(ok(await admin.from('review_flags').select('review_id').eq('review_id',anonymous))).toHaveLength(1);
 ok(await admin.from('gobela_reviews').delete().eq('id',anonymous));
 expect(ok(await admin.from('gb_circle').select('id'))).toHaveLength(0);
 expect(ok(await admin.from('gobela_reviews').select('tip').eq('id',legacy).single()).tip).toBe('Original body');
 }finally{
  for(const u of users){
   await admin.from('gobela_reviews').delete().eq('profile_id',u.id);
   await admin.from('gb_founders').delete().eq('user_id',u.id);
   await u.client.auth.signOut({scope:'local'});
   await admin.auth.admin.deleteUser(u.id);
  }
 }
},120000);
