import assert from 'node:assert/strict';
import {
  filterKegiatanByYear,
  formatKegiatanDate,
  getKegiatanYears,
  isValidISODate
} from '../lib/kegiatan.js';

assert.equal(isValidISODate('2026-02-28'), true);
assert.equal(isValidISODate('2026-02-30'), false);
assert.equal(isValidISODate('26-02-28'), false);
assert.equal(isValidISODate(''), false);

const items = [
  { id: 'a', date: '2025-01-01' },
  { id: 'b', date: '2026-09-20' },
  { id: 'c', date: '2026-01-10' },
  { id: 'd', date: 'invalid' }
];
assert.deepEqual(getKegiatanYears(items), [2026, 2025]);
assert.deepEqual(filterKegiatanByYear(items, 'Semua'), items);
assert.deepEqual(filterKegiatanByYear(items, 2026).map((item) => item.id), ['b', 'c']);
assert.equal(formatKegiatanDate('2026-09-20'), '20 September 2026');
assert.equal(formatKegiatanDate('invalid'), '');

console.log('Kegiatan date and year helpers verified.');
