-- REVIEW ONLY. No deployment authorization. Exact GoBela project must be verified externally.
begin;
set local lock_timeout='2s';
set local statement_timeout='30s';
lock table public.gb_founders in share mode;
select id from public.gb_control where id for update;
select id from gb_private.budget_policy where id for update;
lock table supabase_migrations.schema_migrations in share row exclusive mode;
do $$ begin
 if current_user<>'postgres' then raise exception 'Application owner postgres required';end if;
 if (select count(*) from public.gb_founders)<>1 or not exists(select 1 from public.gb_founders where user_id='07aeee08-37ac-4c04-8078-18bc1fd776aa') then raise exception 'Sole founder differs';end if;
 if not exists(select 1 from public.gb_control where id and paused and not execution_enabled and daily_budget_cents=0) or not exists(select 1 from gb_private.budget_policy where id and not enabled and not halted) then raise exception 'Expected disabled controls';end if;
 if (select count(*) from supabase_migrations.schema_migrations where version in ('20261123012648','20261123025456','20261123052714'))<>3 then raise exception 'Budget foundation history required';end if;
 if to_regprocedure('public.gb_budget_pending_ai()') is not null or exists(select 1 from supabase_migrations.schema_migrations where version='20261126052124') then raise exception 'Already present; inspect before replay';end if;
end $$;
-- Read only billing identifiers and original quotes. No prompts, new permits or activation.
create function gb_private.budget_pending_ai() returns jsonb
language sql stable security definer set search_path='' as $$
 select jsonb_build_object(
  'rows',coalesce((select jsonb_agg(to_jsonb(r)) from (
   select id,pending_receipt,created_at,cost_contract from gb_private.budget_reservations
   where category='ai' and actual_cents is null and pending_receipt is not null and cost_contract is not null
   order by created_at,id limit 2
  ) r),'[]'::jsonb),
  'pending',(select count(*) from gb_private.budget_reservations where category='ai' and actual_cents is null),
  'manual_review',(select count(*) from gb_private.budget_reservations
   where category='ai' and actual_cents is null and (pending_receipt is null or cost_contract is null))
 );
$$;
revoke all on function gb_private.budget_pending_ai() from public,anon,authenticated;
grant execute on function gb_private.budget_pending_ai() to service_role;
create function public.gb_budget_pending_ai() returns jsonb
language sql stable security invoker set search_path='' as $$ select gb_private.budget_pending_ai(); $$;
revoke all on function public.gb_budget_pending_ai() from public,anon,authenticated;
grant execute on function public.gb_budget_pending_ai() to service_role;

insert into supabase_migrations.schema_migrations(version,name,statements) values('20261126052124','superbrain_ai_billing_reconciliation',array['-- Read only billing identifiers and original quotes. No prompts, new permits or activation.
create function gb_private.budget_pending_ai() returns jsonb
language sql stable security definer set search_path='''' as $$
 select jsonb_build_object(
  ''rows'',coalesce((select jsonb_agg(to_jsonb(r)) from (
   select id,pending_receipt,created_at,cost_contract from gb_private.budget_reservations
   where category=''ai'' and actual_cents is null and pending_receipt is not null and cost_contract is not null
   order by created_at,id limit 2
  ) r),''[]''::jsonb),
  ''pending'',(select count(*) from gb_private.budget_reservations where category=''ai'' and actual_cents is null),
  ''manual_review'',(select count(*) from gb_private.budget_reservations
   where category=''ai'' and actual_cents is null and (pending_receipt is null or cost_contract is null))
 );
$$;
revoke all on function gb_private.budget_pending_ai() from public,anon,authenticated;
grant execute on function gb_private.budget_pending_ai() to service_role;
create function public.gb_budget_pending_ai() returns jsonb
language sql stable security invoker set search_path='''' as $$ select gb_private.budget_pending_ai(); $$;
revoke all on function public.gb_budget_pending_ai() from public,anon,authenticated;
grant execute on function public.gb_budget_pending_ai() to service_role;
']);
commit;
