import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Download,
  Layers,
  Sparkles
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export const metadata = {
  title: "AKSES Nusantara | MTI",
  description:
    "AKSES Nusantara adalah publikasi berkala Masyarakat Transportasi Indonesia yang merangkum isu transportasi nasional, kabar wilayah, opini pakar, dan agenda kebijakan setiap bulan."
};

const IMG = {
  logo: "https://mti.or.id/wp-content/uploads/2023/01/cropped-cropped-MTI_LOGO_PNG-1-270x270.png",
  hero: "https://mti.or.id/wp-content/uploads/2023/07/Dialog-dan-Sinergi-2.jpg",
  cover36: "https://mti.or.id/wp-content/uploads/2026/04/36.jpg",
  cover35: "https://mti.or.id/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-11-at-20.25.20-scaled.jpeg",
  cover34: "https://mti.or.id/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-09-at-17.23.00.jpeg",
  cover33: "https://mti.or.id/wp-content/uploads/2026/02/hq720.jpg",
  cover32: "https://mti.or.id/wp-content/uploads/2025/11/1761963524570.jpg",
  cover31: "https://mti.or.id/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-31-at-20.42.11.jpeg"
};


const ticker = [
  { tag: "KEBIJAKAN", text: "Menhub paparkan lima prioritas transportasi nasional di Kongres X MTI" },
  { tag: "MUDIK 2026", text: "MTI usul pembatasan angkutan barang dikurangi 50% jadi 7-8 hari" },
  { tag: "AGENDA", text: "16th EASTS Conference - sinergi MTI di kancah internasional" },
  { tag: "JURNAL", text: "AKSES Nusantara Edisi 36 Maret 2026 telah terbit" }
];

const featuredEdition = {
  edisi: "Edisi 36",
  bulan: "Maret 2026",
  image: IMG.cover36,
  href: "https://mti.or.id/aksesnusantara/",
  tema: "Transportasi Publik & Mudik 2026",
  description:
    "Edisi Maret 2026 merangkum persiapan mudik Lebaran 2026, rekomendasi MTI untuk pembatasan angkutan barang, analisis simpul transportasi, dan kabar kegiatan wilayah dari seluruh Indonesia.",
  highlights: [
    "Rekomendasi mudik Lebaran 2026",
    "Pembatasan angkutan barang: pro dan kontra",
    "Kabar wilayah: MTI Sumatera & Jawa",
    "Opini: Jangan hanya bertumpu di jalan tol"
  ]
};

const archiveEditions = [
  {
    edisi: "Edisi 35",
    bulan: "Februari 2026",
    image: IMG.cover35,
    href: "https://mti.or.id/aksesnusantara/",
    tema: "Mobilitas Kota & Motor"
  },
  {
    edisi: "Edisi 34",
    bulan: "Januari 2026",
    image: IMG.cover34,
    href: "https://mti.or.id/aksesnusantara/",
    tema: "Transportasi Perdesaan & 3T"
  },
  {
    edisi: "Edisi 33",
    bulan: "Desember 2025",
    image: IMG.cover33,
    href: "https://mti.or.id/aksesnusantara/",
    tema: "30 Tahun MTI: Membumi & Berdampak"
  },
  {
    edisi: "Edisi 32",
    bulan: "November 2025",
    image: IMG.cover32,
    href: "https://mti.or.id/aksesnusantara/",
    tema: "TOD & Transportasi Terintegrasi"
  },
  {
    edisi: "Edisi 31",
    bulan: "Oktober 2025",
    image: IMG.cover31,
    href: "https://mti.or.id/aksesnusantara/",
    tema: "ODOL & Logistik Nasional"
  }
];

const olderEditions = [
  ["Edisi 30", "September 2025"],
  ["Edisi 29", "Agustus 2025"],
  ["Edisi 28", "Juli 2025"],
  ["Edisi 27", "Juni 2025"],
  ["Edisi 26", "Mei 2025"],
  ["Edisi 25", "April 2025"]
];

const focusAreas = ["Transportasi Publik", "Kabar Wilayah", "Opini Pakar", "Agenda Kebijakan"];

