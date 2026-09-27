import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

await access(new URL('../app/admin/kontak-crm/page.jsx', import.meta.url));
await access(new URL('../app/admin/kontak-crm/CrmContactsTable.jsx', import.meta.url));

const sidebar = await readFile(new URL('../app/admin/AdminSidebar.jsx', import.meta.url), 'utf8');
assert.ok(sidebar.includes('HUBUNGAN PUBLIK'), 'Sidebar must contain HUBUNGAN PUBLIK group');
assert.ok(sidebar.includes('/admin/kontak-crm'), 'Sidebar must link to CRM contacts');

const actions = await readFile(new URL('../app/admin/actions.js', import.meta.url), 'utf8');
for (const fn of ['updateCrmContactStatus', 'deleteCrmContact']) {
  assert.ok(actions.includes(`export async function ${fn}`), `Missing ${fn}`);
}
assert.ok(actions.includes("['baru', 'sudah_dihubungi', 'selesai']"), 'Status updates must use whitelist');

const cms = await readFile(new URL('../lib/cms.js', import.meta.url), 'utf8');
assert.ok(cms.includes('export async function getCrmContacts'), 'Missing getCrmContacts');

const table = await readFile(new URL('../app/admin/kontak-crm/CrmContactsTable.jsx', import.meta.url), 'utf8');
for (const token of ['Baru', 'Sudah Dihubungi', 'Selesai', 'mailto:', 'ConfirmDeleteModal']) {
  assert.ok(table.includes(token), `CRM table missing ${token}`);
}

console.log('CRM admin workflow contract verified.');
