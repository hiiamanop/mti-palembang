import { getCrmContacts } from '../../../lib/cms';
import CrmContactsTable from './CrmContactsTable';

export const metadata = { title: 'Kontak CRM - MTI CMS' };

export default async function AdminKontakCrmPage() {
  const contacts = await getCrmContacts();
  const newCount = contacts.filter((contact) => contact.status === 'baru').length;

  return (
    <div>
      <div className="adminPageHeader">
        <div>
          <h1>Kontak CRM</h1>
          <p>Permintaan informasi dan kolaborasi yang masuk dari website publik</p>
        </div>
        <span className="adminBadge adminBadgeGreen" style={{ padding: '7px 14px', fontSize: 13 }}>
          {newCount} Kontak Baru
        </span>
      </div>
      <CrmContactsTable initialContacts={contacts} />
    </div>
  );
}
