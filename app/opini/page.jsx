import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Download,
  PenLine,
  Sparkles
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export const metadata = {
  title: "Opini | MTI",
  description:
    "Halaman Opini MTI berisi pandangan, analisis, dan gagasan dari pakar serta anggota Masyarakat Transportasi Indonesia terhadap isu transportasi nasional."
};

const IMG = {
  logo: "https://mti.or.id/wp-content/uploads/2023/01/cropped-cropped-MTI_LOGO_PNG-1-270x270.png",
  hero: "https://mti.or.id/wp-content/uploads/2026/02/hq720.jpg",
  motor: "https://mti.or.id/wp-content/uploads/2026/02/Ojol-Ilustration.png",
  jalanTol: "https://mti.or.id/wp-content/uploads/2026/02/Mudik-JM.jpeg",
  tod: "https://mti.or.id/wp-content/uploads/2025/11/1761963524570.jpg",
  logistics: "https://mti.or.id/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-30-at-14.20.48-1.jpeg",
  odol: "https://mti.or.id/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-31-at-20.42.11.jpeg",
  rural: "https://mti.or.id/wp-content/uploads/2026/03/WhatsApp-Image-2026-02-23-at-14.57.51.jpeg",
  rail: "https://mti.or.id/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-17-at-15.59.48.jpeg",
  akses36: "https://mti.or.id/wp-content/uploads/2026/04/36.jpg"
};



const articles = [
  {
    title: "Motor, Moda Antara Yang Tak Boleh Menjadi Takdir Kota",
    date: "19 Februari 2026",
    tag: "Transportasi Kota",
    image: IMG.motor,
    href: "https://mti.or.id/motor-moda-antara-yang-tak-boleh-menjadi-takdir-kota/",
    excerpt:
      "Indonesia hidup dengan lebih dari 120 juta sepeda motor. Tantangannya adalah memastikan motor tidak menjadi takdir permanen mobilitas kota, melainkan jembatan menuju sistem transportasi publik yang kuat."
  },
  {
    title: "Mudik Lebaran 2026: Jangan Hanya Bertumpu di Jalan Tol",
    date: "19 Februari 2026",
    tag: "Mudik",
    image: IMG.jalanTol,
    href: "https://mti.or.id/mudik-lebaran-2026-jangan-hanya-bertumpu-di-jalan-tol/",
    excerpt:
      "Menghadapi mudik Lebaran 2026, pemerintah dinilai tidak boleh hanya terpaku pada jalan tol, tetapi juga perlu memperkuat moda dan jaringan alternatif agar mobilitas jutaan pemudik lebih terdistribusi."
  },
  {
    title: "Menata Kota dengan TOD: Wujudkan Transportasi Terintegrasi dan Ramah Publik",
    date: "2 November 2025",
    tag: "Perkotaan",
    image: IMG.tod,
    href: "https://mti.or.id/menata-kota-dengan-tod-wujudkan-transportasi-terintegrasi-dan-ramah-publik/",
    excerpt:
      "Perkembangan perkotaan yang pesat memunculkan tantangan kemacetan dan inefisiensi layanan publik. Transit Oriented Development menjadi jawaban untuk membangun kota yang manusiawi dan terintegrasi."
  },
  {
    title: "MTI Dorong Reformasi Sistemik Penanganan ODOL dan Transformasi Logistik Nasional",
    date: "31 Oktober 2025",
    tag: "Logistik",
    image: IMG.logistics,
    href: "https://mti.or.id/mti-dorong-reformasi-sistemik-penanganan-odol-dan-transformasi-logistik-nasional/",
    excerpt:
      "Ketua Umum MTI Tory Damantoro mendorong pembenahan lintas sektor dalam penanganan ODOL, mulai dari regulasi penimbangan, skema insentif pengusaha, hingga integrasi moda dalam ekosistem logistik nasional."
  },
  {
    title: "Tantangan Transportasi Darat: Keselamatan, Truk ODOL, dan Angkutan Roda Dua Jadi Sorotan",
    date: "31 Oktober 2025",
    tag: "Keselamatan",
    image: IMG.odol,
    href: "https://mti.or.id/tantangan-transportasi-darat-di-meja-direktorat-jenderal-perhubungan-darat-keselamatan-truk-odol-dan-angkutan-roda-dua-jadi-sorotan/",
    excerpt:
      "Isu keselamatan angkutan jalan, truk ODOL, dan angkutan roda dua menjadi sorotan dalam pembahasan strategis bersama pemangku kebijakan yang menuntut pendekatan komprehensif dan lintas sektor."
  },
  {
    title: "Penguatan Transportasi Perdesaan, Keperintisan, dan Daerah Tertinggal",
    date: "30 Januari 2026",
    tag: "Konektivitas",
    image: IMG.rural,
    href: "https://mti.or.id/penguatan-transportasi-perdesaan-keperintisan-dan-daerah-tertinggal/",
    excerpt:
      "Ketimpangan konektivitas antara wilayah perkotaan dan perdesaan masih menjadi tantangan besar. MTI mendorong pendekatan kebijakan yang berpihak pada daerah tertinggal dan terpencil."
  },
  {
    title: "Diskusi Forum Transportasi Jalan dan Perkeretaapian MTI dengan Dirjen Perkeretaapian dan Jajaran",
    date: "19 September 2025",
    tag: "Perkeretaapian",
    image: IMG.rail,
    href: "https://mti.or.id/diskusi-forum-transportasi-jalan-dan-perkeretaapian-mti-dengan-dirjen-perkeretaapian-dan-jajaran/",
    excerpt:
      "Sektor perkeretaapian Indonesia berkembang sangat dinamis dalam 15 tahun terakhir, membuka ruang dialog mengenai keselamatan, integrasi layanan, dan arah kebijakan jangka panjang."
  }
];

