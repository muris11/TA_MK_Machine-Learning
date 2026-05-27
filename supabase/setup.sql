create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_csv_uploads (
  id uuid primary key default gen_random_uuid(),
  uploaded_by uuid not null references auth.users(id) on delete cascade,
  original_name text not null,
  stored_name text not null,
  size bigint not null check (size > 0 and size <= 5242880),
  columns text[] not null,
  row_count integer not null check (row_count >= 0),
  preview_rows jsonb not null default '[]'::jsonb,
  uploaded_at timestamptz not null default now()
);

create table if not exists public.admin_csv_rows (
  id uuid primary key default gen_random_uuid(),
  upload_id uuid not null references public.admin_csv_uploads(id) on delete cascade,
  row_number integer not null check (row_number > 0),
  wilayah text not null,
  tahun integer not null,
  gini_ratio numeric(10, 2) not null,
  tingkat_penganggur_terbuka numeric(10, 2) not null,
  rata_rata_inflasi_tahunan numeric(10, 2) not null,
  indeks_pembangunan_manusia numeric(10, 2) not null,
  persentase_kemiskinan numeric(10, 2) not null,
  priority_level text not null check (
    priority_level in ('Low Priority', 'Medium Priority', 'High Priority')
  ),
  raw_data jsonb not null,
  created_at timestamptz not null default now(),
  unique (upload_id, row_number)
);

create index if not exists admin_csv_uploads_uploaded_at_idx
  on public.admin_csv_uploads (uploaded_at desc);

create index if not exists admin_csv_rows_upload_id_idx
  on public.admin_csv_rows (upload_id);

alter table public.admin_users enable row level security;
alter table public.admin_csv_uploads enable row level security;
alter table public.admin_csv_rows enable row level security;

drop policy if exists "Admin users can view own profile" on public.admin_users;
create policy "Admin users can view own profile"
  on public.admin_users
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Admins can manage csv uploads" on public.admin_csv_uploads;
create policy "Admins can manage csv uploads"
  on public.admin_csv_uploads
  for all
  to authenticated
  using (exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  ));

drop policy if exists "Admins can manage csv rows" on public.admin_csv_rows;
create policy "Admins can manage csv rows"
  on public.admin_csv_rows
  for all
  to authenticated
  using (exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  ));

insert into public.admin_users (user_id, email)
select id, email
from auth.users
where email = 'admin@gmail.com'
on conflict (user_id)
do update set email = excluded.email;
