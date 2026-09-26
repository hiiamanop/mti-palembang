'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '../../lib/supabase/server';
import { createAdminClient } from '../../lib/supabase/admin';
import { isValidISODate } from '../../lib/kegiatan';

async function checkAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  return supabase;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function getSingleton(supabase, table) {
  const { data } = await supabase.from(table).select('data').eq('id', 1).single();
  return data.data;
}

async function saveSingleton(supabase, table, value) {
  await supabase.from(table).update({ data: value }).eq('id', 1);
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

// ── Upload Gambar ─────────────────────────────────────────────────────────────
// Upload dijalankan di server pakai service-role (bypass RLS). Token user pakai
// ES256 yang belum didukung server Storage, jadi upload via browser tidak bisa.

export async function uploadImage(formData) {
  await checkAuth();
  const file = formData.get('file');
  if (!file || typeof file === 'string' || file.size === 0) {
    return { error: 'File tidak valid.' };
  }
  const admin = createAdminClient();
  const ext = (file.name?.split('.').pop() || 'bin').toLowerCase();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await admin.storage.from('media').upload(path, file, {
    contentType: file.type || undefined,
    cacheControl: '3600',
    upsert: false
  });
  if (error) return { error: error.message };
  const { data } = admin.storage.from('media').getPublicUrl(path);
  return { url: data.publicUrl };
}

// ── Berita ────────────────────────────────────────────────────────────────────

export async function saveBeritaItem(id, formData) {
  const supabase = await checkAuth();
  const title = formData.get('title');
  const slug = formData.get('slug') || slugify(title || '');
  const update = {
    title,
    slug,
    href: `/berita/${slug}`,
    cat: formData.get('cat'),
    group: formData.get('group'),
    img: formData.get('img'),
    date: formData.get('date'),
    detail_date: formData.get('detailDate'),
    author: formData.get('author'),
    read_time: formData.get('readTime'),
    excerpt: formData.get('excerpt'),
    content: (formData.get('content') || '').split('\n\n').filter(Boolean),
    highlights: (formData.get('highlights') || '').split('\n').filter(Boolean),
    source_url: formData.get('sourceUrl') || ''
  };
  Object.keys(update).forEach((k) => update[k] == null && delete update[k]);
  const { error } = await supabase.from('berita').update(update).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/');
  revalidatePath('/mti-dalam-berita');
  revalidatePath(`/berita/${slug}`);
  redirect('/admin/berita');
}

export async function addBeritaItem(formData) {
  const supabase = await checkAuth();
  const title = formData.get('title') || 'Judul Baru';
  const slug = formData.get('slug') || slugify(title);
  const row = {
    slug,
    href: `/berita/${slug}`,
    cat: formData.get('cat') || 'Berita',
    group: formData.get('group') || 'Berita',
    img: formData.get('img') || '',
    title,
    date: formData.get('date') || '',
    detail_date: formData.get('detailDate') || '',
    author: formData.get('author') || 'Redaksi MTI',
    read_time: formData.get('readTime') || '3 menit baca',
    excerpt: formData.get('excerpt') || '',
    content: (formData.get('content') || '').split('\n\n').filter(Boolean),
    highlights: (formData.get('highlights') || '').split('\n').filter(Boolean),
    source_url: formData.get('sourceUrl') || '',
    published: false
  };
  const { error } = await supabase.from('berita').insert(row);
  if (error) return { error: error.message };
  revalidatePath('/');
  revalidatePath('/mti-dalam-berita');
  redirect('/admin/berita');
}

export async function deleteBeritaItem(id) {
  const supabase = await checkAuth();
  await supabase.from('berita').delete().eq('id', id);
  revalidatePath('/');
  revalidatePath('/mti-dalam-berita');
  revalidatePath('/admin/berita');
}

export async function toggleBeritaPublished(id) {
  const supabase = await checkAuth();
  const { data } = await supabase.from('berita').select('published').eq('id', id).single();
  if (!data) return;
  await supabase.from('berita').update({ published: !data.published }).eq('id', id);
  revalidatePath('/');
  revalidatePath('/mti-dalam-berita');
  revalidatePath('/admin/berita');
}

// ── Kegiatan MTI ──────────────────────────────────────────────────────────────

function kegiatanInput(formData) {
  const title = String(formData.get('title') || '').trim();
  const date = String(formData.get('date') || '');
  if (!title) return { error: 'Judul kegiatan wajib diisi.' };
  if (!isValidISODate(date)) return { error: 'Tanggal kegiatan tidak valid.' };
  return {
    row: {
      title,
      date,
      image: String(formData.get('image') || '').trim(),
      summary: String(formData.get('summary') || '').trim()
    }
  };
}

function revalidateKegiatan() {
  revalidatePath('/kegiatan-mti');
  revalidatePath('/admin');
  revalidatePath('/admin/kegiatan');
}

export async function addKegiatanItem(formData) {
  const supabase = await checkAuth();
  const input = kegiatanInput(formData);
  if (input.error) return input;
  const { error } = await supabase.from('kegiatan').insert({ ...input.row, published: false });
  if (error) return { error: error.message };
  revalidateKegiatan();
  return { success: true };
}

export async function saveKegiatanItem(id, formData) {
  const supabase = await checkAuth();
  const input = kegiatanInput(formData);
  if (input.error) return input;
  const { error } = await supabase.from('kegiatan').update(input.row).eq('id', id);
  if (error) return { error: error.message };
  revalidateKegiatan();
  return { success: true };
}

export async function deleteKegiatanItem(id) {
  const supabase = await checkAuth();
  const { error } = await supabase.from('kegiatan').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidateKegiatan();
  return { success: true };
}

export async function toggleKegiatanPublished(id) {
  const supabase = await checkAuth();
  const { data, error: readError } = await supabase
    .from('kegiatan')
    .select('published')
    .eq('id', id)
    .single();
  if (readError) return { error: readError.message };
  const { error } = await supabase
    .from('kegiatan')
    .update({ published: !data.published })
    .eq('id', id);
  if (error) return { error: error.message };
  revalidateKegiatan();
  return { success: true };
}

// ── Beranda ───────────────────────────────────────────────────────────────────

export async function saveBeranda(section, formData) {
  const supabase = await checkAuth();
  const beranda = await getSingleton(supabase, 'beranda');

  if (section === 'ticker') {
    const ids = formData.getAll('tickerId');
    const tags = formData.getAll('tickerTag');
    const texts = formData.getAll('tickerText');
    beranda.ticker = ids.map((id, i) => ({
      id: id || generateId(),
      tag: tags[i] || '',
      text: texts[i] || ''
    }));
  } else if (section === 'leadStory') {
    beranda.leadStory = {
      img: formData.get('img') || beranda.leadStory.img,
      cat: formData.get('cat') || beranda.leadStory.cat,
      title: formData.get('title') || beranda.leadStory.title,
      excerpt: formData.get('excerpt') || beranda.leadStory.excerpt,
      author: formData.get('author') || beranda.leadStory.author,
      date: formData.get('date') || beranda.leadStory.date,
      readTime: formData.get('readTime') || beranda.leadStory.readTime,
      href: formData.get('href') || beranda.leadStory.href
    };
  } else if (section === 'heroSide') {
    const ids = formData.getAll('sideId');
    const imgs = formData.getAll('sideImg');
    const cats = formData.getAll('sideCat');
    const colors = formData.getAll('sideColor');
    const titles = formData.getAll('sideTitle');
    const dates = formData.getAll('sideDate');
    const hrefs = formData.getAll('sideHref');
    beranda.heroSide = ids.map((id, i) => ({
      id: id || generateId(),
      img: imgs[i] || '',
      cat: cats[i] || '',
      tagColor: colors[i] || '#4647ae',
      title: titles[i] || '',
      date: dates[i] || '',
      href: hrefs[i] || '#'
    }));
  } else if (section === 'regions') {
    const ids = formData.getAll('regionId');
    const nums = formData.getAll('regionNum');
    const tags = formData.getAll('regionTag');
    const titles = formData.getAll('regionTitle');
    const excerpts = formData.getAll('regionExcerpt');
    const dates = formData.getAll('regionDate');
    beranda.regions = ids.map((id, i) => ({
      id: id || generateId(),
      num: nums[i] || String(i + 1).padStart(2, '0'),
      tag: tags[i] || '',
      title: titles[i] || '',
      excerpt: excerpts[i] || '',
      date: dates[i] || ''
    }));
  } else if (section === 'akses') {
    beranda.akses = {
      edition: formData.get('edition') || beranda.akses.edition,
      date: formData.get('date') || beranda.akses.date,
      topic: formData.get('topic') || beranda.akses.topic,
      title: formData.get('title') || beranda.akses.title,
      description: formData.get('description') || beranda.akses.description
    };
  }

  await saveSingleton(supabase, 'beranda', beranda);
  revalidatePath('/');
  revalidatePath('/admin/beranda');
}

// ── Media ─────────────────────────────────────────────────────────────────────

export async function saveMainVideo(formData) {
  const supabase = await checkAuth();
  const media = await getSingleton(supabase, 'media');
  media.mainVideo = {
    url: formData.get('url') || media.mainVideo.url,
    title: formData.get('title') || media.mainVideo.title
  };
  await saveSingleton(supabase, 'media', media);
  revalidatePath('/');
  revalidatePath('/admin/media');
}

export async function saveMiniVideos(formData) {
  const supabase = await checkAuth();
  const media = await getSingleton(supabase, 'media');
  const ids = formData.getAll('videoId');
  const imgs = formData.getAll('videoImg');
  const titles = formData.getAll('videoTitle');
  const hrefs = formData.getAll('videoHref');
  media.miniVideos = ids.map((id, i) => {
    const existing = media.miniVideos.find((v) => v.id === id);
    return {
      id: id || generateId(),
      img: imgs[i] || '',
      title: titles[i] || '',
      href: hrefs[i] || '#',
      visible: existing ? existing.visible : true
    };
  });
  await saveSingleton(supabase, 'media', media);
  revalidatePath('/');
  revalidatePath('/admin/media');
}

export async function toggleMediaVisible(id) {
  const supabase = await checkAuth();
  const media = await getSingleton(supabase, 'media');
  const idx = media.miniVideos.findIndex((v) => v.id === id);
  if (idx === -1) return;
  media.miniVideos[idx].visible = !media.miniVideos[idx].visible;
  await saveSingleton(supabase, 'media', media);
  revalidatePath('/');
  revalidatePath('/admin/media');
}

export async function deleteMediaItem(id) {
  const supabase = await checkAuth();
  const media = await getSingleton(supabase, 'media');
  media.miniVideos = media.miniVideos.filter((v) => v.id !== id);
  await saveSingleton(supabase, 'media', media);
  revalidatePath('/');
  revalidatePath('/admin/media');
}

// ── Jurnal ────────────────────────────────────────────────────────────────────

export async function saveJurnalItem(id, formData) {
  const supabase = await checkAuth();
  const update = {
    title: formData.get('title'),
    edition: formData.get('edition'),
    date: formData.get('date'),
    topic: formData.get('topic'),
    description: formData.get('description'),
    cover: formData.get('cover'),
    download_url: formData.get('downloadUrl')
  };
  Object.keys(update).forEach((k) => update[k] == null && delete update[k]);
  const { error } = await supabase.from('jurnal').update(update).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/');
  revalidatePath('/admin/jurnal');
}

export async function addJurnalItem(formData) {
  const supabase = await checkAuth();
  const row = {
    title: formData.get('title') || 'Jurnal Baru',
    edition: formData.get('edition') || '',
    date: formData.get('date') || '',
    topic: formData.get('topic') || '',
    description: formData.get('description') || '',
    cover: formData.get('cover') || '',
    download_url: formData.get('downloadUrl') || '#',
    visible: true
  };
  const { error } = await supabase.from('jurnal').insert(row);
  if (error) return { error: error.message };
  revalidatePath('/');
  revalidatePath('/admin/jurnal');
}

export async function deleteJurnalItem(id) {
  const supabase = await checkAuth();
  await supabase.from('jurnal').delete().eq('id', id);
  revalidatePath('/');
  revalidatePath('/admin/jurnal');
}

export async function toggleJurnalVisible(id) {
  const supabase = await checkAuth();
  const { data } = await supabase.from('jurnal').select('visible').eq('id', id).single();
  if (!data) return;
  await supabase.from('jurnal').update({ visible: !data.visible }).eq('id', id);
  revalidatePath('/');
  revalidatePath('/admin/jurnal');
}

// ── Artikel ───────────────────────────────────────────────────────────────────

export async function saveArtikelItem(id, formData) {
  const supabase = await checkAuth();
  const update = {
    title: formData.get('title'),
    kategori: formData.get('kategori'),
    daerah: formData.get('daerah'),
    date: formData.get('date'),
    ringkasan: formData.get('ringkasan'),
    konten: (formData.get('konten') || '').split('\n\n').filter(Boolean),
    gambar: formData.get('gambar')
  };
  Object.keys(update).forEach((k) => update[k] == null && delete update[k]);
  const { error } = await supabase.from('artikel').update(update).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/');
  revalidatePath('/admin/artikel');
}

export async function addArtikelItem(formData) {
  const supabase = await checkAuth();
  const row = {
    title: formData.get('title') || 'Artikel Baru',
    kategori: formData.get('kategori') || 'Opini',
    daerah: formData.get('daerah') || '',
    date: formData.get('date') || '',
    ringkasan: formData.get('ringkasan') || '',
    konten: (formData.get('konten') || '').split('\n\n').filter(Boolean),
    gambar: formData.get('gambar') || '',
    visible: false
  };
  const { error } = await supabase.from('artikel').insert(row);
  if (error) return { error: error.message };
  revalidatePath('/');
  revalidatePath('/admin/artikel');
}

export async function deleteArtikelItem(id) {
  const supabase = await checkAuth();
  await supabase.from('artikel').delete().eq('id', id);
  revalidatePath('/');
  revalidatePath('/admin/artikel');
}

export async function toggleArtikelVisible(id) {
  const supabase = await checkAuth();
  const { data } = await supabase.from('artikel').select('visible').eq('id', id).single();
  if (!data) return;
  await supabase.from('artikel').update({ visible: !data.visible }).eq('id', id);
  revalidatePath('/');
  revalidatePath('/admin/artikel');
}
