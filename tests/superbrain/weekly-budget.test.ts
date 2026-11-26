import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, beforeEach, afterAll, it, expect } from 'vitest';
let db: PGlite;
const id=(n:number)=>`00000000-0000-4000-8000-${String(n).padStart(12,'0')}`;
const reserve=(n:number,bucket='ai',cents=100)=>db.query<{result:any}>(
 'select public.gb_budget_reserve($1,$2,$3) result',[id(n),bucket,cents]);
const settle=(n:number,cents:number,receipt='verified-provider-receipt')=>db.query(
 'select public.gb_budget_settle($1,$2,$3)',[id(n),cents,receipt]);
beforeAll(async()=>{
 db=new PGlite();
 await db.exec(`create role anon;create role authenticated;create role service_role;
 create schema gb_private; create table public.gb_control(id boolean primary key,paused boolean,execution_enabled boolean);
 insert into public.gb_control values(true,false,true);
 create table public.gb_actions(id uuid primary key,status text,reserved_cents integer);
 -- Reproduce Supabase's potentially broad default table grants.
 alter default privileges in schema public grant all on tables to anon,authenticated;
 `);
 await db.exec(readFileSync(resolve('../childassist/supabase/migrations/20261123012648_superbrain_weekly_budget.sql'),'utf8'));
 await db.exec(readFileSync(resolve('../childassist/supabase/migrations/20261123025456_superbrain_ai_billing_receipts.sql'),'utf8'));
 await db.exec(readFileSync(resolve('../childassist/supabase/migrations/20261123052714_superbrain_ai_cost_evidence.sql'),'utf8'));
},120000);
beforeEach(async()=>{await db.exec(`reset role; truncate gb_private.budget_reservations,public.gb_actions;
 update gb_private.budget_policy set enabled=true,halted=false;
 update public.gb_control set paused=false,execution_enabled=true;`);});
