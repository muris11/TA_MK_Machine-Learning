delete from public.admin_users
where email = 'admin@gmail.com';

delete from auth.identities
where user_id in (
  select id
  from auth.users
  where email = 'admin@gmail.com'
);

delete from auth.users
where email = 'admin@gmail.com';
