import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

await access(new URL('../app/components/layout/SearchModal.jsx', import.meta.url));
const modal = await readFile(new URL('../app/components/layout/SearchModal.jsx', import.meta.url), 'utf8');
for (const token of ['role="dialog"', 'aria-modal="true"', 'AbortController', 'setTimeout', "event.key === 'Escape'", "event.key === 'ArrowDown'", "event.key === 'ArrowUp'", "event.key === 'Enter'", '/api/search?q=']) {
  assert.ok(modal.includes(token), `SearchModal missing ${token}`);
}
const header = await readFile(new URL('../app/components/layout/Header.jsx', import.meta.url), 'utf8');
assert.ok(header.includes('<SearchModal'), 'Header must render SearchModal');
assert.ok(header.includes('setSearchOpen(true)'), 'Search button must open modal');
console.log('Global search modal accessibility contract verified.');
