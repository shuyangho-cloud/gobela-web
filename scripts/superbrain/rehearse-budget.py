"""Generate captured-schema rehearsal SQL or test an existing isolated container.
No production credentials or network access. Container must expose no host ports.
"""
import re, sys, subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[2]
if len(sys.argv)==2 and sys.argv[1]=='--fixture':
 import tempfile
 # Reuse the established captured-schema generator, rather than maintaining a second one.
 with tempfile.TemporaryDirectory(prefix='gobela-budget-fixture-') as folder:
  target=Path(folder)/'schema.sql'
  subprocess.run([sys.executable,str(root/'scripts/superbrain/build-contract-rehearsal.py'),str(root.parent/'childassist'),str(target)],check=True,capture_output=True,text=True)
  print('create role anon;create role authenticated;create role service_role bypassrls;')
  print(target.read_text())
 for name in ['20261123012648_superbrain_weekly_budget.sql','20261123025456_superbrain_ai_billing_receipts.sql']:
  print((root.parent/'childassist/supabase/migrations'/name).read_text())
 sys.exit(0)
if len(sys.argv)!=3 or sys.argv[1]!='--container' or not re.fullmatch(r'gobela-weekly-rehearsal-[0-9]+',sys.argv[2]):
 raise SystemExit('Use --fixture or --container gobela-weekly-rehearsal-<date>')
container=sys.argv[2]
# One Docker exec keeps connection coordination inside the isolated container;
# host Docker scheduling delays cannot masquerade as database lock contention.
script=(root/'scripts/superbrain/rehearse-budget-locks.sh').read_text()
result=subprocess.run(['docker','exec','-i',container,'sh'],input=script,text=True,timeout=90)
sys.exit(result.returncode)