afterAll(async()=>{await db.close();});
it('uses Singapore Monday boundaries, including UTC Sunday',async()=>{
 const {rows}=await db.query<{week:string}>(`select gb_private.budget_week(x)::text week from unnest(array[
 '2026-11-22T15:59:59Z'::timestamptz,'2026-11-22T16:00:00Z'::timestamptz,
 '2026-11-29T15:59:59Z'::timestamptz,'2026-11-29T16:00:00Z'::timestamptz]) x`);
 expect(rows.map(r=>r.week)).toEqual(['2026-11-16','2026-11-23','2026-11-23','2026-11-30']);
});
it('cannot transfer unused ads or reserve allocation into AI',async()=>{
 await reserve(1,'ai',1000);await reserve(2,'ads',5000);
 await expect(reserve(3,'ai',1)).rejects.toThrow('Weekly budget exceeded');
 await expect(reserve(4,'ads',1)).rejects.toThrow('Weekly budget exceeded');
 await expect(reserve(5,'reserve',1)).rejects.toThrow('Invalid budget reservation');
});
it('serializes competing reservations and never grants two permits for one id',async()=>{
 const results=await Promise.allSettled([reserve(1,'ai',600),reserve(2,'ai',600)]);
 expect(results.filter(r=>r.status==='fulfilled')).toHaveLength(1);
 const first=await reserve(3,'ads',100);
 expect(first.rows[0].result.acquired).toBe(true);
 expect((await reserve(3,'ads',100)).rows[0].result.acquired).toBe(false);
 await expect(reserve(3,'ads',200)).rejects.toThrow('idempotency conflict');
});
it('counts unresolved old-week charges without carry-forward of unused allowance',async()=>{
 await reserve(1,'ai',700);
 await db.exec(`update gb_private.budget_reservations set week_start=gb_private.budget_week(now())-7`);
 await expect(reserve(2,'ai',301)).rejects.toThrow('Weekly budget exceeded');
 await reserve(2,'ai',300);
 // Verified billing for the prior week releases only its unresolved hold.
 await settle(1,700);await reserve(3,'ai',700);
 await expect(reserve(4,'ai',1)).rejects.toThrow('Weekly budget exceeded');
});
it('settles true cost, preserves overruns and halts further paid permits',async()=>{
 await reserve(1);await settle(1,1100);
 expect((await db.query('select actual_cents from gb_private.budget_reservations')).rows[0]).toEqual({actual_cents:1100});
 await expect(reserve(2,'ads',1)).rejects.toThrow('Paid execution disabled');
 await settle(1,1100);
 await expect(settle(1,0)).rejects.toThrow('Settlement conflict');
});
it('does not release uncertain costs or accept missing evidence',async()=>{
 await reserve(1,'ai',1000);
 await expect(settle(1,0,'')).rejects.toThrow('Verified cost');
 await expect(reserve(2,'ai',1)).rejects.toThrow('Weekly budget exceeded');
 await settle(1,0,'provider-confirmed-no-charge');await reserve(2,'ai',1000);
});
it('fails closed for disabled controls and missing singleton rows',async()=>{
 await db.exec('update gb_private.budget_policy set enabled=false');
 await expect(reserve(1)).rejects.toThrow('Paid execution disabled');
 await db.exec('update gb_private.budget_policy set enabled=true;update public.gb_control set paused=true');
 await expect(reserve(1)).rejects.toThrow('Paid execution disabled');
 await db.exec('update public.gb_control set paused=false,execution_enabled=false');
 await expect(reserve(1)).rejects.toThrow('Paid execution disabled');
 await db.exec('delete from public.gb_control');
 await expect(reserve(1)).rejects.toThrow('Paid execution disabled');
 await db.exec('insert into public.gb_control values(true,false,true)');
});
it('denies parents and anonymous callers; service has RPC only, no table writes',async()=>{
 for(const role of ['anon','authenticated']){
  await db.exec(`set role ${role}`);
  await expect(reserve(1)).rejects.toThrow('permission denied');
  await expect(settle(1,0)).rejects.toThrow('permission denied');
  await expect(db.exec('select * from gb_private.budget_reservations')).rejects.toThrow('permission denied');
  await db.exec('reset role');
 }
 await db.exec('set role service_role');await reserve(1);
 await expect(db.exec('update gb_private.budget_policy set enabled=true')).rejects.toThrow('permission denied');
 await settle(1,1);
});
it('blocks legacy paid claims without a current matching ads reservation',async()=>{
 await db.query("insert into public.gb_actions values($1,'approved',100)",[id(1)]);
 const claim=()=>db.query("update public.gb_actions set status='executing' where id=$1",[id(1)]);
 await expect(claim()).rejects.toThrow('Current weekly paid reservation required');
 await reserve(1,'ai',100);await expect(claim()).rejects.toThrow('Current weekly paid reservation required');
 await db.exec('truncate gb_private.budget_reservations');
 await reserve(1,'ads',100);await claim();
});
it('keeps the policy disabled on initial migration and allows existing zero-cost flow',async()=>{
 // Reapply independently to inspect the initial policy rather than beforeEach's test opt-in.
 const sql=readFileSync(resolve('../childassist/supabase/migrations/20261123012648_superbrain_weekly_budget.sql'),'utf8');
 expect(sql).toContain('enabled boolean not null default false');
 await db.exec(`update gb_private.budget_policy set enabled=false;
 insert into public.gb_actions values('${id(1)}','approved',0);
 update public.gb_actions set status='executing' where id='${id(1)}';`);
});
it('integrates with the actual founder command and additive production schema',async()=>{
 const integrated=new PGlite();
 try{
  await integrated.exec(`create role anon;create role authenticated;create role service_role;create schema auth;
   create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
   grant usage on schema auth to authenticated;grant execute on function auth.uid() to authenticated;`);
  await integrated.exec(readFileSync(resolve('../childassist/supabase/migrations/20261023041139_gobela_superbrain.sql'),'utf8'));
  await integrated.exec(readFileSync(resolve('../childassist/supabase/migrations/20261123012648_superbrain_weekly_budget.sql'),'utf8'));
  expect((await integrated.query('select enabled,halted from gb_private.budget_policy')).rows[0]).toEqual({enabled:false,halted:false});
  expect((await integrated.query('select paused,execution_enabled,daily_budget_cents from public.gb_control')).rows[0]).toEqual({paused:true,execution_enabled:false,daily_budget_cents:0});
  await integrated.exec(`insert into auth.users values('${id(9)}');insert into public.gb_founders values('${id(9)}');
   update public.gb_control set paused=false,execution_enabled=true,daily_budget_cents=99999;
   update gb_private.budget_policy set enabled=true;
   set role authenticated;set request.jwt.claim.sub='${id(9)}';`);
  const campaign=await integrated.query<{id:string}>(`insert into public.gb_campaigns(title,audience,category,objective) values('Test','Parents','play','Enquiries') returning id`);
  const command=async(op:string,args:unknown)=> (await integrated.query<{r:any}>('select gb_command($1,$2::jsonb) r',[op,JSON.stringify(args)])).rows[0].r;
  const action=await command('request',{payload:{channel:'email',content:'Test',audience:'Test',campaign_id:campaign.rows[0].id},reserved_cents:100});
  await command('approve',{id:action.id});
  await expect(command('claim',{id:action.id})).rejects.toThrow('Current weekly paid reservation required');
  await integrated.exec('reset role;set role service_role');
  await integrated.query('select gb_budget_reserve($1,$2,$3)',[action.id,'ads',100]);
  await integrated.exec('reset role;set role authenticated');
  expect((await command('claim',{id:action.id})).status).toBe('executing');
 }finally{await integrated.close();}
},120000);

