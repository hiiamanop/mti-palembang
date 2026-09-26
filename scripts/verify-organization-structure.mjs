import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  ORGANIZATION_GROUPS,
  ORGANIZATION_KEYS,
  resolveOrganizationGroup
} from '../lib/organization-structure.js';

assert.deepEqual(Object.keys(ORGANIZATION_GROUPS), [
  'advisory',
  'experts',
  'leadership',
  'divisions'
]);
assert.equal(ORGANIZATION_KEYS.length, 24);
assert.equal(new Set(ORGANIZATION_KEYS).size, 24, 'organization keys must be unique');

const resolved = resolveOrganizationGroup(ORGANIZATION_GROUPS.leadership, {
  'ketua-umum': '  Nama Ketua  ',
  unknown: 'Ignored'
});
assert.equal(resolved[0].role, 'Ketua Umum');
assert.equal(resolved[0].badge, 'Ketua');
assert.equal(resolved[0].name, 'Nama Ketua');
assert.equal(resolved[1].name, '—');
assert.equal(resolved.some((item) => item.key === 'unknown'), false);

const seed = JSON.parse(
  await readFile(new URL('../data/struktur-organisasi.json', import.meta.url), 'utf8')
);
assert.deepEqual(seed, { names: {} });

const cmsSource = await readFile(new URL('../lib/cms.js', import.meta.url), 'utf8');
assert.match(cmsSource, /export async function getStrukturOrganisasi\(\)/);

const actionsSource = await readFile(new URL('../app/admin/actions.js', import.meta.url), 'utf8');
assert.match(actionsSource, /export async function saveStrukturOrganisasi\(formData\)/);
assert.match(actionsSource, /ORGANIZATION_KEYS/);

const adminFormSource = await readFile(
  new URL('../app/admin/struktur-organisasi/StrukturOrganisasiForm.jsx', import.meta.url),
  'utf8'
);
assert.match(adminFormSource, /ORGANIZATION_GROUPS/);
assert.match(adminFormSource, /Simpan Struktur Organisasi/);

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

console.log('Fixed organization structure, database, CMS, and public page verified without hardcoded names.');
