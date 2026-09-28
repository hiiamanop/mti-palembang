import Link from 'next/link';
import { ArrowLeft, Eye } from 'lucide-react';
import { getStrukturOrganisasi } from '../../../../lib/cms';
import StrukturOrganisasiForm from '../../struktur-organisasi/StrukturOrganisasiForm';

export const metadata = { title: 'Kelola Struktur Organisasi - MTI CMS' };

export default async function AdminTentangKamiStrukturPage() {
  const { names } = await getStrukturOrganisasi();

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
          <h1>Struktur Organisasi MTI Sumatera Selatan</h1>
          <p>
            Kelola satu nama pengurus pada 17 posisi tetap dalam lima kelompok: Pengarah, Pengurus Harian, Bidang Organisasi, Bidang Khusus, dan Sekretariat.
          </p>
        </div>
        <a
          href="/struktur-organisasi"
          target="_blank"
          rel="noopener noreferrer"
          className="adminBtn adminBtnSecondary"
        >
          <Eye size={15} style={{ marginRight: 6 }} />
          Lihat Halaman Publik ↗
        </a>
      </div>

      <StrukturOrganisasiForm names={names} />
    </div>
  );
}
