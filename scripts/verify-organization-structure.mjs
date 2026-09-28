import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  ORGANIZATION_GROUPS,
  ORGANIZATION_KEYS,
  resolveOrganizationGroup
} from '../lib/organization-structure.js';

assert.deepEqual(Object.keys(ORGANIZATION_GROUPS), [
  'direction',
  'daily',
  'organization',
  'special',
  'secretariat'
]);
assert.equal(ORGANIZATION_KEYS.length, 17);
assert.equal(new Set(ORGANIZATION_KEYS).size, 17, 'organization keys must be unique');

const resolved = resolveOrganizationGroup(ORGANIZATION_GROUPS.daily, {
  ketua: '  Nama Ketua  ',
  unknown: 'Ignored'
});
assert.equal(ORGANIZATION_GROUPS.direction[0].role, 'Pembina');
assert.equal(resolved[0].role, 'Ketua');
assert.equal(resolved[0].name, 'Nama Ketua');
assert.equal(resolved[1].name, '—');
assert.equal(resolved.some((item) => item.key === 'unknown'), false);

const seed = JSON.parse(
  await readFile(new URL('../data/struktur-organisasi.json', import.meta.url), 'utf8')
);
assert.deepEqual(seed, { version: 2, names: {} });

const migrationSource = await readFile(
  new URL('../scripts/migrate-organization-v2.mjs', import.meta.url),
  'utf8'
);
assert.match(migrationSource, /row\?\.data\?\.version === 2/);
assert.match(migrationSource, /version: 2, names: \{\}/);

const cmsSource = await readFile(new URL('../lib/cms.js', import.meta.url), 'utf8');
assert.match(cmsSource, /export async function getStrukturOrganisasi\(\)/);

const actionsSource = await readFile(new URL('../app/admin/actions.js', import.meta.url), 'utf8');
assert.match(actionsSource, /export async function saveStrukturOrganisasi\(formData\)/);
assert.match(actionsSource, /ORGANIZATION_KEYS/);
assert.match(actionsSource, /data: \{ version: 2, names \}/);
assert.match(cmsSource, /version: 2/);

const adminFormSource = await readFile(
  new URL('../app/admin/struktur-organisasi/StrukturOrganisasiForm.jsx', import.meta.url),
  'utf8'
);
assert.match(adminFormSource, /ORGANIZATION_GROUPS/);
assert.match(adminFormSource, /Simpan.*Struktur Organisasi/);

const publicSource = await readFile(
  new URL('../app/struktur-organisasi/page.jsx', import.meta.url),
  'utf8'
);
for (const oldName of [
  'Tulus Abadi',
  'Agus Taufik Mulyono',
  'Bambang Susantono',
  'Wimpy Santosa',
  'Siti Maimunah',
  'Russ Bona Frazila'
]) {
  assert.equal(publicSource.includes(oldName), false, `hardcoded person remains: ${oldName}`);
}
assert.match(publicSource, /getStrukturOrganisasi/);
assert.match(publicSource, /resolveOrganizationGroup/);
assert.match(publicSource, /orgFlatGrid/);
assert.match(publicSource, /orgFlatCard/);

for (const groupLabel of [
  'Pengarah',
  'Pengurus Harian',
  'Bidang Organisasi',
  'Bidang Khusus',
  'Sekretariat'
]) {
  assert.ok(publicSource.includes(groupLabel), `Missing group label: ${groupLabel}`);
}

console.log('Fixed organization structure, database, CMS, and public page verified without hardcoded names.');
