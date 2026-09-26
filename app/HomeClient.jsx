'use client';

import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Play
} from 'lucide-react';
import aksesBanner from '../assets/Banner-AKSES.jpg';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Newsletter from './components/shared/Newsletter';
import { SITE_CONFIG } from '../lib/site-config';

const signatureTags = ['Kegiatan MTI', 'Dialog Kebijakan', 'Kabar Wilayah', 'Publikasi AKSES'];

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
  regions = [],
  mediaData = null,
  aksesData = null
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

  const aksesEdition = aksesData?.edition || '';
  const aksesDate = aksesData?.date || '';
  const aksesTopic = aksesData?.topic || '';
  const aksesTitle = aksesData?.title || '';
  const aksesDescription = aksesData?.description || '';
  const hasAkses = Boolean(
    aksesEdition || aksesDate || aksesTopic || aksesTitle || aksesDescription
  );
  const hasHero = Boolean(leadStory?.title || heroSide.length);

  return (
    <main className="newsroom">
      <Header activeItem="Beranda" aksesEdition={aksesEdition} />

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

      <section className="signatureSection" aria-label="Sorotan beranda MTI">
        <div className="wideShell signatureGrid">
          <div className="signatureCopy">
            <span className="signatureKicker">Sorotan Beranda</span>
            <h2>Kabar transportasi yang perlu diikuti.</h2>
            <p>
              Beranda MTI merangkum kegiatan, dialog kebijakan, kabar wilayah, dan publikasi agar
              pembaca cepat menemukan isu utama yang sedang dibahas.
            </p>
            <div className="signatureTags" aria-label="Fokus beranda">
              {signatureTags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>

          <div className="signatureBoard" aria-hidden="true">
            <div className="boardHeader">
              <img src={SITE_CONFIG.logo} alt="" />
              <span>
                <strong>Catatan Redaksi</strong>
                <small>Diperbarui berkala</small>
              </span>
            </div>
            <div className="deskPreview">
              <div className="deskPreviewMain">
                <span>Fokus pekan ini</span>
                <strong>Mudik, layanan publik, dan transportasi wilayah</strong>
                <p>Disusun dari agenda MTI, berita terbaru, dan masukan pengurus wilayah.</p>
              </div>
              <div className="deskPreviewRail">
                <span>Kegiatan</span>
                <span>Berita</span>
                <span>Wilayah</span>
                <span>Publikasi</span>
              </div>
            </div>
            <div className="issueStack">
              <span>
                <strong>01</strong>
                Dialog kebijakan dan rekomendasi
              </span>
              <span>
                <strong>02</strong>
                Kabar kegiatan MTI pusat dan wilayah
              </span>
              <span>
                <strong>03</strong>
                Publikasi AKSES Nusantara
              </span>
            </div>
          </div>
        </div>
      </section>

      {hasAkses ? (
        <section className="wideShell aksesShowcase" id="akses">
        <div className="aksesSurface">
          <div className="aksesCopy">
            <span>AKSES Nusantara</span>
            <h2>{aksesTitle}</h2>
            <p>{aksesDescription}</p>
            <div className="aksesMeta">
              <small>{aksesEdition}</small>
              <small>{aksesDate}</small>
              <small>{aksesTopic}</small>
            </div>
            <a href="#newsletter">
              Ikuti update AKSES
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>
          <div className="aksesVisual">
            <img
              className="aksesEdition"
              src="/images/banner-akses-edisi-36.png"
              alt="AKSES Nusantara Edisi 36 Maret 2026"
            />
            <img
              className="aksesTransport"
              src="/images/banner-akses-transport.png"
              alt=""
              aria-hidden="true"
            />
          </div>
        </div>
        </section>
      ) : null}

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
          <a className="journalCard" href="/aksesnusantara">
            <small>Jurnal Berkala</small>
            <strong>
              AKSES Nusantara
              <br />
              {aksesEdition} - {aksesDate}
            </strong>
            <span>
              Baca Edisi Terbaru
              <ArrowRight size={15} aria-hidden="true" />
            </span>
          </a>
        </aside>
        </section>
      ) : null}

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

      {hasAkses ? (
        <section className="aksesFullBanner" aria-label="Banner AKSES Nusantara">
          <img src={aksesBanner.src} alt="AKSES Nusantara" />
        </section>
      ) : null}

      {regions.length > 0 ? (
        <section className="regionalBand" id="tentang">
        <div className="wideShell">
          <div className="regionalHeader">
            <div className="titleLockup">
              <span />
              <div>
                <small>Opini &amp; Suara Daerah</small>
                <h2>MTI Wilayah</h2>
              </div>
            </div>
            <a href="#">
              Semua Wilayah
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>
          <div className="regionGrid">
            {regions.map((region) => (
              <a className="regionItem" href="#" key={region.id || region.num}>
                <span>{region.num}</span>
                <div>
                  <small>{region.tag}</small>
                  <h3>{region.title}</h3>
                  <p>{region.excerpt}</p>
                  <em>{region.date}</em>
                </div>
              </a>
            ))}
          </div>
        </div>
        </section>
      ) : null}

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
