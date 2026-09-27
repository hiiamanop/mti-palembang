import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const seed = JSON.parse(await readFile(new URL('../data/beranda.json', import.meta.url), 'utf8'));
assert.equal(seed.artikelHero.title, 'Artikel & Opini Transportasi');
assert.ok(seed.artikelHero.description);
assert.ok(Object.hasOwn(seed.artikelHero, 'image'));

await access(new URL('../app/admin/header-artikel/page.jsx', import.meta.url));
await access(new URL('../app/admin/header-artikel/ArtikelHeroForm.jsx', import.meta.url));
await access(new URL('../app/artikel/ArtikelHero.jsx', import.meta.url));

const cms = await readFile(new URL('../lib/cms.js', import.meta.url), 'utf8');
assert.ok(cms.includes('export async function getArtikelHero'));
const actions = await readFile(new URL('../app/admin/actions.js', import.meta.url), 'utf8');
assert.ok(actions.includes('export async function saveArtikelHero'));
const sidebar = await readFile(new URL('../app/admin/AdminSidebar.jsx', import.meta.url), 'utf8');
const beranda = sidebar.indexOf('/admin/beranda');
const kegiatan = sidebar.indexOf('/admin/hero-kegiatan');
const artikel = sidebar.indexOf('/admin/header-artikel');
const tentang = sidebar.indexOf('/admin/tentang-kami');
assert.ok(beranda < kegiatan && kegiatan < artikel && artikel < tentang, 'CMS page order must follow public tabs');

console.log('Editable article hero and CMS ordering contract verified.');
