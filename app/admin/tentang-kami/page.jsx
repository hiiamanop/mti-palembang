import Link from 'next/link';
import { BookOpen, Users, Award, ExternalLink } from 'lucide-react';

export const metadata = { title: 'Kelola Tentang Kami - MTI CMS' };

export default function AdminTentangKamiPage() {
  const cards = [
    {
      title: '1. Sejarah MTI',
      desc: 'Kelola teks pengantar perjalanan organisasi sejak 1999 dan foto hero halaman sejarah.',
      href: '/admin/tentang-kami/sejarah',
      publicHref: '/sejarah-mti',
      icon: BookOpen,
      action: 'Buka Editor Sejarah'
    },
    {
      title: '2. Struktur Organisasi',
      desc: 'Kelola nama lengkap 24 posisi pengurus baku MTI Sumatera Selatan (Dewan Pembina, Pakar, Harian, Teknis).',
      href: '/admin/tentang-kami/struktur-organisasi',
      publicHref: '/struktur-organisasi',
      icon: Users,
      action: 'Kelola Nama Pengurus'
    },
    {
      title: '3. Identitas Organisasi',
      desc: 'Kelola penjelasan lambang, filosofi warna, bendera, dan tautan lagu mars resmi MTI.',
      href: '/admin/tentang-kami/identitas',
      publicHref: '/identitas-organisasi',
      icon: Award,
      action: 'Buka Editor Identitas'
    }
  ];

  return (
    <div>
      <div className="adminPageHeader">
        <div>
          <h1>Pengelolaan Halaman Tentang Kami</h1>
          <p>Pusat pengelolaan profil resmi, kepengurusan, dan identitas Masyarakat Transportasi Indonesia</p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
          marginTop: 8
        }}
      >
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className="adminCard"
              style={{
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }}
            >
              <div>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: '#eff6ff',
                    color: '#112e81',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16
                  }}
                >
                  <Icon size={24} />
                </div>
                <h3 style={{ margin: '0 0 10px', fontSize: 18, color: '#0f172a' }}>{c.title}</h3>
                <p style={{ margin: '0 0 24px', fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{c.desc}</p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 18,
                  borderTop: '1px solid #f1f5f9'
                }}
              >
                <Link href={c.href} className="adminBtn adminBtnPrimary">
                  {c.action}
                </Link>
                <a
                  href={c.publicHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: '#64748b',
                    textDecoration: 'none'
                  }}
                >
                  Lihat Publik
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
