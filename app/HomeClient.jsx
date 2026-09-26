'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Newsletter from './components/shared/Newsletter';

const catStyles = {
  Berita: { bg: '#ececf9', color: '#4647ae' },
  Sinergi: { bg: '#e6f0fc', color: '#2e6fd0' },
  Dialog: { bg: '#e6eaf7', color: '#112e81' }
};

export default function HomeClient({
  beritaItems = [],
  tickerItems = [],
  heroSide = [],
  leadStory = null,
  mediaData = null,
  pengenalan = null,
  fokusIsu = [],
  programUnggulan = []
}) {
  const [filter, setFilter] = useState('Semua');

  const news = useMemo(() => {
    const filtered =
      filter === 'Semua' ? beritaItems : beritaItems.filter((item) => item.group === filter);
    return filtered.map((item) => ({
      ...item,
      tagBg: catStyles[item.cat]?.bg || catStyles.Berita.bg,
      tagColor: catStyles[item.cat]?.color || catStyles.Berita.color
    }));
  }, [filter, beritaItems]);

  const mainVideoUrl = mediaData?.mainVideo?.url || '';
  const miniVideos = mediaData?.miniVideos?.filter((v) => v.visible) || [];
  const hasMedia = Boolean(mainVideoUrl || miniVideos.length);

  const hasHero = Boolean(leadStory?.title || heroSide.length);
  const hasPengenalan = Boolean(
    pengenalan?.title ||
    pengenalan?.description ||
    pengenalan?.image ||
    pengenalan?.pillars?.length
  );

  return (
    <main className="newsroom">
      <Header activeItem="Beranda" />

      {tickerItems.length > 0 ? (
        <section className="tickerBand" aria-label="Berita terkini">
          <div className="tickerLabel">
            <span />
            TERKINI
          </div>
          <div className="tickerWindow">
            <div className="tickerTrack">
              {[...tickerItems, ...tickerItems].map((item, index) => (
                <span className="tickerItem" key={`${item.tag}-${index}`}>
                  <strong>{item.tag}</strong>
                  {item.text}
                  <i />
                </span>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Section 1: Pengenalan MTI Sumsel ────────────────── */}
      {hasPengenalan ? (
        <section className="pengenalanSection">
          <div className="wideShell">
            <div className={`pengenalanGrid ${!pengenalan.image ? 'noMedia' : ''}`}>
              <div className="pengenalanContent">
                <span className="pengenalanTag">{pengenalan.tag || 'TENTANG KAMI'}</span>
                <h2>
                  {pengenalan.title ||
                    'Masyarakat Transportasi Indonesia Wilayah Sumatera Selatan'}
                </h2>
                {pengenalan.description ? (
                  <p className="pengenalanLead">{pengenalan.description}</p>
                ) : null}
              </div>
              {pengenalan.image ? (
                <div className="pengenalanMedia">
                  <img
                    src={pengenalan.image}
                    alt={pengenalan.title || 'MTI Sumsel'}
                    className="pengenalanImage"
                  />
                </div>
              ) : null}
            </div>

            {pengenalan.pillars?.length ? (
              <div className="pengenalanPillars">
                {pengenalan.pillars.map((pillar, i) => (
                  <div className="pengenalanPillarCard" key={i}>
                    <span className="pillarNumber">0{i + 1}</span>
                    <strong>{pillar.title}</strong>
                    {pillar.desc ? <p>{pillar.desc}</p> : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ── Section 2: Fokus Isu Transportasi Sumsel ────────── */}
      {fokusIsu.length > 0 ? (
        <section className="fokusIsuSection">
          <div className="wideShell">
            <div className="sectionHeader">
              <div className="titleLockup">
                <span />
                <div>
                  <small>Tantangan &amp; Isu Lokal</small>
                  <h2>Fokus Isu Transportasi Sumatera Selatan</h2>
                </div>
              </div>
            </div>
            <div className="fokusIsuGrid">
              {fokusIsu.map((item, i) => (
                <article className="fokusIsuCard" key={item.id || i}>
                  {item.image ? (
                    <img src={item.image} alt={item.title || ''} />
                  ) : null}
                  <div className="fokusIsuBody">
                    {item.tag ? <span className="fokusIsuTag">{item.tag}</span> : null}
                    <h3>{item.title}</h3>
                    {item.summary ? <p>{item.summary}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Section 3: Program Unggulan MTI Sumsel ──────────── */}
      {programUnggulan.length > 0 ? (
        <section className="programUnggulanSection">
          <div className="wideShell">
            <div className="sectionHeader">
              <div className="titleLockup">
                <span />
                <div>
                  <small>Aksi Nyata &amp; Kolaborasi</small>
                  <h2>Program Unggulan MTI Sumatera Selatan</h2>
                </div>
              </div>
            </div>
            <div className="programUnggulanGrid">
              {programUnggulan.map((item, i) => (
                <article className="programUnggulanCard" key={item.id || i}>
                  {item.image ? (
                    <img src={item.image} alt={item.title || ''} />
                  ) : null}
                  <div className="programUnggulanBody">
                    {item.tag ? <span className="programUnggulanTag">{item.tag}</span> : null}
                    <h3>{item.title}</h3>
                    {item.summary ? <p>{item.summary}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Hero / Lead Story & Sorotan ─────────────────────── */}
      {hasHero ? (
        <section className="wideShell heroGrid">
          {leadStory?.title ? (
            <article className="leadStory riseCard">
              <a href={leadStory.href || '#'} className="newsCard">
                <div className="leadImage">
                  <img src={leadStory.img} alt={leadStory.title} />
                  <span className="imageShade" />
                  <span className="storyPill">{leadStory.cat}</span>
                  <h1>{leadStory.title}</h1>
                </div>
                <div className="leadBody">
                  <p>{leadStory.excerpt}</p>
                  <div className="byline">
                    <span className="authorAvatar" />
                    <strong>{leadStory.author}</strong>
                    <i />
                    <span>{leadStory.date}</span>
                    <i />
                    <span>{leadStory.readTime}</span>
                  </div>
                </div>
              </a>
            </article>
          ) : null}

          <aside className="sideStories riseCard">
            <div className="sideHeading">
              <span />
              <h2>Sorotan</h2>
            </div>
            {heroSide.map((story) => (
              <a className="sideStory" href={story.href || '#'} key={story.id || story.title}>
                <div>
                  <img src={story.img} alt="" />
                </div>
                <span>
                  <small style={{ color: story.tagColor }}>{story.cat}</small>
                  <strong>{story.title}</strong>
                  <em>{story.date}</em>
                </span>
              </a>
            ))}
          </aside>
        </section>
      ) : null}

      {/* ── MTI Dalam Berita ─────────────────────────────────── */}
      {news.length > 0 ? (
        <section className="wideShell newsSection" id="berita">
          <div className="sectionHeader">
            <div className="titleLockup">
              <span />
              <h2>MTI Dalam Berita</h2>
            </div>
            <div className="filterGroup" aria-label="Filter berita">
              {['Semua', 'Berita', 'Sinergi'].map((item) => (
                <button
                  className={filter === item ? 'selected' : ''}
                  type="button"
                  key={item}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="newsGrid">
            {news.map((item) => (
              <a className="articleCard riseCard" href={item.href} key={item.id}>
                <div className="articleImage">
                  <img src={item.img} alt="" />
                  <span style={{ background: item.tagBg, color: item.tagColor }}>{item.cat}</span>
                </div>
                <div className="articleBody">
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                  <div>
                    <span>{item.date}</span>
                    <strong>
                      Selengkapnya
                      <ArrowRight size={13} aria-hidden="true" />
                    </strong>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── MTI di Media ────────────────────────────────────── */}
      {hasMedia ? (
        <section className="wideShell mediaSection">
          <div className="sectionHeader single">
            <div className="titleLockup">
              <span />
              <h2>MTI di Media</h2>
            </div>
          </div>
          <div className="mediaGrid">
            {mainVideoUrl ? (
              <div className="videoFrame">
                <iframe
                  src={mainVideoUrl}
                  title={mediaData?.mainVideo?.title || 'MTI di Media'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : null}
            <div className="videoList">
              {miniVideos.map((video) => (
                <a className="miniVideo" href={video.href || '#'} key={video.id || video.title}>
                  <img src={video.img} alt="" />
                  <span className="imageShade" />
                  <i>
                    <Play size={16} fill="currentColor" aria-hidden="true" />
                  </i>
                  <strong>{video.title}</strong>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <Newsletter />
      <Footer />
    </main>
  );
}
