'use client';

import { useState, useTransition } from 'react';
import { Check, Send, AlertCircle } from 'lucide-react';
import { submitCrmContact } from '../../crm-actions';
import newsletterOverlay from '../../../assets/Banner-AKSES 2.png';

export default function CrmContact() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setResult(null);
    setFieldErrors({});

    startTransition(async () => {
      const response = await submitCrmContact(formData);
      if (response?.fieldErrors) {
        setFieldErrors(response.fieldErrors);
        return;
      }
      if (response?.error) {
        setResult({ type: 'error', message: response.error });
        return;
      }
      setResult({
        type: 'success',
        message: response.emailPending
          ? 'Terima kasih. Permintaan Anda sudah diterima. Email konfirmasi mungkin tertunda, tetapi tim kami tetap akan menindaklanjuti.'
          : 'Terima kasih. Permintaan Anda sudah diterima. Konfirmasi telah dikirim ke email Anda.'
      });
      form.reset();
    });
  }

  return (
    <section className="newsletter" id="crm">
      <div className="newsletterTexture" />
      <img className="newsletterOverlay" src={newsletterOverlay.src} alt="" aria-hidden="true" />
      <div className="newsletterInner">
        <p>KOLABORASI &amp; INFORMASI</p>
        <h2>Hubungi MTI Sumatera Selatan</h2>
        <span>
          Sampaikan kebutuhan informasi, peluang kolaborasi, keanggotaan, atau agenda transportasi
          kepada tim MTI Sumsel.
        </span>

        {result ? (
          <div className={result.type === 'success' ? 'successBox' : 'crmErrorBox'} role={result.type === 'error' ? 'alert' : 'status'}>
            <i>
              {result.type === 'success' ? <Check size={16} aria-hidden="true" /> : <AlertCircle size={16} aria-hidden="true" />}
            </i>
            {result.message}
          </div>
        ) : null}

        <form className="newsletterForm crmForm" onSubmit={handleSubmit} noValidate>
          <div className="crmField">
            <input name="name" placeholder="Nama Lengkap" aria-label="Nama Lengkap" aria-invalid={Boolean(fieldErrors.name)} />
            {fieldErrors.name ? <small>{fieldErrors.name}</small> : null}
          </div>
          <div className="crmField">
            <input name="email" type="email" placeholder="Email" aria-label="Email" aria-invalid={Boolean(fieldErrors.email)} />
            {fieldErrors.email ? <small>{fieldErrors.email}</small> : null}
          </div>
          <div className="crmField">
            <input name="institution" placeholder="Asal Institusi" aria-label="Asal Institusi" aria-invalid={Boolean(fieldErrors.institution)} />
            {fieldErrors.institution ? <small>{fieldErrors.institution}</small> : null}
          </div>
          <input
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="crmHoneypot"
          />
          <button type="submit" disabled={isPending}>
            <Send size={16} aria-hidden="true" />
            {isPending ? 'Mengirim permintaan...' : 'Kirim Permintaan Kontak'}
          </button>
        </form>
      </div>
    </section>
  );
}
