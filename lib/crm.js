import { createHash } from 'node:crypto';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCrmInput(input) {
  const data = {
    name: String(input?.name || '').trim(),
    email: String(input?.email || '').trim().toLowerCase(),
    institution: String(input?.institution || '').trim()
  };
  const fieldErrors = {};

  if (!data.name) fieldErrors.name = 'Nama lengkap wajib diisi.';
  else if (data.name.length < 2) fieldErrors.name = 'Nama lengkap minimal 2 karakter.';
  else if (data.name.length > 120) fieldErrors.name = 'Nama lengkap maksimal 120 karakter.';

  if (!data.email) fieldErrors.email = 'Email wajib diisi.';
  else if (data.email.length > 254 || !EMAIL_PATTERN.test(data.email)) fieldErrors.email = 'Format email tidak valid.';

  if (!data.institution) fieldErrors.institution = 'Asal institusi wajib diisi.';
  else if (data.institution.length < 2) fieldErrors.institution = 'Asal institusi minimal 2 karakter.';
  else if (data.institution.length > 160) fieldErrors.institution = 'Asal institusi maksimal 160 karakter.';

  return Object.keys(fieldErrors).length ? { fieldErrors } : { data };
}

export function hashClientIp(ip, salt = process.env.CRM_RATE_LIMIT_SALT) {
  if (!ip || !salt) return null;
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

export function crmStatusLabel(status) {
  return {
    baru: 'Baru',
    sudah_dihubungi: 'Sudah Dihubungi',
    selesai: 'Selesai'
  }[status] || status;
}
