-- Hospitality Portfolio CMS schema
-- Run this in Supabase SQL Editor after creating a new project.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  email text unique not null,
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists public.home_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  professional_title text not null,
  hero_text text,
  profile_image_url text,
  resume_url text,
  qr_code_url text,
  social_links jsonb default '{}'::jsonb,
  achievements jsonb default '[]'::jsonb,
  stats jsonb default '[]'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists public.about_sections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  organization text not null,
  location text,
  start_date date,
  end_date date,
  description text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  degree text not null,
  institution text not null,
  location text,
  year text,
  description text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  percentage int default 0 check (percentage >= 0 and percentage <= 100),
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text,
  issue_date date,
  certificate_url text,
  image_url text,
  description text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.teaching_materials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  course text,
  material_type text,
  document_url text,
  description text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  client_or_context text,
  project_date date,
  image_url text,
  document_url text,
  description text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.consultancy_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  client text,
  consultancy_date date,
  report_url text,
  image_url text,
  description text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  image_url text not null,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  quote text not null,
  image_url text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.contact_info (
  id uuid primary key default gen_random_uuid(),
  phone text,
  email text,
  website_url text,
  office_address text,
  social_links jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Helpful timestamp trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['site_settings','home_profiles','about_sections','experiences','education','skills','certifications','teaching_materials','projects','consultancy_projects','gallery_items','testimonials','contact_info'] loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', t, t);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

-- Public storage buckets. In production, you may make document buckets private and serve signed URLs.
insert into storage.buckets (id, name, public) values
  ('portfolio-assets', 'portfolio-assets', true),
  ('documents', 'documents', true),
  ('certificates', 'certificates', true),
  ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- RLS
alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.home_profiles enable row level security;
alter table public.about_sections enable row level security;
alter table public.experiences enable row level security;
alter table public.education enable row level security;
alter table public.skills enable row level security;
alter table public.certifications enable row level security;
alter table public.teaching_materials enable row level security;
alter table public.projects enable row level security;
alter table public.consultancy_projects enable row level security;
alter table public.gallery_items enable row level security;
alter table public.testimonials enable row level security;
alter table public.contact_info enable row level security;
alter table public.contact_messages enable row level security;

-- Public can read published portfolio content.
do $$
declare t text;
begin
  foreach t in array array['site_settings','home_profiles','about_sections','experiences','education','skills','certifications','teaching_materials','projects','consultancy_projects','gallery_items','testimonials','contact_info'] loop
    execute format('drop policy if exists public_read_%I on public.%I', t, t);
    execute format('create policy public_read_%I on public.%I for select using (true)', t, t);
  end loop;
end $$;

-- Only listed admins can manage CMS content.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.admin_users where auth_user_id = auth.uid());
$$;

do $$
declare t text;
begin
  foreach t in array array['site_settings','home_profiles','about_sections','experiences','education','skills','certifications','teaching_materials','projects','consultancy_projects','gallery_items','testimonials','contact_info','contact_messages'] loop
    execute format('drop policy if exists admin_all_%I on public.%I', t, t);
    execute format('create policy admin_all_%I on public.%I for all using (public.is_admin()) with check (public.is_admin())', t, t);
  end loop;
end $$;

-- Login mapping: public can resolve a username to the auth email through an RPC.
-- Password verification still happens only inside Supabase Auth.
create or replace function public.admin_email_for_username(username_text text)
returns text language sql stable security definer set search_path = public as $$
  select email from public.admin_users where username = username_text limit 1;
$$;
grant execute on function public.admin_email_for_username(text) to anon, authenticated;

-- Contact form: public can submit only.
drop policy if exists public_insert_contact_messages on public.contact_messages;
create policy public_insert_contact_messages on public.contact_messages for insert with check (true);

-- Storage policies.
drop policy if exists public_read_storage on storage.objects;
create policy public_read_storage on storage.objects for select using (bucket_id in ('portfolio-assets','documents','certificates','gallery'));

drop policy if exists admin_upload_storage on storage.objects;
create policy admin_upload_storage on storage.objects for insert with check (public.is_admin() and bucket_id in ('portfolio-assets','documents','certificates','gallery'));

drop policy if exists admin_update_storage on storage.objects;
create policy admin_update_storage on storage.objects for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists admin_delete_storage on storage.objects;
create policy admin_delete_storage on storage.objects for delete using (public.is_admin());
