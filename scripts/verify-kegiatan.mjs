import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  filterKegiatanByYear,
  formatKegiatanDate,
  getKegiatanYears,
  isValidISODate
} from '../lib/kegiatan.js';

assert.equal(isValidISODate('2026-02-28'), true);
assert.equal(isValidISODate('2026-02-30'), false);
assert.equal(isValidISODate('26-02-28'), false);
assert.equal(isValidISODate(''), false);

const items = [
  { id: 'a', date: '2025-01-01' },
  { id: 'b', date: '2026-09-20' },
  { id: 'c', date: '2026-01-10' },
  { id: 'd', date: 'invalid' }
];
assert.deepEqual(getKegiatanYears(items), [2026, 2025]);
assert.deepEqual(filterKegiatanByYear(items, 'Semua'), items);
assert.deepEqual(filterKegiatanByYear(items, 2026).map((item) => item.id), ['b', 'c']);
assert.equal(formatKegiatanDate('2026-09-20'), '20 September 2026');
assert.equal(formatKegiatanDate('invalid'), '');

const cmsSource = await readFile(new URL('../lib/cms.js', import.meta.url), 'utf8');
assert.match(cmsSource, /export async function getKegiatan\(\)/);
assert.match(cmsSource, /\.from\('kegiatan'\)/);
assert.match(cmsSource, /\.order\('date', \{ ascending: false \}\)/);

const actionsSource = await readFile(new URL('../app/admin/actions.js', import.meta.url), 'utf8');
for (const name of [
  'addKegiatanItem',
  'saveKegiatanItem',
  'deleteKegiatanItem',
  'toggleKegiatanPublished'
]) {
  assert.equal(actionsSource.includes(`export async function ${name}`), true, `${name} missing`);
}

for (const path of [
  '../app/admin/kegiatan/page.jsx',
  '../app/admin/kegiatan/KegiatanForm.jsx'
]) {
  await readFile(new URL(path, import.meta.url), 'utf8');
}

for (const path of [
  '../app/kegiatan-mti/page.jsx',
  '../app/kegiatan-mti/KegiatanClient.jsx'
]) {
  await readFile(new URL(path, import.meta.url), 'utf8');
}

for (const path of [
  '../app/dialog-kebijakan/page.jsx',
  '../app/mti-dalam-berita/page.jsx',
  '../app/kegiatan-mti/jalan-jalan/page.jsx',
  '../app/mti-wilayah/jalan-jalan/page.jsx'
]) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  assert.match(source, /permanentRedirect\('\/kegiatan-mti'\)/);
}

const siteConfig = await readFile(new URL('../lib/site-config.js', import.meta.url), 'utf8');
assert.match(siteConfig, /label: 'Kegiatan MTI', href: '\/kegiatan-mti'/);
assert.equal(siteConfig.includes("href: '/dialog-kebijakan'"), false);
assert.equal(siteConfig.includes("href: '/mti-dalam-berita'"), false);
assert.equal(siteConfig.includes("href: '/kegiatan-mti/jalan-jalan'"), false);

console.log('Kegiatan module contracts verified.');
