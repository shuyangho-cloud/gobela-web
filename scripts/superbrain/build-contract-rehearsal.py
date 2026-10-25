# Generate local-only schema rehearsal SQL from reviewed, data-free metadata. Does not connect to any database.
import json,re,sys
from pathlib import Path
if len(sys.argv)!=3:raise SystemExit('Usage: build-contract-rehearsal.py <isolated-childassist> <output.sql>')
w=Path(__file__).resolve().parents[2];d=Path(sys.argv[1]).resolve()
m=json.loads((w/'docs/superbrain/review-data/production-contract-2026-10-25.json').read_text());cols=json.loads((w/'docs/superbrain/review-data/production-columns-2026-10-25.json').read_text())['columns']
def ident(s):return '"'+s.replace('"','""')+'"'
sql=re.search(r'await db.exec\(`(create role anon;.*?)`\);',(w/'tests/superbrain/production-schema.test.ts').read_text(),re.S)[1]
sql=re.sub(r'create role [^;]+;','',sql)
chunks=[sql]
for t in sorted(set(c['table_name'] for c in cols)):
 fields=[ident(c['column_name'])+' '+('text[]' if c['data_type']=='ARRAY' else c['data_type'])+(' default '+c['column_default'] if c['column_default'] else '')+(' not null' if c['is_nullable']=='NO' else '') for c in cols if c['table_name']==t]
 chunks.append('create table public.'+ident(t)+'('+','.join(fields)+');')
chunks.append('create table public.referrals('+','.join(ident(c['column_name'])+' '+c['sql_type']+(' default '+c['default'] if c['default'] else '')+(' not null' if c['not_null'] else '') for c in m['referrals_columns'])+');')
for foreign in [False,True]:
 for c in m['constraints']:
  if c['definition'].startswith('FOREIGN KEY')==foreign:chunks.append('alter table public.'+ident(c['table_name'])+' add constraint '+ident(c['conname'])+' '+c['definition']+';')
names={c['conname'] for c in m['constraints'] if c['definition'].startswith(('PRIMARY KEY','UNIQUE'))}
for index in m['indexes']:
 if re.search(r'INDEX (\S+) ON',index)[1] not in names:chunks.append(index+';')
chunks.append(m['is_admin'])
for t in m['triggers']:chunks.extend([t['function_definition'],t['definition']+';'])
for r in m['rls']:
 if r['enabled']:chunks.append('alter table public.'+ident(r['table_name'])+' enable row level security;')
 if r['forced']:chunks.append('alter table public.'+ident(r['table_name'])+' force row level security;')
for g in m['grants']:chunks.append('grant '+g['privilege_type']+' on public.'+ident(g['table_name'])+' to '+ident(g['grantee'])+';')
for p in m['policies']:chunks.append('create policy '+ident(p['policyname'])+' on public.'+ident(p['tablename'])+' as '+p['permissive']+' for '+p['cmd']+' to '+','.join(map(ident,p['roles']))+(' using ('+p['qual']+')' if p['qual'] else '')+(' with check ('+p['with_check']+')' if p['with_check'] else '')+';')
for entry in json.loads((w/'docs/superbrain/deployment-migrations.json').read_text())['migrations']:chunks.extend(['-- REHEARSE '+entry['path'],(d/entry['path']).read_text()])
Path(sys.argv[2]).write_text('\n;\n'.join(chunks)+'\n;\n')
print('Generated customer-data-free captured-contract rehearsal SQL.')
