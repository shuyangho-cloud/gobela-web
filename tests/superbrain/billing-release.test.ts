import {PGlite} from '@electric-sql/pglite';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {it,expect} from 'vitest';
it('guarded disabled transaction preserves data, registers exactly one version and refuses replay',async()=>{
 const db=new PGlite();
 try{
  await db.exec(`create role anon;create role authenticated;create role service_role;create schema gb_private;create schema supabase_migrations;
   create table supabase_migrations.schema_migrations(version text primary key,name text,statements text[]);
   insert into supabase_migrations.schema_migrations(version) values('20261123012648'),('20261123025456'),('20261123052714');
   create table public.gb_founders(user_id uuid primary key);insert into public.gb_founders values('07aeee08-37ac-4c04-8078-18bc1fd776aa');
   create table public.gb_control(id boolean primary key,paused boolean,execution_enabled boolean,daily_budget_cents integer);
   insert into public.gb_control values(true,true,false,0);
   create table public.gb_actions(id uuid primary key,status text,reserved_cents integer);
   insert into public.gb_actions select ('00000000-0000-4000-8000-'||lpad(n::text,12,'0'))::uuid,'pending',0 from generate_series(1,1000)n;
  `);
  for(const name of ['20261123012648_superbrain_weekly_budget.sql','20261123025456_superbrain_ai_billing_receipts.sql','20261123052714_superbrain_ai_cost_evidence.sql'])await db.exec(readFileSync(resolve('../childassist/supabase/migrations',name),'utf8'));
  const fingerprint=()=>db.query(`select md5(string_agg(to_jsonb(t)::text,',' order by id)) hash,count(*)::int n from public.gb_actions t`);
  const before=await fingerprint();
  const sql=readFileSync(resolve('docs/superbrain/billing/REVIEW_ONLY_disabled-rollout.sql'),'utf8');
  await db.exec(sql);
  expect((await fingerprint()).rows).toEqual(before.rows);
  expect((await db.query(`select version from supabase_migrations.schema_migrations where version='20261126052124'`)).rows).toHaveLength(1);
  expect((await db.query(`select paused,execution_enabled,daily_budget_cents from public.gb_control`)).rows).toEqual([{paused:true,execution_enabled:false,daily_budget_cents:0}]);
  expect((await db.query(`select enabled,halted from gb_private.budget_policy`)).rows).toEqual([{enabled:false,halted:false}]);
  await expect(db.exec(sql)).rejects.toThrow('Already present');await db.exec('rollback');
  expect((await fingerprint()).rows).toEqual(before.rows);
  expect((await db.query(`select version from supabase_migrations.schema_migrations`)).rows).toHaveLength(4);
 }finally{await db.close();}
},120000);
