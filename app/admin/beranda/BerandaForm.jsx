'use client';

import { useState, useTransition } from 'react';
import { saveBeranda } from '../actions';
import ImageUpload from '../components/ImageUpload';

const TABS = [
  { key: 'aboutSumsel', label: 'Tentang MTI Sumsel' },
  { key: 'fokusIsu', label: 'Fokus Isu Sumsel' },
  { key: 'leadStory', label: 'Berita Utama' },
  { key: 'heroSide', label: 'Sorotan' },
  { key: 'ticker', label: 'Ticker' }
];

export default function BerandaForm({ beranda }) {
  const [activeTab, setActiveTab] = useState('aboutSumsel');
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState('');

  const [aboutSumsel] = useState(
    beranda.aboutSumsel || {
      tag: '',
      title: '',
      description: '',
      image: '',
      pillars: []
    }
  );

  const [fokusIsu, setFokusIsu] = useState(beranda.fokusIsu || []);
  const [ticker, setTicker] = useState(beranda.ticker || []);
  const [heroSide, setHeroSide] = useState(beranda.heroSide || []);

  const save = (section, formData) => {
    startTransition(async () => {
      await saveBeranda(section, formData);
      setStatus('Tersimpan!');
      setTimeout(() => setStatus(''), 2000);
    });
  };

  const handleAboutSubmit = (e) => {
    e.preventDefault();
    save('aboutSumsel', new FormData(e.target));
  };

  const handleFokusSubmit = (e) => {
    e.preventDefault();
    save('fokusIsu', new FormData(e.target));
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

  const pillars = aboutSumsel.pillars || [];

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

      {activeTab === 'aboutSumsel' && (
        <div className="adminCard" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px' }}>Tentang MTI Sumatera Selatan</h3>
          <form onSubmit={handleAboutSubmit} className="adminForm">
            <div className="adminFormRow">
              <div className="adminFormGroup" style={{ flex: '0 0 180px' }}>
                <label>Tag / Label</label>
                <input
                  name="aboutTag"
                  defaultValue={aboutSumsel.tag || 'TENTANG MTI SUMSEL'}
                  placeholder="TENTANG MTI SUMSEL"
                />
              </div>
              <div className="adminFormGroup" style={{ flex: 1 }}>
                <label>Judul Utama</label>
                <input
                  name="aboutTitle"
                  defaultValue={
                    aboutSumsel.title ||
                    'Masyarakat Transportasi Indonesia Wilayah Sumatera Selatan'
                  }
                  placeholder="Judul profil organisasi..."
                />
              </div>
            </div>

            <div className="adminFormGroup">
              <label>Gambar Resmi / Dokumentasi MTI Sumsel</label>
              <ImageUpload name="aboutImage" defaultValue={aboutSumsel.image || ''} />
            </div>

            <div className="adminFormGroup">
              <label>Deskripsi Profil</label>
              <textarea
                name="aboutDescription"
                defaultValue={
                  aboutSumsel.description ||
                  'Lembaga pemikir independen yang menghimpun akademisi, praktisi, birokrat, dan pemerhati transportasi di Sumatera Selatan untuk mewujudkan sistem mobilitas yang aman, tertib, terintegrasi, dan berkelanjutan.'
                }
                rows={4}
                placeholder="Penjelasan profil dan mandat MTI Sumsel..."
              />
            </div>

            <h4 style={{ margin: '24px 0 12px', fontSize: 15 }}>
              Poin / Nilai Gerak (Maksimal 3 Pilar)
            </h4>

            {[1, 2, 3].map((num, i) => {
              const p = pillars[i] || {};
              const defaultTitles = [
                'Riset & Rekomendasi Kebijakan',
                'Advokasi Transportasi Publik',
                'Kolaborasi Multipihak'
              ];
              const defaultDescs = [
                'Menghasilkan kajian berbasis data ilmiah untuk mendukung keputusan strategis pemerintah daerah.',
                'Mendorong integrasi antarmoda dan layanan transportasi yang inklusif serta terjangkau.',
                'Menjembatani akademisi, operator transportasi, pemangku kebijakan, dan masyarakat.'
              ];
              return (
                <div key={num} className="adminFormSection" style={{ marginBottom: 16 }}>
                  <div className="adminFormSectionTitle">Pilar {num}</div>
                  <div className="adminFormGroup">
                    <label>Judul Pilar</label>
                    <input
                      name={`pillarTitle${num}`}
                      defaultValue={p.title ?? defaultTitles[i]}
                      placeholder="Judul pilar/nilai..."
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
                {isPending ? 'Menyimpan...' : 'Simpan Tentang MTI Sumsel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'fokusIsu' && (
        <div className="adminCard" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 8px' }}>Fokus Isu Transportasi Sumsel</h3>
          <p style={{ margin: '0 0 20px', color: '#667085', fontSize: 14 }}>
            Tambahkan kartu fokus isu sesuai gambar dokumentasi yang Anda miliki. Bebas tambah
            atau hapus kartu.
          </p>

          <form onSubmit={handleFokusSubmit} className="adminForm">
            {fokusIsu.map((item, i) => (
              <div key={item.id || i} className="adminFormSection" style={{ marginBottom: 20 }}>
                <input type="hidden" name="fokusId" value={item.id || ''} />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12
                  }}
                >
                  <div className="adminFormSectionTitle">Item Fokus #{i + 1}</div>
                  <button
                    type="button"
                    className="adminBtn adminBtnSmall adminBtnDanger"
                    onClick={() => setFokusIsu(fokusIsu.filter((_, idx) => idx !== i))}
                  >
                    Hapus
                  </button>
                </div>

                <div className="adminFormGroup">
                  <label>Gambar Fokus</label>
                  <ImageUpload name="fokusImage" defaultValue={item.image || ''} />
                </div>

                <div className="adminFormRow">
                  <div className="adminFormGroup" style={{ flex: '0 0 220px' }}>
                    <label>Tag / Kategori</label>
                    <input
                      name="fokusTag"
                      defaultValue={item.tag || ''}
                      placeholder="LRT SUMSEL / TRANSPORTASI DARAT"
                    />
                  </div>
                  <div className="adminFormGroup" style={{ flex: 1 }}>
                    <label>Judul Fokus</label>
                    <input
                      name="fokusTitle"
                      defaultValue={item.title || ''}
                      placeholder="Judul fokus transportasi..."
                    />
                  </div>
                </div>

                <div className="adminFormGroup">
                  <label>Ringkasan / Keterangan</label>
                  <textarea
                    name="fokusSummary"
                    defaultValue={item.summary || ''}
                    rows={3}
                    placeholder="Ringkasan penjelasan fokus isu..."
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              className="adminBtn adminBtnSecondary"
              style={{ marginBottom: 20 }}
              onClick={() =>
                setFokusIsu([
                  ...fokusIsu,
                  {
                    id: Date.now().toString(),
                    image: '',
                    tag: 'TRANSPORTASI SUMSEL',
                    title: '',
                    summary: ''
                  }
                ])
              }
            >
              + Tambah Item Fokus
            </button>

            <div className="adminFormActions">
              <button type="submit" className="adminBtn adminBtnPrimary" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Simpan Fokus Isu'}
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
