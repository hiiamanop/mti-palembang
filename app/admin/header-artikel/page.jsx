import { getArtikelHero } from '../../../lib/cms';
import ArtikelHeroForm from './ArtikelHeroForm';

export const metadata = { title: 'Header Artikel & Berita - MTI CMS' };

export default async function AdminHeaderArtikelPage() {
  const hero = await getArtikelHero();
  return <ArtikelHeroForm hero={hero} />;
}
