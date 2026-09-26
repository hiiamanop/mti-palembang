'use client';

import { ArrowRight } from 'lucide-react';

const FALLBACK_IMAGES = [
  'https://mti.or.id/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-11-at-20.25.20-scaled.jpeg',
  'https://mti.or.id/wp-content/uploads/2023/07/Screenshot-2023-07-01-at-17.28.41.png',
  'https://mti.or.id/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-15-at-15.20.45.jpeg'
];

export default function ProgramCarousel({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="programShowcase">
      {/* ── Section Header ── */}
      <div className="editorialSectionHeader centered">
        <div className="headerKicker">
          <span className="kickerBar" />
          <span className="kickerText">AKSI NYATA &amp; KOLABORASI</span>
        </div>
        <div className="headerMain">
          <h2>Program Unggulan MTI Sumatera Selatan</h2>
          <p>
            Inisiatif rutin advokasi, penyerapan aspirasi publik, dan perumusan rekomendasi
            kebijakan transportasi daerah.
          </p>
        </div>
      </div>

      {/* ── 3-Card Symmetric Grid ── */}
      <div className="programCardsGrid">
        {items.map((item, index) => {
          const imageSrc = item.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
          return (
            <article className="programCardItem" key={item.id || index}>
              <div className="programCardMedia">
                <img src={imageSrc} alt={item.title || 'Program MTI'} />
                <div className="mediaScrim" />
                {item.tag ? <span className="programBadge">{item.tag}</span> : null}
                <span className="programIndexTag">0{index + 1}</span>
              </div>

              <div className="programCardContent">
                <h3>{item.title}</h3>
                {item.summary ? <p>{item.summary}</p> : null}

                <div className="programCardFoot">
                  <a href="/kegiatan-mti" className="programActionLink">
                    <span>Lihat Agenda Terkait</span>
                    <ArrowRight size={14} className="actionArrow" />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
