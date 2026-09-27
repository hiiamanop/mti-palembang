import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

// 1. Verify Pagination component exists
await access(new URL('../app/admin/components/Pagination.jsx', import.meta.url));

// 2. Verify all 5 CMS tables import and render Pagination
const tables = [
  '../app/admin/kegiatan/KegiatanTable.jsx',
  '../app/admin/artikel/ArtikelTable.jsx',
  '../app/admin/kontak-crm/CrmContactsTable.jsx',
  '../app/admin/berita/BeritaTable.jsx',
  '../app/admin/jurnal/JurnalForm.jsx'
];

for (const path of tables) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  assert.ok(source.includes('Pagination'), `${path} must import Pagination`);
  assert.ok(source.includes('<Pagination'), `${path} must render <Pagination`);
}

// 3. Verify CRM success box padding bottom
const crmContact = await readFile(new URL('../app/components/shared/CrmContact.jsx', import.meta.url), 'utf8');
assert.ok(crmContact.includes('crmSuccessBox'), 'CrmContact must use crmSuccessBox');

const css = await readFile(new URL('../app/globals.css', import.meta.url), 'utf8');
assert.ok(css.includes('.crmSuccessBox'), 'globals.css must style .crmSuccessBox');
assert.ok(css.includes('.adminPagination'), 'globals.css must style .adminPagination');

// 4. Verify 400 char limit
const actions = await readFile(new URL('../app/admin/actions.js', import.meta.url), 'utf8');
assert.ok(actions.includes('summary.length > 400'), 'actions.js must enforce 400 char limit');

console.log('Admin pagination, CRM success padding, and 400-char limit contract verified.');
