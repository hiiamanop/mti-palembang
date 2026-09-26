import { Sparkles } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { getKegiatan } from '../../lib/cms';
import KegiatanClient from './KegiatanClient';

const HERO_BG =
  'https://mti.or.id/wp-content/uploads/2023/07/Dialog-dan-Sinergi-2.jpg';

export const metadata = {
  title: 'Kegiatan MTI | MTI SUMSEL',
  description: 'Daftar kegiatan Masyarakat Transportasi Indonesia Sumatera Selatan.'
};

export default async function KegiatanPage() {
  const allKegiatan = await getKegiatan();
  const kegiatan = allKegiatan.filter((item) => item.published);
  return (
    <main className="kegiatanPage">
      <Header activeItem="Kegiatan MTI" />
      <section className="dialogHero">
        <img src={HERO_BG} alt="" aria-hidden="true" />
        <span className="dialogHeroShade" />
        <div className="wideShell dialogHeroContent">
          <span className="dialogEyebrow">
            <Sparkles size={16} aria-hidden="true" />
            Kegiatan MTI
          </span>
          <h1>Kegiatan Masyarakat Transportasi Indonesia</h1>
          <p>
            Agenda, diskusi kebijakan, dan aksi nyata Masyarakat Transportasi Indonesia Wilayah
            Sumatera Selatan dari tahun ke tahun.
          </p>
        </div>
      </section>
      <KegiatanClient kegiatan={kegiatan} />
      <Footer />
    </main>
  );
}
