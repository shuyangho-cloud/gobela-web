import {readFileSync} from 'node:fs';
import {createClient} from '@supabase/supabase-js';
import {expect,it,vi} from 'vitest';
import {advanceInstagramReel,type InstagramCheckpoint} from '../../lib/superbrain/instagram';

it.skipIf(process.env.RUN_SUPERBRAIN_INSTAGRAM_LOCAL!=='1')('durable Instagram stages, race protection, pause and uncertain no-resend with real local RPC and mocked Meta',async()=>{
 const cfg=JSON.parse(readFileSync('/tmp/gobela-integration-review/canonical-supabase.json','utf8'));
 expect(cfg.API_URL).toBe('http://127.0.0.1:56421');
 const admin=createClient(cfg.API_URL,cfg.SERVICE_ROLE_KEY,{auth:{persistSession:false}});
 const ok=(r:any)=>{if(r.error)throw new Error(r.error.message);return r.data;};
 const users=[];let campaignId='';
 for(const[name,value]of Object.entries({SUPERBRAIN_INSTAGRAM_ADAPTER_ENABLED:'true',SUPERBRAIN_META_ENABLED:'true',SUPERBRAIN_EXECUTION_ENABLED:'true',SUPERBRAIN_ADAPTER_MODE:'meta',SUPERBRAIN_META_PAGE_ID:'123',SUPERBRAIN_META_INSTAGRAM_ID:'456',SUPERBRAIN_META_INSTAGRAM_USERNAME:'gobelaapp',SUPERBRAIN_META_API_VERSION:'v25.0',SUPERBRAIN_META_PAGE_TOKEN:'synthetic-local-token'}))vi.stubEnv(name,value);
 try{
 for(const role of ['founder','parent']){
  const email=`ig-${role}-${crypto.randomUUID()}@test.invalid`,password=crypto.randomUUID()+'Az!';
  const user=ok(await admin.auth.admin.createUser({email,password,email_confirm:true})).user;
  const client=createClient(cfg.API_URL,cfg.ANON_KEY,{auth:{persistSession:false}});
  const session=ok(await client.auth.signInWithPassword({email,password})).session;
  users.push({id:user.id,client,token:session.access_token});
  ok(await admin.from('profiles').upsert({id:user.id,name:role}));
 }
 const[f,p]=users;
 ok(await admin.from('gb_founders').insert({user_id:f.id}));
 const command=async(op:string,args:Record<string,unknown>)=>ok(await f.client.rpc('gb_command',{op,args}));
 const checkpoint:InstagramCheckpoint=async(op,args)=>ok(await f.client.rpc('gb_instagram_checkpoint',{op,args}));
 campaignId=ok(await f.client.from('gb_campaigns').insert({title:'Synthetic organic Reel',audience:'instagram:456:public',category:'play',objective:'Local non-sending validation'}).select('id').single()).id;
 await command('controls',{paused:false,execution_enabled:true,daily_budget_cents:0});
 const prepare=async(content:string)=>{
  const requested=await command('request',{payload:{campaign_id:campaignId,channel:'instagram',content,audience:'instagram:456:public',media:{asset_id:'backpack-reel-audio48k',sha256:'cf8fbd6b90522a251ec407fa8d724b31859240e15d0e1c2cf288e3c87041ce7d',reuse_approved:true}},reserved_cents:0});
  await command('approve',{id:requested.id});return command('claim',{id:requested.id});
 };
 const action=await prepare('Exact synthetic approved copy');
 const calls:{url:string;method:string}[]=[];
 const transport:typeof fetch=async(url,init)=>{
  const path=String(url);calls.push({url:path,method:init?.method??'GET'});
  if(path.includes('/me?'))return Response.json({id:'123',instagram_business_account:{id:'456',username:'gobelaapp'}});
  if(path.endsWith('/456/media'))return Response.json({id:'789'});
  if(path.includes('/789?'))return Response.json({id:'789',status_code:'FINISHED'});
  if(path.endsWith('/456/media_publish'))return Response.json({id:'901'});
  if(path.includes('/901?'))return Response.json({id:'901',owner:{id:'456'},caption:action.payload.content,media_type:'VIDEO',media_product_type:'REELS',permalink:'https://www.instagram.com/reel/Synthetic_Receipt/',timestamp:new Date().toISOString()});
  throw new Error('Unexpected mocked Meta path');
 };
 const run=(start:boolean)=>advanceInstagramReel(action,start,checkpoint,async()=> 'https://synthetic.test/temporary-media-read-capability',transport);
 const starts=await Promise.allSettled([run(true),run(true)]);
 expect(starts.filter(r=>r.status==='fulfilled')).toHaveLength(1);
 expect(calls.filter(c=>c.method==='POST'&&c.url.endsWith('/media'))).toHaveLength(1);
 expect(ok(await p.client.from('gb_instagram_jobs').select('*'))).toHaveLength(0);
 expect((await p.client.rpc('gb_instagram_checkpoint',{op:'read',args:{id:action.id}})).error).not.toBeNull();
 expect((await f.client.from('gb_instagram_jobs').update({phase:'ready'}).eq('action_id',action.id)).error).not.toBeNull();
 expect(await run(false)).toMatchObject({pending:true,phase:'processing'});
 expect(calls.filter(c=>c.url.includes('/789?'))).toHaveLength(0);
 ok(await admin.from('gb_instagram_jobs').update({next_check_at:'2020-01-01T00:00:00Z'}).eq('action_id',action.id));
 expect(await run(false)).toMatchObject({pending:true,phase:'ready'});
 expect(ok(await admin.from('gb_actions').select('status').eq('id',action.id).single()).status).toBe('executing');
 await command('controls',{paused:true,execution_enabled:true,daily_budget_cents:0});
 await expect(run(false)).rejects.toThrow('paused');
 expect(calls.filter(c=>c.url.endsWith('/media_publish'))).toHaveLength(0);
 await command('controls',{paused:false,execution_enabled:true,daily_budget_cents:0});
 const publications=await Promise.allSettled([run(false),run(false)]);
 expect(publications.filter(r=>r.status==='fulfilled')).toHaveLength(1);
 expect(calls.filter(c=>c.url.endsWith('/media_publish'))).toHaveLength(1);
 const receipt=await run(false);expect(receipt).toEqual({receipt_id:'instagram:901',actual_cost_cents:0});
 await command('complete',{id:action.id,...receipt});
 const saved=ok(await admin.from('gb_instagram_jobs').select('*').eq('action_id',action.id).single());
 expect(saved.phase).toBe('confirmed');expect(JSON.stringify(saved)).not.toContain('temporary-media-read-capability');expect(JSON.stringify(saved)).not.toContain('synthetic-local-token');
 const uncertain=await prepare('Timeout fixture');let mutations=0;
 const timeout:typeof fetch=async(url,init)=>{if(init?.method==='POST'){mutations++;throw new Error('Synthetic network timeout');}return Response.json({id:'123',instagram_business_account:{id:'456',username:'gobelaapp'}});};
 await expect(advanceInstagramReel(uncertain,true,checkpoint,async()=> 'https://synthetic.test/private',timeout)).rejects.toThrow('uncertain');
 const held=ok(await admin.from('gb_actions').select('*').eq('id',uncertain.id).single());expect(held.status).toBe('uncertain');
 await expect(advanceInstagramReel(held,false,checkpoint,vi.fn(),timeout)).rejects.toThrow('reconciliation');expect(mutations).toBe(1);
 }finally{
  await admin.from('gb_control').update({paused:true,execution_enabled:false,daily_budget_cents:0}).eq('id',true);
  if(campaignId){await admin.from('gb_actions').delete().eq('campaign_id',campaignId);await admin.from('gb_campaigns').delete().eq('id',campaignId);}
  for(const u of users){await admin.from('gb_founders').delete().eq('user_id',u.id);await u.client.auth.signOut({scope:'local'});await admin.auth.admin.deleteUser(u.id);}
  vi.unstubAllEnvs();
 }
},120000);
