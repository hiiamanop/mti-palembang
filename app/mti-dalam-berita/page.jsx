import {
  ArrowRight,
  CalendarDays,
  Download,
  Megaphone,
  Newspaper,
  Sparkles
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export const metadata = {
  title: "MTI Dalam Berita | MTI",
  description:
    "Halaman MTI Dalam Berita berisi liputan terbaru seputar kegiatan MTI Pusat dan isu transportasi nasional."
};

const IMG = {
  logo: "https://mti.or.id/wp-content/uploads/2023/01/cropped-cropped-MTI_LOGO_PNG-1-270x270.png",
  hero: "https://mti.or.id/wp-content/uploads/2023/05/13.jpg",
  jasa: "https://mti.or.id/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-11-at-20.25.20-scaled.jpeg",
  bkt: "https://mti.or.id/wp-content/uploads/2026/03/jelang-mudik-lebaran-kendaraan-barang-berat-dibatasi-mulai-13-maret-1773223046236_169.jpeg",
  bukaPuasa: "https://mti.or.id/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-19-at-19.50.51.jpeg",
  mudikBalik: "https://mti.or.id/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-09-at-17.23.00.jpeg",
  membumi: "https://mti.or.id/wp-content/uploads/2026/02/hq720.jpg",
  motor: "https://mti.or.id/wp-content/uploads/2026/02/Ojol-Ilustration.png",
  jalanTol: "https://mti.or.id/wp-content/uploads/2026/02/Mudik-JM.jpeg",
  akses36: "https://mti.or.id/wp-content/uploads/2026/04/36.jpg"
};


const ticker = [
  { tag: "KEBIJAKAN", text: "Menhub paparkan lima prioritas transportasi nasional di Kongres X MTI" },
  { tag: "MUDIK 2026", text: "MTI usul pembatasan angkutan barang dikurangi 50% jadi 7-8 hari" },
  { tag: "AGENDA", text: "16th EASTS Conference - sinergi MTI di kancah internasional" },
  { tag: "JURNAL", text: "AKSES Nusantara Edisi 36 Maret 2026 telah terbit" }
];

const articles = [
  {
    title: "Hadapi Mudik Lebaran 2026, Jasa Raharja Kumpulkan Pakar Transportasi MTI",
    date: "18 Maret 2026",
    tag: "Mudik 2026",
    image: IMG.jasa,
    href: "https://mti.or.id/hadapi-mudik-lebaran-2026-jasa-raharja-kumpulkan-pakar-transportasi-mti/",
    excerpt:
      "PT Jasa Raharja menggelar forum diskusi Ngobrol Santai Bersama Pakar Transportasi untuk membahas kesiapan penyelenggaraan mudik Lebaran 2026."
  },
  {
    title: "MTI dan BKT Bahas Pro-Kontra Pembatasan Angkutan Barang pada Mudik 2026",
    date: "15 Maret 2026",
    tag: "Dialog",
    image: IMG.bkt,
    href: "https://mti.or.id/mti-dan-bkt-bahas-pro-kontra-pembatasan-angkutan-barang-pada-mudik-2026/",
    excerpt:
      "MTI melakukan pertemuan dengan pimpinan Badan Kebijakan Transportasi Kementerian Perhubungan untuk membahas kebijakan pembatasan angkutan barang."
  },
  {
    title: "MTI Gelar Buka Puasa Bersama, Sampai Rekomendasi Mudik 2026",
    date: "15 Maret 2026",
    tag: "Kegiatan",
    image: IMG.bukaPuasa,
    href: "https://mti.or.id/mti-gelar-buka-puasa-bersama-sampai-rekomendasi-mudik-2026/",
    excerpt:
      "MTI menggelar buka puasa bersama yang dirangkaikan dengan konferensi pers dan penyampaian rekomendasi penyelenggaraan mudik 2026."
  },
  {
    title: "Mudik-Balik 2026: Mengantisipasi Risiko Kemacetan Lalu Lintas dan Kepadatan di Simpul Transportasi",
    date: "12 Maret 2026",
    tag: "Analisis",
    image: IMG.mudikBalik,
    href: "https://mti.or.id/mudik-balik-2026-mengantisipasi-risiko-kemacetan-lalu-lintas-dan-kepadatan-di-simpul-transportasi/",
    excerpt:
      "Mengacu hasil survei BKT Kementerian Perhubungan, MTI menyoroti risiko kemacetan dan kepadatan simpul transportasi selama arus mudik dan balik."
  },
  {
    title: "MTI Membumi, MTI Berdampak, MTI untuk Indonesia.",
    date: "19 Februari 2026",
    tag: "Milestone",
    image: IMG.membumi,
    href: "https://mti.or.id/mti-membumi-mti-berdampak-mti-untuk-indonesia/",
    excerpt:
      "Tepat pada 21 Desember 2025, Masyarakat Transportasi Indonesia genap berusia 30 tahun dan terus memperkuat dampaknya bagi transportasi Indonesia."
  },
  {
    title: "Motor, Moda Antara Yang Tak Boleh Menjadi Takdir Kota",
    date: "19 Februari 2026",
    tag: "Opini",
    image: IMG.motor,
    href: "https://mti.or.id/motor-moda-antara-yang-tak-boleh-menjadi-takdir-kota/",
    excerpt:
      "Indonesia hidup dengan lebih dari 120 juta sepeda motor. Tantangannya adalah memastikan motor tidak menjadi takdir permanen mobilitas kota."
  },
  {
    title: "Mudik Lebaran 2026: Jangan Hanya Bertumpu di Jalan Tol",
    date: "19 Februari 2026",
    tag: "Mudik",
    image: IMG.jalanTol,
    href: "https://mti.or.id/mudik-lebaran-2026-jangan-hanya-bertumpu-di-jalan-tol/",
    excerpt:
      "Menghadapi mudik Lebaran 2026, pemerintah dinilai tidak boleh hanya terpaku pada jalan tol, tetapi juga perlu memperkuat moda dan jaringan alternatif."
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

const focusAreas = ["Kegiatan MTI Pusat", "Mudik Lebaran", "Transportasi Kota", "Opini Publik"];

export default function MtiDalamBeritaPage() {
  const [leadArticle, ...otherArticles] = articles;

  return (
    <main className="dialogPolicyPage mediaNewsPage">
      <Header activeItem="Kegiatan MTI" />

      <section className="tickerBand" aria-label="Berita terkini">
        <div className="tickerLabel">
          <span />
          TERKINI
        </div>
        <div className="tickerWindow">
          <div className="tickerTrack">
            {[...ticker, ...ticker].map((item, index) => (
              <span className="tickerItem" key={`${item.tag}-${index}`}>
                <strong>{item.tag}</strong>
                {item.text}
                <i />
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="dialogHero">
        <img src={IMG.hero} alt="" aria-hidden="true" />
        <span className="dialogHeroShade" />
        <div className="wideShell dialogHeroContent">
          <span className="dialogEyebrow">
            <Sparkles size={16} aria-hidden="true" />
            MTI Dalam Berita
          </span>
          <h1>MTI Dalam Berita</h1>
          <p>
            Berita terbaru seputar kegiatan MTI Pusat, pandangan pakar transportasi, dan isu
            mobilitas nasional yang menjadi perhatian publik.
          </p>
          <div className="dialogHeroStats" aria-label="Ringkasan halaman">
            <span>
              <strong>7</strong>
              Berita utama
            </span>
            <span>
              <strong>2026</strong>
              Liputan terbaru
            </span>
            <span>
              <strong>MTI</strong>
              Pusat
            </span>
          </div>
        </div>
      </section>

      <section className="wideShell dialogIntroStrip" aria-label="Fokus liputan MTI">
        {focusAreas.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>

      <section className="wideShell dialogContentGrid">
        <div className="dialogFeed">
          <div className="dialogSectionHead">
            <span>
              <Newspaper size={18} aria-hidden="true" />
              Berita Terbaru
            </span>
            <h2>Berita terbaru seputar kegiatan MTI Pusat.</h2>
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

        <aside className="dialogSidebar" aria-label="Publikasi dan arsip MTI">
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
            <span>Ruang Liputan</span>
            <h2>Kabar MTI dikurasi dari kegiatan, diskusi, dan isu publik.</h2>
            <p>
              Halaman ini membantu pembaca mengikuti aktivitas MTI Pusat tanpa kehilangan konteks
              kebijakan transportasi yang sedang berkembang.
            </p>
            <a href="mailto:secretariat@mti.or.id">
              Hubungi sekretariat
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          </section>
        </aside>
      </section>

      <section className="dialogPolicyBand mediaNewsBand">
        <div className="wideShell dialogPolicyBandInner">
          <div>
            <span>Media Watch</span>
            <h2>Aktivitas MTI Pusat dibaca bersama arah kebijakan transportasi nasional.</h2>
          </div>
          <p>
            Dari forum mudik, rekomendasi keselamatan, sampai opini mobilitas kota, halaman ini
            menjadi pintu masuk cepat untuk mengikuti suara MTI di ruang publik.
          </p>
          <Megaphone size={48} aria-hidden="true" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
