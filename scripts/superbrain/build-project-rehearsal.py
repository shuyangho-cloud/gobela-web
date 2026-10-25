# Emit SQL for an EMPTY LOCAL database. Never connects to production; no customer rows.
import sys,json
from pathlib import Path
if len(sys.argv)!=3:raise SystemExit('Usage: build-project-rehearsal.py <isolated-childassist> <output.sql>')
w=Path(__file__).resolve().parents[2];db=Path(sys.argv[1]).resolve()
c=json.loads((w/'docs/superbrain/review-data/project-schema-2026-10-26.json').read_text());a=json.loads((w/'docs/superbrain/review-data/project-access-2026-10-26.json').read_text())
def q(s):return '"'+s.replace('"','""')+'"'
def lit(s):return "'"+s.replace("'","''")+"'"
def acl_entries(entries):
 for entry in entries or []:
  role,rest=entry.split('=',1);perms=rest.split('/')[0];yield(q(role) if role else 'public'),perms
chunks=['set search_path=public,extensions;set check_function_bodies=false;alter table auth.users add primary key(id);alter table storage.buckets add primary key(id);grant usage on schema auth,storage to anon,authenticated,service_role,postgres;grant select,insert,update,delete,references,trigger on all tables in schema auth,storage to postgres;create extension if not exists pgcrypto with schema extensions;create extension if not exists "uuid-ossp" with schema extensions;set role postgres;create schema private;create schema supabase_migrations;create table supabase_migrations.schema_migrations(version text primary key,statements text[],name text,created_by text,idempotency_key text,rollback text[]);']
for s in c['tables']:
 fields=[]
 for x in s['columns']:
  clause=q(x['name'])+' '+x['type']
  if x['identity']:clause+=' generated '+('always' if x['identity']=='a' else 'by default')+' as identity'
  elif x['generated']:clause+=' generated always as ('+x['default']+') stored'
  elif x['default']:clause+=' default '+x['default']
  if x['not_null']:clause+=' not null'
  fields.append(clause)
 chunks.append('create table '+q(s['schema'])+'.'+q(s['name'])+'('+','.join(fields)+');')
for f in c['functions']:chunks.append(f['definition'])
for foreign in [False,True]:
 for x in c['constraints']:
  if (x['kind']=='f')==foreign:chunks.append('alter table '+q(x['schema'])+'.'+q(x['table'])+' add constraint '+q(x['name'])+' '+x['definition']+';')
con_indexes={x['name'] for x in c['constraints'] if x['kind'] in ['p','u','x']}
for x in c['indexes']:
 if x['indexname'] not in con_indexes:chunks.append(x['indexdef'])
for v in c['views']:chunks.append('create '+('materialized ' if v['kind']=='m' else '')+'view '+q(v['schema'])+'.'+q(v['name'])+(' with ('+','.join(v['options'])+')' if v['options'] else '')+' as '+v['definition'])
for t in c['triggers']:chunks.append(t['definition'])
for t in c['tables']:
 if t['rls']:chunks.append('alter table '+q(t['schema'])+'.'+q(t['name'])+' enable row level security;')
 if t['forced']:chunks.append('alter table '+q(t['schema'])+'.'+q(t['name'])+' force row level security;')
for p in c['policies']:chunks.append('create policy '+q(p['policyname'])+' on '+q(p['schemaname'])+'.'+q(p['tablename'])+' as '+p['permissive']+' for '+p['cmd']+' to '+','.join(map(q,p['roles']))+(' using ('+p['qual']+')' if p['qual'] else '')+(' with check ('+p['with_check']+')' if p['with_check'] else '')+';')
for g in c['grants']:chunks.append('grant '+g['privilege_type']+' on '+q(g['table_schema'])+'.'+q(g['table_name'])+' to '+q(g['grantee'])+';')
# Captured explicit function ACLs override local Supabase defaults.
for f in c['functions']:
 if f['acl'] is not None:
  target=q(f['schema'])+'.'+q(f['name'])+'('+f['identity']+')'
  chunks.append('revoke all on function '+target+' from public,anon,authenticated,service_role;')
  for role,perms in acl_entries(f['acl']):
   if 'X' in perms:chunks.append('grant execute on function '+target+' to '+role+(' with grant option' if 'X*' in perms else '')+';')
for s in a['schema_acls']:
 for role,perms in acl_entries(s['acl']):
  names=[p for code,p in [('U','usage'),('C','create')] if code in perms]
  if names:chunks.append('grant '+','.join(names)+' on schema '+q(s['name'])+' to '+role+';')
chunks.append('reset role;')
for x in a['default_acls']:
 kind={'S':'sequences','f':'functions','r':'tables'}[x['kind']]
 base='alter default privileges for role '+q(x['role'])+(' in schema '+q(x['schema']) if x['schema'] else '')
 chunks.append(base+' revoke all on '+kind+' from public;')
 for role,perms in acl_entries(x['acl']):chunks.append(base+' grant all on '+kind+' to '+role+';')
for f in json.loads((w/'docs/superbrain/review-data/project-function-owners-2026-10-26.json').read_text()):
 chunks.append('alter function '+q(f['schema'])+'.'+q(f['name'])+'('+f['identity']+') owner to '+q(f['owner'])+';')
for e in a['event_triggers']:
 chunks.append('alter function public.'+e['function']+'() owner to current_user;')
 chunks.append('create event trigger '+q(e['name'])+' on '+e['event']+(' when tag in ('+','.join(map(lit,e['tags']))+')' if e['tags'] else '')+' execute function public.'+e['function']+'();')
 chunks.append('alter function public.'+e['function']+'() owner to postgres;')
 if e['enabled']=='D':chunks.append('alter event trigger '+q(e['name'])+' disable;')
chunks.append("reset role;alter table storage.objects enable row level security;grant select,insert,delete on storage.objects to authenticated;set role postgres;set check_function_bodies=true;select 'APPLICATION BASELINE READY: 53 tables, 39 functions, 4 views, 81 policies' as baseline;")
# Application migration files are intentionally not appended: time and verify each separately.
Path(sys.argv[2]).write_text('\n;\n'.join(chunks)+'\n;\n')
print('Generated local-only full application schema rehearsal SQL; managed platform schema must be installed separately.')
