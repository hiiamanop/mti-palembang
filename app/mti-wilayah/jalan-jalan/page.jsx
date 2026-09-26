import {
  ArrowRight,
  CalendarDays,
  Compass,
  Download,
  MapPin,
  Newspaper,
  Sparkles
} from "lucide-react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export const metadata = {
  title: "Jalan-Jalan | MTI",
  description:
    "Halaman Jalan-Jalan MTI berisi cerita mobilitas wilayah, transportasi gratis, wisata, dan pengalaman perjalanan."
};

const IMG = {
  logo: "https://mti.or.id/wp-content/uploads/2023/01/cropped-cropped-MTI_LOGO_PNG-1-270x270.png",
  hero: "https://mti.or.id/wp-content/uploads/2023/05/17.jpg",
  pakpak: "https://mti.or.id/wp-content/uploads/2026/03/WhatsApp-Image-2026-02-16-at-10.05.36.jpeg",
  sragen: "https://mti.or.id/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-19-at-06.54.06-1.jpeg",
  koetaradja: "https://mti.or.id/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-22-at-18.20.25.jpeg",
  bali: "https://mti.or.id/wp-content/uploads/2023/05/yudi-haryasa-aMvn52M6P3w-unsplash-scaled.jpg",
  restArea: "https://mti.or.id/wp-content/uploads/2023/05/WhatsApp-Image-2023-04-16-at-14.20.40.jpeg",
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
    title: "Bus Sekolah Di Pakpak Bharat: Solusi Jarak Jauh Di Kaki Bukit Barisan",
    date: "30 Januari 2026",
    tag: "Transportasi Pelajar",
    image: IMG.pakpak,
    href: "https://mti.or.id/bus-sekolah-di-pakpak-bharat-solusi-jarak-jauh-di-kaki-bukit-barisan/",
    excerpt:
      "Kabupaten Pakpak Bharat berada di dataran tinggi Sumatera Utara, tepat di kaki Bukit Barisan. Layanan bus sekolah menjadi solusi mobilitas jarak jauh bagi pelajar."
  },
  {
    title: "Bus Gratis Sragen: Dari Hibah Instansi, Untuk Pendidikan Anak Bangsa",
    date: "31 Oktober 2025",
    tag: "Bus Gratis",
    image: IMG.sragen,
    href: "https://mti.or.id/bus-gratis-sragen-dari-hibah-instansi-untuk-pendidikan-anak-bangsa/",
    excerpt:
      "Inovasi bus gratis Sragen sejalan dengan visi layanan publik yang inklusif, berdaya guna, dan mendukung akses pendidikan anak bangsa."
  },
  {
    title: "Bus Trans Koetaradja: Bukti Nyata Transportasi Gratis Itu Ada",
    date: "31 Oktober 2025",
    tag: "Angkutan Umum",
    image: IMG.koetaradja,
    href: "https://mti.or.id/bus-trans-koetaradja-bukti-nyata-transportasi-gratis-itu-ada/",
    excerpt:
      "Bus Trans Koetaradja adalah sistem transportasi umum di Banda Aceh dan Aceh Besar yang menunjukkan bahwa transportasi gratis dapat menjadi layanan nyata."
  },
  {
    title: "Kolaborasi Pengaturan Obyek Wisata Bali",
    date: "9 Mei 2023",
    tag: "Wisata",
    image: IMG.bali,
    href: "https://mti.or.id/kolaborasi-pengaturan-obyek-wisata-bali/",
    excerpt:
      "Pulau Bali, the Paradise Island, merupakan tujuan wisata utama yang membutuhkan kolaborasi pengaturan mobilitas agar pengalaman wisata tetap tertata."
  },
  {
    title: "Jelajah Kuliner di Rest Area Super Lengkap",
    date: "9 Mei 2023",
    tag: "Rest Area",
    image: IMG.restArea,
    href: "https://mti.or.id/jelajah-kuliner-di-rest-area-super-lengkap/",
    excerpt:
      "Pulang kampung selesai, saatnya kembali ke kota. Rest area yang lengkap dapat menjadi bagian dari pengalaman perjalanan yang lebih nyaman."
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

const focusAreas = ["Transportasi Pelajar", "Bus Gratis", "Wisata dan Mobilitas", "Rest Area"];

export default function JalanJalanPage() {
  const [leadArticle, ...otherArticles] = articles;

  return (
    <main className="dialogPolicyPage travelPage">
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
            <Compass size={16} aria-hidden="true" />
            MTI Jalan-Jalan
          </span>
          <h1>Jalan-Jalan</h1>
          <p>
            Cerita perjalanan transportasi dari daerah, mulai dari layanan bus pelajar, transportasi
            gratis, pengaturan destinasi wisata, sampai pengalaman rest area.
          </p>
          <div className="dialogHeroStats" aria-label="Ringkasan halaman">
            <span>
              <strong>5</strong>
              Cerita perjalanan
            </span>
            <span>
              <strong>2023-2026</strong>
              Arsip wilayah
            </span>
            <span>
              <strong>MTI</strong>
              Jalan-Jalan
            </span>
          </div>
        </div>
      </section>

      <section className="wideShell dialogIntroStrip" aria-label="Fokus Jalan-Jalan MTI">
        {focusAreas.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>

      <section className="wideShell dialogContentGrid">
        <div className="dialogFeed">
          <div className="dialogSectionHead">
            <span>
              <Newspaper size={18} aria-hidden="true" />
              MTI Jalan-Jalan
            </span>
            <h2>Catatan mobilitas dari wilayah dan ruang perjalanan.</h2>
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
            <span>Ruang Wilayah</span>
            <h2>Jalan-Jalan membaca transportasi lewat pengalaman nyata.</h2>
            <p>
              Dari bus sekolah sampai rest area, rubrik ini melihat layanan transportasi dari sisi
              pengguna, wilayah, dan pengalaman perjalanan.
            </p>
            <a href="/#tentang">
              Lihat MTI Wilayah
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          </section>
        </aside>
      </section>

      <section className="dialogPolicyBand travelBand">
        <div className="wideShell dialogPolicyBandInner">
          <div>
            <span>Travel Notes</span>
            <h2>Transportasi terasa nyata saat dibaca dari perjalanan orang dan daerah.</h2>
          </div>
          <p>
            Jalan-Jalan mengajak pembaca melihat layanan transportasi sebagai pengalaman harian:
            bagaimana orang berangkat sekolah, berwisata, berpindah, dan berhenti sejenak di jalur
            perjalanan.
          </p>
          <MapPin size={48} aria-hidden="true" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
