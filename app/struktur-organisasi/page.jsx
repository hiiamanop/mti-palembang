import {
  ArrowRight,
  Building2,
  Download,
  Users
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { getStrukturOrganisasi } from "../../lib/cms";
import {
  ORGANIZATION_GROUPS,
  resolveOrganizationGroup
} from "../../lib/organization-structure";

export const metadata = {
  title: "Struktur Organisasi | Masyarakat Transportasi Indonesia",
  description:
    "Struktur kepengurusan Masyarakat Transportasi Indonesia periode 2025–2028 hasil Kongres Nasional X di Jakarta."
};

const IMG = {
  logo: "https://mti.or.id/wp-content/uploads/2023/01/cropped-cropped-MTI_LOGO_PNG-1-270x270.png",
  hero: "https://mti.or.id/wp-content/uploads/2023/07/Dialog-dan-Sinergi-2.jpg",
  akses36: "https://mti.or.id/wp-content/uploads/2026/04/36.jpg",
  orgChart: "https://mti.or.id/wp-content/uploads/2025/11/1761963524570.jpg"
};

const tentangLinks = [
  { label: "Sejarah MTI", href: "/sejarah-mti" },
  { label: "Struktur Organisasi", href: "/struktur-organisasi", active: true },
  { label: "Identitas Organisasi", href: "/identitas-organisasi" }
];

const aksesItems = [
  ["Transportasi Publik & Mudik", "Edisi 36", "Mar 2026"],
  ["Keselamatan Jalan Nasional", "Edisi 35", "Feb 2026"],
  ["TOD & Kota Berkelanjutan", "Edisi 34", "Jan 2026"],
  ["Logistik & ODOL", "Edisi 33", "Des 2025"],
  ["3T & Konektivitas Nusantara", "Edisi 32", "Nov 2025"]
];

export default async function StrukturOrganisasiPage() {
  const { names } = await getStrukturOrganisasi();

  const advisory = resolveOrganizationGroup(ORGANIZATION_GROUPS.advisory, names);
  const experts = resolveOrganizationGroup(ORGANIZATION_GROUPS.experts, names);
  const leadership = resolveOrganizationGroup(ORGANIZATION_GROUPS.leadership, names);
  const divisions = resolveOrganizationGroup(ORGANIZATION_GROUPS.divisions, names);

  return (
    <main className="dialogPolicyPage">
      <Header activeItem="Tentang Kami" />

      <section className="dialogHero">
        <img src={IMG.hero} alt="" aria-hidden="true" />
        <span className="dialogHeroShade" />
        <div className="wideShell dialogHeroContent">
          <span className="dialogEyebrow">
            Tentang Kami
          </span>
          <h1>Struktur Organisasi MTI</h1>
          <p>
            Kepengurusan Masyarakat Transportasi Indonesia periode 2025–2028 hasil Kongres
            Nasional X yang diselenggarakan di Jakarta pada November 2025.
          </p>
          <div className="dialogHeroStats" aria-label="Ringkasan halaman">
            <span>
              <strong>2025–2028</strong>
              Periode kepengurusan
            </span>
            <span>
              <strong>10</strong>
              Bidang kerja
            </span>
            <span>
              <strong>34</strong>
              Wilayah aktif
            </span>
          </div>
        </div>
      </section>

      <section className="wideShell dialogIntroStrip" aria-label="Lembaga pendukung">
        {["Dewan Pembina", "Majelis Pakar", "Pengurus Pusat", "Bidang Teknis"].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>

      <section className="wideShell dialogContentGrid">
        <div className="dialogFeed">
          <div className="dialogSectionHead">
            <span>
              <Users size={18} aria-hidden="true" />
              Kepengurusan Pusat
            </span>
            <h2>Pengurus MTI periode 2025–2028.</h2>
          </div>

          {/* Dewan Pembina */}
          <div className="orgSection">
            <h3 className="orgSectionTitle">Dewan Pembina</h3>
            <div className="orgAdvisoryGrid">
              {advisory.map((p) => (
                <div className="orgAdvisoryCard" key={p.key}>
                  <span>{p.role}</span>
                  <strong>{p.name}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Majelis Pakar */}
          <div className="orgSection">
            <h3 className="orgSectionTitle">Majelis Pakar</h3>
            <div className="orgAdvisoryGrid">
              {experts.map((p) => (
                <div className="orgAdvisoryCard" key={p.key}>
                  <span>{p.role}</span>
                  <strong>{p.name}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Pengurus Harian */}
          <div className="orgSection">
            <h3 className="orgSectionTitle">Pengurus Harian</h3>
            <div className="orgLeaderGrid">
              {leadership.map((p) => (
                <div className="orgLeaderCard" key={p.key}>
                  <span className="orgBadge">{p.badge}</span>
                  <div className="orgLeaderBody">
                    <small>{p.role}</small>
                    <strong>{p.name}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bidang-Bidang */}
          <div className="orgSection">
            <h3 className="orgSectionTitle">Bidang Teknis</h3>
            <div className="orgDivisionGrid">
              {divisions.map((d, i) => (
                <div className="orgDivisionCard" key={d.key}>
                  <span className="orgDivisionNum">Bidang {i + 1}</span>
                  <strong>{d.role}</strong>
                  <small>{d.name}</small>
                </div>
              ))}
            </div>
          </div>
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
                  className={link.active ? "sejarahSideLinkActive" : ""}
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
            <h2>Terhubung dengan sekretariat MTI.</h2>
            <p>
              Untuk informasi keanggotaan, kolaborasi, dan agenda organisasi, hubungi sekretariat
              kami.
            </p>
            <a href="mailto:secretariat@mti.or.id">
              secretariat@mti.or.id
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          </section>
        </aside>
      </section>

      <section className="mediaNewsBand">
        <div className="wideShell mediaNewsBandInner">
          <div className="mediaNewsBandText">
            <span>Organisasi Profesi</span>
            <h2>Digerakkan oleh para pakar, akademisi, dan praktisi transportasi Indonesia.</h2>
          </div>
          <div className="mediaNewsBandDesc">
            <p>
              Kepengurusan MTI mencerminkan keberagaman keahlian di bidang transportasi — dari
              teknik, kebijakan publik, logistik, hingga manajemen — bersinergi untuk mendorong
              pembangunan transportasi nasional yang berkelanjutan.
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
