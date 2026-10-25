import {PGlite} from '@electric-sql/pglite';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {beforeAll,afterAll,it,expect} from 'vitest';
const captured=JSON.parse(readFileSync(resolve('docs/superbrain/review-data/production-contract-2026-10-25.json'),'utf8'));
const columns=JSON.parse(readFileSync(resolve('docs/superbrain/review-data/production-columns-2026-10-25.json'),'utf8')).columns;
const manifest=JSON.parse(readFileSync(resolve('docs/superbrain/deployment-migrations.json'),'utf8'));
const ident=(s:string)=>'"'+s.replaceAll('"','""')+'"';
const founder='11111111-1111-4111-8111-111111111111',parent='22222222-2222-4222-8222-222222222222',other='33333333-3333-4333-8333-333333333333';
let db:PGlite;
async function as(id:string,sql:string){await db.exec(`reset role;set role authenticated;set request.jwt.claim.sub='${id}';`);return db.query(sql);}
beforeAll(async()=>{
 db=new PGlite();
 // Explicit platform fixtures: no Auth engine, real Storage server or production rows copied.
 await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;create function auth.role() returns text language sql stable as $$select current_user::text$$;grant usage on schema auth to anon,authenticated;grant execute on all functions in schema auth to anon,authenticated;alter default privileges in schema public grant all on tables to anon,authenticated;create schema storage;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text);alter table storage.objects enable row level security;create function storage.foldername(text) returns text[] language sql immutable as $$select (string_to_array($1,'/'))[1:array_length(string_to_array($1,'/'),1)-1]$$;grant usage on schema storage to authenticated;grant select,insert,delete on storage.objects to authenticated;`);
 for(const table of [...new Set(columns.map((c:any)=>c.table_name))] as string[]){
  const fields=columns.filter((c:any)=>c.table_name===table).map((c:any)=>`${ident(c.column_name)} ${c.data_type==='ARRAY'?'text[]':c.data_type}${c.column_default?' default '+c.column_default:''}${c.is_nullable==='NO'?' not null':''}`);
  await db.exec(`create table public.${ident(table)} (${fields.join(',')});`);
 }
 await db.exec(`create table public.referrals (${captured.referrals_columns.map((c:any)=>`${ident(c.column_name)} ${c.sql_type}${c.default?' default '+c.default:''}${c.not_null?' not null':''}`).join(',')});`);
 for(const foreign of [false,true])for(const c of captured.constraints.filter((c:any)=>c.definition.startsWith('FOREIGN KEY')===foreign))await db.exec(`alter table public.${ident(c.table_name)} add constraint ${ident(c.conname)} ${c.definition};`);
 const existing=new Set(captured.constraints.filter((c:any)=>c.definition.startsWith('PRIMARY KEY')||c.definition.startsWith('UNIQUE')).map((c:any)=>c.conname));
 for(const index of captured.indexes){const name=index.match(/INDEX (\S+) ON/)[1];if(!existing.has(name))await db.exec(index);}
 await db.exec(captured.is_admin);
 for(const t of captured.triggers){await db.exec(t.function_definition);await db.exec(t.definition);}
 for(const r of captured.rls){if(r.enabled)await db.exec(`alter table public.${ident(r.table_name)} enable row level security;`);if(r.forced)await db.exec(`alter table public.${ident(r.table_name)} force row level security;`);}
 for(const g of captured.grants)await db.exec(`grant ${g.privilege_type} on public.${ident(g.table_name)} to ${ident(g.grantee)};`);
 for(const p of captured.policies)await db.exec(`create policy ${ident(p.policyname)} on public.${ident(p.tablename)} as ${p.permissive} for ${p.cmd} to ${p.roles.map(ident).join(',')}${p.qual?' using ('+p.qual+')':''}${p.with_check?' with check ('+p.with_check+')':''};`);
 for(const m of manifest.migrations)await db.exec(readFileSync(resolve('../childassist',m.path),'utf8'));
 await db.exec(`insert into auth.users values('${founder}'),('${parent}'),('${other}');insert into public.profiles(id) values('${founder}'),('${parent}'),('${other}');insert into public.gb_founders values('${founder}');insert into public.gobela_reviews(id,profile_id,type,tip) values('parent-review','${parent}','play','Original parent words');`);
},120000);
afterAll(async()=>{await db.close();});
it('all reviewed migrations apply over captured production column, constraint, index, trigger, grant and RLS contracts',async()=>{
 const count=await db.query("select count(*)::int n from pg_tables where schemaname='public' and tablename like 'gb_%'");expect((count.rows[0] as any).n).toBeGreaterThan(15);
 const controls=await db.query('select paused,execution_enabled,daily_budget_cents from public.gb_control');expect(controls.rows[0]).toEqual({paused:true,execution_enabled:false,daily_budget_cents:0});
});
it('founder moderation changes only visibility, closes reports and appends audit; parent cannot moderate',async()=>{
 await db.exec(`reset role;insert into public.user_reports(reporter_id,reported_id,review_id) values('${other}','${parent}','parent-review');`);
 await expect(as(other,"select public.gb_moderate_legacy_review('parent-review',true)")).rejects.toThrow('Founder required');
 await as(founder,"select public.gb_moderate_legacy_review('parent-review',true)");
 await db.exec('reset role');expect((await db.query("select is_hidden,tip from public.gobela_reviews where id='parent-review'")).rows[0]).toEqual({is_hidden:true,tip:'Original parent words'});
 expect((await db.query("select status from public.user_reports where review_id='parent-review'")).rows[0]).toEqual({status:'reviewed'});
 expect((await db.query("select count(*)::int n from public.gb_audit where event='legacy_circle_moderated'")).rows[0]).toEqual({n:1});
});
it('founder cannot bypass moderation audit by directly editing another parent review',async()=>{
 await as(founder,"update public.gobela_reviews set tip='Rewritten by founder',is_hidden=false where id='parent-review'");
 await db.exec('reset role');expect((await db.query("select tip,is_hidden from public.gobela_reviews where id='parent-review'")).rows[0]).toEqual({tip:'Original parent words',is_hidden:true});
});
it('existing booking trigger still fills identity and rejects a second trial for the same partner',async()=>{
 await as(parent,"insert into public.trial_bookings(event_id,partner_name,status) values('fixture-programme','Fixture partner','pending')");
 expect((await as(parent,"select profile_id from public.trial_bookings where partner_name='Fixture partner'")).rows[0]).toEqual({profile_id:parent});
 await expect(as(parent,"insert into public.trial_bookings(event_id,partner_name,status) values('another-programme','Fixture partner','completed')")).rejects.toThrow('ONE_TRIAL_PER_PARTNER');
});
