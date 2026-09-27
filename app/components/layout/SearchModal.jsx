'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';

export default function SearchModal({ open, onClose }) {
  const inputRef = useRef(null);
  const closeRef = useRef(null);
  const [query, setQuery] = useState('');
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const flatItems = groups.flatMap((group) => group.items);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      previous?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`, { signal: controller.signal });
        if (!response.ok) throw new Error('search unavailable');
        const data = await response.json();
        setGroups(data.groups || []);
        setActiveIndex(0);
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') setError('Pencarian sedang tidak tersedia. Silakan coba kembali.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, query ? 250 : 0);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [open, query]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, Math.max(flatItems.length - 1, 0)));
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
      }
      if (event.key === 'Enter' && flatItems[activeIndex]) {
        event.preventDefault();
        window.location.href = flatItems[activeIndex].href;
      }
      if (event.key === 'Tab') {
        const focusable = [inputRef.current, closeRef.current].filter(Boolean);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose, flatItems, activeIndex]);

  if (!open) return null;

  let globalIndex = -1;
  return (
    <div className="searchModalBackdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="searchModal" role="dialog" aria-modal="true" aria-label="Pencarian website">
        <div className="searchModalTop">
          <Search size={20} aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari kegiatan, artikel, berita, jurnal, atau media..."
            aria-label="Kata kunci pencarian"
          />
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Tutup pencarian"><X size={20} /></button>
        </div>

        <div className="searchModalBody">
          {loading ? <p className="searchMessage">Mencari konten...</p> : null}
          {error ? <p className="searchMessage searchMessageError" role="alert">{error}</p> : null}
          {!loading && !error && !groups.length ? (
            <p className="searchMessage">Tidak ada hasil untuk &ldquo;{query}&rdquo;. Coba kata kunci lain.</p>
          ) : null}

          {!loading && !error ? groups.map((group) => (
            <div className="searchGroup" key={group.key}>
              <h3>{group.label}</h3>
              {group.items.map((item) => {
                globalIndex += 1;
                const itemIndex = globalIndex;
                return (
                  <a
                    key={`${group.key}-${item.href}-${item.title}`}
                    href={item.href}
                    className={`searchResult ${activeIndex === itemIndex ? 'active' : ''}`}
                    onMouseEnter={() => setActiveIndex(itemIndex)}
                  >
                    <span><strong>{item.title}</strong>{item.description ? <small>{item.description}</small> : null}</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          )) : null}
        </div>

        <footer className="searchModalFooter">Gunakan ↑ ↓ untuk memilih, Enter untuk membuka, dan Esc untuk menutup.</footer>
      </section>
    </div>
  );
}
