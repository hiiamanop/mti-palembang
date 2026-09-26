'use client';

import { useState, useTransition } from 'react';
import { saveBeranda } from '../actions';
import ImageUpload from '../components/ImageUpload';

const TABS = [
  { key: 'pengenalan', label: '1. Pengenalan MTI Sumsel' },
  { key: 'visiMisi', label: '2. Visi & Misi' },
  { key: 'programUnggulan', label: '3. Program Unggulan' },
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
      tag: 'TENTANG KAMI',
      title: 'Masyarakat Transportasi Indonesia Wilayah Sumatera Selatan',
      description:
        'Lembaga pemikir (think tank) independen yang menghimpun akademisi, praktisi, birokrat, dan pemerhati transportasi di Sumsel.',
      image: '',
      pillars: [
        {
          title: 'Riset & Rekomendasi',
          desc: 'Memberi masukan berbasis data kepada Pemprov Sumsel & Pemkot/Pemkab.'
        },
        {
          title: 'Advokasi Publik',
          desc: 'Mendorong transportasi yang inklusif, aman, dan terjangkau.'
        },
        {
          title: 'Kolaborasi Multi-Pihak',
          desc: 'Menjembatani regulator (Kemenhub/Dishub), operator, dan masyarakat.'
        }
      ]
    }
  );

  const [visiMisi, setVisiMisi] = useState(
    beranda.visiMisi || {
      tag: 'VISI & MISI',
      visi:
        'Terwujudnya MTI sebagai organisasi yang menjadi acuan profesional bidang transportasi, menuju terbentuknya sistem transportasi yang berkelanjutan dan sesuai dengan aspirasi segenap pemangku kepentingan.',
      misi: [
        'Menumbuhkembangkan profesionalitas pelaku kegiatan bidang transportasi',
        'Memberikan pelayanan advokasi untuk pengambilan keputusan bidang transportasi'
      ],
      image: ''
    }
  );

  const [misiList, setMisiList] = useState(
    visiMisi.misi?.length
      ? visiMisi.misi
      : [
          'Menumbuhkembangkan profesionalitas pelaku kegiatan bidang transportasi',
          'Memberikan pelayanan advokasi untuk pengambilan keputusan bidang transportasi'
        ]
  );

  const [programUnggulan, setProgramUnggulan] = useState(
    beranda.programUnggulan?.length
      ? beranda.programUnggulan
      : [
          {
            id: 'p1',
            image: '',
            tag: 'FORUM DISKUSI',
            title: 'Forum Diskusi Transportasi Sumsel (FDTS)',
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

  const pillars = pengenalan.pillars || [];

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
            Hero section utama beranda dengan efek visual background dan bayangan (shadow) elegan seperti halaman Tentang Kami.
          </p>
          <form onSubmit={handlePengenalanSubmit} className="adminForm">
            <div className="adminFormRow">
              <div className="adminFormGroup" style={{ flex: '0 0 180px' }}>
                <label>Tag / Label</label>
                <input
                  name="pengenalanTag"
                  defaultValue={pengenalan.tag || 'TENTANG KAMI'}
                  placeholder="TENTANG KAMI"
                />
              </div>
              <div className="adminFormGroup" style={{ flex: 1 }}>
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
            </div>

            <div className="adminFormGroup">
              <label>Gambar Hero / Background Dokumentasi MTI Sumsel</label>
              <ImageUpload name="pengenalanImage" defaultValue={pengenalan.image || ''} />
              <small style={{ color: '#64748b', marginTop: 4, display: 'block' }}>
                Gambar ini akan menjadi latar belakang hero dengan efek bayangan dan pencahayaan sinematik.
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

            <h4 style={{ margin: '24px 0 12px', fontSize: 15 }}>
              3 Pilar Gerak MTI Sumsel
            </h4>

            {[1, 2, 3].map((num, i) => {
              const p = pillars[i] || {};
              const defaultTitles = [
                'Riset & Rekomendasi',
                'Advokasi Publik',
                'Kolaborasi Multi-Pihak'
              ];
              const defaultDescs = [
                'Memberi masukan berbasis data kepada Pemprov Sumsel & Pemkot/Pemkab.',
                'Mendorong transportasi yang inklusif, aman, dan terjangkau.',
                'Menjembatani regulator (Kemenhub/Dishub), operator, dan masyarakat.'
              ];
              return (
                <div key={num} className="adminFormSection" style={{ marginBottom: 16 }}>
                  <div className="adminFormSectionTitle">Pilar {num}</div>
                  <div className="adminFormGroup">
                    <label>Judul Pilar</label>
                    <input
                      name={`pillarTitle${num}`}
                      defaultValue={p.title ?? defaultTitles[i]}
                      placeholder="Judul pilar..."
                    />
                  </div>
                  <div className="adminFormGroup">
                    <label>Keterangan Pilar</label>
                    <textarea
                      name={`pillarDesc${num}`}
                      defaultValue={p.desc ?? defaultDescs[i]}
                      rows={2}
                      placeholder="Penjelasan pilar..."
                    />
                  </div>
                </div>
              );
            })}

            <div className="adminFormActions">
              <button type="submit" className="adminBtn adminBtnPrimary" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Simpan Pengenalan MTI Sumsel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'visiMisi' && (
        <div className="adminCard" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 8px' }}>Section 2: Visi &amp; Misi Organisasi</h3>
          <p style={{ margin: '0 0 20px', color: '#667085', fontSize: 14 }}>
            Arah dan cita-cita strategis MTI Sumatera Selatan.
          </p>

          <form onSubmit={handleVisiMisiSubmit} className="adminForm">
            <div className="adminFormGroup">
              <label>Tag / Label Seksi</label>
              <input
                name="visiMisiTag"
                defaultValue={visiMisi.tag || 'VISI & MISI'}
                placeholder="VISI & MISI"
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
                rows={4}
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
              style={{ marginBottom: 20 }}
              onClick={() => setMisiList([...misiList, ''])}
            >
              + Tambah Butir Misi
            </button>

            <div className="adminFormGroup">
              <label>Gambar / Dokumentasi Seksi Visi Misi (Opsional)</label>
              <ImageUpload name="visiMisiImage" defaultValue={visiMisi.image || ''} />
            </div>

            <div className="adminFormActions">
              <button type="submit" className="adminBtn adminBtnPrimary" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Simpan Visi & Misi'}
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
