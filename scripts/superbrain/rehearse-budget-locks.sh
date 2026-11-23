#!/bin/sh
# Run ONLY inside the isolated, no-network GoBela rehearsal container.
set -eu
query() { psql -X -U postgres -v ON_ERROR_STOP=1 -At -c "$1"; }
cleanup() {
  query "update public.gb_control set paused=true,execution_enabled=false,daily_budget_cents=0;update gb_private.budget_policy set enabled=false;" >/dev/null
}
trap cleanup EXIT
query 'select version();'
query 'truncate gb_private.budget_reservations;update public.gb_control set paused=false,execution_enabled=true;update gb_private.budget_policy set enabled=true,halted=false;' >/dev/null
query "set application_name='gobela-budget-a';begin;select gb_budget_reserve('00000000-0000-4000-8000-000000000001','ai',600);select pg_sleep(12);commit;" >/tmp/gobela-budget-a.log 2>&1 &
a=$!
i=0
while [ "$(query "select count(*) from pg_stat_activity where application_name='gobela-budget-a' and wait_event='PgSleep';")" != 1 ]; do
 i=$((i+1)); [ "$i" -lt 16 ] || exit 1; sleep 0.25
done
query "set application_name='gobela-budget-b';select gb_budget_reserve('00000000-0000-4000-8000-000000000002','ai',600);" >/tmp/gobela-budget-b.log 2>&1 &
b=$!
i=0
while [ "$(query "select count(*) from pg_stat_activity where application_name='gobela-budget-b' and wait_event_type='Lock' and cardinality(pg_blocking_pids(pid))>0;")" != 1 ]; do
 i=$((i+1)); [ "$i" -lt 16 ] || exit 1; sleep 0.25
done
printf '%s\n' 'PASS observed second connection waiting on a real PostgreSQL lock held by the first reservation'
wait "$a"
if wait "$b"; then printf '%s\n' 'FAIL competing reservation unexpectedly succeeded'; exit 1; fi
grep -q 'Weekly budget exceeded' /tmp/gobela-budget-b.log
[ "$(query 'select count(*) from gb_private.budget_reservations;')" = 1 ]
printf '%s\n' 'PASS competing600cent reservations: one success, one budget rejection, exactly one persisted hold'
query "select gb_budget_note_receipt('00000000-0000-4000-8000-000000000001','gateway:gen_rehearsal');select gb_budget_settle('00000000-0000-4000-8000-000000000001',700,'gateway:gen_rehearsal');"
[ "$(query 'select halted from gb_private.budget_policy;')" = t ]
printf '%s\n' 'PASS persisted billing identifier, actual overrun and paid-execution halt; no provider requests'
