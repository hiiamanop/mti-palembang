-- ============================================================
--  MTI CMS — Skema tabel + RLS
--  Jalankan di Supabase Dashboard > SQL Editor > Run
-- ============================================================

-- ============ TABEL LIST ============

create table if not exists public.berita (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  href text,
  cat text,
  "group" text,
  img text,
  title text not null,
  date text,
  detail_date text,
  author text,
  read_time text,
  excerpt text,
  content jsonb default '[]'::jsonb,
  highlights jsonb default '[]'::jsonb,
  source_url text default '',
  published boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.jurnal (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  edition text,
  date text,
  topic text,
  description text,
  cover text,
  download_url text default '#',
  visible boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.artikel (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  kategori text,
  daerah text,
  date text,
  ringkasan text,
  konten jsonb default '[]'::jsonb,
  gambar text,
  visible boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.kegiatan (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  image text,
  summary text,
  published boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.crm_contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  institution text not null,
  status text not null default 'baru'
    check (status in ('baru', 'sudah_dihubungi', 'selesai')),
  ip_hash text,
  internal_email_status text not null default 'pending'
    check (internal_email_status in ('pending', 'terkirim', 'gagal')),
  confirmation_email_status text not null default 'pending'
    check (confirmation_email_status in ('pending', 'terkirim', 'gagal')),
  email_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists crm_contacts_email_created_idx
  on public.crm_contacts (email, created_at desc);
create index if not exists crm_contacts_ip_hash_created_idx
  on public.crm_contacts (ip_hash, created_at desc);
create index if not exists crm_contacts_status_created_idx
  on public.crm_contacts (status, created_at desc);

-- ============ TABEL SINGLETON (JSONB) ============

create table if not exists public.beranda (
  id int primary key default 1,
  data jsonb not null,
  constraint beranda_singleton check (id = 1)
);

create table if not exists public.media (
  id int primary key default 1,
  data jsonb not null,
  constraint media_singleton check (id = 1)
);

create table if not exists public.struktur_organisasi (
  id int primary key default 1,
  data jsonb not null,
  constraint struktur_organisasi_singleton check (id = 1)
);

-- ============ AKTIFKAN RLS ============

alter table public.berita enable row level security;
alter table public.jurnal enable row level security;
alter table public.artikel enable row level security;
alter table public.kegiatan enable row level security;
alter table public.beranda enable row level security;
alter table public.media enable row level security;
alter table public.struktur_organisasi enable row level security;
alter table public.crm_contacts enable row level security;

-- ============ POLICY: SELECT PUBLIK (hanya konten tayang) ============

drop policy if exists "berita public read" on public.berita;
create policy "berita public read" on public.berita
  for select using (published = true);
drop policy if exists "jurnal public read" on public.jurnal;
create policy "jurnal public read" on public.jurnal
  for select using (visible = true);
drop policy if exists "artikel public read" on public.artikel;
create policy "artikel public read" on public.artikel
  for select using (visible = true);
drop policy if exists "kegiatan public read" on public.kegiatan;
create policy "kegiatan public read" on public.kegiatan
  for select using (published = true);
drop policy if exists "beranda public read" on public.beranda;
create policy "beranda public read" on public.beranda
  for select using (true);
drop policy if exists "media public read" on public.media;
create policy "media public read" on public.media
  for select using (true);
drop policy if exists "struktur organisasi public read" on public.struktur_organisasi;
create policy "struktur organisasi public read" on public.struktur_organisasi
  for select using (true);

-- ============ POLICY: ADMIN (terautentikasi) AKSES PENUH ============

drop policy if exists "berita admin all" on public.berita;
create policy "berita admin all" on public.berita
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
drop policy if exists "jurnal admin all" on public.jurnal;
create policy "jurnal admin all" on public.jurnal
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
drop policy if exists "artikel admin all" on public.artikel;
create policy "artikel admin all" on public.artikel
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
drop policy if exists "kegiatan admin all" on public.kegiatan;
create policy "kegiatan admin all" on public.kegiatan
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
drop policy if exists "beranda admin all" on public.beranda;
create policy "beranda admin all" on public.beranda
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
drop policy if exists "media admin all" on public.media;
create policy "media admin all" on public.media
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
drop policy if exists "struktur organisasi admin all" on public.struktur_organisasi;
create policy "struktur organisasi admin all" on public.struktur_organisasi
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
drop policy if exists "crm contacts admin all" on public.crm_contacts;
create policy "crm contacts admin all" on public.crm_contacts
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
