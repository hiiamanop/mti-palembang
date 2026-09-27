export default async function sitemap() {
  const baseUrl = 'https://mti-sumsel.or.id';
  const now = new Date();

  return [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/kegiatan-mti`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/artikel`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/sejarah-mti`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/struktur-organisasi`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/identitas-organisasi`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 }
  ];
}
