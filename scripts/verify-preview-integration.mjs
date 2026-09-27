import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// 1. Verify KegiatanClient has preview integration
const kegiatanSource = await readFile(new URL('../app/kegiatan-mti/KegiatanClient.jsx', import.meta.url), 'utf8');
assert.ok(kegiatanSource.includes('loadPreviewDraft'), 'KegiatanClient must import loadPreviewDraft');
assert.ok(kegiatanSource.includes('PreviewBanner'), 'KegiatanClient must import PreviewBanner');

// 2. Verify ArtikelClient has preview integration
const artikelSource = await readFile(new URL('../app/artikel/ArtikelClient.jsx', import.meta.url), 'utf8');
assert.ok(artikelSource.includes('loadPreviewDraft'), 'ArtikelClient must import loadPreviewDraft');
assert.ok(artikelSource.includes('PreviewBanner'), 'ArtikelClient must import PreviewBanner');

// 3. Verify HomeClient has preview integration
const homeSource = await readFile(new URL('../app/HomeClient.jsx', import.meta.url), 'utf8');
assert.ok(homeSource.includes('loadPreviewDraft'), 'HomeClient must import loadPreviewDraft');
assert.ok(homeSource.includes('PreviewBanner'), 'HomeClient must import PreviewBanner');

console.log('Public page preview integration contract verified.');
