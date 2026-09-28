import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { normalizeSearchQuery, staticSearchResults, safeSearchHref, groupSearchResults } from '../lib/search.js';

assert.equal(normalizeSearchQuery('  Transportasi   Publik  '), 'transportasi publik');
assert.equal(normalizeSearchQuery('a'.repeat(150)).length, 100);
assert.equal(safeSearchHref('javascript:alert(1)'), '#');
assert.equal(safeSearchHref('https://example.com/a'), 'https://example.com/a');
assert.equal(safeSearchHref('/artikel/123'), '/artikel/123');
assert.ok(staticSearchResults('').some((item) => item.href === '/struktur-organisasi'));

const groups = groupSearchResults({
  pages: Array.from({ length: 8 }, (_, i) => ({ title: `Page ${i}` })),
  artikel: [{ title: 'A' }]
});
assert.equal(groups.find((group) => group.key === 'pages').items.length, 5);
assert.equal(groups.find((group) => group.key === 'artikel').label, 'Artikel & Berita');

await access(new URL('../app/api/search/route.js', import.meta.url));
const route = await readFile(new URL('../app/api/search/route.js', import.meta.url), 'utf8');
for (const table of ['kegiatan', 'artikel', 'berita', 'jurnal', 'media']) {
  assert.ok(route.includes(table), `Search route missing ${table}`);
}
assert.ok(route.includes(".eq('published', true)"), 'Search route must filter published content');
assert.ok(route.includes(".eq('visible', true)"), 'Search route must filter visible content');

console.log('Global search helpers and API contract verified.');
