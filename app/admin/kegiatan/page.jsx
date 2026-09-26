import { getKegiatan } from '../../../lib/cms';
import KegiatanForm from './KegiatanForm';

export const metadata = { title: 'Kegiatan MTI - MTI CMS' };

export default async function AdminKegiatanPage() {
  const kegiatan = await getKegiatan();
  return (
    <div>
      <div className="adminPageHeader">
        <div>
          <h1>Kegiatan MTI</h1>
          <p>Kelola daftar kegiatan berdasarkan tanggal</p>
        </div>
      </div>
      <KegiatanForm kegiatan={kegiatan} />
    </div>
  );
}
