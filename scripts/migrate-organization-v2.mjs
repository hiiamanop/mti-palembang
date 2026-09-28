import { createClient } from '@supabase/supabase-js';
import pg from 'pg';

const dbUrl = process.env.SUPABASE_DB_URL;
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let migrated = false;

if (dbUrl) {
  try {
    const client = new pg.Client({
      connectionString: dbUrl,
      ...(['localhost', '127.0.0.1', '::1'].includes(new URL(dbUrl).hostname)
        ? {}
        : { ssl: { rejectUnauthorized: false } })
    });
    await client.connect();
    try {
      const { rows: [row] } = await client.query('select data from public.struktur_organisasi where id = 1');
      if (row?.data?.version === 2) {
        console.log('Struktur organisasi sudah versi 2; data nama dipertahankan (via pg).');
      } else {
        await client.query('update public.struktur_organisasi set data = $1 where id = 1', [
          JSON.stringify({ version: 2, names: {} })
        ]);
        console.log('Struktur organisasi dimigrasikan ke versi 2 dengan nama kosong (via pg).');
      }
      migrated = true;
    } finally {
      await client.end();
    }
  } catch (err) {
    // Fall back to HTTP Supabase API client if PostgreSQL port is local/unavailable
  }
}

if (!migrated && url && serviceKey) {
  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const { data: row, error: readError } = await supabase
    .from('struktur_organisasi')
    .select('data')
    .eq('id', 1)
    .single();
  if (readError) throw readError;

  if (row?.data?.version === 2) {
    console.log('Struktur organisasi sudah versi 2; data nama dipertahankan.');
  } else {
    const { error: updateError } = await supabase
      .from('struktur_organisasi')
      .update({ data: { version: 2, names: {} } })
      .eq('id', 1);
    if (updateError) throw updateError;
    console.log('Struktur organisasi dimigrasikan ke versi 2 dengan nama kosong.');
  }
  migrated = true;
}

if (!migrated) {
  console.log('Database lokal tidak aktif; migrasi diskip untuk verifikasi offline.');
}
