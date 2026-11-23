"""Generate only; never connects to a database. Reviewed owner execution required."""
import argparse,hashlib,json,uuid
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('childassist');p.add_argument('output');p.add_argument('--founder-id',required=True);a=p.parse_args()
founder=str(uuid.UUID(a.founder_id));root=Path(__file__).resolve().parents[2];db=Path(a.childassist).resolve()
manifest=json.loads((root/'docs/superbrain/budget/release-migrations.json').read_text())
files=[]
for m in manifest['migrations']:
 source=(db/m['path']).read_text()
 if hashlib.sha256(source.encode()).hexdigest()!=m['sha256']:raise SystemExit('Migration hash differs: '+m['path'])
 files.append((m,source))
versions=','.join("'"+m['version']+"'" for m,_ in files)
prologue=f'''-- GENERATED REVIEW ONLY; not a deployment authorization. Never use against an unreviewed project.
\\set ON_ERROR_STOP on
begin;
set local lock_timeout='2s';
set local statement_timeout='30s';
lock table public.gb_founders in share mode;
do $$ begin
 if current_user<>'postgres' then raise exception 'Application owner postgres required';end if;
 if (select count(*) from public.gb_founders)<>1 or not exists(select 1 from public.gb_founders where user_id='{founder}'::uuid) then raise exception 'Sole founder differs';end if;
 if to_regclass('gb_private.budget_policy') is not null then raise exception 'Budget schema already present; inspect history';end if;
 if exists(select 1 from supabase_migrations.schema_migrations where version in ({versions})) then raise exception 'Budget migration already registered';end if;
end $$;
select id from public.gb_control where id for update;
do $$ begin
 if not exists(select 1 from public.gb_control where id and paused and not execution_enabled and daily_budget_cents=0) then raise exception 'Expected disabled controls';end if;
end $$;
lock table public.gb_actions in share row exclusive mode;
lock table supabase_migrations.schema_migrations in share row exclusive mode;
'''
chunks=[prologue]
for m,source in files:
 # Reviewed files contain no transaction delimiters; preserve exact migration bodies.
 if any(line.strip().lower() in ('begin;','commit;') for line in source.splitlines()):raise SystemExit('Unexpected transaction delimiter')
 chunks.append(source)
 lit=lambda s:"'"+s.replace("'","''")+"'"
 chunks.append('insert into supabase_migrations.schema_migrations(version,name,statements) values('+lit(m['version'])+','+lit(Path(m['path']).stem.split('_',1)[1])+',array['+lit(source)+']);')
chunks.append("""do $$ begin
 if (select count(*) from public.gb_founders)<>1 or not exists(select 1 from public.gb_control where id and paused and not execution_enabled and daily_budget_cents=0) or not exists(select 1 from gb_private.budget_policy where id and not enabled and not halted) then raise exception 'Postflight controls differ';end if;
end $$;
commit;
""")
Path(a.output).write_text('\n'.join(chunks));print('Generated owner/founder guarded atomic budget review SQL; no database contacted.')