export default function AksesNusantaraPage() {
  return (
    <main className="dialogPolicyPage aksesNusantaraPage">
      <Header activeItem="AKSES Nusantara" />

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

      <section className="dialogHero aksesNusantaraHero">
        <img src={IMG.hero} alt="" aria-hidden="true" />
        <span className="dialogHeroShade" />
        <div className="wideShell dialogHeroContent">
          <span className="dialogEyebrow">
            <Sparkles size={16} aria-hidden="true" />
            AKSES Nusantara
          </span>
          <h1>AKSES Nusantara — Jurnal Transportasi MTI</h1>
          <p>
            Publikasi bulanan Masyarakat Transportasi Indonesia yang merangkum isu transportasi
            nasional, kabar kegiatan wilayah, opini pakar, dan agenda kebijakan terkini.
          </p>
          <div className="dialogHeroStats" aria-label="Ringkasan publikasi">
            <span>
              <strong>36</strong>
              Edisi terbit
            </span>
            <span>
              <strong>Bulanan</strong>
              Frekuensi
            </span>
            <span>
              <strong>2023–2026</strong>
              Periode arsip
            </span>
          </div>
        </div>
      </section>

      <section className="wideShell dialogIntroStrip" aria-label="Rubrik AKSES Nusantara">
        {focusAreas.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>

      <section className="wideShell dialogContentGrid">
        <div className="dialogFeed">
          <div className="dialogSectionHead">
            <span>
              <Layers size={18} aria-hidden="true" />
              Edisi Terbaru
            </span>
            <h2>AKSES Nusantara Edisi 36 — Maret 2026.</h2>
          </div>

          <article className="dialogLeadArticle aksesNusantaraFeatured">
            <a href={featuredEdition.href}>
              <div className="dialogLeadImage">
                <img src={featuredEdition.image} alt="" />
                <span>{featuredEdition.edisi}</span>
              </div>
              <div className="dialogLeadCopy">
                <small>
                  <CalendarDays size={14} aria-hidden="true" />
                  {featuredEdition.bulan}
                </small>
                <h3>{featuredEdition.tema}</h3>
                <p>{featuredEdition.description}</p>
                <ul className="aksesHighlightList">
                  {featuredEdition.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                <strong>
                  Baca Edisi 36
                  <ArrowRight size={15} aria-hidden="true" />
                </strong>
              </div>
            </a>
          </article>

          <div className="dialogSectionHead" style={{ marginTop: 36 }}>
            <span>
              <BookOpen size={18} aria-hidden="true" />
              Arsip Edisi
            </span>
            <h2>Edisi-edisi sebelumnya.</h2>
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
                      {edition.bulan}
                    </small>
                    <h3>{edition.tema}</h3>
                    <em>
                      Baca Edisi
                      <ArrowRight size={13} aria-hidden="true" />
                    </em>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </div>

        <aside className="dialogSidebar" aria-label="Arsip dan informasi AKSES">
          <section className="dialogSidePanel highlight">
            <img src={IMG.cover36} alt="AKSES Nusantara Edisi 36" />
            <div>
              <span>Edisi Terbaru</span>
              <h2>AKSES Nusantara Edisi 36</h2>
              <p>Maret 2026 — transportasi publik, mudik 2026, dan kabar wilayah MTI.</p>
            </div>
          </section>

          <section className="dialogSidePanel">
            <div className="dialogSideTitle">
              <Download size={18} aria-hidden="true" />
              <h2>Unduh Edisi Lama</h2>
            </div>
            <div className="aksesDownloadList">
              {olderEditions.map(([edisi, bulan]) => (
                <a href="https://mti.or.id/aksesnusantara/" key={`${edisi}-${bulan}`}>
                  <span>
                    <strong>AKSES Nusantara {edisi}</strong>
                    <small>{bulan}</small>
                  </span>
                  <em>{bulan}</em>
                </a>
              ))}
            </div>
          </section>

          <section className="dialogSidePanel contact">
            <span>Tentang AKSES Nusantara</span>
            <h2>Ikuti perkembangan transportasi Indonesia setiap bulan.</h2>
            <p>
              AKSES Nusantara diterbitkan MTI sebagai media kurasi isu transportasi nasional dan
              wilayah yang dapat diunduh secara bebas oleh publik.
            </p>
            <a href="mailto:secretariat@mti.or.id">
              Berlangganan AKSES
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          </section>
        </aside>
      </section>

      <section className="dialogPolicyBand mediaNewsBand">
        <div className="wideShell dialogPolicyBandInner">
          <div>
            <span>Publikasi Berkala</span>
            <h2>Setiap bulan, satu edisi merangkum arah transportasi Indonesia.</h2>
          </div>
          <p>
            Dari kabar wilayah, opini pakar, kebijakan mudik, logistik, sampai perkeretaapian —
            AKSES Nusantara hadir setiap bulan sebagai referensi cepat bagi pemangku kepentingan
            transportasi nasional.
          </p>
          <BookOpen size={48} aria-hidden="true" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
