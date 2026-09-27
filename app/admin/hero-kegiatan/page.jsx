import { getKegiatanHero } from '../../../lib/cms';
import HeroKegiatanForm from './HeroKegiatanForm';

export const metadata = { title: 'Hero Kegiatan - MTI CMS' };

export default async function AdminHeroKegiatanPage() {
  const hero = await getKegiatanHero();
  return <HeroKegiatanForm hero={hero} />;
}
