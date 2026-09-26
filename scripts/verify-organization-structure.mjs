import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  ORGANIZATION_GROUPS,
  ORGANIZATION_KEYS,
  resolveOrganizationGroup
} from '../lib/organization-structure.js';

assert.deepEqual(Object.keys(ORGANIZATION_GROUPS), [
  'advisory',
  'experts',
  'leadership',
  'divisions'
]);
assert.equal(ORGANIZATION_KEYS.length, 24);
assert.equal(new Set(ORGANIZATION_KEYS).size, 24, 'organization keys must be unique');

const resolved = resolveOrganizationGroup(ORGANIZATION_GROUPS.leadership, {
  'ketua-umum': '  Nama Ketua  ',
  unknown: 'Ignored'
});
assert.equal(resolved[0].role, 'Ketua Umum');
assert.equal(resolved[0].badge, 'Ketua');
assert.equal(resolved[0].name, 'Nama Ketua');
assert.equal(resolved[1].name, '—');
assert.equal(resolved.some((item) => item.key === 'unknown'), false);

const seed = JSON.parse(
  await readFile(new URL('../data/struktur-organisasi.json', import.meta.url), 'utf8')
);
assert.deepEqual(seed, { names: {} });

console.log('Fixed organization structure and empty seed verified.');
