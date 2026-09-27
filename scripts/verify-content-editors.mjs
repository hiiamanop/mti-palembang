import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

// 1. Verify isolated routes exist
await access(new URL('../app/admin/kegiatan/baru/page.jsx', import.meta.url));
await access(new URL('../app/admin/kegiatan/[id]/page.jsx', import.meta.url));
await access(new URL('../app/admin/artikel/baru/page.jsx', import.meta.url));
await access(new URL('../app/admin/artikel/[id]/page.jsx', import.meta.url));

// 2. Verify table pages no longer expand inline forms inside table rows
const kegiatanSource = await readFile(new URL('../app/admin/kegiatan/page.jsx', import.meta.url), 'utf8');
assert.equal(kegiatanSource.includes('<KegiatanFields'), false, 'kegiatan page must not contain inline form fields in table');

const artikelSource = await readFile(new URL('../app/admin/artikel/page.jsx', import.meta.url), 'utf8');
assert.equal(artikelSource.includes('<ArtikelFields'), false, 'artikel page must not contain inline form fields in table');

console.log('Isolated content editors contract verified.');
