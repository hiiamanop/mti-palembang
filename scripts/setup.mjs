// ============================================================
//  MTI CMS — Setup otomatis Supabase (sekali jalan)
//
//  Menjalankan SEMUA langkah backend dalam satu perintah:
//    1. Bikin tabel + RLS + policy  (supabase/schema.sql)
//    2. Bikin bucket "media" + policy storage  (supabase/storage.sql)
//    3. Bikin akun admin (ADMIN_EMAIL / ADMIN_PASSWORD)
//    4. Seed data dari 5 file JSON di folder data/
//
//  Jalankan:
//    node --env-file=.env.local scripts/setup.mjs
//
//  Butuh env (di .env.local):
//    SUPABASE_DB_URL              -> Settings > Database > Connection string (URI)
//    NEXT_PUBLIC_SUPABASE_URL     -> Settings > API > Project URL
//    SUPABASE_SERVICE_ROLE_KEY    -> Settings > API > service_role key (rotated)
//    ADMIN_EMAIL, ADMIN_PASSWORD  -> akun admin untuk /admin/login
// ============================================================

import { createClient } from '@supabase/supabase-js';
import pg from 'pg';
import { readFile } from 'fs/promises';
import path from 'path';

const {
  SUPABASE_DB_URL,
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  ADMIN_EMAIL,
  ADMIN_PASSWORD
} = process.env;

function need(name, val) {
  if (!val) {
    console.error(`✖ Env ${name} belum diisi di .env.local`);
    process.exit(1);
  }
}
need('SUPABASE_DB_URL', SUPABASE_DB_URL);
need('NEXT_PUBLIC_SUPABASE_URL', NEXT_PUBLIC_SUPABASE_URL);
need('SUPABASE_SERVICE_ROLE_KEY', SUPABASE_SERVICE_ROLE_KEY);
need('ADMIN_EMAIL', ADMIN_EMAIL);
need('ADMIN_PASSWORD', ADMIN_PASSWORD);

const ROOT = process.cwd();
const DATA = path.join(ROOT, 'data');
const readJSON = async (f) => JSON.parse(await readFile(path.join(DATA, f), 'utf-8'));
const readSQL = (f) => readFile(path.join(ROOT, 'supabase', f), 'utf-8');

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// ── 1 & 2: jalankan SQL skema + storage lewat koneksi Postgres ────────────────
async function runSql() {
  const dbHost = new URL(SUPABASE_DB_URL).hostname;
  const client = new pg.Client({
    connectionString: SUPABASE_DB_URL,
    ...(['localhost', '127.0.0.1', '::1'].includes(dbHost)
      ? {}
      : { ssl: { rejectUnauthorized: false } })
  });
  await client.connect();
  try {
    console.log('→ Menjalankan schema.sql (tabel + RLS + policy)...');
    await client.query(await readSQL('schema.sql'));
    console.log('  ✓ schema.sql selesai');

    console.log('→ Menjalankan storage.sql (bucket + policy storage)...');
    await client.query(await readSQL('storage.sql'));
    console.log('  ✓ storage.sql selesai');
  } finally {
    await client.end();
  }
}

// ── 3: bikin akun admin ───────────────────────────────────────────────────────
async function createAdmin() {
  console.log(`→ Membuat akun admin ${ADMIN_EMAIL}...`);
  const { error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true
  });
  if (error) {
    if (/already been registered|already exists/i.test(error.message)) {
      console.log('  ✓ akun admin sudah ada (dilewati)');
    } else {
      throw error;
    }
  } else {
    console.log('  ✓ akun admin dibuat');
  }
}

// ── 4: seed data (hanya isi kalau tabel masih kosong) ─────────────────────────
async function seedList(table, rowsFn, file) {
  const { count, error: countError } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true });
  if (countError) throw countError;
  if (count && count > 0) {
    console.log(`  ✓ ${table}: sudah ada ${count} baris (dilewati)`);
    return;
  }
  const items = await readJSON(file);
  if (items.length === 0) {
    console.log(`  ✓ ${table}: kosong`);
    return;
  }
  const rows = items.map(rowsFn);
  const { error } = await supabase.from(table).insert(rows);
  if (error) throw error;
  console.log(`  ✓ ${table}: ${rows.length} baris di-seed`);
}

async function seedSingleton(table, file) {
  const data = await readJSON(file);
  const { error } = await supabase.from(table).upsert({ id: 1, data });
  if (error) throw error;
  console.log(`  ✓ ${table}: 1 baris (upsert)`);
}

async function seedSingletonIfMissing(table, file) {
  const { count, error: countError } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true });
  if (countError) throw countError;
  if (count && count > 0) {
    console.log(`  ✓ ${table}: sudah ada (dilewati)`);
    return;
  }
  const data = await readJSON(file);
  const { error } = await supabase.from(table).insert({ id: 1, data });
  if (error) throw error;
  console.log(`  ✓ ${table}: singleton dibuat`);
}

async function seed() {
  console.log('→ Seed data dari folder data/...');
  await seedList('berita', (i) => ({
    slug: i.slug, href: i.href, cat: i.cat, group: i.group, img: i.img,
    title: i.title, date: i.date, detail_date: i.detailDate, author: i.author,
    read_time: i.readTime, excerpt: i.excerpt, content: i.content ?? [],
    highlights: i.highlights ?? [], source_url: i.sourceUrl ?? '',
    published: i.published ?? false
  }), 'berita.json');

  await seedList('kegiatan', (i) => ({
    title: i.title, date: i.date, image: i.image ?? '', summary: i.summary ?? '',
    published: i.published ?? false
  }), 'kegiatan.json');

  await seedList('jurnal', (i) => ({
    title: i.title, edition: i.edition, date: i.date, topic: i.topic,
    description: i.description, cover: i.cover, download_url: i.downloadUrl ?? '#',
    visible: i.visible ?? true
  }), 'jurnal.json');

  await seedList('artikel', (i) => ({
    title: i.title, kategori: i.kategori, daerah: i.daerah, date: i.date,
    ringkasan: i.ringkasan, konten: i.konten ?? [], gambar: i.gambar,
    visible: i.visible ?? false
  }), 'artikel.json');

  await seedSingleton('beranda', 'beranda.json');
  await seedSingleton('media', 'media.json');
  await seedSingletonIfMissing('struktur_organisasi', 'struktur-organisasi.json');
}

async function main() {
  await runSql();
  await createAdmin();
  await seed();
  console.log('\n✔ Setup Supabase selesai. Backend siap.');
}

main().catch((e) => {
  console.error('\n✖ Setup gagal:', e.message || e);
  process.exit(1);
});
