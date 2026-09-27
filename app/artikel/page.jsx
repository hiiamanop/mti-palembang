import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { getArtikel, getArtikelHero } from '../../lib/cms';
import ArtikelClient from './ArtikelClient';
import ArtikelHero from './ArtikelHero';

export const metadata = {
  title: 'Artikel & Opini | MTI SUMSEL',
  description: 'Artikel, analisis, dan opini Masyarakat Transportasi Indonesia Sumatera Selatan.'
};

export default async function ArtikelPage() {
  const [allArtikel, artikelHero] = await Promise.all([getArtikel(), getArtikelHero()]);
  const visibleArticles = allArtikel.filter((item) => item.visible !== false);

  return (
    <main className="artikelPage">
      <Header activeItem="Artikel & Opini" />

      {/* ── Standard Hero Header (420px, 42px font) ── */}
      <ArtikelHero savedHero={artikelHero} />

      <ArtikelClient initialArticles={visibleArticles} />

      <Footer />
    </main>
  );
}
