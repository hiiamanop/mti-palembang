'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import newsletterOverlay from '../../../assets/Banner-AKSES 2.png';

export default function Newsletter() {
  const [nlDone, setNlDone] = useState(false);
  const [nlName, setNlName] = useState('');
  const [nlEmail, setNlEmail] = useState('');
  const [subscriber, setSubscriber] = useState('rekan MTI');

  function handleNewsletter(event) {
    event.preventDefault();
    setSubscriber(nlName.trim() || 'rekan MTI');
    setNlDone(true);
    setNlEmail('');
  }

  return (
    <section className="newsletter" id="newsletter">
      <div className="newsletterTexture" />
      <img className="newsletterOverlay" src={newsletterOverlay.src} alt="" aria-hidden="true" />
      <div className="newsletterInner">
        <p>Sinergi Mewarnai Kemajuan Transportasi Indonesia</p>
        <h2>Berlangganan Newsletter MTI</h2>
        <span>
          Kabar kegiatan, rekomendasi kebijakan, dan jurnal AKSES Nusantara langsung ke email Anda.
        </span>
        {nlDone ? (
          <div className="successBox">
            <i>
              <Check size={16} aria-hidden="true" />
            </i>
            Terima kasih, {subscriber}. Anda berhasil berlangganan.
          </div>
        ) : (
          <form className="newsletterForm" onSubmit={handleNewsletter}>
            <input
              value={nlName}
              onChange={(event) => setNlName(event.target.value)}
              placeholder="Nama"
              aria-label="Nama"
            />
            <input
              value={nlEmail}
              onChange={(event) => setNlEmail(event.target.value)}
              type="email"
              placeholder="Email"
              aria-label="Email"
              required
            />
            <button type="submit">Subscribe</button>
          </form>
        )}
      </div>
    </section>
  );
}
