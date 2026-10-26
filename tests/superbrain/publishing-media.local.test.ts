import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
import {expect,it,vi} from 'vitest';
import {handle} from '../../lib/superbrain/api';
import {signPublishingVideo} from '../../lib/superbrain/marketing-assets';
import media from '../../lib/superbrain/publishing-media.json';
it.skipIf(process.env.RUN_SUPERBRAIN_PUBLISHING_MEDIA_LOCAL!=='1')('exact media derivative is private, hash checked and signs only with founder Storage authority',async()=>{
 const cfg=JSON.parse(readFileSync('/tmp/gobela-integration-review/canonical-supabase.json','utf8'));
 expect(cfg.API_URL).toBe('http://127.0.0.1:56421');
 const source=process.env.SUPERBRAIN_PUBLISHING_MEDIA_SOURCE;if(!source)throw Error('Explicit authorized review-media source required');
 const bytes=readFileSync(source),asset=media[0],path=asset.sha256+'/'+asset.filename;
 expect(bytes.length).toBe(asset.bytes);expect(createHash('sha256').update(bytes).digest('hex')).toBe(asset.sha256);
 for(const[name,value]of Object.entries({NEXT_PUBLIC_SUPABASE_URL:cfg.API_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY:cfg.ANON_KEY,SUPERBRAIN_ASSET_STORAGE:'private-supabase'}))vi.stubEnv(name,value);
 const admin=createClient(cfg.API_URL,cfg.SERVICE_ROLE_KEY,{auth:{persistSession:false}}),users=[];
 const ok=(r:any)=>{if(r.error)throw Error(r.error.message);return r.data;};let uploaded=false;
 try{
 for(const role of ['founder','parent']){
  const email=`media-${role}-${crypto.randomUUID()}@test.invalid`,password=crypto.randomUUID()+'Az!';
  const user=ok(await admin.auth.admin.createUser({email,password,email_confirm:true})).user;
  const client=createClient(cfg.API_URL,cfg.ANON_KEY,{auth:{persistSession:false}});
  const session=ok(await client.auth.signInWithPassword({email,password})).session;
  users.push({id:user.id,client,token:session.access_token});
  ok(await admin.from('profiles').upsert({id:user.id,name:role}));
 }
 const[f,p]=users;ok(await admin.from('gb_founders').insert({user_id:f.id}));
 ok(await admin.storage.from('gb-marketing-references').upload(path,bytes,{contentType:'video/mp4',upsert:false}));uploaded=true;
 const request=(token?:string)=>new Request(`http://local/api/superbrain/founder/publishing-media/${asset.id}`,{headers:{Range:'bytes=0-31',...(token?{Authorization:`Bearer ${token}`}:{})}});
 expect((await handle(request(),['founder','publishing-media',asset.id])).status).toBe(401);
 expect((await handle(request(p.token),['founder','publishing-media',asset.id])).status).toBe(403);
 const response=await handle(request(f.token),['founder','publishing-media',asset.id]);expect(response.status).toBe(206);
 expect(Buffer.from(await response.arrayBuffer()).equals(bytes.subarray(0,32))).toBe(true);
 const anon=createClient(cfg.API_URL,cfg.ANON_KEY,{auth:{persistSession:false}});
 expect((await anon.storage.from('gb-marketing-references').download(path)).error).not.toBeNull();
 expect((await p.client.storage.from('gb-marketing-references').download(path)).error).not.toBeNull();
 expect((await f.client.storage.from('gb-marketing-references').upload(asset.sha256+'/forged.mp4',bytes)).error).not.toBeNull();
 const capability=await signPublishingVideo(asset.id,asset.sha256,f.client);
 const downloaded=await fetch(capability);expect(downloaded.status).toBe(200);
 expect(createHash('sha256').update(Buffer.from(await downloaded.arrayBuffer())).digest('hex')).toBe(asset.sha256);
 await expect(signPublishingVideo(asset.id,asset.sha256,p.client)).rejects.toThrow('unavailable');
 await expect(signPublishingVideo(asset.id,'0'.repeat(64),f.client)).rejects.toThrow('not provisioned');
 }finally{
  if(uploaded)await admin.storage.from('gb-marketing-references').remove([path]);
  for(const u of users){await admin.from('gb_founders').delete().eq('user_id',u.id);await u.client.auth.signOut({scope:'local'});await admin.auth.admin.deleteUser(u.id);}
  vi.unstubAllEnvs();
 }
},120000);
