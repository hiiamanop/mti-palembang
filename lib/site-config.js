export const SITE_CONFIG = {
  name: 'MTI SUMSEL',
  fullName: 'MASYARAKAT TRANSPORTASI INDONESIA',
  region: 'SUMATERA SELATAN',
  description:
    'Organisasi profesi yang menghimpun pakar, akademisi, praktisi, dan birokrat untuk pembangunan transportasi nasional yang berkelanjutan.',
  address: 'Wisma Nugra Santana 13th Floor, Jl. Jend. Sudirman Kav 7-8, Karet Tengsin, Jakarta.',
  email: 'secretariat@mti.or.id',
  socials: {
    linkedin: 'https://www.linkedin.com/company/sinergi-mti/',
    instagram: 'https://www.instagram.com/masyarakatransportasi/',
    twitter: 'https://twitter.com/sinergi_mti',
    facebook: 'https://www.facebook.com/groups/158206227226'
  },
  logo: 'https://mti.or.id/wp-content/uploads/2023/01/cropped-cropped-MTI_LOGO_PNG-1-270x270.png',
  navItems: [
    { label: 'Beranda', href: '/' },
    { label: 'Kegiatan MTI', href: '/kegiatan-mti' },
    { label: 'Artikel & Opini', href: '/artikel' },
    {
      label: 'Tentang Kami',
      href: '/sejarah-mti',
      children: [
        { label: 'Sejarah MTI', href: '/sejarah-mti' },
        { label: 'Struktur Organisasi', href: '/struktur-organisasi' },
        { label: 'Identitas Organisasi', href: '/identitas-organisasi' }
      ]
    }
  ],
  footerLinks: [
    {
      title: 'Kegiatan',
      items: [
        { label: 'Kegiatan MTI', href: '/kegiatan-mti' },
        { label: 'Artikel & Opini', href: '/artikel' }
      ]
    },
    {
      title: 'Tentang',
      items: [
        { label: 'Sejarah MTI', href: '/sejarah-mti' },
        { label: 'Struktur Organisasi', href: '/struktur-organisasi' },
        { label: 'Identitas Organisasi', href: '/identitas-organisasi' }
      ]
    }
  ]
};
