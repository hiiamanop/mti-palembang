'use client';

import { useState, useTransition } from 'react';
import { saveBeranda } from '../actions';
import ImageUpload from '../components/ImageUpload';

const TABS = [
  { key: 'pengenalan', label: '1. Hero Pengenalan' },
  { key: 'visiMisi', label: '2. Visi, Misi & Tujuan' },
  { key: 'programUnggulan', label: '3. Program Unggulan' },
  { key: 'kegiatanHero', label: 'Hero Kegiatan MTI' },
  { key: 'leadStory', label: 'Berita Utama' },
  { key: 'heroSide', label: 'Sorotan' },
  { key: 'ticker', label: 'Ticker' }
];

export default function BerandaForm({ beranda }) {
  const [activeTab, setActiveTab] = useState('pengenalan');
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState('');

  const [pengenalan] = useState(
    beranda.pengenalan || {
      tag: '',
      title: 'Masyarakat Transportasi Indonesia Wilayah Sumatera Selatan',
      description:
        'Lembaga pemikir (think tank) independen yang menghimpun akademisi, praktisi, birokrat, dan pemerhati transportasi di Sumsel.',
      image: ''
    }
  );

  const [visiMisi] = useState(
    beranda.visiMisi || {
      tag: 'VISI, MISI & TUJUAN',
      visi:
        'Terwujudnya MTI sebagai organisasi yang menjadi acuan profesional bidang transportasi, menuju terbentuknya sistem transportasi yang berkelanjutan dan sesuai dengan aspirasi segenap pemangku kepentingan.',
      misi: [
        'Menumbuh kembangkan profesionalitas pelaku kegiatan bidang transportasi',
        'Memberikan pelayanan advokasi untuk pengambil keputusan bidang transportasi',
        'Mendorong interaksi sinergis antar pemangku kepentingan untuk peningkatan kualitas layanan transportasi'
      ],
      tujuan: [
        'Meningkatnya jumlah dan kualitas pelaku profesional bidang transportasi bersertifikasi',
        'Meningkatnya jumlah kota dan wilayah yang menerapkan prinsip-prinsip transportasi berkelanjutan',
        'Meningkatnya jumlah regulasi bidang transportasi yang sejalan dengan aspirasi masyarakat dan prinsip transportasi berkelanjutan'
      ],
      image: ''
    }
  );

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

  const [kegiatanHero] = useState(
    beranda.kegiatanHero || {
      eyebrow: 'Kegiatan MTI',
      title: 'Kegiatan Masyarakat Transportasi Sumatera Selatan',
      description:
        'Agenda, diskusi kebijakan, dan aksi nyata Masyarakat Transportasi Indonesia Wilayah Sumatera Selatan dari tahun ke tahun.',
      image: ''
    }
  );

  const [programUnggulan, setProgramUnggulan] = useState(
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

  const [ticker, setTicker] = useState(beranda.ticker || []);
  const [heroSide, setHeroSide] = useState(beranda.heroSide || []);

  const save = (section, formData) => {
    startTransition(async () => {
      await saveBeranda(section, formData);
      setStatus('Tersimpan!');
      setTimeout(() => setStatus(''), 2000);
    });
  };

  const handlePengenalanSubmit = (e) => {
    e.preventDefault();
    save('pengenalan', new FormData(e.target));
  };

  const handleVisiMisiSubmit = (e) => {
    e.preventDefault();
    save('visiMisi', new FormData(e.target));
  };

  const handleProgramSubmit = (e) => {
    e.preventDefault();
    save('programUnggulan', new FormData(e.target));
  };

  const handleKegiatanHeroSubmit = (e) => {
    e.preventDefault();
    save('kegiatanHero', new FormData(e.target));
  };

  const handleTickerSubmit = (e) => {
    e.preventDefault();
    save('ticker', new FormData(e.target));
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    save('leadStory', new FormData(e.target));
  };

  const handleHeroSideSubmit = (e) => {
    e.preventDefault();
    save('heroSide', new FormData(e.target));
  };

  return (
    <div>
      {status && <div className="adminAlert adminAlertSuccess">{status}</div>}

      <div className="adminTabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`adminTab ${activeTab === tab.key ? 'adminTabActive' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'pengenalan' && (
        <div className="adminCard" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px' }}>Section 1: Hero Pengenalan MTI Sumsel</h3>
          <p style={{ margin: '0 0 20px', color: '#667085', fontSize: 14 }}>
            Hero section utama beranda dengan efek visual latar belakang transparan seperti halaman Tentang Kami.
          </p>
          <form onSubmit={handlePengenalanSubmit} className="adminForm">
            <div className="adminFormGroup">
              <label>Judul Utama</label>
              <input
                name="pengenalanTitle"
                defaultValue={
                  pengenalan.title ||
                  'Masyarakat Transportasi Indonesia Wilayah Sumatera Selatan'
                }
                placeholder="Judul profil organisasi..."
              />
            </div>

            <div className="adminFormGroup">
              <label>Gambar Hero / Background Dokumentasi MTI Sumsel</label>
              <ImageUpload name="pengenalanImage" defaultValue={pengenalan.image || ''} />
              <small style={{ color: '#64748b', marginTop: 4, display: 'block' }}>
                Foto ini akan tampil di belakang hero dengan bayangan transparan (sama seperti halaman Tentang Kami).
              </small>
            </div>

            <div className="adminFormGroup">
              <label>Pernyataan Misi / Deskripsi</label>
              <textarea
                name="pengenalanDescription"
                defaultValue={
                  pengenalan.description ||
                  'Lembaga pemikir (think tank) independen yang menghimpun akademisi, praktisi, birokrat, dan pemerhati transportasi di Sumsel.'
                }
                rows={3}
                placeholder="Penjelasan mandat organisasi di Sumsel..."
              />
            </div>

            <div className="adminFormActions">
              <button type="submit" className="adminBtn adminBtnPrimary" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Simpan Hero Pengenalan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'visiMisi' && (
        <div className="adminCard" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 8px' }}>Section 2: Visi, Misi &amp; Tujuan Organisasi</h3>
          <p style={{ margin: '0 0 20px', color: '#667085', fontSize: 14 }}>
            Satu kartu memuat Visi &amp; Misi, dan kartu kedua memuat Tujuan Organisasi.
          </p>

          <form onSubmit={handleVisiMisiSubmit} className="adminForm">
            <div className="adminFormGroup">
              <label>Tag / Label Seksi</label>
              <input
                name="visiMisiTag"
                defaultValue={visiMisi.tag || 'VISI, MISI & TUJUAN'}
                placeholder="VISI, MISI & TUJUAN"
              />
            </div>

            <div className="adminFormGroup">
              <label>Pernyataan Visi</label>
              <textarea
                name="visiText"
                defaultValue={
                  visiMisi.visi ||
                  'Terwujudnya MTI sebagai organisasi yang menjadi acuan profesional bidang transportasi, menuju terbentuknya sistem transportasi yang berkelanjutan dan sesuai dengan aspirasi segenap pemangku kepentingan.'
                }
                rows={3}
                placeholder="Pernyataan visi organisasi..."
              />
            </div>

            <h4 style={{ margin: '24px 0 12px', fontSize: 15 }}>
              Daftar Butir Misi
            </h4>

            {misiList.map((item, i) => (
              <div key={i} className="adminFormRow" style={{ alignItems: 'flex-start', marginBottom: 12 }}>
                <div className="adminFormGroup" style={{ flex: 1 }}>
                  <label>Misi #{i + 1}</label>
                  <input
                    name="misiItem"
                    defaultValue={item}
                    placeholder="Butir misi organisasi..."
                  />
                </div>
                <button
                  type="button"
                  className="adminBtn adminBtnSmall adminBtnDanger"
                  style={{ alignSelf: 'flex-end', marginBottom: 4 }}
                  onClick={() => setMisiList(misiList.filter((_, idx) => idx !== i))}
                >
                  Hapus
                </button>
              </div>
            ))}

            <button
              type="button"
              className="adminBtn adminBtnSecondary"
              style={{ marginBottom: 24 }}
              onClick={() => setMisiList([...misiList, ''])}
            >
              + Tambah Butir Misi
            </button>

            <h4 style={{ margin: '24px 0 12px', fontSize: 15, borderTop: '1px solid #eef0f8', paddingTop: 20 }}>
              Daftar Butir Tujuan Organisasi
            </h4>

            {tujuanList.map((item, i) => (
              <div key={i} className="adminFormRow" style={{ alignItems: 'flex-start', marginBottom: 12 }}>
                <div className="adminFormGroup" style={{ flex: 1 }}>
                  <label>Tujuan #{i + 1}</label>
                  <input
                    name="tujuanItem"
                    defaultValue={item}
                    placeholder="Butir tujuan organisasi..."
                  />
                </div>
                <button
                  type="button"
                  className="adminBtn adminBtnSmall adminBtnDanger"
                  style={{ alignSelf: 'flex-end', marginBottom: 4 }}
                  onClick={() => setTujuanList(tujuanList.filter((_, idx) => idx !== i))}
                >
                  Hapus
                </button>
              </div>
            ))}

            <button
              type="button"
              className="adminBtn adminBtnSecondary"
              style={{ marginBottom: 20 }}
              onClick={() => setTujuanList([...tujuanList, ''])}
            >
              + Tambah Butir Tujuan
            </button>

            <div className="adminFormGroup" style={{ borderTop: '1px solid #eef0f8', paddingTop: 20 }}>
              <label>Gambar / Banner Tambahan (Opsional)</label>
              <ImageUpload name="visiMisiImage" defaultValue={visiMisi.image || ''} />
            </div>

            <div className="adminFormActions">
              <button type="submit" className="adminBtn adminBtnPrimary" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Simpan Visi, Misi & Tujuan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'programUnggulan' && (
        <div className="adminCard" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 8px' }}>Section 3: Program Unggulan MTI Sumsel</h3>
          <p style={{ margin: '0 0 20px', color: '#667085', fontSize: 14 }}>
            Aksi dan kegiatan rutin MTI Sumsel (Forum Diskusi, Suara Warga, Kajian Kebijakan).
            Setiap program memiliki slot upload gambar.
          </p>

          <form onSubmit={handleProgramSubmit} className="adminForm">
            {programUnggulan.map((item, i) => (
              <div key={item.id || i} className="adminFormSection" style={{ marginBottom: 20 }}>
                <input type="hidden" name="programId" value={item.id || ''} />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12
                  }}
                >
                  <div className="adminFormSectionTitle">Program #{i + 1}</div>
                  <button
                    type="button"
                    className="adminBtn adminBtnSmall adminBtnDanger"
                    onClick={() =>
                      setProgramUnggulan(programUnggulan.filter((_, idx) => idx !== i))
                    }
                  >
                    Hapus
                  </button>
                </div>

                <div className="adminFormGroup">
                  <label>Gambar / Dokumentasi Program</label>
                  <ImageUpload name="programImage" defaultValue={item.image || ''} />
                </div>

                <div className="adminFormRow">
                  <div className="adminFormGroup" style={{ flex: '0 0 220px' }}>
                    <label>Tag / Kategori</label>
                    <input
                      name="programTag"
                      defaultValue={item.tag || ''}
                      placeholder="FORUM DISKUSI / ASPIRASI"
                    />
                  </div>
                  <div className="adminFormGroup" style={{ flex: 1 }}>
                    <label>Judul Program</label>
                    <input
                      name="programTitle"
                      defaultValue={item.title || ''}
                      placeholder="Nama program..."
                    />
                  </div>
                </div>

                <div className="adminFormGroup">
                  <label>Keterangan Program</label>
                  <textarea
                    name="programSummary"
                    defaultValue={item.summary || ''}
                    rows={3}
                    placeholder="Penjelasan program..."
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              className="adminBtn adminBtnSecondary"
              style={{ marginBottom: 20 }}
              onClick={() =>
                setProgramUnggulan([
                  ...programUnggulan,
                  {
                    id: Date.now().toString(),
                    image: '',
                    tag: 'PROGRAM MTI',
                    title: '',
                    summary: ''
                  }
                ])
              }
            >
              + Tambah Program
            </button>

            <div className="adminFormActions">
              <button type="submit" className="adminBtn adminBtnPrimary" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Simpan Program Unggulan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'kegiatanHero' && (
        <div className="adminCard" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 8px' }}>Hero Halaman Kegiatan MTI</h3>
          <p style={{ margin: '0 0 20px', color: '#667085', fontSize: 14 }}>
            Kelola label, judul, deskripsi, dan gambar hero pada halaman publik Kegiatan MTI.
          </p>
          <form onSubmit={handleKegiatanHeroSubmit} className="adminForm">
            <div className="adminFormGroup">
              <label>Label Hero</label>
              <input
                name="kegiatanHeroEyebrow"
                defaultValue={kegiatanHero.eyebrow || 'Kegiatan MTI'}
                placeholder="Kegiatan MTI"
              />
            </div>
            <div className="adminFormGroup">
              <label>Judul Hero</label>
              <input
                name="kegiatanHeroTitle"
                defaultValue={kegiatanHero.title || 'Kegiatan Masyarakat Transportasi Sumatera Selatan'}
                placeholder="Kegiatan Masyarakat Transportasi Sumatera Selatan"
              />
            </div>
            <div className="adminFormGroup">
              <label>Deskripsi Hero</label>
              <textarea
                name="kegiatanHeroDescription"
                defaultValue={
                  kegiatanHero.description ||
                  'Agenda, diskusi kebijakan, dan aksi nyata Masyarakat Transportasi Indonesia Wilayah Sumatera Selatan dari tahun ke tahun.'
                }
                rows={3}
                placeholder="Deskripsi singkat halaman kegiatan..."
              />
            </div>
            <div className="adminFormGroup">
              <label>Gambar Background Hero</label>
              <ImageUpload name="kegiatanHeroImage" defaultValue={kegiatanHero.image || ''} />
            </div>
            <div className="adminFormActions">
              <button type="submit" className="adminBtn adminBtnPrimary" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Simpan Hero Kegiatan MTI'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'leadStory' && (
        <div className="adminCard" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px' }}>Berita Utama (Lead Story)</h3>
          <form onSubmit={handleLeadSubmit} className="adminForm">
            <div className="adminFormGroup">
              <label>Gambar Berita Utama</label>
              <ImageUpload name="img" defaultValue={beranda.leadStory?.img || ''} />
            </div>
            <div className="adminFormRow">
              <div className="adminFormGroup">
                <label>Kategori</label>
                <input name="cat" defaultValue={beranda.leadStory?.cat || ''} />
              </div>
              <div className="adminFormGroup">
                <label>Tanggal</label>
                <input name="date" defaultValue={beranda.leadStory?.date || ''} />
              </div>
            </div>
            <div className="adminFormGroup">
              <label>Judul</label>
              <input name="title" defaultValue={beranda.leadStory?.title || ''} />
            </div>
            <div className="adminFormGroup">
              <label>Ringkasan (Excerpt)</label>
              <textarea
                name="excerpt"
                defaultValue={beranda.leadStory?.excerpt || ''}
                rows={3}
              />
            </div>
            <div className="adminFormRow">
              <div className="adminFormGroup">
                <label>Penulis</label>
                <input name="author" defaultValue={beranda.leadStory?.author || ''} />
              </div>
              <div className="adminFormGroup">
                <label>Waktu Baca</label>
                <input name="readTime" defaultValue={beranda.leadStory?.readTime || ''} />
              </div>
            </div>
            <div className="adminFormGroup">
              <label>Link (href)</label>
              <input name="href" defaultValue={beranda.leadStory?.href || '#'} />
            </div>
            <div className="adminFormActions">
              <button type="submit" className="adminBtn adminBtnPrimary" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Simpan Berita Utama'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'heroSide' && (
        <div className="adminCard" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px' }}>Sorotan (Hero Side Stories)</h3>
          <form onSubmit={handleHeroSideSubmit} className="adminForm">
            {heroSide.map((story, i) => (
              <div key={story.id || i} className="adminFormSection">
                <input type="hidden" name="sideId" value={story.id || ''} />
                <div className="adminFormSectionTitle">Sorotan {i + 1}</div>
                <div className="adminFormGroup">
                  <label>Gambar Sorotan</label>
                  <ImageUpload name="sideImg" defaultValue={story.img || ''} />
                </div>
                <div className="adminFormRow">
                  <div className="adminFormGroup">
                    <label>Kategori</label>
                    <input name="sideCat" defaultValue={story.cat || ''} />
                  </div>
                  <div className="adminFormGroup">
                    <label>Warna Tag (hex)</label>
                    <input name="sideColor" defaultValue={story.tagColor || '#4647ae'} />
                  </div>
                  <div className="adminFormGroup">
                    <label>Tanggal</label>
                    <input name="sideDate" defaultValue={story.date || ''} />
                  </div>
                </div>
                <div className="adminFormGroup">
                  <label>Judul</label>
                  <input name="sideTitle" defaultValue={story.title || ''} />
                </div>
                <div className="adminFormGroup">
                  <label>Link (href)</label>
                  <input name="sideHref" defaultValue={story.href || '#'} />
                </div>
              </div>
            ))}
            <div className="adminFormActions">
              <button type="submit" className="adminBtn adminBtnPrimary" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Simpan Sorotan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'ticker' && (
        <div className="adminCard" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px' }}>Ticker Berita</h3>
          <form onSubmit={handleTickerSubmit} className="adminForm">
            {ticker.map((item, i) => (
              <div key={item.id || i} className="adminFormRow adminTickerRow">
                <input type="hidden" name="tickerId" value={item.id || ''} />
                <div className="adminFormGroup" style={{ flex: '0 0 140px' }}>
                  <label>Tag</label>
                  <input
                    name="tickerTag"
                    defaultValue={item.tag}
                    placeholder="KEBIJAKAN"
                  />
                </div>
                <div className="adminFormGroup" style={{ flex: 1 }}>
                  <label>Teks</label>
                  <input
                    name="tickerText"
                    defaultValue={item.text}
                    placeholder="Teks berita..."
                  />
                </div>
                <button
                  type="button"
                  className="adminBtn adminBtnSmall adminBtnDanger"
                  style={{ alignSelf: 'flex-end', marginBottom: 1 }}
                  onClick={() => setTicker(ticker.filter((_, idx) => idx !== i))}
                >
                  Hapus
                </button>
              </div>
            ))}
            <button
              type="button"
              className="adminBtn adminBtnSecondary"
              onClick={() =>
                setTicker([
                  ...ticker,
                  { id: Date.now().toString(), tag: '', text: '' }
                ])
              }
            >
              + Tambah Item Ticker
            </button>
            <div className="adminFormActions">
              <button type="submit" className="adminBtn adminBtnPrimary" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Simpan Ticker'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
