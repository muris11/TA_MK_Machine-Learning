create extension if not exists pgcrypto;

do $$
declare
  admin_email text := 'admin@gmail.com';
  admin_password text := 'admin021105';
  admin_user_id uuid;
begin
  select id
  into admin_user_id
  from auth.users
  where email = admin_email;

  if admin_user_id is null then
    admin_user_id := gen_random_uuid();

    insert into auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    )
    values (
      '00000000-0000-0000-0000-000000000000',
      admin_user_id,
      'authenticated',
      'authenticated',
      admin_email,
      crypt(admin_password, gen_salt('bf')),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{}'::jsonb,
      now(),
      now()
    );
  else
    update auth.users
    set
      encrypted_password = crypt(admin_password, gen_salt('bf')),
      email_confirmed_at = coalesce(email_confirmed_at, now()),
      confirmed_at = coalesce(confirmed_at, now()),
      raw_app_meta_data = '{"provider":"email","providers":["email"]}'::jsonb,
      updated_at = now()
    where id = admin_user_id;
  end if;

  delete from auth.identities
  where provider = 'email'
    and provider_id = admin_user_id::text;

  insert into auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  )
  values (
    gen_random_uuid(),
    admin_user_id,
    admin_user_id::text,
    jsonb_build_object('sub', admin_user_id::text, 'email', admin_email),
    'email',
    now(),
    now(),
    now()
  );

  insert into public.admin_users (user_id, email)
  values (admin_user_id, admin_email)
  on conflict (user_id)
  do update set email = excluded.email;
end $$;
