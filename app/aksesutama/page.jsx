import {
  ArrowRight,
  BookMarked,
  CalendarDays,
  Download,
  FileText
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export const metadata = {
  title: "AKSES Utama | MTI",
  description:
    "AKSES Utama adalah publikasi kebijakan transportasi unggulan Masyarakat Transportasi Indonesia, merangkum analisis, rekomendasi, dan arah kebijakan transportasi nasional."
};

const IMG = {
  logo: "https://mti.or.id/wp-content/uploads/2023/01/cropped-cropped-MTI_LOGO_PNG-1-270x270.png",
  hero: "https://mti.or.id/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-15-at-15.20.45.jpeg",
  cover12: "https://mti.or.id/wp-content/uploads/2026/04/36.jpg",
  cover11: "https://mti.or.id/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-31-at-20.42.11.jpeg",
  cover10: "https://mti.or.id/wp-content/uploads/2025/11/1761963524570.jpg",
  cover9: "https://mti.or.id/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-30-at-14.20.48-1.jpeg",
  cover8: "https://mti.or.id/wp-content/uploads/2026/03/WhatsApp-Image-2026-02-23-at-14.57.51.jpeg",
  cover7: "https://mti.or.id/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-17-at-15.59.48.jpeg",
  akses36: "https://mti.or.id/wp-content/uploads/2026/04/36.jpg"
};



const featuredEdition = {
  edisi: "Edisi 12",
  title: "Kongres MTI X: Arah Kebijakan Transportasi Indonesia 2025–2030",
  date: "Desember 2025",
  image: IMG.cover12,
  href: "https://mti.or.id/aksesutama/",
  description:
    "Dokumentasi lengkap Kongres X Masyarakat Transportasi Indonesia, merangkum arah kebijakan transportasi nasional periode 2025–2030 dari perspektif pakar, akademisi, dan pemangku kepentingan.",
  tags: ["Kongres MTI", "Kebijakan Nasional", "Transportasi 2030"]
};

const archiveEditions = [
  {
    edisi: "Edisi 11",
    title: "Keselamatan Transportasi Jalan Nasional",
    date: "September 2025",
    image: IMG.cover11,
    href: "https://mti.or.id/aksesutama/",
    description:
      "Analisis mendalam tentang keselamatan jalan nasional, penanganan kendaraan ODOL, dan reformasi regulasi angkutan jalan."
  },
  {
    edisi: "Edisi 10",
    title: "Transformasi Transportasi Publik Perkotaan",
    date: "Juni 2025",
    image: IMG.cover10,
    href: "https://mti.or.id/aksesutama/",
    description:
      "Kajian TOD, integrasi moda, dan pengembangan transportasi publik perkotaan yang manusiawi dan berkelanjutan."
  },
  {
    edisi: "Edisi 9",
    title: "Konektivitas Logistik dan Rantai Pasok Nasional",
    date: "Maret 2025",
    image: IMG.cover9,
    href: "https://mti.or.id/aksesutama/",
    description:
      "Pemetaan tantangan logistik nasional, efisiensi rantai pasok, dan konektivitas antar-pulau dalam mendukung pertumbuhan ekonomi."
  },
  {
    edisi: "Edisi 8",
    title: "Transportasi 3T: Daerah Tertinggal, Terdepan, Terluar",
    date: "Desember 2024",
    image: IMG.cover8,
    href: "https://mti.or.id/aksesutama/",
    description:
      "Strategi penguatan transportasi keperintisan dan perdesaan di daerah 3T sebagai wujud pemerataan konektivitas nasional."
  },
  {
    edisi: "Edisi 7",
    title: "Akselerasi Perkeretaapian Indonesia",
    date: "September 2024",
    image: IMG.cover7,
    href: "https://mti.or.id/aksesutama/",
    description:
      "Evaluasi dan proyeksi pengembangan jaringan kereta api nasional, termasuk keselamatan, integrasi antarmoda, dan pembiayaan."
  }
];

const aksesNusantaraItems = [
  ["Akses Nusantara Edisi 36", "Maret 2026", "11 April 2026"],
  ["Akses Nusantara Edisi 35", "Februari 2026", "11 April 2026"],
  ["Akses Nusantara Edisi 34", "Januari 2026", "24 Februari 2026"],
  ["Akses Nusantara Edisi 33", "Desember 2025", "24 Februari 2026"],
  ["Akses Nusantara Edisi 32", "November 2025", "14 November 2025"],
  ["Akses Nusantara Edisi 31", "Oktober 2025", "14 November 2025"]
];

const focusAreas = ["Kebijakan Nasional", "Keselamatan", "Logistik & Konektivitas", "Transportasi Publik"];

export default function AksesUtamaPage() {
  return (
    <main className="dialogPolicyPage aksesUtamaPage">
      <Header activeItem="Rekomendasi Kebijakan" />


      <section className="dialogHero aksesUtamaHero">
        <img src={IMG.hero} alt="" aria-hidden="true" />
        <span className="dialogHeroShade" />
        <div className="wideShell dialogHeroContent">
          <span className="dialogEyebrow">
            AKSES Utama
          </span>
          <h1>AKSES Utama — Publikasi Kebijakan Transportasi MTI</h1>
          <p>
            Jurnal kebijakan transportasi nasional Masyarakat Transportasi Indonesia, merangkum
            analisis, rekomendasi, dan arah kebijakan lintas moda dari para pakar dan pemangku
            kepentingan.
          </p>
          <div className="dialogHeroStats" aria-label="Ringkasan publikasi">
            <span>
              <strong>12</strong>
              Edisi terbit
            </span>
            <span>
              <strong>2019–2025</strong>
              Arsip publikasi
            </span>
            <span>
              <strong>5</strong>
              Tema utama
            </span>
          </div>
        </div>
      </section>

      <section className="wideShell dialogIntroStrip" aria-label="Tema kajian AKSES Utama">
        {focusAreas.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>

      <section className="wideShell dialogContentGrid">
        <div className="dialogFeed">
          <div className="dialogSectionHead">
            <span>
              <FileText size={18} aria-hidden="true" />
              Edisi Unggulan
            </span>
            <h2>Publikasi kebijakan transportasi nasional MTI.</h2>
          </div>

          <article className="dialogLeadArticle aksesUtamaFeatured">
            <a href={featuredEdition.href}>
              <div className="dialogLeadImage">
                <img src={featuredEdition.image} alt="" />
                <span>{featuredEdition.edisi}</span>
              </div>
              <div className="dialogLeadCopy">
                <small>
                  <CalendarDays size={14} aria-hidden="true" />
                  {featuredEdition.date}
                </small>
                <h3>{featuredEdition.title}</h3>
                <p>{featuredEdition.description}</p>
                <div className="aksesEditionTags">
                  {featuredEdition.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <strong>
                  Baca Publikasi
                  <ArrowRight size={15} aria-hidden="true" />
                </strong>
              </div>
            </a>
          </article>

          <div className="dialogSectionHead" style={{ marginTop: 32 }}>
            <span>
              <BookMarked size={18} aria-hidden="true" />
              Arsip Edisi
            </span>
            <h2>Seluruh edisi AKSES Utama yang telah terbit.</h2>
          </div>

          <div className="aksesEditionGrid">
            {archiveEditions.map((edition) => (
              <article className="aksesEditionCard" key={edition.edisi}>
                <a href={edition.href}>
                  <div className="aksesEditionCover">
                    <img src={edition.image} alt="" />
                    <span>{edition.edisi}</span>
                  </div>
                  <div className="aksesEditionBody">
                    <small>
                      <CalendarDays size={12} aria-hidden="true" />
                      {edition.date}
                    </small>
                    <h3>{edition.title}</h3>
                    <p>{edition.description}</p>
                    <em>
                      Baca Selengkapnya
                      <ArrowRight size={13} aria-hidden="true" />
                    </em>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </div>

        <aside className="dialogSidebar" aria-label="Publikasi dan informasi MTI">
          <section className="dialogSidePanel highlight">
            <img src={IMG.akses36} alt="Akses Nusantara Edisi 36" />
            <div>
              <span>Publikasi Terbaru</span>
              <h2>AKSES Nusantara Edisi 36</h2>
              <p>
                Edisi Maret 2026 — isu transportasi wilayah, opini pakar, dan agenda kebijakan
                terkini.
              </p>
            </div>
          </section>

          <section className="dialogSidePanel">
            <div className="dialogSideTitle">
              <Download size={18} aria-hidden="true" />
              <h2>Arsip AKSES Nusantara</h2>
            </div>
            <div className="aksesDownloadList">
              {aksesNusantaraItems.map(([title, edition, date]) => (
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
            <span>Tentang AKSES Utama</span>
            <h2>Jurnal kebijakan transportasi nasional yang mendalam dan independen.</h2>
            <p>
              AKSES Utama diterbitkan oleh MTI sebagai wadah analisis kebijakan transportasi
              berbasis riset dan pengalaman lapangan para pakar dan praktisi.
            </p>
            <a href="mailto:secretariat@mti.or.id">
              secretariat@mti.or.id
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          </section>
        </aside>
      </section>

      <section className="dialogPolicyBand mediaNewsBand">
        <div className="wideShell dialogPolicyBandInner">
          <div>
            <span>Publikasi</span>
            <h2>AKSES Utama — analisis transportasi yang dibaca sebagai referensi kebijakan.</h2>
          </div>
          <p>
            Dari kongres, keselamatan jalan, logistik, TOD, transportasi 3T, sampai perkeretaapian,
            setiap edisi AKSES Utama merangkum percakapan kebijakan agar pembuat keputusan dan
            publik dapat bertindak berbasis data.
          </p>
          <BookMarked size={48} aria-hidden="true" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
