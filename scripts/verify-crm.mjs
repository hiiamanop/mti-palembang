import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateCrmInput } from '../lib/crm.js';

const schema = await readFile(new URL('../supabase/schema.sql', import.meta.url), 'utf8');
for (const token of [
  'create table if not exists public.crm_contacts',
  'institution text not null',
  'internal_email_status',
  'confirmation_email_status',
  'crm contacts admin all'
]) {
  assert.ok(schema.includes(token), `CRM schema missing: ${token}`);
}
assert.ok(!schema.includes('crm contacts public'), 'CRM must not expose a public RLS policy');

assert.deepEqual(validateCrmInput({ name: '', email: '', institution: '' }).fieldErrors, {
  name: 'Nama lengkap wajib diisi.',
  email: 'Email wajib diisi.',
  institution: 'Asal institusi wajib diisi.'
});
assert.equal(validateCrmInput({ name: 'A', email: 'bad', institution: 'X' }).fieldErrors.email, 'Format email tidak valid.');
assert.deepEqual(
  validateCrmInput({ name: '  Ahmad Naufal  ', email: ' AHMAD@example.com ', institution: '  MTI Sumsel  ' }),
  { data: { name: 'Ahmad Naufal', email: 'ahmad@example.com', institution: 'MTI Sumsel' } }
);

const env = await readFile(new URL('../.env.example', import.meta.url), 'utf8');
for (const key of ['RESEND_API_KEY', 'CRM_FROM_EMAIL', 'CRM_REPLY_TO', 'CRM_NOTIFICATION_EMAIL', 'CRM_RATE_LIMIT_SALT']) {
  assert.ok(env.includes(`${key}=`), `.env.example missing ${key}`);
}

const resend = await readFile(new URL('../lib/resend.js', import.meta.url), 'utf8');
assert.ok(resend.includes('api.resend.com/emails'), 'Resend service must call official REST API');
assert.ok(resend.includes('sendCrmEmails'), 'Resend service must export sendCrmEmails');

console.log('CRM schema, validation, and Resend service contract verified.');
