export const STATIC_SEARCH_PAGES = [
  { title: 'Beranda', description: 'Halaman utama MTI Sumatera Selatan', href: '/' },
  { title: 'Kegiatan MTI', description: 'Agenda dan dokumentasi kegiatan MTI Sumsel', href: '/kegiatan-mti' },
  { title: 'Artikel & Berita', description: 'Kajian, analisis, artikel dan rilis berita transportasi', href: '/artikel' },
  { title: 'Sejarah MTI', description: 'Perjalanan organisasi sejak 1999', href: '/sejarah-mti' },
  { title: 'Struktur Organisasi', description: 'Susunan pengurus MTI Sumatera Selatan', href: '/struktur-organisasi' },
  { title: 'Identitas Organisasi', description: 'Logo, visi-misi, bendera, dan Mars MTI', href: '/identitas-organisasi' },
  { title: 'Jurnal AKSES Nusantara', description: 'Publikasi dan jurnal transportasi MTI', href: '/aksesnusantara' }
];

export function normalizeSearchQuery(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, 100).toLowerCase();
}

export function safeSearchHref(value) {
  const href = String(value || '');
  if (href.startsWith('/') && !href.startsWith('//')) return href;
  try {
    const url = new URL(href);
    return ['http:', 'https:'].includes(url.protocol) ? href : '#';
  } catch {
    return '#';
  }
}

export function staticSearchResults(query) {
  const normalized = normalizeSearchQuery(query);
  if (!normalized) return STATIC_SEARCH_PAGES.slice(0, 5);
  return STATIC_SEARCH_PAGES.filter((item) =>
    `${item.title} ${item.description}`.toLowerCase().includes(normalized)
  ).slice(0, 5);
}

const LABELS = {
  pages: 'Halaman',
  kegiatan: 'Kegiatan',
  artikel: 'Artikel & Berita',
  berita: 'Berita',
  jurnal: 'Jurnal',
  media: 'Media Video'
};

export function groupSearchResults(resultMap) {
  return Object.entries(resultMap)
    .map(([key, items]) => ({ key, label: LABELS[key] || key, items: (items || []).slice(0, 5) }))
    .filter((group) => group.items.length > 0);
}
