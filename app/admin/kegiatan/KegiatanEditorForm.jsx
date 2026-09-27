'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, Save } from 'lucide-react';
import { addKegiatanItem, saveKegiatanItem } from '../actions';
import ImageUpload from '../components/ImageUpload';
import AdminAlert from '../components/AdminAlert';
import { savePreviewDraft } from '../../../lib/preview-storage';
import { useUnsavedChanges } from '../components/useUnsavedChanges';

export default function KegiatanEditorForm({ item = null, id = null, isNew = false }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  useUnsavedChanges(isDirty);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedback(null);
    const fd = new FormData(e.target);

    startTransition(async () => {
      const res = isNew ? await addKegiatanItem(fd) : await saveKegiatanItem(id, fd);
      if (res?.error) {
        setFeedback({ type: 'error', message: `Gagal menyimpan: ${res.error}` });
      } else {
        setIsDirty(false);
        setFeedback({
          type: 'success',
          message: 'Kegiatan berhasil disimpan dan langsung tampil di website publik!',
          linkHref: '/kegiatan-mti'
        });
        if (isNew) {
          setTimeout(() => {
            router.push('/admin/kegiatan');
          }, 1500);
        }
      }
    });
  };

  const handlePreview = () => {
    const title = document.querySelector('[name="title"]')?.value || 'Judul Kegiatan Draf';
    const date = document.querySelector('[name="date"]')?.value || new Date().toISOString().split('T')[0];
    const image = document.querySelector('[name="image"]')?.value || '';
    const summary = document.querySelector('[name="summary"]')?.value || '';

    savePreviewDraft('kegiatan', {
      id: id || 'preview-draft',
      title,
      date,
      image,
      summary,
      published: true
    });

    window.open('/kegiatan-mti?preview=1', '_blank');
  };

  return (
    <div style={{ maxWidth: 840 }}>
      <div style={{ marginBottom: 16 }}>
        <Link
          href="/admin/kegiatan"
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
          Kembali ke Daftar Kegiatan
        </Link>
      </div>

      <div className="adminPageHeader">
        <div>
          <h1>{isNew ? 'Tambah Kegiatan Baru' : 'Edit Kegiatan'}</h1>
          <p>{isNew ? 'Isi formulir untuk menambahkan kegiatan baru' : `Mengedit kegiatan: ${item?.title}`}</p>
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
            <label>Judul Kegiatan</label>
            <input
              name="title"
              defaultValue={item?.title || ''}
              placeholder="Contoh: Diskusi Kebijakan Transportasi Perkotaan..."
              required
            />
          </div>

          <div className="adminFormGroup">
            <label>Tanggal Kegiatan</label>
            <input
              name="date"
              type="date"
              defaultValue={item?.date || new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="adminFormGroup">
            <label>Foto Dokumentasi Kegiatan (Maksimal 5 MB)</label>
            <ImageUpload name="image" defaultValue={item?.image || ''} />
            <small style={{ color: '#64748b', marginTop: 4 }}>
              Foto dokumentasi akan tampil sebagai thumbnail pada kartu kegiatan dan galeri.
            </small>
          </div>

          <div className="adminFormGroup">
            <label>Ringkasan Kegiatan</label>
            <textarea
              name="summary"
              defaultValue={item?.summary || ''}
              rows={4}
              placeholder="Tuliskan rangkuman pokok bahasan, peserta, dan poin penting hasil kegiatan..."
            />
          </div>

          <div
            className="adminFormActions"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 20 }}
          >
            <Link href="/admin/kegiatan" className="adminBtn adminBtnSecondary">
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
