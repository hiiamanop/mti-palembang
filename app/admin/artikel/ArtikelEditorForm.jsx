'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, Save } from 'lucide-react';
import { addArtikelItem, saveArtikelItem } from '../actions';
import ImageUpload from '../components/ImageUpload';
import AdminAlert from '../components/AdminAlert';
import { savePreviewDraft } from '../../../lib/preview-storage';
import { useUnsavedChanges } from '../components/useUnsavedChanges';

export default function ArtikelEditorForm({ item = null, id = null, isNew = false }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  useUnsavedChanges(isDirty);

  const defaultKonten = item?.konten ? item.konten.join('\n\n') : '';

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedback(null);
    const fd = new FormData(e.target);

    startTransition(async () => {
      const res = isNew ? await addArtikelItem(fd) : await saveArtikelItem(id, fd);
      if (res?.error) {
        setFeedback({ type: 'error', message: `Gagal menyimpan: ${res.error}` });
      } else {
        setIsDirty(false);
        setFeedback({
          type: 'success',
          message: 'Artikel berhasil disimpan dan langsung tampil di website publik!',
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

  const handlePreview = () => {
    const title = document.querySelector('[name="title"]')?.value || 'Judul Draf Artikel';
    const kategori = document.querySelector('[name="kategori"]')?.value || 'Opini';
    const daerah = document.querySelector('[name="daerah"]')?.value || 'Sumatera Selatan';
    const date = document.querySelector('[name="date"]')?.value || '27 Sep 2026';
    const ringkasan = document.querySelector('[name="ringkasan"]')?.value || '';
    const gambar = document.querySelector('[name="gambar"]')?.value || '';
    const kontenRaw = document.querySelector('[name="konten"]')?.value || '';
    const konten = kontenRaw.split('\n\n').filter(Boolean);

    savePreviewDraft('artikel', {
      id: id || 'preview-draft',
      title,
      kategori,
      daerah,
      date,
      ringkasan,
      gambar,
      konten,
      visible: true
    });

    window.open('/artikel?preview=1', '_blank');
  };

  return (
    <div style={{ maxWidth: 840 }}>
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
          Kembali ke Daftar Artikel
        </Link>
      </div>

      <div className="adminPageHeader">
        <div>
          <h1>{isNew ? 'Tambah Artikel Baru' : 'Edit Artikel'}</h1>
          <p>{isNew ? 'Tuliskan artikel opini, analisis, atau kabar wilayah baru' : `Mengedit artikel: ${item?.title}`}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" onClick={handlePreview} className="adminBtn adminBtnSecondary">
            <Eye size={15} style={{ marginRight: 6 }} />
            ↗ Pratinjau di Tab Baru
          </button>
        </div>
      </div>

      <AdminAlert {...feedback} />

      <div className="adminCard" style={{ padding: 32 }}>
        <form onSubmit={handleSubmit} onChange={() => setIsDirty(true)} className="adminForm">
          <div className="adminFormGroup">
            <label>Judul Artikel</label>
            <input
              name="title"
              defaultValue={item?.title || ''}
              placeholder="Judul artikel atau analisis kebijakan..."
              required
            />
          </div>

          <div className="adminFormRow">
            <div className="adminFormGroup">
              <label>Kategori</label>
              <select name="kategori" defaultValue={item?.kategori || 'Opini'}>
                <option value="Opini">Opini</option>
                <option value="Berita Wilayah">Berita Wilayah</option>
                <option value="Analisis">Analisis</option>
              </select>
            </div>
            <div className="adminFormGroup">
              <label>Penulis / Daerah</label>
              <input
                name="daerah"
                defaultValue={item?.daerah || ''}
                placeholder="Contoh: Palembang atau Ir. H. Ahmad"
              />
            </div>
            <div className="adminFormGroup">
              <label>Tanggal Tayang</label>
              <input
                name="date"
                defaultValue={item?.date || ''}
                placeholder="Contoh: 27 Sep 2026"
              />
            </div>
          </div>

          <div className="adminFormGroup">
            <label>Foto Cover Artikel (Maksimal 5 MB)</label>
            <ImageUpload name="gambar" defaultValue={item?.gambar || ''} />
          </div>

          <div className="adminFormGroup">
            <label>Ringkasan Singkat / Abstrak</label>
            <textarea
              name="ringkasan"
              defaultValue={item?.ringkasan || ''}
              rows={3}
              placeholder="Ringkasan 1-2 kalimat pengantar artikel..."
            />
          </div>

          <div className="adminFormGroup">
            <label>Isi Artikel Lengkap</label>
            <textarea
              name="konten"
              defaultValue={defaultKonten}
              rows={12}
              placeholder="Tuliskan naskah artikel di sini. Pisahkan antar paragraf dengan menekan tombol Enter dua kali (baris kosong)."
            />
          </div>

          <div
            className="adminFormActions"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 20 }}
          >
            <Link href="/admin/artikel" className="adminBtn adminBtnSecondary">
              Batal
            </Link>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="button" onClick={handlePreview} className="adminBtn adminBtnSecondary">
                <Eye size={15} style={{ marginRight: 6 }} />
                Pratinjau Dulu
              </button>
              <button type="submit" className="adminBtn adminBtnPrimary" disabled={isPending}>
                <Save size={15} style={{ marginRight: 6 }} />
                {isPending ? 'Menyimpan...' : 'Simpan ke Website'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
