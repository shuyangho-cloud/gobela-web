import {it,expect,afterEach} from 'vitest';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,mkdirSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';import {join,dirname,resolve} from 'node:path';
const temporary:string[]=[];afterEach(()=>{for(const p of temporary.splice(0))rmSync(p,{recursive:true,force:true});});
function fixture(){const root=mkdtempSync(join(tmpdir(),'gobela-release-'));temporary.push(root);const manifest=JSON.parse(readFileSync('docs/superbrain/deployment-migrations.json','utf8'));for(const m of manifest.migrations){const target=join(root,m.path);mkdirSync(dirname(target),{recursive:true});writeFileSync(target,readFileSync(resolve('../childassist',m.path)));}return {root,manifest};}
it('prepares a guarded atomic release with bounded lock waits and all migration-history records',()=>{
 const {root}=fixture();const out=join(root,'review.sql');execFileSync('python3',['scripts/superbrain/prepare-reviewed-release.py',root,out]);const sql=readFileSync(out,'utf8');
 expect(sql).toContain("set local lock_timeout='2s'");expect(sql).toContain("set local statement_timeout='30s'");expect(sql).toContain('Verified founder missing or banned');expect(sql).toContain('Integration already present or partially applied');expect(sql).toContain('Unexpected additional founder');expect(sql.match(/insert into supabase_migrations.schema_migrations/g)).toHaveLength(12);expect(sql.trim().endsWith('commit;')).toBe(true);
});
it('refuses changed migration SQL instead of generating a deployable release',()=>{
 const {root,manifest}=fixture();writeFileSync(join(root,manifest.migrations[0].path),'select 1;');expect(()=>execFileSync('python3',['scripts/superbrain/prepare-reviewed-release.py',root,join(root,'review.sql')],{stdio:'pipe'})).toThrow();
});
