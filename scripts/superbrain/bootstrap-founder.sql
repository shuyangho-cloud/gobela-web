-- Run only after reviewed migration deployment. Aborts if identity differs.
begin;
do $$
declare founder_id uuid;
begin
 select id into founder_id from auth.users where id='07aeee08-37ac-4c04-8078-18bc1fd776aa' and lower(email)='shuyangho@gmail.com' and email_confirmed_at is not null;
 if founder_id is null then raise exception 'Verified founder identity missing'; end if;
 if exists(select 1 from public.gb_founders where user_id<>founder_id) then raise exception 'Unexpected additional founder; review membership'; end if;
 insert into public.gb_founders(user_id) values(founder_id) on conflict do nothing;
end $$;
commit;
