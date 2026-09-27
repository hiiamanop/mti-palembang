import Link from 'next/link';
import { ArrowLeft, Eye, BookOpen } from 'lucide-react';

export const metadata = { title: 'Sejarah MTI - MTI CMS' };

export default function AdminTentangKamiSejarahPage() {
  return (
    <div>
      <div className="adminPageHeader">
        <div>
          <Link
            href="/admin/tentang-kami"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 700,
              color: '#112e81',
              textDecoration: 'none',
              marginBottom: 10
            }}
          >
            <ArrowLeft size={14} />
            Kembali ke Hub Tentang Kami
          </Link>
          <h1>Sejarah Masyarakat Transportasi Indonesia</h1>
          <p>Dokumentasi perjalanan historis MTI sejak deklarasi di Bandung pada 14 Maret 1999 hingga Kongres X 2025.</p>
        </div>
        <a
          href="/sejarah-mti"
          target="_blank"
          rel="noopener noreferrer"
          className="adminBtn adminBtnSecondary"
        >
          <Eye size={15} style={{ marginRight: 6 }} />
          Lihat Halaman Publik ↗
        </a>
      </div>

      <div className="adminCard" style={{ padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ padding: 10, background: '#eff6ff', borderRadius: 8, color: '#112e81' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 17, color: '#0f172a' }}>Konten Halaman Sejarah MTI</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
              Kronologi 10 Kongres Nasional MTI (1999 &mdash; 2025) terintegrasi pada kode halaman publik baku.
            </p>
          </div>
        </div>

        <div style={{ background: '#f8fafc', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14, color: '#334155', lineHeight: 1.7 }}>
          <p style={{ margin: '0 0 12px' }}>
            Halaman publik <strong>/sejarah-mti</strong> mendokumentasikan deklarasi pendirian MTI di Bandung, Anggaran Dasar, dan 10 perjalanan Kongres Nasional di berbagai kota termasuk Kongres V di Palembang (2013).
          </p>
          <p style={{ margin: 0 }}>
            Tampilan banner hero atas halaman sejarah mengikuti standar ukuran resmi MTI: tinggi 420px dan font judul 42px.
          </p>
        </div>

        <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid #f1f5f9' }}>
          <a
            href="/sejarah-mti"
            target="_blank"
            rel="noopener noreferrer"
            className="adminBtn adminBtnPrimary"
          >
            Buka Halaman Sejarah Publik di Tab Baru ↗
          </a>
        </div>
      </div>
    </div>
  );
}
