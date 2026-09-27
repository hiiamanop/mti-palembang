import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

await access(new URL('../app/crm-actions.js', import.meta.url));
await access(new URL('../app/components/shared/CrmContact.jsx', import.meta.url));

const header = await readFile(new URL('../app/components/layout/Header.jsx', import.meta.url), 'utf8');
assert.equal(header.includes('Berlangganan'), false, 'Header must not contain old Berlangganan copy');
assert.ok(header.includes('Hubungi Kami'), 'Header must expose Hubungi Kami CTA');
assert.ok(header.includes('/#crm'), 'Header CTA must target /#crm');

const crm = await readFile(new URL('../app/components/shared/CrmContact.jsx', import.meta.url), 'utf8');
for (const token of ['id="crm"', 'name="name"', 'name="email"', 'name="institution"', 'name="website"', 'submitCrmContact']) {
  assert.ok(crm.includes(token), `CRM form missing ${token}`);
}

const home = await readFile(new URL('../app/HomeClient.jsx', import.meta.url), 'utf8');
assert.ok(home.includes("import CrmContact"), 'HomeClient must import CrmContact');
assert.ok(home.includes('<CrmContact'), 'HomeClient must render CrmContact');
assert.equal(home.includes('<Newsletter'), false, 'HomeClient must remove Newsletter');

console.log('Public CRM form and header CTA contract verified.');