it('persists pending billing identifiers without releasing an unresolved hold',async()=>{
 await reserve(1,'ai',1000);
 await db.exec('set role service_role');
 await db.query('select gb_budget_note_receipt($1,$2)',[id(1),'gateway:gen_test']);
 await expect(reserve(2,'ai',1)).rejects.toThrow('Weekly budget exceeded');
 await expect(settle(1,1,'gateway:gen_other')).rejects.toThrow('Receipt conflict');
 await settle(1,1,'gateway:gen_test');
 await db.exec('reset role');
 expect((await db.query('select pending_receipt,actual_cents from gb_private.budget_reservations')).rows[0]).toEqual({pending_receipt:'gateway:gen_test',actual_cents:1});
});
it('rejects duplicate, changing, invalid or non-AI billing identifiers',async()=>{
 await reserve(1);await reserve(2);await reserve(3,'ads');
 const note=(n:number,receipt:string)=>db.query('select gb_budget_note_receipt($1,$2)',[id(n),receipt]);
 await note(1,'gateway:gen_test');await note(1,'gateway:gen_test');
 await expect(note(1,'gateway:gen_other')).rejects.toThrow('Receipt conflict');
 await expect(note(2,'gateway:gen_test')).rejects.toThrow('duplicate key');
 await expect(note(2,'prompt text')).rejects.toThrow('Invalid provider receipt');
 await expect(note(3,'gateway:gen_ads')).rejects.toThrow('AI reservation required');
});
it('denies parents and anonymous callers the receipt RPC',async()=>{
 for(const role of ['anon','authenticated']){
  await db.exec(`set role ${role}`);
  await expect(db.query('select gb_budget_note_receipt($1,$2)',[id(1),'gateway:gen_test'])).rejects.toThrow('permission denied');
  await db.exec('reset role');
 }
});
function quote(){return {version:1,model:'provider/model',provider:'provider',evidence:'reviewed test fixture, not live configuration',reviewedAt:new Date(Date.now()-1000).toISOString(),expiresAt:new Date(Date.now()+3600000).toISOString(),maximumUsdMicros:4000000,sgdCentsPerUsdCeiling:150,maximumInputBytes:1000,maximumOutputTokens:600};}
const reserveAi=(n:number,q:unknown=quote())=>db.query<{r:any}>('select gb_budget_reserve_ai($1,$2::jsonb) r',[id(n),JSON.stringify(q)]);
const settleAi=(n:number,micros:number,time:string)=>db.query('select gb_budget_settle_ai($1,$2,$3,$4::timestamptz)',[id(n),micros,`gateway:gen_${n}`,time]);
it('atomically retains the exact quote and detects replay with different pricing evidence',async()=>{
 const q=quote();const result=await reserveAi(1,q);expect(result.rows[0].r.reserved_cents).toBe(600);
 expect((await reserveAi(1,q)).rows[0].r.acquired).toBe(false);
 await expect(reserveAi(1,{...q,evidence:'different review'})).rejects.toThrow('Cost evidence conflict');
 expect((await db.query('select cost_contract from gb_private.budget_reservations')).rows[0]).toEqual({cost_contract:q});
});
it('rejects missing, extra, expired and over-budget quote evidence without creating a hold',async()=>{
 for(const q of [null,{}, {...quote(),prompt:'Private words'}, {...quote(),provider:null}, {...quote(),expiresAt:'2020-01-01T00:00:00Z'}, {...quote(),maximumUsdMicros:1000000000}])await expect(reserveAi(1,q)).rejects.toThrow();
 expect((await db.query('select count(*)::int n from gb_private.budget_reservations')).rows[0]).toEqual({n:0});
});
it('attributes a late Monday charge to its billed week and retains USD/FX evidence',async()=>{
 await reserveAi(1);
 await db.exec(`update gb_private.budget_reservations set created_at=(gb_private.budget_week(now())::timestamp at time zone 'Asia/Singapore')-interval '1 second',week_start=gb_private.budget_week(now())-7`);
 const billed=(await db.query<{t:string}>("select clock_timestamp()::text t")).rows[0].t;
 await db.query('select gb_budget_note_receipt($1,$2)',[id(1),'gateway:gen_1']);
 await settleAi(1,4000000,billed); // S$6 must remain in this week's S$10 allocation.
 await expect(reserve(2,'ai',401)).rejects.toThrow('Weekly budget exceeded');
 await reserve(2,'ai',400);
 const row=(await db.query<any>('select week_start::text,charged_at is not null has_time,billed_usd_micros::text usd,cost_contract->>\'sgdCentsPerUsdCeiling\' fx from gb_private.budget_reservations where id=$1',[id(1)])).rows[0];
 expect(row).toEqual({week_start:(await db.query<{w:string}>('select gb_private.budget_week(now())::text w')).rows[0].w,has_time:true,usd:'4000000',fx:'150'});
 await settleAi(1,4000000,billed);
 await expect(settleAi(1,3000000,billed)).rejects.toThrow('Billing evidence conflict');
});
it('does not accept future or unrelated billing times and keeps the reservation held',async()=>{
 await reserveAi(1);await db.query('select gb_budget_note_receipt($1,$2)',[id(1),'gateway:gen_1']);
 for(const time of [new Date(Date.now()+3600000).toISOString(),'2020-01-01T00:00:00Z'])await expect(settleAi(1,1,time)).rejects.toThrow('Invalid billed cost or time');
 expect((await db.query('select actual_cents from gb_private.budget_reservations')).rows[0]).toEqual({actual_cents:null});
});
it('denies anonymous and parent access to quote reservation and billed settlement',async()=>{
 for(const role of ['anon','authenticated']){
  await db.exec(`set role ${role}`);
  await expect(reserveAi(1)).rejects.toThrow('permission denied');
  await expect(settleAi(1,1,new Date().toISOString())).rejects.toThrow('permission denied');
  await db.exec('reset role');
 }
});
