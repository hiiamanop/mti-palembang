import Link from 'next/link';
import { getBerita, getKegiatan, getMedia, getJurnal, getArtikel } from '../../lib/cms';

export const metadata = { title: 'Dashboard - MTI CMS' };

export default async function AdminDashboard() {
  const [berita, kegiatan, media, jurnal, artikel] = await Promise.all([
    getBerita(),
    getKegiatan(),
    getMedia(),
    getJurnal(),
    getArtikel()
  ]);

  const publishedBerita = berita.filter((b) => b.published).length;
  const visibleMedia = media.miniVideos.filter((v) => v.visible).length;

  const stats = [
    { label: 'Total Berita', value: berita.length, sub: `${publishedBerita} Dipublikasi`, href: '/admin/berita', color: '#4647ae' },
    { label: 'Total Kegiatan', value: kegiatan.length, sub: `${kegiatan.filter((item) => item.published).length} Dipublikasi`, href: '/admin/kegiatan', color: '#2e6fd0' },
    { label: 'Total Media', value: media.miniVideos.length, sub: `${visibleMedia} Ditampilkan`, href: '/admin/media', color: '#2e6fd0' },
    { label: 'Total Jurnal', value: jurnal.length, sub: `${jurnal.filter((j) => j.visible).length} Aktif`, href: '/admin/jurnal', color: '#112e81' },
    { label: 'Total Artikel', value: artikel.length, sub: `${artikel.filter((a) => a.visible).length} Ditampilkan`, href: '/admin/artikel', color: '#1a6b4a' }
  ];

  return (
    <div>
      <div className="adminPageHeader">
        <h1>Dashboard</h1>
        <p>Selamat datang di panel CMS MTI</p>
      </div>

      <div className="adminStatsGrid">
        {stats.map((stat) => (
          <Link href={stat.href} key={stat.label} className="adminStatCard adminCard">
            <div className="adminStatTop" style={{ borderColor: stat.color }}>
              <span className="adminStatValue" style={{ color: stat.color }}>{stat.value}</span>
              <span className="adminStatLabel">{stat.label}</span>
            </div>
            <span className="adminStatSub">{stat.sub}</span>
          </Link>
        ))}
      </div>

      <div className="adminCard" style={{ padding: '24px', marginTop: '28px' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 16 }}>Akses Cepat Pengelolaan</h2>
        <div className="adminQuickLinks">
          <Link href="/admin/beranda" className="adminBtn adminBtnPrimary">Kelola Beranda</Link>
          <Link href="/admin/tentang-kami" className="adminBtn adminBtnSecondary">Tentang Kami (Hub)</Link>
          <Link href="/admin/hero-kegiatan" className="adminBtn adminBtnSecondary">Hero Kegiatan</Link>
          <Link href="/admin/kegiatan" className="adminBtn adminBtnSecondary">Kegiatan MTI</Link>
          <Link href="/admin/artikel" className="adminBtn adminBtnSecondary">Artikel &amp; Berita</Link>
          <Link href="/admin/berita" className="adminBtn adminBtnSecondary">Berita</Link>
          <Link href="/admin/jurnal" className="adminBtn adminBtnSecondary">Jurnal AKSES</Link>
          <Link href="/admin/media" className="adminBtn adminBtnSecondary">Media Video</Link>
        </div>
      </div>

      <div className="adminCard" style={{ padding: '24px', marginTop: '20px' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 16 }}>5 Berita Terbaru</h2>
        <table className="adminTable">
          <thead>
            <tr>
              <th>Judul</th>
              <th>Kategori</th>
              <th>Tanggal</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {berita.slice(0, 5).map((item) => (
              <tr key={item.id}>
                <td>
                  <Link href={`/admin/berita/${item.id}`} className="adminTableLink">
                    {item.title}
                  </Link>
                </td>
                <td>{item.cat}</td>
                <td>{item.date}</td>
                <td>
                  <span className={`adminBadge ${item.published ? 'adminBadgeGreen' : 'adminBadgeGray'}`}>
                    {item.published ? 'Publik' : 'Draft'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
