'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const FALLBACK_IMAGES = [
  'https://mti.or.id/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-11-at-20.25.20-scaled.jpeg',
  'https://mti.or.id/wp-content/uploads/2023/07/Screenshot-2023-07-01-at-17.28.41.png',
  'https://mti.or.id/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-15-at-15.20.45.jpeg'
];

export default function ProgramCarousel({ items = [] }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const total = items.length;

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const cardWidth = el.querySelector('.programCardItem')?.offsetWidth || clientWidth;
    const newIdx = Math.round(scrollLeft / (cardWidth + 24));
    setActiveIndex(Math.min(Math.max(0, newIdx), total - 1));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [total]);

  const scrollByCard = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector('.programCardItem');
    const scrollAmount = card ? card.offsetWidth + 24 : 360;
    el.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="programShowcase">
      {/* ── Section Header with Integrated Controls ── */}
      <div className="programHeaderRow">
        <div className="programHeaderTitles">
          <div className="headerKicker">
            <span className="kickerBar" />
            <span className="kickerText">AKSI NYATA &amp; KOLABORASI</span>
          </div>
          <h2>Program Unggulan MTI Sumatera Selatan</h2>
          <p>
            Inisiatif rutin advokasi, penyerapan aspirasi publik, dan perumusan rekomendasi
            kebijakan transportasi daerah.
          </p>
        </div>

        {total > 1 ? (
          <div className="programControls">
            <div className="programCounter">
              <strong>0{activeIndex + 1}</strong>
              <span>/</span>
              <span>0{total}</span>
            </div>
            <div className="programNavGroup">
              <button
                type="button"
                className={`programNavBtn ${!canScrollLeft ? 'disabled' : ''}`}
                onClick={() => scrollByCard(-1)}
                disabled={!canScrollLeft}
                aria-label="Geser ke kiri"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className={`programNavBtn ${!canScrollRight ? 'disabled' : ''}`}
                onClick={() => scrollByCard(1)}
                disabled={!canScrollRight}
                aria-label="Geser ke kanan"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* ── Horizontal Multi-Card Track ── */}
      <div className="programTrackContainer" ref={scrollRef}>
        <div className="programTrack">
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
    </div>
  );
}
