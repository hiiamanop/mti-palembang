'use client';

import { useState, useTransition } from 'react';
import { Home, Compass, Layers, Eye, Sparkles } from 'lucide-react';
import { saveBeranda } from '../actions';
import ImageUpload from '../components/ImageUpload';
import AdminAlert from '../components/AdminAlert';
import { savePreviewDraft } from '../../../lib/preview-storage';

export default function BerandaHub({ beranda }) {
  const [activeCard, setActiveCard] = useState('pengenalan');
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState(null);

  const pengenalan = beranda.pengenalan || {
    title: 'Masyarakat Transportasi Indonesia Wilayah Sumatera Selatan',
    description:
      'Lembaga pemikir (think tank) independen yang menghimpun akademisi, praktisi, birokrat, dan pemerhati transportasi di Sumsel.',
    image: ''
  };

  const visiMisi = beranda.visiMisi || {
    tag: 'VISI, MISI & TUJUAN',
    visi:
      'Terwujudnya MTI sebagai organisasi yang menjadi acuan profesional bidang transportasi, menuju terbentuknya sistem transportasi yang berkelanjutan dan sesuai dengan aspirasi segenap pemangku kepentingan.',
    misi: [],
    tujuan: []
  };

  const [misiList, setMisiList] = useState(
    visiMisi.misi?.length
      ? visiMisi.misi
      : [
          'Menumbuh kembangkan profesionalitas pelaku kegiatan bidang transportasi',
          'Memberikan pelayanan advokasi untuk pengambil keputusan bidang transportasi',
          'Mendorong interaksi sinergis antar pemangku kepentingan untuk peningkatan kualitas layanan transportasi'
        ]
  );

  const [tujuanList, setTujuanList] = useState(
    visiMisi.tujuan?.length
      ? visiMisi.tujuan
      : [
          'Meningkatnya jumlah dan kualitas pelaku profesional bidang transportasi bersertifikasi',
          'Meningkatnya jumlah kota dan wilayah yang menerapkan prinsip-prinsip transportasi berkelanjutan',
          'Meningkatnya jumlah regulasi bidang transportasi yang sejalan dengan aspirasi masyarakat dan prinsip transportasi berkelanjutan'
        ]
  );

  const [programs, setPrograms] = useState(
    beranda.programUnggulan?.length
      ? beranda.programUnggulan
      : [
          {
            id: 'p1',
            image: '',
            tag: 'FORUM DISKUSI',
            title: 'Forum Diskusi Transportasi wilayah Sumsel (FDTS)',
            summary:
              'Diskusi berkala membahas isu hangat transportasi lokal bersama Dishub dan operator.'
          },
          {
            id: 'p2',
            image: '',
            tag: 'ASPIRASI PUBLIK',
            title: 'MTI Mendengar / Suara Warga',
            summary:
              'Saluran aspirasi masyarakat terkait fasilitas halte, trotoar, dan layanan angkutan umum.'
          },
          {
            id: 'p3',
            image: '',
            tag: 'RISET & KEBIJAKAN',
            title: 'Kajian & Policy Brief',
            summary:
              'Ringkasan riset kebijakan yang diserahkan ke pengambil keputusan.'
          }
        ]
  );

  const handleSave = (section, formData) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await saveBeranda(section, formData);
      if (res?.error) {
        setFeedback({ type: 'error', message: `Gagal menyimpan: ${res.error}` });
      } else {
        setFeedback({
          type: 'success',
          message: 'Perubahan berhasil disimpan dan langsung tampil di website publik!',
          linkHref: '/'
        });
      }
    });
  };

  const handlePreview = (sectionName) => {
    // Save draft state to preview storage
    savePreviewDraft('beranda', {
      pengenalan: {
        title: document.querySelector('[name="pengenalanTitle"]')?.value || pengenalan.title,
        description: document.querySelector('[name="pengenalanDescription"]')?.value || pengenalan.description,
        image: document.querySelector('[name="pengenalanImage"]')?.value || pengenalan.image,
        imagePosition: document.querySelector('[name="pengenalanImagePosition"]')?.value || pengenalan.imagePosition || 'center center'
      },
      visiMisi: {
        tag: document.querySelector('[name="tag"]')?.value || visiMisi.tag,
        visi: document.querySelector('[name="visi"]')?.value || visiMisi.visi,
        misi: misiList,
        tujuan: tujuanList,
        image: document.querySelector('[name="visiMisiImage"]')?.value || visiMisi.image
      },
      programUnggulan: programs
    });
    window.open('/?preview=1', '_blank');
  };

  return (
    <div>
      {/* ── Top Header ── */}
      <div className="adminPageHeader">
        <div>
          <h1>Pengelolaan Halaman Beranda</h1>
          <p>Kelola 3 seksi utama yang tampil di beranda website publik MTI Sumsel</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            className="adminBtn adminBtnSecondary"
            onClick={() => handlePreview(activeCard)}
          >
            <Eye size={15} style={{ marginRight: 6 }} />
            ↗ Pratinjau Beranda di Tab Baru
          </button>
        </div>
      </div>

      <AdminAlert {...feedback} />

      {/* ── 3 Kartu Seksi Beranda ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
          marginBottom: 28
        }}
      >
        <button
          type="button"
          onClick={() => setActiveCard('pengenalan')}
          className="adminCard"
          style={{
            padding: 20,
            textAlign: 'left',
            border: activeCard === 'pengenalan' ? '2px solid #112e81' : '1px solid #e2e8f0',
            background: activeCard === 'pengenalan' ? '#f0f4ff' : '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, color: '#112e81' }}>
            <Home size={20} />
            <strong style={{ fontSize: 15 }}>1. Hero Pengenalan</strong>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.4 }}>
            Judul utama, narasi misi, dan foto latar belakang berbayang di bagian atas beranda.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setActiveCard('visiMisi')}
          className="adminCard"
          style={{
            padding: 20,
            textAlign: 'left',
            border: activeCard === 'visiMisi' ? '2px solid #112e81' : '1px solid #e2e8f0',
            background: activeCard === 'visiMisi' ? '#f0f4ff' : '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, color: '#112e81' }}>
            <Compass size={20} />
            <strong style={{ fontSize: 15 }}>2. Visi, Misi &amp; Tujuan</strong>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.4 }}>
            Kutipan visi terpadu, butir-butir misi, dan 3 sasaran strategis terukur organisasi.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setActiveCard('programUnggulan')}
          className="adminCard"
          style={{
            padding: 20,
            textAlign: 'left',
            border: activeCard === 'programUnggulan' ? '2px solid #112e81' : '1px solid #e2e8f0',
            background: activeCard === 'programUnggulan' ? '#f0f4ff' : '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, color: '#112e81' }}>
            <Layers size={20} />
            <strong style={{ fontSize: 15 }}>3. Program Unggulan</strong>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.4 }}>
            3 kartu inisiatif unggulan: FDTS, Suara Warga, dan Kajian Policy Brief.
          </p>
        </button>
      </div>

      {/* ── Editor Card 1: Hero Pengenalan ── */}
      {activeCard === 'pengenalan' && (
        <div className="adminCard" style={{ padding: 28 }}>
          <h3 style={{ margin: '0 0 8px', fontSize: 18, color: '#0f172a' }}>Edit Hero Pengenalan</h3>
          <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: 14 }}>
            Seksi paling atas beranda yang menyapa pengunjung dan mengenalkan mandat MTI Sumatera Selatan.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave('pengenalan', new FormData(e.target));
            }}
            className="adminForm"
          >
            <div className="adminFormGroup">
              <label>Judul Profil Organisasi</label>
              <input
                name="pengenalanTitle"
                defaultValue={pengenalan.title}
                placeholder="Masyarakat Transportasi Indonesia Wilayah Sumatera Selatan"
                required
              />
            </div>

            <div className="adminFormGroup">
              <label>Foto Dokumentasi Latar Belakang (Maksimal 5 MB)</label>
              <ImageUpload
                name="pengenalanImage"
                defaultValue={pengenalan.image}
                withPosition={true}
                positionName="pengenalanImagePosition"
                defaultPosition={pengenalan.imagePosition || 'center center'}
                previewTitle={pengenalan.title || 'Masyarakat Transportasi Indonesia'}
              />
              <small style={{ color: '#64748b', marginTop: 4 }}>
                Foto ini tampil di belakang hero dengan bayangan transparan cerah sinematik.
              </small>
            </div>

            <div className="adminFormGroup">
              <label>Pernyataan Mandat / Deskripsi Singkat</label>
              <textarea
                name="pengenalanDescription"
                defaultValue={pengenalan.description}
                rows={3}
                placeholder="Penjelasan peran strategis organisasi di Sumsel..."
                required
              />
            </div>

            <div className="adminFormActions" style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="adminBtn adminBtnPrimary" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Simpan Hero Pengenalan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Editor Card 2: Visi, Misi & Tujuan ── */}
      {activeCard === 'visiMisi' && (
        <div className="adminCard" style={{ padding: 28 }}>
          <h3 style={{ margin: '0 0 8px', fontSize: 18, color: '#0f172a' }}>Edit Visi, Misi &amp; Tujuan</h3>
          <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: 14 }}>
            Dua kartu berdampingan di beranda: Kartu 1 untuk Visi &amp; Misi, Kartu 2 untuk Sasaran Tujuan Terukur.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              fd.delete('misi');
              fd.delete('tujuan');
              misiList.forEach((m) => fd.append('misi', m));
              tujuanList.forEach((t) => fd.append('tujuan', t));
              handleSave('visiMisi', fd);
            }}
            className="adminForm"
          >
            <div className="adminFormGroup">
              <label>Label Kicker / Badge</label>
              <input name="tag" defaultValue={visiMisi.tag || 'VISI, MISI & TUJUAN'} />
            </div>

            <div className="adminFormGroup">
              <label>Pernyataan Visi Organisasi</label>
              <textarea name="visi" defaultValue={visiMisi.visi} rows={3} required />
            </div>

            <div className="adminFormSection">
              <span className="adminFormSectionTitle">Daftar Misi Organisasi (Butir-butir)</span>
              {misiList.map((m, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, color: '#112e81', width: 20 }}>{idx + 1}.</span>
                  <input
                    type="text"
                    value={m}
                    onChange={(e) => {
                      const updated = [...misiList];
                      updated[idx] = e.target.value;
                      setMisiList(updated);
                    }}
                    style={{ flex: 1 }}
                  />
                  {misiList.length > 1 && (
                    <button
                      type="button"
                      className="adminBtn adminBtnSmall adminBtnDanger"
                      onClick={() => setMisiList(misiList.filter((_, i) => i !== idx))}
                    >
                      Hapus
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="adminBtn adminBtnSecondary adminBtnSmall"
                style={{ alignSelf: 'flex-start' }}
                onClick={() => setMisiList([...misiList, ''])}
              >
                + Tambah Butir Misi
              </button>
            </div>

            <div className="adminFormSection">
              <span className="adminFormSectionTitle">Sasaran Tujuan Organisasi (01, 02, 03)</span>
              {tujuanList.map((t, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, color: '#112e81', width: 28 }}>0{idx + 1}.</span>
                  <input
                    type="text"
                    value={t}
                    onChange={(e) => {
                      const updated = [...tujuanList];
                      updated[idx] = e.target.value;
                      setTujuanList(updated);
                    }}
                    style={{ flex: 1 }}
                  />
                  {tujuanList.length > 1 && (
                    <button
                      type="button"
                      className="adminBtn adminBtnSmall adminBtnDanger"
                      onClick={() => setTujuanList(tujuanList.filter((_, i) => i !== idx))}
                    >
                      Hapus
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="adminBtn adminBtnSecondary adminBtnSmall"
                style={{ alignSelf: 'flex-start' }}
                onClick={() => setTujuanList([...tujuanList, ''])}
              >
                + Tambah Sasaran Tujuan
              </button>
            </div>

            <div className="adminFormActions">
              <button type="submit" className="adminBtn adminBtnPrimary" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Simpan Visi, Misi & Tujuan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Editor Card 3: Program Unggulan ── */}
      {activeCard === 'programUnggulan' && (
        <div className="adminCard" style={{ padding: 28 }}>
          <h3 style={{ margin: '0 0 8px', fontSize: 18, color: '#0f172a' }}>Edit Program Unggulan</h3>
          <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: 14 }}>
            3 kartu inisiatif yang ditampilkan berdampingan di bagian bawah beranda.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              handleSave('programUnggulan', fd);
            }}
            className="adminForm"
          >
            {programs.map((item, idx) => (
              <div key={item.id || idx} className="adminFormSection">
                <span className="adminFormSectionTitle">Kartu {idx + 1}</span>
                <input type="hidden" name="programId" value={item.id} />

                <div className="adminFormRow">
                  <div className="adminFormGroup" style={{ flex: '1 1 200px' }}>
                    <label>Tag Kategori</label>
                    <input
                      name="programTag"
                      defaultValue={item.tag}
                      placeholder="FORUM DISKUSI"
                      required
                    />
                  </div>
                  <div className="adminFormGroup" style={{ flex: '2 1 300px' }}>
                    <label>Judul Program</label>
                    <input
                      name="programTitle"
                      defaultValue={item.title}
                      placeholder="Judul program inisiatif..."
                      required
                    />
                  </div>
                </div>

                <div className="adminFormGroup">
                  <label>Foto Program (Maksimal 5 MB)</label>
                  <ImageUpload name="programImage" defaultValue={item.image} />
                </div>

                <div className="adminFormGroup">
                  <label>Ringkasan Kegiatan</label>
                  <textarea
                    name="programSummary"
                    defaultValue={item.summary}
                    rows={2}
                    placeholder="Penjelasan ringkas agenda..."
                    required
                  />
                </div>
              </div>
            ))}

            <div className="adminFormActions">
              <button type="submit" className="adminBtn adminBtnPrimary" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Simpan Program Unggulan'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
