export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const IMAGE_MAX_LABEL = '5 MB';
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function validateImage(file) {
  if (!file) return 'Pilih file gambar terlebih dahulu.';
  if (!file.size) return 'File gambar kosong atau tidak valid.';
  if (!IMAGE_TYPES.includes(file.type)) return 'Format gambar harus JPG, PNG, atau WebP.';
  if (file.size > IMAGE_MAX_BYTES) {
    const size = (file.size / 1024 / 1024).toLocaleString('id-ID', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });
    return `Ukuran gambar ${size} MB melebihi batas maksimal ${IMAGE_MAX_LABEL}.`;
  }
  return '';
}
