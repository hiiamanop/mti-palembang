'use client';

import { useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Flag,
  MessageSquare,
  Play,
  Sparkles,
  Target,
  Users
} from 'lucide-react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Newsletter from './components/shared/Newsletter';

const catStyles = {
  Berita: { bg: '#ececf9', color: '#4647ae' },
  Sinergi: { bg: '#e6f0fc', color: '#2e6fd0' },
  Dialog: { bg: '#e6eaf7', color: '#112e81' }
};

const DEFAULT_HERO_BG =
  'https://mti.or.id/wp-content/uploads/2023/07/Dialog-dan-Sinergi-2.jpg';

export default function HomeClient({
  beritaItems = [],
  tickerItems = [],
  heroSide = [],
  leadStory = null,
  mediaData = null,
  pengenalan = null,
  visiMisi = null,
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

  const hasVisiMisi = Boolean(
    visiMisi?.visi ||
    visiMisi?.misi?.length ||
    visiMisi?.image
  );

  const heroBg = pengenalan?.image || DEFAULT_HERO_BG;

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

      {/* ── Section 1: Hero Pengenalan MTI Sumsel dengan Shadow Gambar ── */}
      {hasPengenalan ? (
        <section className="homeDialogHero">
          <img src={heroBg} alt="" className="homeHeroBg" aria-hidden="true" />
          <span className="homeHeroShade" />

          <div className="wideShell homeHeroContent">
            <div className="homeHeroHeader">
              <h1 className="homeHeroTitle">
                {pengenalan.title || 'Masyarakat Transportasi Indonesia Wilayah Sumatera Selatan'}
              </h1>
              {pengenalan.description ? (
                <p className="homeHeroLead">{pengenalan.description}</p>
              ) : null}

              <div className="homeHeroActions">
                <a href="/kegiatan-mti" className="homeHeroBtnPrimary">
                  Jelajahi Kegiatan MTI
                  <ArrowRight size={15} aria-hidden="true" />
                </a>
                <a href="/sejarah-mti" className="homeHeroBtnSecondary">
                  Profil Organisasi
                </a>
              </div>
            </div>

            {pengenalan.pillars?.length ? (
              <div className="homeHeroPillarsGrid">
                {pengenalan.pillars.map((pillar, i) => (
                  <div className="homeHeroPillarCard" key={i}>
                    <div className="pillarCardTop">
                      <span className="pillarNum">0{i + 1}</span>
                      <span className="pillarAccent" />
                    </div>
                    <strong>{pillar.title}</strong>
                    {pillar.desc ? <p>{pillar.desc}</p> : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ── Section 2: Visi & Misi Organisasi ─────────────────── */}
      {hasVisiMisi ? (
        <section className="visiMisiSection">
          <div className="wideShell">
            <div className="editorialSectionHeader">
              <div className="headerKicker">
                <span className="kickerBar" />
                <span className="kickerText">{visiMisi.tag || 'VISI &amp; MISI'}</span>
              </div>
              <div className="headerMain">
                <h2>Arah &amp; Cita-Cita Strategis MTI Sumsel</h2>
                <p>
                  Landasan pijak perjuangan menuju terciptanya sistem mobilitas yang adil,
                  berkelanjutan, dan berpihak kepada kepentingan masyarakat.
                </p>
              </div>
            </div>

            <div className="visiMisiLayout">
              {/* Kolom Visi */}
              <div className="visiCard">
                <div className="visiCardHeader">
                  <div className="iconCircle">
                    <Target size={22} strokeWidth={2} />
                  </div>
                  <span className="badgeLabel">VISI ORGANISASI</span>
                </div>
                <blockquote className="visiQuote">
                  &ldquo;{visiMisi.visi || 'Terwujudnya MTI sebagai organisasi yang menjadi acuan profesional bidang transportasi, menuju terbentuknya sistem transportasi yang berkelanjutan dan sesuai dengan aspirasi segenap pemangku kepentingan.'}&rdquo;
                </blockquote>
                <div className="visiFooterNote">
                  <span>Pedoman Strategis Kebijakan Transportasi</span>
                </div>
              </div>

              {/* Kolom Misi */}
              <div className="misiCard">
                <div className="misiCardHeader">
                  <div className="iconCircle">
                    <Flag size={22} strokeWidth={2} />
                  </div>
                  <span className="badgeLabel">MISI ORGANISASI</span>
                </div>

                <ul className="misiList">
                  {(visiMisi.misi?.length
                    ? visiMisi.misi
                    : [
                        'Menumbuhkembangkan profesionalitas pelaku kegiatan bidang transportasi',
                        'Memberikan pelayanan advokasi untuk pengambilan keputusan bidang transportasi'
                      ]
                  ).map((item, idx) => (
                    <li key={idx} className="misiItem">
                      <div className="misiNumber">0{idx + 1}</div>
                      <div className="misiText">{item}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {visiMisi.image ? (
              <div className="visiMisiBannerImage">
                <img src={visiMisi.image} alt="Visi Misi MTI Sumsel" />
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ── Section 3: Program Unggulan MTI Sumsel ──────────── */}
      {programUnggulan.length > 0 ? (
        <section className="programUnggulanSection">
          <div className="wideShell">
            <div className="editorialSectionHeader centered">
              <div className="headerKicker">
                <span className="kickerBar" />
                <span className="kickerText">AKSI NYATA &amp; KOLABORASI</span>
              </div>
              <div className="headerMain">
                <h2>Program Unggulan MTI Sumatera Selatan</h2>
                <p>Wadah berkala dialog, advokasi aspirasi publik, dan kajian kebijakan berkelanjutan.</p>
              </div>
            </div>

            <div className="programBentoGrid">
              {programUnggulan.map((item, i) => {
                const icons = [MessageSquare, Users, FileText];
                const IconComponent = icons[i % icons.length];
                return (
                  <article className="programBentoCard" key={item.id || i}>
                    <div className="programCardTop">
                      <div className="programIconBadge">
                        <IconComponent size={20} strokeWidth={1.8} />
                      </div>
                      {item.tag ? <span className="programTagBadge">{item.tag}</span> : null}
                    </div>

                    {item.image ? (
                      <div className="programImageFrame">
                        <img src={item.image} alt={item.title || ''} />
                      </div>
                    ) : null}

                    <div className="programCardBody">
                      <h3>{item.title}</h3>
                      {item.summary ? <p>{item.summary}</p> : null}
                    </div>

                    <div className="programCardFoot">
                      <span className="programIndex">PROG 0{i + 1}</span>
                      <span className="programArrow">
                        <ArrowUpRight size={16} />
                      </span>
                    </div>
                  </article>
                );
              })}
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
