import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getKegiatan } from '../../../lib/cms';
import KegiatanTable from './KegiatanTable';

export const metadata = { title: 'Kelola Kegiatan MTI - MTI CMS' };

export default async function AdminKegiatanPage() {
  const kegiatan = await getKegiatan();

  return (
    <div>
      <div className="adminPageHeader">
        <div>
          <h1>Kelola Kegiatan MTI</h1>
          <p>Daftar semua agenda, pertemuan, dan kegiatan Masyarakat Transportasi Indonesia Sumsel</p>
        </div>
        <Link href="/admin/kegiatan/baru" className="adminBtn adminBtnPrimary">
          <Plus size={16} style={{ marginRight: 6 }} />
          Tambah Kegiatan Baru
        </Link>
      </div>

      <KegiatanTable initialKegiatan={kegiatan} />
    </div>
  );
}
