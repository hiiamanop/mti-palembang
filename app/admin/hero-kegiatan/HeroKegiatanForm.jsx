'use client';

import { useState, useTransition } from 'react';
import { Eye, Compass } from 'lucide-react';
import { saveBeranda } from '../actions';
import ImageUpload from '../components/ImageUpload';
import AdminAlert from '../components/AdminAlert';
import { savePreviewDraft } from '../../../lib/preview-storage';

export default function HeroKegiatanForm({ hero = {} }) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState(null);

  const initial = {
    eyebrow: hero.eyebrow || 'Kegiatan MTI',
    title: hero.title || 'Kegiatan Masyarakat Transportasi Sumatera Selatan',
    description:
      hero.description ||
      'Agenda, diskusi kebijakan, dan aksi nyata Masyarakat Transportasi Indonesia Wilayah Sumatera Selatan dari tahun ke tahun.',
    image: hero.image || '',
    imagePosition: hero.imagePosition || 'center center'
  };

  const handleSave = (e) => {
    e.preventDefault();
    setFeedback(null);
    const fd = new FormData(e.target);
    startTransition(async () => {
      const res = await saveBeranda('kegiatanHero', fd);
      if (res?.error) {
        setFeedback({ type: 'error', message: `Gagal menyimpan: ${res.error}` });
      } else {
        setFeedback({
          type: 'success',
          message: 'Banner hero kegiatan berhasil disimpan dan langsung tampil di website!',
          linkHref: '/kegiatan-mti'
        });
      }
    });
  };

  const handlePreview = () => {
    savePreviewDraft('kegiatanHero', {
      eyebrow: document.querySelector('[name="kegiatanHeroEyebrow"]')?.value || initial.eyebrow,
      title: document.querySelector('[name="kegiatanHeroTitle"]')?.value || initial.title,
      description: document.querySelector('[name="kegiatanHeroDescription"]')?.value || initial.description,
      image: document.querySelector('[name="kegiatanHeroImage"]')?.value || initial.image,
      imagePosition: document.querySelector('[name="kegiatanHeroImagePosition"]')?.value || initial.imagePosition
    });
    window.open('/kegiatan-mti?preview=1', '_blank');
  };

  return (
    <div>
      <div className="adminPageHeader">
        <div>
          <h1>Hero Halaman Kegiatan MTI</h1>
          <p>Kelola judul, subjudul, dan foto latar belakang banner atas pada halaman /kegiatan-mti</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" className="adminBtn adminBtnSecondary" onClick={handlePreview}>
            <Eye size={15} style={{ marginRight: 6 }} />
            ↗ Pratinjau Hero di Tab Baru
          </button>
        </div>
      </div>

      <AdminAlert {...feedback} />

      <div className="adminCard" style={{ padding: 28, maxWidth: 780 }}>
        <form onSubmit={handleSave} className="adminForm">
          <div className="adminFormGroup">
            <label>Label Atas (Eyebrow)</label>
            <input
              name="kegiatanHeroEyebrow"
              defaultValue={initial.eyebrow}
              placeholder="Kegiatan MTI"
              required
            />
          </div>

          <div className="adminFormGroup">
            <label>Judul Utama Banner</label>
            <input
              name="kegiatanHeroTitle"
              defaultValue={initial.title}
              placeholder="Kegiatan Masyarakat Transportasi Sumatera Selatan"
              required
            />
          </div>

          <div className="adminFormGroup">
            <label>Foto Banner Latar Belakang (Maksimal 5 MB)</label>
            <ImageUpload
              name="kegiatanHeroImage"
              defaultValue={initial.image}
              withPosition={true}
              positionName="kegiatanHeroImagePosition"
              defaultPosition={initial.imagePosition || 'center center'}
              previewTitle={initial.title}
            />
            <small style={{ color: '#64748b', marginTop: 4 }}>
              Foto ini tampil dengan bayangan transparan cerah agar teks judul tetap mudah terbaca.
            </small>
          </div>

          <div className="adminFormGroup">
            <label>Deskripsi Pengantar</label>
            <textarea
              name="kegiatanHeroDescription"
              defaultValue={initial.description}
              rows={3}
              placeholder="Deskripsi kegiatan organisasi..."
              required
            />
          </div>

          <div className="adminFormActions" style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="adminBtn adminBtnPrimary" disabled={isPending}>
              {isPending ? 'Menyimpan...' : 'Simpan Banner Kegiatan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
