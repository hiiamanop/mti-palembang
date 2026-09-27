import assert from 'node:assert/strict';
import {
  IMAGE_MAX_BYTES,
  IMAGE_MAX_LABEL,
  IMAGE_TYPES,
  validateImage
} from '../lib/image-upload.js';

assert.equal(IMAGE_MAX_BYTES, 5 * 1024 * 1024);
assert.equal(IMAGE_MAX_LABEL, '5 MB');
assert.deepEqual(IMAGE_TYPES, ['image/jpeg', 'image/png', 'image/webp']);

assert.equal(validateImage(null), 'Pilih file gambar terlebih dahulu.');
assert.equal(
  validateImage({ size: 0, type: 'image/jpeg' }),
  'File gambar kosong atau tidak valid.'
);
assert.equal(
  validateImage({ size: 1024, type: 'image/gif' }),
  'Format gambar harus JPG, PNG, atau WebP.'
);
assert.equal(
  validateImage({ size: IMAGE_MAX_BYTES + 1, type: 'image/jpeg' }),
  'Ukuran gambar 5,0 MB melebihi batas maksimal 5 MB.'
);
assert.equal(validateImage({ size: IMAGE_MAX_BYTES, type: 'image/webp' }), '');

console.log('Image upload validation contract verified.');
