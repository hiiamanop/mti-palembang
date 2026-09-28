import { ArrowRight, Building2, Download, Users } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { getStrukturOrganisasi } from '../../lib/cms';
import {
  ORGANIZATION_GROUPS,
  resolveOrganizationGroup
} from '../../lib/organization-structure';

export const metadata = {
  title: 'Struktur Organisasi | MTI Sumatera Selatan',
  description:
    'Struktur organisasi Masyarakat Transportasi Indonesia Wilayah Sumatera Selatan yang terdiri dari 17 posisi dalam lima kelompok.'
};

const IMG = {
  hero: 'https://mti.or.id/wp-content/uploads/2023/07/Dialog-dan-Sinergi-2.jpg',
  akses36: 'https://mti.or.id/wp-content/uploads/2026/04/36.jpg'
};

const GROUP_LABELS = {
  direction: 'Pengarah',
  daily: 'Pengurus Harian',
  organization: 'Bidang Organisasi',
  special: 'Bidang Khusus',
  secretariat: 'Sekretariat'
};

const tentangLinks = [
  { label: 'Sejarah MTI', href: '/sejarah-mti' },
  { label: 'Struktur Organisasi', href: '/struktur-organisasi', active: true },
  { label: 'Identitas Organisasi', href: '/identitas-organisasi' }
];

const aksesItems = [
  ['Transportasi Publik & Mudik', 'Edisi 36', 'Mar 2026'],
  ['Keselamatan Jalan Nasional', 'Edisi 35', 'Feb 2026'],
  ['TOD & Kota Berkelanjutan', 'Edisi 34', 'Jan 2026'],
  ['Logistik & ODOL', 'Edisi 33', 'Des 2025'],
  ['3T & Konektivitas Nusantara', 'Edisi 32', 'Nov 2025']
];

export default async function StrukturOrganisasiPage() {
  const { names } = await getStrukturOrganisasi();
  const resolvedGroups = Object.fromEntries(
    Object.entries(ORGANIZATION_GROUPS).map(([groupKey, positions]) => [
      groupKey,
      resolveOrganizationGroup(positions, names)
    ])
  );

  return (
    <main className="dialogPolicyPage">
      <Header activeItem="Tentang Kami" />

      <section className="dialogHero">
        <img src={IMG.hero} alt="" aria-hidden="true" />
        <span className="dialogHeroShade" />
        <div className="wideShell dialogHeroContent">
          <span className="dialogEyebrow">Tentang Kami</span>
          <h1>Struktur Organisasi MTI Sumatera Selatan</h1>
          <p>
            Susunan pengurus wilayah yang mendukung pengembangan organisasi, komunikasi publik,
            pendidikan profesi, kemitraan, dan bidang khusus transportasi di Sumatera Selatan.
          </p>
          <div className="dialogHeroStats" aria-label="Ringkasan struktur organisasi">
            <span>
              <strong>17</strong>
              Posisi organisasi
            </span>
            <span>
              <strong>5</strong>
              Kelompok kepengurusan
            </span>
            <span>
              <strong>1</strong>
              Nama per jabatan
            </span>
          </div>
        </div>
      </section>

      <section className="wideShell dialogIntroStrip" aria-label="Kelompok struktur organisasi">
        {Object.values(GROUP_LABELS).map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>

      <section className="wideShell dialogContentGrid">
        <div className="dialogFeed">
          <div className="dialogSectionHead">
            <span>
              <Users size={18} aria-hidden="true" />
              Kepengurusan Wilayah
            </span>
            <h2>Struktur organisasi MTI Sumatera Selatan.</h2>
          </div>

          {Object.entries(resolvedGroups).map(([groupKey, positions]) => (
            <section className="orgSection" key={groupKey}>
              <h3 className="orgSectionTitle">{GROUP_LABELS[groupKey]}</h3>
              <div className="orgFlatGrid">
                {positions.map((position) => (
                  <article className="orgFlatCard" key={position.key}>
                    <span>{position.role}</span>
                    <strong>{position.name}</strong>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="dialogSidebar" aria-label="Tentang MTI">
          <section className="dialogSidePanel highlight">
            <img src={IMG.akses36} alt="Akses Nusantara Edisi 36" />
            <div>
              <span>Publikasi</span>
              <h2>Unduh AKSES Nusantara</h2>
              <p>Publikasi berkala MTI untuk mengikuti isu transportasi nasional dan wilayah.</p>
            </div>
          </section>

          <section className="dialogSidePanel">
            <div className="dialogSideTitle">
              <Building2 size={18} aria-hidden="true" />
              <h2>Tentang Kami</h2>
            </div>
            <div className="sejarahSideLinks">
              {tentangLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={link.active ? 'sejarahSideLinkActive' : ''}
                >
                  {link.label}
                  <ArrowRight size={13} aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>

          <section className="dialogSidePanel">
            <div className="dialogSideTitle">
              <Download size={18} aria-hidden="true" />
              <h2>Arsip AKSES</h2>
            </div>
            <div className="aksesDownloadList">
              {aksesItems.map(([title, edition, date]) => (
                <a href="/aksesnusantara" key={`${title}-${edition}`}>
                  <span>
                    <strong>{title}</strong>
                    <small>{edition}</small>
                  </span>
                  <em>{date}</em>
                </a>
              ))}
            </div>
          </section>

          <section className="dialogSidePanel contact">
            <span>Sinergi MTI</span>
            <h2>Terhubung dengan MTI Sumatera Selatan.</h2>
            <p>
              Untuk informasi keanggotaan, kolaborasi, dan agenda organisasi, hubungi tim MTI
              Sumatera Selatan.
            </p>
            <a href="/#crm">
              Hubungi MTI Sumsel
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          </section>
        </aside>
      </section>

      <section className="mediaNewsBand">
        <div className="wideShell mediaNewsBandInner">
          <div className="mediaNewsBandText">
            <span>Organisasi Wilayah</span>
            <h2>Berkolaborasi untuk transportasi Sumatera Selatan yang lebih baik.</h2>
          </div>
          <div className="mediaNewsBandDesc">
            <p>
              Kepengurusan MTI Sumatera Selatan menyatukan pengalaman organisasi, pendidikan,
              komunikasi publik, dan keahlian bidang transportasi dalam satu forum profesional.
            </p>
          </div>
          <div className="mediaNewsBandIcon">
            <Users size={88} strokeWidth={0.8} aria-hidden="true" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
