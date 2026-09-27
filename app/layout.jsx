import './globals.css';

export const metadata = {
  metadataBase: new URL('https://mti-sumsel.or.id'),
  title: {
    default: 'MTI SUMSEL | Masyarakat Transportasi Indonesia Sumatera Selatan',
    template: '%s | MTI SUMSEL'
  },
  description:
    'Situs resmi Masyarakat Transportasi Indonesia (MTI) Wilayah Sumatera Selatan. Informasi kegiatan, advokasi kebijakan, riset, artikel opini, dan agenda sistem mobilitas daerah.',
  keywords: [
    'MTI',
    'MTI Sumsel',
    'Masyarakat Transportasi Indonesia',
    'Sumatera Selatan',
    'Palembang',
    'Transportasi Publik',
    'LRT Palembang',
    'Kebijakan Transportasi'
  ],
  authors: [{ name: 'MTI Sumatera Selatan', url: 'https://mti-sumsel.or.id' }],
  creator: 'MTI Sumatera Selatan',
  publisher: 'Masyarakat Transportasi Indonesia Wilayah Sumatera Selatan',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' }
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }]
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://mti-sumsel.or.id',
    siteName: 'MTI Sumatera Selatan',
    title: 'MTI SUMSEL | Masyarakat Transportasi Indonesia Sumatera Selatan',
    description:
      'Situs resmi Masyarakat Transportasi Indonesia (MTI) Wilayah Sumatera Selatan. Informasi kegiatan, advokasi kebijakan, riset, artikel opini, dan agenda sistem mobilitas daerah.',
    images: [
      {
        url: '/images/og-mti-sumsel.png',
        width: 1200,
        height: 630,
        alt: 'MTI Sumatera Selatan - Masyarakat Transportasi Indonesia'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MTI SUMSEL | Masyarakat Transportasi Indonesia Sumatera Selatan',
    description: 'Situs resmi Masyarakat Transportasi Indonesia (MTI) Wilayah Sumatera Selatan.',
    site: '@sinergi_mti',
    creator: '@sinergi_mti',
    images: ['/images/og-mti-sumsel.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Lora:ital,wght@1,500;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
