import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { getArtikel } from '../../lib/cms';
import ArtikelClient from './ArtikelClient';

export const metadata = {
  title: 'Artikel & Opini | MTI SUMSEL',
  description: 'Artikel, analisis, dan opini Masyarakat Transportasi Indonesia Sumatera Selatan.'
};

export default async function ArtikelPage() {
  const allArtikel = await getArtikel();
  const visibleArticles = allArtikel.filter((item) => item.visible !== false);

  return (
    <main className="artikelPage">
      <Header activeItem="Artikel & Opini" />

      {/* ── Standard Hero Header (420px, 42px font) ── */}
      <section className="dialogHero">
        <img
          src="https://mti.or.id/wp-content/uploads/2023/07/Screenshot-2023-07-01-at-17.28.41.png"
          alt=""
          aria-hidden="true"
        />
        <span className="dialogHeroShade" />
        <div className="wideShell dialogHeroContent">
          <span className="dialogEyebrow">Artikel &amp; Opini</span>
          <h1>Artikel &amp; Opini Transportasi</h1>
          <p>
            Kajian mendalam, analisis kebijakan, dan perspektif kritis para pakar Masyarakat Transportasi Indonesia
            Wilayah Sumatera Selatan.
          </p>
        </div>
      </section>

      <ArtikelClient initialArticles={visibleArticles} />

      <Footer />
    </main>
  );
}
