import { createClient } from '../../../lib/supabase/server';
import { groupSearchResults, normalizeSearchQuery, safeSearchHref, staticSearchResults } from '../../../lib/search';

export async function GET(request) {
  const query = normalizeSearchQuery(new URL(request.url).searchParams.get('q'));
  const pages = staticSearchResults(query);
  if (query.length < 2) return Response.json({ groups: groupSearchResults({ pages }) });

  const supabase = await createClient();
  const pattern = `%${query}%`;
  const [kegiatanRes, artikelRes, beritaRes, jurnalRes, mediaRes] = await Promise.all([
    supabase.from('kegiatan').select('id,title,date,summary').eq('published', true).or(`title.ilike.${pattern},summary.ilike.${pattern}`).limit(5),
    supabase.from('artikel').select('id,title,kategori,date,ringkasan').eq('visible', true).or(`title.ilike.${pattern},ringkasan.ilike.${pattern}`).limit(5),
    supabase.from('berita').select('id,title,cat,date,excerpt,href').eq('published', true).or(`title.ilike.${pattern},excerpt.ilike.${pattern}`).limit(5),
    supabase.from('jurnal').select('id,title,edition,date,description,download_url').eq('visible', true).or(`title.ilike.${pattern},description.ilike.${pattern}`).limit(5),
    supabase.from('media').select('data').eq('id', 1).single()
  ]);

  const hasError = [kegiatanRes, artikelRes, beritaRes, jurnalRes, mediaRes].find((result) => result.error);
  if (hasError) return Response.json({ error: 'Pencarian sedang tidak tersedia.' }, { status: 500 });

  const mediaData = mediaRes.data?.data || {};
  const mediaItems = [mediaData.mainVideo, ...(mediaData.miniVideos || []).filter((item) => item.visible)]
    .filter(Boolean)
    .filter((item) => `${item.title || ''}`.toLowerCase().includes(query))
    .slice(0, 5)
    .map((item) => ({
      title: item.title || 'Media MTI',
      description: 'Video dan dokumentasi media MTI',
      href: safeSearchHref(item.href || item.url || '/')
    }));

  const groups = groupSearchResults({
    pages,
    kegiatan: (kegiatanRes.data || []).map((item) => ({
      title: item.title,
      description: item.summary || item.date || '',
      href: '/kegiatan-mti'
    })),
    artikel: (artikelRes.data || []).map((item) => ({
      title: item.title,
      description: item.ringkasan || item.kategori || '',
      href: `/artikel/${item.id}`
    })),
    berita: (beritaRes.data || []).map((item) => ({
      title: item.title,
      description: item.excerpt || item.cat || '',
      href: safeSearchHref(item.href)
    })),
    jurnal: (jurnalRes.data || []).map((item) => ({
      title: item.title,
      description: item.description || item.edition || item.date || '',
      href: safeSearchHref(item.download_url === '#' ? '/aksesnusantara' : item.download_url)
    })),
    media: mediaItems
  });

  return Response.json({ groups });
}
