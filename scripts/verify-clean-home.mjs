import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../app/HomeClient.jsx', import.meta.url), 'utf8');
const forbidden = [
  'https://www.youtube.com/embed/0_jL04tc3TY',
  "aksesData?.edition || 'Edisi 36'",
  "aksesData?.date || 'Maret 2026'",
  'Jurnal transportasi dengan tampilan editorial yang lebih kuat.'
];

for (const value of forbidden) {
  assert.equal(source.includes(value), false, `sample fallback remains: ${value}`);
}

for (const guard of ['tickerItems.length > 0', 'hasHero', 'news.length > 0', 'hasMedia', 'hasAboutSumsel', 'fokusIsu.length > 0']) {
  assert.equal(source.includes(guard), true, `missing empty-state guard: ${guard}`);
}

console.log('Clean homepage guards verified.');
