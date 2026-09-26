'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function ProgramCarousel({ items = [] }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const total = items.length;

  useEffect(() => {
    if (total <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(timer);
  }, [total, isPaused]);

  if (!items || items.length === 0) return null;

  const nextSlide = () => setCurrent((prev) => (prev + 1) % total);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + total) % total);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="programCarouselWrap"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Program Unggulan MTI Sumsel"
    >
      <div className="carouselTrackViewport">
        <div
          className="carouselTrack"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {items.map((item, index) => (
            <div
              className={`carouselSlide ${index === current ? 'active' : ''}`}
              key={item.id || index}
              aria-hidden={index !== current}
            >
              <div className="slideCard">
                <div className="slideMedia">
                  {item.image ? (
                    <img src={item.image} alt={item.title || ''} className="slideImage" />
                  ) : (
                    <div className="slidePatternFallback">
                      <div className="slidePatternGlow" />
                      <Sparkles size={56} className="slidePatternIcon" />
                      <span>Dokumentasi Program</span>
                    </div>
                  )}
                  <div className="slideMediaOverlay" />
                </div>

                <div className="slideContent">
                  <div className="slideTagRow">
                    {item.tag ? <span className="slideBadge">{item.tag}</span> : null}
                    <span className="slideCounter">
                      0{index + 1} / 0{total}
                    </span>
                  </div>

                  <h3 className="slideTitle">{item.title}</h3>
                  {item.summary ? <p className="slideSummary">{item.summary}</p> : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {total > 1 ? (
        <div className="carouselControlBar">
          <div className="carouselDots" role="tablist">
            {items.map((item, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-label={`Slide ${i + 1}: ${item.title || ''}`}
                className={`carouselDot ${i === current ? 'active' : ''}`}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>

          <div className="carouselNavBtns">
            <button
              type="button"
              className="carouselArrowBtn"
              onClick={prevSlide}
              aria-label="Slide sebelumnya"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="carouselArrowBtn"
              onClick={nextSlide}
              aria-label="Slide berikutnya"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
