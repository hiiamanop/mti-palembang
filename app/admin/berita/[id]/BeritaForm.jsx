'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { saveBeritaItem, addBeritaItem } from '../../actions';
import ImageUpload from '../../components/ImageUpload';
import AdminAlert from '../../components/AdminAlert';
import { useUnsavedChanges } from '../../components/useUnsavedChanges';

export default function BeritaForm({ item, id }) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  useUnsavedChanges(isDirty);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedback(null);
    const formData = new FormData(e.target);
    startTransition(async () => {
      try {
        if (id === 'baru') {
          await addBeritaItem(formData);
        } else {
          await saveBeritaItem(id, formData);
        }
        setIsDirty(false);
      } catch (err) {
        setFeedback({ type: 'error', message: `Gagal menyimpan: ${err.message || 'Terjadi kesalahan'}` });
      }
    });
  };

  const defaultContent = item?.content ? item.content.join('\n\n') : '';
  const defaultHighlights = item?.highlights ? item.highlights.join('\n') : '';

  return (
    <div style={{ maxWidth: 840 }}>
      <div style={{ marginBottom: 16 }}>
        <Link
          href="/admin/berita"
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
          Kembali ke Daftar Berita
        </Link>
      </div>

      <AdminAlert {...feedback} />

      <div className="adminCard" style={{ padding: 32 }}>
        <form onSubmit={handleSubmit} onChange={() => setIsDirty(true)} className="adminForm">
          <div className="adminFormRow">
            <div className="adminFormGroup">
              <label>Judul Berita</label>
              <input name="title" defaultValue={item?.title || ''} required placeholder="Judul berita" />
            </div>
            <div className="adminFormGroup">
              <label>Slug (URL Otomatis)</label>
              <input name="slug" defaultValue={item?.slug || ''} placeholder="otomatis dibuat dari judul..." />
            </div>
          </div>

          <div className="adminFormRow">
            <div className="adminFormGroup">
              <label>Kategori</label>
              <select name="cat" defaultValue={item?.cat || 'Berita'}>
                <option value="Berita">Berita</option>
                <option value="Dialog">Dialog</option>
                <option value="Sinergi">Sinergi</option>
              </select>
            </div>
            <div className="adminFormGroup">
              <label>Kelompok Tampilan</label>
              <select name="group" defaultValue={item?.group || 'Berita'}>
                <option value="Berita">Berita</option>
                <option value="Sinergi">Sinergi</option>
              </select>
            </div>
          </div>

          <div className="adminFormRow">
            <div className="adminFormGroup">
              <label>Tanggal Rilis (misal: 27 Sep 2026)</label>
              <input name="date" defaultValue={item?.date || ''} placeholder="27 Sep 2026" />
            </div>
            <div className="adminFormGroup">
              <label>Tanggal Detail (misal: 27 September 2026)</label>
              <input name="detailDate" defaultValue={item?.detailDate || ''} placeholder="27 September 2026" />
            </div>
          </div>

          <div className="adminFormRow">
            <div className="adminFormGroup">
              <label>Penulis / Redaksi</label>
              <input name="author" defaultValue={item?.author || 'Redaksi MTI'} />
            </div>
            <div className="adminFormGroup">
              <label>Perkiraan Waktu Baca</label>
              <input name="readTime" defaultValue={item?.readTime || '3 menit baca'} />
            </div>
          </div>

          <div className="adminFormGroup">
            <label>Foto Berita (Maksimal 5 MB)</label>
            <ImageUpload name="img" defaultValue={item?.img || ''} />
          </div>

          <div className="adminFormGroup">
            <label>Ringkasan Kutipan / Excerpt</label>
            <textarea name="excerpt" defaultValue={item?.excerpt || ''} rows={3} placeholder="Ringkasan singkat..." />
          </div>

          <div className="adminFormGroup">
            <label>Konten Berita Lengkap</label>
            <textarea
              name="content"
              defaultValue={defaultContent}
              rows={12}
              placeholder="Tuliskan naskah berita di sini. Pisahkan antar paragraf dengan menekan tombol Enter dua kali."
            />
          </div>

          <div className="adminFormGroup">
            <label>Highlights / Topik Utama (satu per baris)</label>
            <textarea name="highlights" defaultValue={defaultHighlights} rows={3} placeholder="Topik 1&#10;Topik 2" />
          </div>

          <div className="adminFormGroup">
            <label>URL Sumber (Opsional)</label>
            <input name="sourceUrl" type="url" defaultValue={item?.sourceUrl || ''} placeholder="https://..." />
          </div>

          <div
            className="adminFormActions"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 20 }}
          >
            <Link href="/admin/berita" className="adminBtn adminBtnSecondary">
              Batal
            </Link>
            <button type="submit" className="adminBtn adminBtnPrimary" disabled={isPending}>
              <Save size={15} style={{ marginRight: 6 }} />
              {isPending ? 'Menyimpan...' : 'Simpan Berita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
