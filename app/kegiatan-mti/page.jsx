import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { getKegiatan, getKegiatanHero } from '../../lib/cms';
import KegiatanClient from './KegiatanClient';

const DEFAULT_HERO = {
  eyebrow: 'Kegiatan MTI',
  title: 'Kegiatan Masyarakat Transportasi Sumatera Selatan',
  description:
    'Agenda, diskusi kebijakan, dan aksi nyata Masyarakat Transportasi Indonesia Wilayah Sumatera Selatan dari tahun ke tahun.',
  image: 'https://mti.or.id/wp-content/uploads/2023/07/Dialog-dan-Sinergi-2.jpg'
};

export const metadata = {
  title: 'Kegiatan MTI | MTI SUMSEL',
  description: 'Daftar kegiatan Masyarakat Transportasi Indonesia Sumatera Selatan.'
};

export default async function KegiatanPage() {
  const [allKegiatan, savedHero] = await Promise.all([
    getKegiatan(),
    getKegiatanHero()
  ]);
  const kegiatan = allKegiatan.filter((item) => item.published);
  const hero = {
    eyebrow: savedHero.eyebrow || DEFAULT_HERO.eyebrow,
    title: savedHero.title || DEFAULT_HERO.title,
    description: savedHero.description || DEFAULT_HERO.description,
    image: savedHero.image || DEFAULT_HERO.image
  };

  return (
    <main className="kegiatanPage">
      <Header activeItem="Kegiatan MTI" />
      <section className="dialogHero">
        <img src={hero.image} alt="" aria-hidden="true" />
        <span className="dialogHeroShade" />
        <div className="wideShell dialogHeroContent">
          <span className="dialogEyebrow">{hero.eyebrow}</span>
          <h1>{hero.title}</h1>
          <p>{hero.description}</p>
        </div>
      </section>
      <KegiatanClient kegiatan={kegiatan} />
      <Footer />
    </main>
  );
}
