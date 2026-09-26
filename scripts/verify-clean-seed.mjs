import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const readJSON = async (name) =>
  JSON.parse(await readFile(new URL(`../data/${name}.json`, import.meta.url), 'utf8'));

for (const name of ['berita', 'jurnal', 'artikel']) {
  assert.deepEqual(await readJSON(name), [], `${name}.json must be empty`);
}

assert.deepEqual(await readJSON('beranda'), {
  ticker: [],
  leadStory: {},
  heroSide: [],
  regions: [],
  akses: {}
});

assert.deepEqual(await readJSON('media'), {
  mainVideo: {},
  miniVideos: []
});

console.log('Clean seed contract verified.');
