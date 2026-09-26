import { createClient } from './supabase/server';

function rowToBerita(r) {
  return {
    id: r.id,
    slug: r.slug,
    href: r.href,
    cat: r.cat,
    group: r.group,
    img: r.img,
    title: r.title,
    date: r.date,
    detailDate: r.detail_date,
    author: r.author,
    readTime: r.read_time,
    excerpt: r.excerpt,
    content: r.content ?? [],
    highlights: r.highlights ?? [],
    sourceUrl: r.source_url ?? '',
    published: r.published
  };
}

function rowToKegiatan(row) {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    image: row.image ?? '',
    summary: row.summary ?? '',
    published: row.published
  };
}

function rowToJurnal(r) {
  return {
    id: r.id,
    title: r.title,
    edition: r.edition,
    date: r.date,
    topic: r.topic,
    description: r.description,
    cover: r.cover,
    downloadUrl: r.download_url,
    visible: r.visible
  };
}

function rowToArtikel(r) {
  return {
    id: r.id,
    title: r.title,
    kategori: r.kategori,
    daerah: r.daerah,
    date: r.date,
    ringkasan: r.ringkasan,
    konten: r.konten ?? [],
    gambar: r.gambar,
    visible: r.visible
  };
}

export async function getBerita() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('berita')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToBerita);
}

export async function getKegiatan() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('kegiatan')
    .select('*')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToKegiatan);
}

export async function getBeranda() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('beranda')
    .select('data')
    .eq('id', 1)
    .single();
  if (error) throw error;
  return data.data;
}

export async function getKegiatanHero() {
  const beranda = await getBeranda();
  return beranda.kegiatanHero ?? {};
}

export async function getStrukturOrganisasi() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('struktur_organisasi')
    .select('data')
    .eq('id', 1)
    .single();
  if (error) throw error;
  return {
    names:
      data?.data?.names && typeof data.data.names === 'object'
        ? data.data.names
        : {}
  };
}

export async function getMedia() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('media')
    .select('data')
    .eq('id', 1)
    .single();
  if (error) throw error;
  return data.data;
}

export async function getJurnal() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('jurnal')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToJurnal);
}

export async function getArtikel() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('artikel')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToArtikel);
}
