import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SITE_CONFIG } from '../lib/site-config.js';

const hiddenLabels = new Set([
  '16th EASTS Conference',
  'Rekomendasi Kebijakan',
  'AKSES Nusantara'
]);
assert.equal(
  SITE_CONFIG.navItems.some((item) => hiddenLabels.has(item.label)),
  false,
  'hidden pages must not appear in the main navigation'
);
assert.equal(
  SITE_CONFIG.footerLinks.some((column) =>
    column.items.some((item) => hiddenLabels.has(item.label))
  ),
  false,
  'hidden pages must not appear in the footer navigation'
);

const header = await readFile(new URL('../app/components/layout/Header.jsx', import.meta.url), 'utf8');
assert.equal(header.includes('aksesLink'), false, 'AKSES shortcut must be hidden');

const css = await readFile(new URL('../app/globals.css', import.meta.url), 'utf8');
assert.match(
  css,
  /\.subscribeButton,[\s\S]*?background:\s*var\(--blue\)/,
  'subscribe button must use the main blue color'
);
assert.match(
  css,
  /\.desktopNav\s*{[\s\S]*?justify-content:\s*center/,
  'desktop navigation items must be centered'
);

console.log('Site navigation visibility and subscribe color verified.');