const aksesItems = [
  ["Akses Nusantara Edisi 36", "Maret 2026", "11 April 2026"],
  ["Akses Nusantara Edisi 35", "Februari 2026", "11 April 2026"],
  ["Akses Nusantara Edisi 34", "Januari 2026", "24 Februari 2026"],
  ["Akses Nusantara Edisi 33", "Desember 2025", "24 Februari 2026"],
  ["Akses Nusantara Edisi 32", "November 2025", "14 November 2025"],
  ["Akses Nusantara Edisi 31", "Oktober 2025", "14 November 2025"]
];

const focusAreas = ["Transportasi Kota", "Keselamatan Jalan", "Logistik Nasional", "Kebijakan Publik"];

export default function OpiniPage() {
  const [leadArticle, ...otherArticles] = articles;

  return (
    <main className="dialogPolicyPage opiniPage">
      <Header activeItem="Rekomendasi Kebijakan" />


      <section className="dialogHero">
        <img src={IMG.hero} alt="" aria-hidden="true" />
        <span className="dialogHeroShade" />
        <div className="wideShell dialogHeroContent">
          <span className="dialogEyebrow">
            <Sparkles size={16} aria-hidden="true" />
            Opini MTI
          </span>
          <h1>Opini Masyarakat Transportasi Indonesia</h1>
          <p>
            Pandangan, analisis, dan gagasan dari pakar serta anggota MTI terhadap isu transportasi
            nasional yang terus berkembang.
          </p>
          <div className="dialogHeroStats" aria-label="Ringkasan halaman">
            <span>
              <strong>7</strong>
              Artikel opini
            </span>
            <span>
              <strong>2025-2026</strong>
              Arsip editorial
            </span>
            <span>
              <strong>4</strong>
              Bidang kajian
            </span>
          </div>
        </div>
      </section>

      <section className="wideShell dialogIntroStrip" aria-label="Bidang kajian opini">
        {focusAreas.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>

      <section className="wideShell dialogContentGrid">
        <div className="dialogFeed">
          <div className="dialogSectionHead">
            <span>
              <PenLine size={18} aria-hidden="true" />
              Artikel Opini
            </span>
            <h2>Gagasan dan pandangan dari para pakar transportasi.</h2>
          </div>

          <article className="dialogLeadArticle">
            <a href={leadArticle.href}>
              <div className="dialogLeadImage">
                <img src={leadArticle.image} alt="" />
                <span>{leadArticle.tag}</span>
              </div>
              <div className="dialogLeadCopy">
                <small>
                  <CalendarDays size={14} aria-hidden="true" />
                  {leadArticle.date}
                </small>
                <h3>{leadArticle.title}</h3>
                <p>{leadArticle.excerpt}</p>
                <strong>
                  Baca Selengkapnya
                  <ArrowRight size={15} aria-hidden="true" />
                </strong>
              </div>
            </a>
          </article>

          <div className="dialogArticleList">
            {otherArticles.map((article) => (
              <article className="dialogArticle" key={article.title}>
                <a href={article.href}>
                  <img src={article.image} alt="" />
                  <div>
                    <span>{article.tag}</span>
                    <h3>{article.title}</h3>
                    <p>{article.excerpt}</p>
                    <small>
                      {article.date}
                      <ArrowRight size={14} aria-hidden="true" />
                    </small>
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
              <span>Publikasi</span>
              <h2>Unduh AKSES Nusantara</h2>
              <p>Publikasi berkala MTI untuk mengikuti isu transportasi nasional dan wilayah.</p>
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
            <span>Ruang Opini MTI</span>
            <h2>Suara pakar untuk kebijakan transportasi yang lebih baik.</h2>
            <p>
              Opini MTI hadir untuk membuka ruang gagasan, kajian kritis, dan rekomendasi dari
              seluruh pemangku kepentingan transportasi nasional.
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
            <span>Editorial</span>
            <h2>Opini yang dibaca sebagai pandangan, bukan sekadar komentar.</h2>
          </div>
          <p>
            Dari isu motor, jalan tol, TOD, ODOL, logistik, sampai perkeretaapian, ruang opini MTI
            menjadi wadah pemikiran kritis yang mendorong kebijakan transportasi berbasis data dan
            pengalaman lapangan.
          </p>
          <BookOpen size={48} aria-hidden="true" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
