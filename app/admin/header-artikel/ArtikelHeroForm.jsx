'use client';

import { useState, useTransition } from 'react';
import { Eye, Save } from 'lucide-react';
import { saveArtikelHero } from '../actions';
import ImageUpload from '../components/ImageUpload';
import AdminAlert from '../components/AdminAlert';
import { savePreviewDraft } from '../../../lib/preview-storage';
import { useUnsavedChanges } from '../components/useUnsavedChanges';

export default function ArtikelHeroForm({ hero = {} }) {
  const [feedback, setFeedback] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isPending, startTransition] = useTransition();
  useUnsavedChanges(isDirty);

  const initial = {
    title: hero.title?.replace('Artikel & Opini', 'Artikel & Berita') || 'Artikel & Berita Transportasi',
    description: hero.description || 'Artikel, kajian, dan berita transportasi dari Masyarakat Transportasi Indonesia Wilayah Sumatera Selatan.',
    image: hero.image || '',
    imagePosition: hero.imagePosition || 'center center'
  };

  function currentDraft() {
    return {
      title: document.querySelector('[name="title"]')?.value || initial.title,
      description: document.querySelector('[name="description"]')?.value || initial.description,
      image: document.querySelector('[name="image"]')?.value || initial.image,
      imagePosition: document.querySelector('[name="imagePosition"]')?.value || initial.imagePosition
    };
  }

  function preview() {
    savePreviewDraft('artikelHero', currentDraft());
    window.open('/artikel?preview=1', '_blank');
  }

  function submit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setFeedback(null);
    startTransition(async () => {
      const result = await saveArtikelHero(formData);
      if (result?.error) setFeedback({ type: 'error', message: result.error });
      else {
        setIsDirty(false);
        setFeedback({ type: 'success', message: 'Header Artikel & Berita berhasil disimpan dan sudah tampil di website.', linkHref: '/artikel' });
      }
    });
  }

  return (
    <div style={{ maxWidth: 840 }}>
      <div className="adminPageHeader">
        <div>
          <h1>Header Artikel &amp; Berita</h1>
          <p>Kelola judul, deskripsi, dan gambar latar banner halaman /artikel</p>
        </div>
        <button type="button" onClick={preview} className="adminBtn adminBtnSecondary"><Eye size={15} /> Pratinjau di Tab Baru</button>
      </div>

      <AdminAlert {...feedback} />
      <div className="adminCard" style={{ padding: 32 }}>
        <form className="adminForm" onSubmit={submit} onChange={() => setIsDirty(true)}>
          <div className="adminFormGroup">
            <label>Judul Header Artikel</label>
            <input name="title" defaultValue={initial.title} required />
          </div>
          <div className="adminFormGroup">
            <label>Deskripsi Pengantar</label>
            <textarea name="description" defaultValue={initial.description} rows={4} required />
          </div>
          <div className="adminFormGroup">
            <label>Gambar Latar Hero (Maksimal 5 MB)</label>
            <ImageUpload
              name="image"
              defaultValue={initial.image}
              withPosition={true}
              positionName="imagePosition"
              defaultPosition={initial.imagePosition || 'center center'}
              previewTitle={initial.title}
            />
          </div>
          <div className="adminFormActions" style={{ justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" onClick={preview} className="adminBtn adminBtnSecondary"><Eye size={15} /> Pratinjau Dulu</button>
            <button type="submit" className="adminBtn adminBtnPrimary" disabled={isPending}><Save size={15} /> {isPending ? 'Menyimpan...' : 'Simpan Header Artikel'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
