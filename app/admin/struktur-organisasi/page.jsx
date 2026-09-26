import { getStrukturOrganisasi } from '../../../lib/cms';
import StrukturOrganisasiForm from './StrukturOrganisasiForm';

export const metadata = { title: 'Struktur Organisasi - MTI CMS' };

export default async function AdminStrukturOrganisasiPage() {
  const data = await getStrukturOrganisasi();
  return (
    <div>
      <div className="adminPageHeader">
        <div>
          <h1>Struktur Organisasi</h1>
          <p>Kelola nama pengurus pada posisi jabatan tetap</p>
        </div>
      </div>
      <StrukturOrganisasiForm names={data.names} />
    </div>
  );
}
