'use server';

import { headers } from 'next/headers';
import { createAdminClient } from '../lib/supabase/admin';
import { hashClientIp, validateCrmInput } from '../lib/crm';
import { sendCrmEmails } from '../lib/resend';

export async function submitCrmContact(formData) {
  if (String(formData.get('website') || '').trim()) {
    return { success: true };
  }

  const input = validateCrmInput({
    name: formData.get('name'),
    email: formData.get('email'),
    institution: formData.get('institution')
  });
  if (input.fieldErrors) return input;

  const headerList = await headers();
  const forwarded = headerList.get('x-forwarded-for')?.split(',')[0]?.trim();
  const ip = forwarded || headerList.get('x-real-ip') || '';
  const ipHash = hashClientIp(ip);
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const admin = createAdminClient();

  const [{ count: emailCount, error: emailCountError }, ipRate] = await Promise.all([
    admin
      .from('crm_contacts')
      .select('*', { count: 'exact', head: true })
      .eq('email', input.data.email)
      .gte('created_at', since),
    ipHash
      ? admin
          .from('crm_contacts')
          .select('*', { count: 'exact', head: true })
          .eq('ip_hash', ipHash)
          .gte('created_at', since)
      : Promise.resolve({ count: 0, error: null })
  ]);

  if (emailCountError || ipRate.error) {
    return { error: 'Sistem kontak sedang sibuk. Silakan coba kembali.' };
  }
  if ((emailCount || 0) >= 3 || (ipRate.count || 0) >= 5) {
    return { error: 'Permintaan terlalu sering. Silakan tunggu sebelum mencoba kembali.' };
  }

  const { data: contact, error: insertError } = await admin
    .from('crm_contacts')
    .insert({ ...input.data, ip_hash: ipHash })
    .select('*')
    .single();

  if (insertError) return { error: 'Permintaan belum dapat disimpan. Silakan coba kembali.' };

  const emails = await sendCrmEmails(contact);
  const errors = [emails.internal.error, emails.confirmation.error].filter(Boolean).join(' | ');
  await admin
    .from('crm_contacts')
    .update({
      internal_email_status: emails.internal.status,
      confirmation_email_status: emails.confirmation.status,
      email_error: errors || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', contact.id);

  return {
    success: true,
    emailPending: emails.confirmation.status !== 'terkirim'
  };
}
