'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { loadPreviewDraft } from '../../lib/preview-storage';
import PreviewBanner from '../components/shared/PreviewBanner';

const CATEGORIES = ['Semua', 'Opini', 'Berita Wilayah', 'Analisis'];

export default function ArtikelClient({ initialArticles = [] }) {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === '1';

  const [articles, setArticles] = useState(initialArticles);
  const [selectedCat, setSelectedCat] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isPreview) {
      const draft = loadPreviewDraft('artikel');
      if (draft && draft.title) {
        setArticles((prev) => {
          const filtered = prev.filter((a) => a.id !== draft.id);
          return [draft, ...filtered];
        });
      }
    }
  }, [isPreview]);

  const filtered = useMemo(() => {
    return articles.filter((item) => {
      const matchCat =
        selectedCat === 'Semua' ||
        (item.kategori && item.kategori.toLowerCase() === selectedCat.toLowerCase());
      const query = searchQuery.trim().toLowerCase();
      const matchQuery =
        !query ||
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.ringkasan && item.ringkasan.toLowerCase().includes(query)) ||
        (item.daerah && item.daerah.toLowerCase().includes(query));
      return matchCat && matchQuery;
    });
  }, [articles, selectedCat, searchQuery]);

  return (
    <>
      {isPreview ? <PreviewBanner /> : null}

      <div className="wideShell" style={{ padding: '48px 0 80px' }}>
        {/* ── Toolbar: Filter Kategori & Search ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 36,
            paddingBottom: 20,
            borderBottom: '1px solid #e2e8f0'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: selectedCat === cat ? '#112e81' : '#cbd5e1',
                  background: selectedCat === cat ? '#112e81' : '#ffffff',
                  color: selectedCat === cat ? '#ffffff' : '#475569',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', minWidth: 260 }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8'
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari artikel atau isu..."
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: 8,
                border: '1.5px solid #cbd5e1',
                fontSize: 13.5,
                outline: 'none',
                background: '#ffffff',
                color: '#1e293b'
              }}
            />
          </div>
        </div>

        {/* ── Grid Kartu Artikel ── */}
        {filtered.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 28
            }}
          >
            {filtered.map((item) => (
              <article
                key={item.id}
                style={{
                  background: '#ffffff',
                  borderRadius: 14,
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                {item.gambar ? (
                  <div style={{ width: '100%', height: 200, overflow: 'hidden', background: '#f1f5f9' }}>
                    <img
                      src={item.gambar}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: 180,
                      background: 'linear-gradient(135deg, #112e81, #1e4fd8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: 18,
                      letterSpacing: '0.05em'
                    }}
                  >
                    MTI SUMSEL
                  </div>
                )}

                <div style={{ padding: 22, display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        padding: '3px 8px',
                        borderRadius: 4,
                        textTransform: 'uppercase'
                      }}
                    >
                      {item.kategori || 'Opini'}
                    </span>
                    {item.daerah ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748b' }}>
                        <MapPin size={12} />
                        {item.daerah}
                      </span>
                    ) : null}
                    {item.date ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748b' }}>
                        <Calendar size={12} />
                        {item.date}
                      </span>
                    ) : null}
                  </div>

                  <h3 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 800, color: '#0f172a', lineHeight: 1.35 }}>
                    <Link href={`/artikel/${item.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {item.title}
                    </Link>
                  </h3>

                  <p
                    style={{
                      margin: '0 0 18px',
                      fontSize: 14,
                      color: '#475569',
                      lineHeight: 1.6,
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {item.ringkasan || (item.konten?.[0] ? item.konten[0].slice(0, 160) + '...' : '')}
                  </p>

                  <div style={{ paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
                    <Link
                      href={`/artikel/${item.id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: '#112e81',
                        textDecoration: 'none'
                      }}
                    >
                      Baca Selengkapnya
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: '#ffffff',
              borderRadius: 12,
              border: '1px solid #e2e8f0'
            }}
          >
            <p style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
              Tidak ada artikel yang cocok.
            </p>
            <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>
              Coba ubah kata kunci pencarian atau pilih kategori lain.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
