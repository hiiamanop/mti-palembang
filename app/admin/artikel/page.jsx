import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getArtikel } from '../../../lib/cms';
import ArtikelTable from './ArtikelTable';

export const metadata = { title: 'Kelola Artikel & Berita - MTI CMS' };

export default async function AdminArtikelPage() {
  const artikel = await getArtikel();

  return (
    <div>
      <div className="adminPageHeader">
        <div>
          <h1>Kelola Artikel &amp; Berita</h1>
          <p>Daftar semua artikel dan berita resmi Masyarakat Transportasi Indonesia Sumatera Selatan</p>
        </div>
        <Link href="/admin/artikel/baru" className="adminBtn adminBtnPrimary">
          <Plus size={16} style={{ marginRight: 6 }} />
          Tambah Artikel / Berita Baru
        </Link>
      </div>

      <ArtikelTable initialArtikel={artikel} />
    </div>
  );
}
