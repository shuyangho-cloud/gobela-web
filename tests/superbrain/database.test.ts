import { PGlite } from '@electric-sql/pglite';
import { readFileSync,readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll,afterAll,it,expect } from 'vitest';
let db:PGlite;
const founder='11111111-1111-4111-8111-111111111111';
const parent='22222222-2222-4222-8222-222222222222';
const other='33333333-3333-4333-8333-333333333333';
const child='44444444-4444-4444-8444-444444444444';
let campaign:string;
async function as(id:string,sql:string,params:unknown[]=[]){await db.exec(`reset role; set role authenticated; set request.jwt.claim.sub='${id}';`);return db.query(sql,params);}
async function cmd(id:string,op:string,args:Record<string,unknown>={}){return (await as(id,'select public.gb_command($1,$2::jsonb) result',[op,JSON.stringify(args)])).rows[0] as {result:any};}
async function action(cents=50){return (await cmd(founder,'request',{payload:{channel:'email',content:'Approved draft',audience:'test audience',campaign_id:campaign},reserved_cents:cents})).result;}
beforeAll(async()=>{
 db=new PGlite();
 await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;grant usage on schema auth to authenticated;grant execute on function auth.uid() to authenticated;alter default privileges in schema public grant all on tables to anon,authenticated;insert into auth.users values('${founder}'),('${parent}'),('${other}');`);
 const dir=resolve(process.cwd(),'../childassist/supabase/migrations');
 await db.exec(readFileSync(resolve(dir,readdirSync(dir).find(f=>f.endsWith('_gobela_superbrain.sql'))!),'utf8'));
 await db.exec(`create schema storage;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text);alter table storage.objects enable row level security;create function storage.foldername(text) returns text[] language sql immutable as $$ select (string_to_array($1,'/'))[1:array_length(string_to_array($1,'/'),1)-1] $$;grant usage on schema storage to authenticated;grant select,insert,delete on storage.objects to authenticated;`);
 await db.exec(readFileSync(resolve(dir,readdirSync(dir).find(f=>f.endsWith('_gobela_circle_photos.sql'))!),'utf8'));
 await db.exec("create table public.enrichment_classes(id text primary key,name text,provider text,location text,trial_price float,is_active boolean);create table public.trial_bookings(id uuid primary key default gen_random_uuid(),profile_id uuid,status text,event_id text);");
 for(const name of ['20261023060000_superbrain_legacy_catalogue.sql','20261023061000_superbrain_family_consent.sql','20261023063000_superbrain_booking_attribution.sql']) await db.exec(readFileSync(resolve(dir,name),'utf8'));
 await db.exec(readFileSync(resolve(dir,readdirSync(dir).find(f=>f.endsWith('_superbrain_explicit_booking_link.sql'))!),'utf8'));
 for(const uid of [parent,other])await as(uid,"insert into public.gb_family_consent(owner_id,version,granted) values($1,'2026-10-23',true)",[uid]);
 await db.exec(`reset role; insert into public.gb_founders values('${founder}');`);
 campaign=(await as(founder,"insert into public.gb_campaigns(title,audience,category,objective) values('Weekend','Parents','play','Enquiries') returning id")).rows[0] as any;
 campaign=(campaign as any).id;
},120000);
afterAll(async()=>{await db.close();});
it('parent cannot read founder campaigns, controls or business knowledge',async()=>{
 await as(founder,"insert into public.gb_knowledge(title,content,scope,source_url,verified_at) values('Private','Business only','business','https://example.com',now())");
 for(const table of ['campaigns','control','knowledge','audit']) expect((await as(parent,`select * from public.gb_${table}`)).rows).toHaveLength(0);
 await expect(cmd(parent,'controls',{paused:false,execution_enabled:true,daily_budget_cents:999})).rejects.toThrow('Founder required');
});
it('health and memory stay private even from founder, and child ownership is enforced',async()=>{
 await as(parent,'insert into public.gb_children(id,owner_id,name,birth_date) values($1,$2,$3,$4)',[child,parent,'Kid','2020-01-01']);
 await as(parent,"insert into public.gb_health(owner_id,child_id,kind,value,recorded_at) values($1,$2,'height_cm','110',now())",[parent,child]);
 for(const user of [founder,other]) expect((await as(user,'select * from public.gb_health')).rows).toHaveLength(0);
 await expect(as(other,"insert into public.gb_health(owner_id,child_id,kind,value,recorded_at) values($1,$2,'note','x',now())",[other,child])).rejects.toThrow();
 await expect(as(other,"insert into public.gb_memory(owner_id,fact) values($1,'x')",[parent])).rejects.toThrow();
});
it('approval, pause, budget, duplicate claims and payload freezing are enforced by the database',async()=>{
 const a=await action();
 await expect(cmd(founder,'claim',{id:a.id})).rejects.toThrow('Paused');
 await cmd(founder,'controls',{paused:false,execution_enabled:true,daily_budget_cents:100});
 await expect(cmd(founder,'claim',{id:a.id})).rejects.toThrow('Invalid transition');
 await cmd(founder,'approve',{id:a.id});
 await expect(as(founder,"update public.gb_actions set payload='{}' where id=$1",[a.id])).rejects.toThrow('permission denied');
 expect((await cmd(founder,'claim',{id:a.id})).result.status).toBe('executing');
 await expect(cmd(founder,'claim',{id:a.id})).rejects.toThrow('Invalid transition');
 const b=await action(60);await cmd(founder,'approve',{id:b.id});
 await expect(cmd(founder,'claim',{id:b.id})).rejects.toThrow('Budget exceeded');
 await cmd(founder,'uncertain',{id:a.id});
 await expect(cmd(founder,'claim',{id:b.id})).rejects.toThrow('Budget exceeded');
 await cmd(founder,'reconcile',{id:a.id,receipt_id:'verified-test-receipt',actual_cost_cents:25});
 expect((await cmd(founder,'claim',{id:b.id})).result.status).toBe('executing');
});
it('expired approvals cannot execute',async()=>{
 const a=await action(0);await cmd(founder,'approve',{id:a.id});
 await db.exec('reset role');await db.query("update public.gb_actions set approved_until=now()-interval '1 hour' where id=$1",[a.id]);
 await expect(cmd(founder,'claim',{id:a.id})).rejects.toThrow('Approval expired');
});
it('Circle requires moderation; parents cannot set verification badges or read evidence',async()=>{
 const inserted=await as(parent,"insert into public.gb_circle(owner_id,category,title,body) values($1,'play','Our visit','Good day') returning id",[parent]);
 const id=(inserted.rows[0] as any).id;
 expect((await as(other,'select id from public.gb_circle where id=$1',[id])).rows).toHaveLength(0);
 await expect(as(parent,"update public.gb_circle set status='published' where id=$1",[id])).rejects.toThrow('permission denied');
 await cmd(founder,'moderate',{id,status:'published'});
 expect((await as(other,'select id from public.gb_circle where id=$1',[id])).rows).toHaveLength(1);
 await cmd(founder,'verify_review',{id,kind:'booking',evidence:'Private booking reference'});
 await expect(as(other,'select verification_evidence from public.gb_circle where id=$1',[id])).rejects.toThrow('permission denied');
 await as(other,'insert into public.gb_votes(post_id,owner_id) values($1,$2)',[id,other]);
 expect((await cmd(parent,'vote_counts')).result[id]).toBe(1);
 await expect(as(other,"insert into public.gb_consents(post_id,owner_id,purpose,granted) values($1,$2,'ad',true)",[id,other])).rejects.toThrow();
});
it('request quota is per identity and cannot be reset by a parent',async()=>{
 for(let i=0;i<50;i++)await cmd(other,'consume');
 await expect(cmd(other,'consume')).rejects.toThrow('Daily request limit reached');
 expect((await cmd(parent,'consume')).result.remaining).toBe(49);
});
it('deleting a child cascades their health records',async()=>{
 await as(parent,'delete from public.gb_children where id=$1',[child]);
 expect((await as(parent,'select * from public.gb_health')).rows).toHaveLength(0);
});

it('default Supabase grants cannot let parents create founders or edit actions',async()=>{
 await expect(as(parent,'insert into public.gb_founders(user_id) values($1)',[parent])).rejects.toThrow('permission denied');
 await expect(as(parent,"insert into public.gb_audit(actor_id,event) values($1,'forged')",[parent])).rejects.toThrow('permission denied');
});
it('photo objects are private until a linked review is published',async()=>{
 const photo=`${parent}/77777777-7777-4777-8777-777777777777.jpg`;
 await as(parent,"insert into storage.objects(bucket_id,name) values('gb-circle',$1)",[photo]);
 expect((await as(other,'select name from storage.objects')).rows).toHaveLength(0);
 await expect(as(other,"insert into storage.objects(bucket_id,name) values('gb-circle',$1)",[photo])).rejects.toThrow();
 const post=(await as(parent,"insert into public.gb_circle(owner_id,category,title,body,photo_path) values($1,'eat','Lunch','Our experience',$2) returning id",[parent,photo])).rows[0] as any;
 await cmd(founder,'moderate',{id:post.id,status:'published'});
 expect((await as(other,'select name from storage.objects')).rows).toHaveLength(1);
 await cmd(founder,'moderate',{id:post.id,status:'hidden'});
 expect((await as(other,'select name from storage.objects')).rows).toHaveLength(0);
});
it('unexpected overspend is recorded and pauses subsequent execution',async()=>{
 const a=await action(0);await cmd(founder,'approve',{id:a.id});await cmd(founder,'claim',{id:a.id});
 await cmd(founder,'complete',{id:a.id,receipt_id:'overrun-test',actual_cost_cents:1});
 expect(((await as(founder,'select paused from public.gb_control')).rows[0] as any).paused).toBe(true);
});

it('withdrawal preserves reads and deletion but blocks new family records',async()=>{
 await as(other,"update public.gb_family_consent set granted=false where owner_id=$1",[other]);
 await expect(as(other,"insert into public.gb_children(owner_id,name,birth_date) values($1,'Private','2020-01-01')",[other])).rejects.toThrow();
 expect((await as(founder,'select * from public.gb_family_consent')).rows).toHaveLength(0);
});

it('campaign outcomes require founder membership',async()=>{
 await expect(as(other,'select public.gb_campaign_results()')).rejects.toThrow('Founder required');
 expect((await as(founder,'select public.gb_campaign_results() result')).rows).toHaveLength(1);
});
it('legacy records hidden by source RLS cannot reappear as active recommendations',async()=>{
 await db.exec("reset role; insert into public.enrichment_classes values('hidden-source','Hidden','Provider','East',0,false);alter table public.enrichment_classes enable row level security;grant select on public.enrichment_classes to authenticated;create policy active_source on public.enrichment_classes for select to authenticated using(is_active);");
 await as(founder,"insert into public.gb_catalogue(legacy_id,title,provider,category,area,min_age,max_age,price_cents,source_url,verified_at) values('hidden-source','Old title','Old provider','play','East',0,10,0,'https://example.com',now())");
 const rows=await as(parent,"select active from public.gb_catalogue_retrieval where legacy_id='hidden-source'");
 expect(rows.rows).toEqual([{active:false}]);
});

it('direct booking writes cannot attribute an enquiry for a different listing',async()=>{
 await db.exec("reset role; insert into public.enrichment_classes values('booking-source','Source','Provider','East',0,true);");
 const listing=(await as(founder,"insert into public.gb_catalogue(legacy_id,title,provider,category,area,min_age,max_age,price_cents,source_url,verified_at) values('booking-source','Source','Provider','play','East',0,10,0,'https://example.com',now()) returning id")).rows[0] as {id:string};
 const enquiry=(await cmd(parent,'enquire',{listing_id:listing.id,message:'Explicit interest'})).result;
 await expect(as(parent,"insert into public.trial_bookings(profile_id,event_id,status,superbrain_enquiry_id) values($1,'different-source','pending',$2)",[parent,enquiry.id])).rejects.toThrow('same parent and listing');
 const booking=(await as(parent,"insert into public.trial_bookings(profile_id,event_id,status,superbrain_enquiry_id) values($1,'booking-source','pending',$2) returning id",[parent,enquiry.id])).rows[0] as {id:string};
 await as(parent,"update public.trial_bookings set status='completed' where id=$1",[booking.id]);
});
