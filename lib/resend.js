const RESEND_URL = 'https://api.resend.com/emails';

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function sendEmail(payload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { status: 'gagal', error: 'RESEND_API_KEY belum dikonfigurasi.' };

  try {
    const response = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const body = await response.text();
      return { status: 'gagal', error: `Resend ${response.status}: ${body.slice(0, 300)}` };
    }
    return { status: 'terkirim' };
  } catch (error) {
    return { status: 'gagal', error: error.message || 'Koneksi Resend gagal.' };
  }
}

export async function sendCrmEmails(contact) {
  const from = process.env.CRM_FROM_EMAIL || 'MTI Sumsel <kontak@mti-sumsel.or.id>';
  const replyTo = process.env.CRM_REPLY_TO || 'mtiwilayahsumsel@gmail.com';
  const notificationTo = process.env.CRM_NOTIFICATION_EMAIL || 'mtiwilayahsumsel@gmail.com';
  const name = escapeHtml(contact.name);
  const email = escapeHtml(contact.email);
  const institution = escapeHtml(contact.institution);
  const createdAt = new Date(contact.created_at || Date.now()).toLocaleString('id-ID', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta'
  });

  const internal = await sendEmail({
    from,
    to: [notificationTo],
    reply_to: contact.email,
    subject: `Kontak baru dari website MTI Sumsel — ${contact.name}`,
    html: `<h2>Kontak baru dari website MTI Sumsel</h2><p><strong>Nama:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Institusi:</strong> ${institution}</p><p><strong>Waktu:</strong> ${createdAt} WIB</p><p><a href="https://mti-sumsel.or.id/admin/kontak-crm">Buka daftar Kontak CRM</a></p>`
  });

  const confirmation = await sendEmail({
    from,
    to: [contact.email],
    reply_to: replyTo,
    subject: 'Permintaan Anda telah diterima — MTI Sumatera Selatan',
    html: `<h2>Terima kasih, ${name}</h2><p>Permintaan kontak Anda telah diterima oleh MTI Sumatera Selatan.</p><p>Tim kami akan meninjau informasi dari <strong>${institution}</strong> dan menghubungi Anda melalui email ini.</p><p>Jika perlu menambahkan informasi, balas email ini atau hubungi ${escapeHtml(replyTo)}.</p><p>Salam,<br><strong>MTI Sumatera Selatan</strong></p>`
  });

  return { internal, confirmation };
}
