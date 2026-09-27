import Link from 'next/link';
import { ArrowLeft, Eye, Award } from 'lucide-react';

export const metadata = { title: 'Identitas Organisasi - MTI CMS' };

export default function AdminTentangKamiIdentitasPage() {
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
          <h1>Identitas Resmi Organisasi MTI</h1>
          <p>Kelola dan tinjau lambang, filosofi warna visual, bendera resmi, serta lagu Mars MTI.</p>
        </div>
        <a
          href="/identitas-organisasi"
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
            <Award size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 17, color: '#0f172a' }}>Identitas Visual &amp; Mars MTI</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
              Pedoman visual resmi Masyarakat Transportasi Indonesia Wilayah Sumatera Selatan.
            </p>
          </div>
        </div>

        <div style={{ background: '#f8fafc', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14, color: '#334155', lineHeight: 1.7 }}>
          <p style={{ margin: '0 0 12px' }}>
            Halaman publik <strong>/identitas-organisasi</strong> menampilkan:
          </p>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>Makna 4 Warna Dasar (Biru Tua, Merah, Putih, Emas).</li>
            <li>Makna 4 Simbol Logo (Roda Bergerigi, Sayap, Ombak, Lingkaran Penuh).</li>
            <li>Standar Bendera Resmi Organisasi (90 &times; 135 cm dan 120 &times; 180 cm).</li>
            <li>Pemutar video dan lirik Mars Masyarakat Transportasi Indonesia.</li>
          </ul>
        </div>

        <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid #f1f5f9' }}>
          <a
            href="/identitas-organisasi"
            target="_blank"
            rel="noopener noreferrer"
            className="adminBtn adminBtnPrimary"
          >
            Buka Halaman Identitas Publik di Tab Baru ↗
          </a>
        </div>
      </div>
    </div>
  );
}
