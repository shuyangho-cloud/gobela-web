# Generate reviewable SQL only. Never connects to or deploys a database.
import sys,json,hashlib,re
from pathlib import Path
if len(sys.argv)!=3:raise SystemExit('Usage: prepare-reviewed-release.py <isolated-childassist> <output.sql>')
w=Path(__file__).resolve().parents[2];root=Path(sys.argv[1]).resolve();m=json.loads((w/'docs/superbrain/deployment-migrations.json').read_text())
parts=['-- GoBela mcyvyqieygpbtcheouzr. Requires explicit production deployment instruction.','begin;','set local lock_timeout=\'2s\';set local statement_timeout=\'30s\';',"do $$begin if to_regclass('public.gb_founders') is not null then raise exception 'Integration already present or partially applied: review history';end if;if not exists(select 1 from auth.users where id='07aeee08-37ac-4c04-8078-18bc1fd776aa' and lower(email)='shuyangho@gmail.com' and email_confirmed_at is not null and (banned_until is null or banned_until<=now())) then raise exception 'Verified founder missing or banned';end if;end$$;"]
def unwrap(s):return re.sub(r'^\s*(?:begin|commit);\s*$','',s,flags=re.M|re.I)
for item in m['migrations']:
 p=root/item['path'];data=p.read_bytes()
 if hashlib.sha256(data).hexdigest()!=item['sha256']:raise SystemExit('Changed migration: '+item['path'])
 sql=unwrap(data.decode());version=p.name[:14];name=p.name[15:-4];tag='$gb_'+item['sha256'][:16]+'$'
 if tag in sql:raise SystemExit('Unexpected SQL delimiter collision')
 parts.extend(['-- '+item['path'],sql,"insert into supabase_migrations.schema_migrations(version,name,statements) values ('"+version+"','"+name+"',array["+tag+sql+tag+"]);"])
parts.extend(['-- Guarded founder bootstrap',unwrap((w/'scripts/superbrain/bootstrap-founder.sql').read_text()),"do $$begin if not exists(select 1 from public.gb_control where paused and not execution_enabled and daily_budget_cents=0) then raise exception 'Release must remain paused, disabled and zero-budget';end if;end$$;",'commit;'])
Path(sys.argv[2]).write_text('\n'.join(parts)+'\n');print('Generated one guarded transaction for reviewed migrations plus founder bootstrap; nothing executed.')
