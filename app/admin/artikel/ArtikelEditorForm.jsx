'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, Save, Calendar, MapPin, ArrowRight, LayoutList, FileText } from 'lucide-react';
import { addArtikelItem, saveArtikelItem } from '../actions';
import ImageUpload from '../components/ImageUpload';
import AdminAlert from '../components/AdminAlert';
import RichTextEditor from '../components/RichTextEditor';
import { savePreviewDraft } from '../../../lib/preview-storage';
import { useUnsavedChanges } from '../components/useUnsavedChanges';

export default function ArtikelEditorForm({ item = null, id = null, isNew = false }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Form State for Live Preview
  const initialCategory = item?.kategori === 'Berita' ? 'Berita' : 'Artikel';
  const [title, setTitle] = useState(item?.title || '');
  const [kategori, setKategori] = useState(initialCategory);
  const [daerah, setDaerah] = useState(item?.daerah || '');
  const [date, setDate] = useState(item?.date || '');
  const [gambar, setGambar] = useState(item?.gambar || '');
  const [ringkasan, setRingkasan] = useState(item?.ringkasan || '');
  const [konten, setKonten] = useState(
    item?.konten ? (Array.isArray(item.konten) ? item.konten.join('\n\n') : String(item.konten)) : ''
  );
  const [previewTab, setPreviewTab] = useState('card'); // 'card' or 'reader'

  useUnsavedChanges(isDirty);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedback(null);
    const fd = new FormData(e.target);
    fd.set('kategori', kategori);
    fd.set('konten', konten);

    startTransition(async () => {
      const res = isNew ? await addArtikelItem(fd) : await saveArtikelItem(id, fd);
      if (res?.error) {
        setFeedback({ type: 'error', message: `Gagal menyimpan: ${res.error}` });
      } else {
        setIsDirty(false);
        setFeedback({
          type: 'success',
          message: 'Artikel & Berita berhasil disimpan dan langsung tampil di website publik!',
          linkHref: '/artikel'
        });
        if (isNew) {
          setTimeout(() => {
            router.push('/admin/artikel');
          }, 1500);
        }
      }
    });
  };

  const handlePreviewTabOpen = () => {
    const parsedKonten = konten
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean);

    savePreviewDraft('artikel', {
      id: id || 'preview-draft',
      title: title || 'Judul Draf Artikel & Berita',
      kategori,
      daerah: daerah || 'Sumatera Selatan',
      date: date || '27 Sep 2026',
      ringkasan,
      gambar,
      konten: parsedKonten,
      visible: true
    });

    window.open('/artikel?preview=1', '_blank');
  };

  const previewParagraphs = konten
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Link
          href="/admin/artikel"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 700,
            color: '#112e81',
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={14} />
          Kembali ke Daftar Artikel &amp; Berita
        </Link>
      </div>

      <div className="adminPageHeader">
        <div>
          <h1>{isNew ? 'Tambah Artikel / Berita Baru' : 'Edit Artikel & Berita'}</h1>
          <p>{isNew ? 'Tuliskan rilis artikel atau berita resmi MTI Sumatera Selatan' : `Mengedit: ${item?.title}`}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" onClick={handlePreviewTabOpen} className="adminBtn adminBtnSecondary">
            <Eye size={15} style={{ marginRight: 6 }} />
            ↗ Buka Pratinjau Tab Baru
          </button>
        </div>
      </div>

      <AdminAlert {...feedback} />

      {/* ── 2-Column Responsive Layout: Left Editor, Right Live Preview ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 28,
          alignItems: 'start'
        }}
      >
        {/* ── Left Column: Form Editor ── */}
        <div className="adminCard" style={{ padding: 28 }}>
          <form onSubmit={handleSubmit} onChange={() => setIsDirty(true)} className="adminForm">
            <div className="adminFormGroup">
              <label>Judul Artikel / Berita</label>
              <input
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul artikel atau siaran berita..."
                required
              />
            </div>

            <div className="adminFormRow">
              <div className="adminFormGroup" style={{ flex: 1 }}>
                <label>Tipe / Kategori</label>
                <select
                  name="kategori"
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  style={{ fontWeight: 700, color: '#112e81' }}
                >
                  <option value="Artikel">Artikel</option>
                  <option value="Berita">Berita</option>
                </select>
              </div>

              <div className="adminFormGroup" style={{ flex: 1 }}>
                <label>Penulis / Daerah</label>
                <input
                  name="daerah"
                  value={daerah}
                  onChange={(e) => setDaerah(e.target.value)}
                  placeholder="Contoh: Palembang atau Ir. H. Ahmad"
                />
              </div>

              <div className="adminFormGroup" style={{ flex: 1 }}>
                <label>Tanggal Tayang</label>
                <input
                  name="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="27 Sep 2026"
                />
              </div>
            </div>

            <div className="adminFormGroup">
              <label>Foto Cover / Dokumentasi (Maksimal 5 MB)</label>
              <ImageUpload
                name="gambar"
                defaultValue={gambar}
                withPosition={false}
              />
            </div>

            <div className="adminFormGroup">
              <label>Ringkasan Singkat / Abstrak</label>
              <textarea
                name="ringkasan"
                value={ringkasan}
                onChange={(e) => setRingkasan(e.target.value)}
                rows={3}
                placeholder="Ringkasan 1-2 kalimat pengantar artikel yang akan tampil pada kartu daftar..."
              />
            </div>

            <div className="adminFormGroup">
              <label>Isi Konten Lengkap</label>
              <RichTextEditor
                name="konten"
                value={konten}
                onChange={(val) => {
                  setKonten(val);
                  setIsDirty(true);
                }}
                placeholder="Tuliskan naskah lengkap artikel atau berita di sini. Gunakan tombol toolbar di atas untuk menebalkan teks, menambahkan subjudul, kutipan, poin, atau paragraf baru..."
              />
            </div>

            <div
              className="adminFormActions"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 20 }}
            >
              <Link href="/admin/artikel" className="adminBtn adminBtnSecondary">
                Batal
              </Link>
              <button type="submit" className="adminBtn adminBtnPrimary" disabled={isPending}>
                <Save size={15} style={{ marginRight: 6 }} />
                {isPending ? 'Menyimpan...' : 'Simpan ke Website'}
              </button>
            </div>
          </form>
        </div>

        {/* ── Right Column: Sticky Live Preview Panel ── */}
        <div style={{ position: 'sticky', top: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="adminCard" style={{ padding: 20 }}>
            {/* Preview Mode Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                Pratinjau Langsung (Live Preview)
              </div>
              <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 3, borderRadius: 8 }}>
                <button
                  type="button"
                  onClick={() => setPreviewTab('card')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: 'none',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    background: previewTab === 'card' ? '#ffffff' : 'transparent',
                    color: previewTab === 'card' ? '#112e81' : '#64748b',
                    boxShadow: previewTab === 'card' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  <LayoutList size={13} />
                  Kartu Daftar
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('reader')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: 'none',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    background: previewTab === 'reader' ? '#ffffff' : 'transparent',
                    color: previewTab === 'reader' ? '#112e81' : '#64748b',
                    boxShadow: previewTab === 'reader' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  <FileText size={13} />
                  Halaman Baca
                </button>
              </div>
            </div>

            {/* ── Mode 1: Kartu Daftar ── */}
            {previewTab === 'card' && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 10 }}>
                  Simulasi tampilan kartu di halaman <strong>/artikel</strong>:
                </div>
                <article
                  style={{
                    background: '#ffffff',
                    borderRadius: 14,
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
                  }}
                >
                  {gambar ? (
                    <div style={{ width: '100%', height: 160, overflow: 'hidden', background: '#f1f5f9' }}>
                      <img src={gambar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ width: '100%', height: 120, background: 'linear-gradient(135deg, #112e81, #1e4fd8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14 }}>
                      MTI SUMSEL
                    </div>
                  )}

                  <div style={{ padding: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 10.5, fontWeight: 800, background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase' }}>
                        {kategori}
                      </span>
                      {daerah ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#64748b' }}>
                          <MapPin size={11} /> {daerah}
                        </span>
                      ) : null}
                      {date ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#64748b' }}>
                          <Calendar size={11} /> {date}
                        </span>
                      ) : null}
                    </div>

                    <h4 style={{ margin: '0 0 8px', fontSize: 15.5, fontWeight: 800, color: '#0f172a', lineHeight: 1.35 }}>
                      {title || 'Judul artikel atau berita akan tampil di sini...'}
                    </h4>

                    <p style={{ margin: '0 0 14px', fontSize: 12.5, color: '#475569', lineHeight: 1.5 }}>
                      {ringkasan || 'Ringkasan singkat artikel akan tampil di sini...'}
                    </p>

                    <div style={{ paddingTop: 10, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#112e81' }}>
                      Baca Selengkapnya <ArrowRight size={13} />
                    </div>
                  </div>
                </article>
              </div>
            )}

            {/* ── Mode 2: Halaman Baca Penuh ── */}
            {previewTab === 'reader' && (
              <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 10 }}>
                  Simulasi halaman baca artikel lengkap:
                </div>

                {/* Simulated Hero */}
                <div style={{ background: 'linear-gradient(180deg, #0b1330 0%, #112e81 100%)', color: '#fff', borderRadius: 10, padding: 20, marginBottom: 14 }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 10, fontWeight: 800, background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: 4 }}>
                      {kategori}
                    </span>
                    <span style={{ fontSize: 11, color: '#cbd5e1' }}>{daerah} &bull; {date}</span>
                  </div>
                  <h3 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>
                    {title || 'Judul Artikel / Berita'}
                  </h3>
                  {ringkasan ? (
                    <div style={{ fontSize: 12.5, color: '#e2e8f0', fontStyle: 'italic', borderLeft: '2px solid #38bdf8', paddingLeft: 10 }}>
                      &ldquo;{ringkasan}&rdquo;
                    </div>
                  ) : null}
                </div>

                {/* Simulated Content Box */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 18 }}>
                  {gambar ? (
                    <img src={gambar} alt="" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, marginBottom: 14 }} />
                  ) : null}

                  {previewParagraphs.length > 0 ? (
                    previewParagraphs.map((p, idx) => (
                      <p key={idx} style={{ margin: '0 0 12px', fontSize: 13, lineHeight: 1.7, color: '#334155', whiteSpace: 'pre-line' }}>
                        {p}
                      </p>
                    ))
                  ) : (
                    <p style={{ margin: 0, fontSize: 12.5, color: '#94a3b8', fontStyle: 'italic' }}>
                      Ketikkan isi naskah artikel pada text editor di sebelah kiri untuk melihat pembagian paragraf secara langsung di sini.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
