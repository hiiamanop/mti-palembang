import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { SITE_CONFIG } from '../lib/site-config.js';

// 1. Verify site-config navigation
const artikelNavItem = SITE_CONFIG.navItems.find((item) => item.href === '/artikel');
assert.ok(artikelNavItem, 'SITE_CONFIG.navItems must include /artikel');
assert.equal(artikelNavItem.label, 'Artikel & Opini');

const kegiatanFooter = SITE_CONFIG.footerLinks.find((section) => section.title === 'Kegiatan');
assert.ok(kegiatanFooter, 'Footer must have Kegiatan section');
const artikelFooter = kegiatanFooter.items.find((item) => item.href === '/artikel');
assert.ok(artikelFooter, 'Footer Kegiatan section must include /artikel');

// 2. Verify files exist
await access(new URL('../app/artikel/page.jsx', import.meta.url));
await access(new URL('../app/artikel/ArtikelClient.jsx', import.meta.url));
await access(new URL('../app/artikel/[id]/page.jsx', import.meta.url));

// 3. Verify page content has dialogHero and standard heading
const pageSource = await readFile(new URL('../app/artikel/page.jsx', import.meta.url), 'utf8');
assert.ok(pageSource.includes('dialogHero'), 'app/artikel/page.jsx must use dialogHero');
assert.ok(pageSource.includes('Artikel & Opini'), 'app/artikel/page.jsx must feature Artikel & Opini title');

console.log('Public artikel page and navigation contract verified.');
