export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*']
      }
    ],
    sitemap: 'https://mti-sumsel.or.id/sitemap.xml'
  };
}
