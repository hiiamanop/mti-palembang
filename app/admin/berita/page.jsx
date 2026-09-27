import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getBerita } from '../../../lib/cms';
import BeritaTable from './BeritaTable';

export const metadata = { title: 'Kelola Berita - MTI CMS' };

export default async function AdminBeritaPage() {
  const berita = await getBerita();

  return (
    <div>
      <div className="adminPageHeader">
        <div>
          <h1>Kelola Berita</h1>
          <p>Daftar semua artikel berita dan siaran pers resmi</p>
        </div>
        <Link href="/admin/berita/baru" className="adminBtn adminBtnPrimary">
          <Plus size={16} style={{ marginRight: 6 }} />
          Tambah Berita Baru
        </Link>
      </div>

      <BeritaTable initialBerita={berita} />
    </div>
  );
}
