"""Emit a review-only transaction for pending migrations16/17. Never connects."""
import hashlib,json,re,sys
from pathlib import Path
if len(sys.argv)!=3:
 raise SystemExit('Usage: prepare-closeout-release.py <isolated-childassist> <output.sql>')
web=Path(__file__).resolve().parents[2];db=Path(sys.argv[1]).resolve()
manifest=json.loads((web/'docs/superbrain/closeout/pending-migrations-2026-10-27.json').read_text())
def lit(value):return "'"+value.replace("'","''")+"'"
parts=["-- REVIEW ONLY. Target project mcyvyqieygpbtcheouzr. Does not deploy web, functions, media or flags.","begin;set local search_path=public;set local lock_timeout='2s';set local statement_timeout='30s';",'''do $guard$begin
 if not pg_try_advisory_xact_lock(hashtext('gobela-superbrain-closeout-2026-10-27')) then raise exception 'Another closeout is running';end if;
 if not exists(select 1 from auth.users u join public.gb_founders f on f.user_id=u.id where u.id='07aeee08-37ac-4c04-8078-18bc1fd776aa' and lower(u.email)='shuyangho@gmail.com' and u.email_confirmed_at is not null) or (select count(*) from public.gb_founders)<>1 then raise exception 'Verified sole founder must be preserved';end if;
 if not exists(select 1 from public.gb_control where id and paused and not execution_enabled and daily_budget_cents=0) then raise exception 'Keep release paused, disabled and zero-budget';end if;
 if (select max(version) from supabase_migrations.schema_migrations) is distinct from '20261026161203' then raise exception 'Unexpected migration head; re-review source history';end if;
 if exists(select 1 from public.gb_actions where status in ('executing','uncertain')) then raise exception 'Resolve existing in-flight/uncertain actions before rollout';end if;
 if to_regclass('public.gb_circle_meta') is not null or to_regclass('public.gb_instagram_jobs') is not null then raise exception 'Pending closeout is already or partially installed';end if;
 if exists(select 1 from public.gb_circle) or exists(select 1 from storage.objects where bucket_id='gb-circle') then raise exception 'Preview/orphaned Circle data needs a reviewed reconciliation plan';end if;
 if to_regprocedure('storage.allow_only_operation(text)') is null or to_regprocedure('storage.allow_any_operation(text[])') is null then raise exception 'Required native Storage operation helpers missing';end if;
end$guard$;''']
for item in manifest['migrations']:
 source=(db/item['path']).read_text()
 if hashlib.sha256(source.encode()).hexdigest()!=item['sha256']:
  raise SystemExit('Reviewed migration checksum changed: '+item['path'])
 # Unwrap only the outer transaction; function-body BEGIN/END remains untouched.
 sql=re.sub(r'\Abegin;\s*','',source,flags=re.I)
 sql=re.sub(r'\s*commit;\s*\Z','',sql,flags=re.I)
 if sql==source:raise SystemExit('Expected explicit migration transaction: '+item['path'])
 parts.extend(['-- '+item['path'],sql,'insert into supabase_migrations.schema_migrations(version,name,statements) values('+lit(item['version'])+','+lit(item['name'])+',array['+lit(source)+']);'])
parts+=['''do $guard$begin
 if (select count(*) from public.gb_circle_meta)<>(select count(*) from public.gobela_reviews) then raise exception 'Canonical mapping coverage mismatch';end if;
 if exists(select 1 from public.gb_instagram_jobs) then raise exception 'Release must not create a publisher job';end if;
 if not exists(select 1 from public.gb_control where id and paused and not execution_enabled and daily_budget_cents=0) then raise exception 'Release must remain paused, disabled and zero-budget';end if;
 if (select count(*) from public.gb_founders)<>1 then raise exception 'Founder membership changed';end if;
end$guard$;''','commit;']
Path(sys.argv[2]).write_text('\n\n'.join(parts)+'\n')
print('Prepared one guarded review transaction for migrations16/17; nothing executed.')
