import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Share2 } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { getArtikelById } from '../../../lib/cms';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const artikel = await getArtikelById(id);
  if (!artikel) return { title: 'Artikel Tidak Ditemukan | MTI SUMSEL' };
  return {
    title: `${artikel.title} | MTI SUMSEL`,
    description: artikel.ringkasan || 'Artikel MTI Sumatera Selatan'
  };
}

export default async function ArtikelDetailPage({ params }) {
  const { id } = await params;
  const artikel = await getArtikelById(id);
  if (!artikel) notFound();

  return (
    <main className="artikelDetailPage" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Header activeItem="Artikel & Opini" />

      {/* ── Artikel Header Area ── */}
      <section
        style={{
          background: 'linear-gradient(180deg, #0b1330 0%, #112e81 100%)',
          color: '#ffffff',
          padding: '60px 0 50px'
        }}
      >
        <div className="wideShell" style={{ maxWidth: 840 }}>
          <Link
            href="/artikel"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: '#93c5fd',
              fontSize: 13.5,
              fontWeight: 700,
              textDecoration: 'none',
              marginBottom: 24
            }}
          >
            <ArrowLeft size={16} />
            Kembali ke Daftar Artikel
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 800,
                background: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: 6,
                textTransform: 'uppercase',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              {artikel.kategori || 'Opini'}
            </span>
            {artikel.daerah ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#cbd5e1' }}>
                <MapPin size={13} />
                {artikel.daerah}
              </span>
            ) : null}
            {artikel.date ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#cbd5e1' }}>
                <Calendar size={13} />
                {artikel.date}
              </span>
            ) : null}
          </div>

          <h1
            style={{
              margin: '0 0 16px',
              fontSize: 'clamp(28px, 3.5vw, 40px)',
              fontWeight: 800,
              lineHeight: 1.25,
              color: '#ffffff',
              letterSpacing: '-0.02em'
            }}
          >
            {artikel.title}
          </h1>

          {artikel.ringkasan ? (
            <p
              style={{
                margin: 0,
                fontSize: 17,
                lineHeight: 1.6,
                color: '#e2e8f0',
                fontStyle: 'italic',
                borderLeft: '3px solid #38bdf8',
                paddingLeft: 16
              }}
            >
              &ldquo;{artikel.ringkasan}&rdquo;
            </p>
          ) : null}
        </div>
      </section>

      {/* ── Artikel Content Area ── */}
      <section style={{ padding: '40px 0 80px' }}>
        <div className="wideShell" style={{ maxWidth: 840 }}>
          {artikel.gambar ? (
            <div
              style={{
                borderRadius: 14,
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                marginBottom: 36,
                maxHeight: 480,
                background: '#e2e8f0'
              }}
            >
              <img
                src={artikel.gambar}
                alt={artikel.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          ) : null}

          <div
            style={{
              background: '#ffffff',
              padding: '36px 40px',
              borderRadius: 14,
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              color: '#1e293b',
              fontSize: 16.5,
              lineHeight: 1.8
            }}
          >
            {artikel.konten?.length > 0 ? (
              artikel.konten.map((p, idx) => (
                <p key={idx} style={{ margin: '0 0 20px' }}>
                  {p}
                </p>
              ))
            ) : (
              <p style={{ margin: 0, color: '#64748b' }}>
                {artikel.ringkasan || 'Belum ada konten lengkap untuk artikel ini.'}
              </p>
            )}

            <div
              style={{
                marginTop: 40,
                paddingTop: 24,
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16
              }}
            >
              <Link
                href="/artikel"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  color: '#112e81',
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <ArrowLeft size={16} />
                Kembali ke Semua Artikel
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
