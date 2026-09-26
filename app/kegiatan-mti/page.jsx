import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { getKegiatan } from '../../lib/cms';
import KegiatanClient from './KegiatanClient';

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
      <section className="kegiatanHero">
        <div className="wideShell">
          <span>Kegiatan MTI</span>
          <h1>Kegiatan Masyarakat Transportasi Indonesia</h1>
          <p>Agenda dan aktivitas MTI Sumatera Selatan dari tahun ke tahun.</p>
        </div>
      </section>
      <KegiatanClient kegiatan={kegiatan} />
      <Footer />
    </main>
  );
}
