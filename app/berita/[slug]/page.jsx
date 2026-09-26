import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  Tag,
  UserRound
} from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { getBerita } from '../../../lib/cms';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const berita = await getBerita();
  const article = berita.find((item) => item.slug === slug);

  if (!article) {
    return { title: 'Berita Tidak Ditemukan | MTI' };
  }

  return {
    title: `${article.title} | MTI`,
    description: article.excerpt
  };
}

export default async function NewsDetailPage({ params }) {
  const { slug } = await params;
  const berita = await getBerita();
  const article = berita.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = berita
    .filter((item) => item.slug !== article.slug)
    .filter((item) => item.group === article.group || item.cat === article.cat)
    .slice(0, 3);

  return (
    <main className="newsDetailPage">
      <Header
        activeItem="Kegiatan MTI"
        editionTitle="DETAIL BERITA"
        editionSubtitle="Masyarakat Transportasi Indonesia"
      />

      <article className="newsDetailHero">
        <div className="wideShell newsDetailHeroInner">
          <a className="newsBackLink" href="/#berita">
            <ArrowLeft size={16} aria-hidden="true" />
            Kembali ke daftar berita
          </a>
          <div className="newsDetailMeta">
            <span>{article.cat}</span>
            <small>
              <CalendarDays size={14} aria-hidden="true" />
              {article.detailDate}
            </small>
            <small>
              <UserRound size={14} aria-hidden="true" />
              {article.author}
            </small>
            <small>
              <Clock size={14} aria-hidden="true" />
              {article.readTime}
            </small>
          </div>
          <h1>{article.title}</h1>
          <p>{article.excerpt}</p>
        </div>
      </article>

      <section className="wideShell newsDetailLayout">
        <article className="newsDetailArticle">
          <img className="newsDetailImage" src={article.img} alt="" />
          <div className="newsDetailBody">
            {(article.content || []).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </article>

        <aside className="newsDetailSidebar" aria-label="Informasi berita">
          <section className="newsDetailPanel">
            <div className="newsDetailPanelTitle">
              <Tag size={18} aria-hidden="true" />
              <h2>Topik</h2>
            </div>
            <div className="newsDetailTopics">
              {(article.highlights || []).map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </section>

          {article.sourceUrl ? (
            <section className="newsDetailPanel source">
              <span>Sumber Artikel</span>
              <p>
                Halaman ini dibuat sebagai detail internal beranda. Tautan sumber asli tetap
                disimpan.
              </p>
              <a href={article.sourceUrl}>
                Buka sumber
                <ArrowRight size={15} aria-hidden="true" />
              </a>
            </section>
          ) : null}

          <section className="newsDetailPanel">
            <div className="newsDetailPanelTitle">
              <h2>Berita Terkait</h2>
            </div>
            <div className="newsRelatedList">
              {relatedArticles.map((item) => (
                <a href={item.href} key={item.slug}>
                  <img src={item.img} alt="" />
                  <span>
                    <small>{item.cat}</small>
                    <strong>{item.title}</strong>
                    <em>{item.date}</em>
                  </span>
                </a>
              ))}
            </div>
          </section>
        </aside>
      </section>

      <Footer />
    </main>
  );
}
