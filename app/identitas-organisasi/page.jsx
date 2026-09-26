import {
  ArrowRight,
  Download,
  Flag,
  Info,
  Sparkles,
  Target,
  Users,
  Video
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export const metadata = {
  title: "Identitas Organisasi | Masyarakat Transportasi Indonesia",
  description:
    "Logo, lambang, bendera, visi, misi, dan Mars MTI — identitas resmi Masyarakat Transportasi Indonesia sebagai organisasi profesi transportasi nasional."
};

const IMG = {
  logo: "https://mti.or.id/wp-content/uploads/2023/01/cropped-cropped-MTI_LOGO_PNG-1-270x270.png",
  logoFull: "https://mti.or.id/wp-content/uploads/2023/01/Logo_Profpict.png",
  word: "https://mti.or.id/wp-content/uploads/2023/01/MTI_WORD_PNG.png",
  hero: "https://mti.or.id/wp-content/uploads/2023/07/Dialog-dan-Sinergi-2.jpg",
  akses36: "https://mti.or.id/wp-content/uploads/2026/04/36.jpg"
};


const maknaLogo = [
  {
    warna: "Biru Tua",
    hex: "#1a2f6e",
    label: "Langit & Laut",
    uraian:
      "Melambangkan moda transportasi udara dan laut yang menjadi tulang punggung konektivitas kepulauan Indonesia."
  },
  {
    warna: "Merah",
    hex: "#c8102e",
    label: "Semangat & Keberanian",
    uraian:
      "Mencerminkan semangat juang dan keberanian para insan transportasi dalam membangun sistem mobilitas nasional yang lebih baik."
  },
  {
    warna: "Putih",
    hex: "#ffffff",
    label: "Kejujuran & Integritas",
    uraian:
      "Melambangkan komitmen MTI pada kejujuran ilmiah, transparansi kebijakan, dan integritas dalam setiap rekomendasi kepada pemangku kepentingan."
  },
  {
    warna: "Emas",
    hex: "#c9a227",
    label: "Keunggulan & Prestasi",
    uraian:
      "Merepresentasikan standar keunggulan dalam penelitian dan advokasi transportasi yang menjadi ciri khas MTI sejak 1999."
  }
];

const simbolLogo = [
  {
    simbol: "Roda Bergerigi",
    uraian:
      "Melambangkan pergerakan dan dinamika, serta keterkaitan antar moda transportasi darat yang saling menopang."
  },
  {
    simbol: "Sayap",
    uraian:
      "Representasi moda transportasi udara dan cita-cita MTI untuk membawa Indonesia terbang tinggi dalam standar transportasi global."
  },
  {
    simbol: "Ombak/Gelombang",
    uraian:
      "Mencerminkan transportasi laut sebagai moda strategis menghubungkan 17.000 pulau Nusantara."
  },
  {
    simbol: "Lingkaran Penuh",
    uraian:
      "Melambangkan kesatuan, keutuhan, dan kolaborasi seluruh pemangku kepentingan transportasi dalam wadah MTI."
  }
];

const misi = [
  "Mengembangkan pemikiran, kajian, dan konsep kebijakan transportasi nasional yang berbasis riset dan data.",
  "Membangun sinergi antara pemerintah, akademisi, praktisi, dan birokrat dalam ekosistem transportasi Indonesia.",
  "Memberikan masukan dan rekomendasi kebijakan kepada lembaga negara dan pemangku kepentingan transportasi.",
  "Meningkatkan kapasitas sumber daya manusia di bidang transportasi melalui pendidikan dan pelatihan.",
  "Menyelenggarakan penelitian dan pengembangan ilmu pengetahuan transportasi yang aplikatif.",
  "Membangun jaringan kerja sama internasional untuk kemajuan transportasi Indonesia."
];

const tentangLinks = [
  { label: "Sejarah MTI", href: "/sejarah-mti" },
  { label: "Struktur Organisasi", href: "/struktur-organisasi" },
  { label: "Identitas Organisasi", href: "/identitas-organisasi", active: true }
];

const aksesItems = [
  ["Transportasi Publik & Mudik", "Edisi 36", "Mar 2026"],
  ["Keselamatan Jalan Nasional", "Edisi 35", "Feb 2026"],
  ["TOD & Kota Berkelanjutan", "Edisi 34", "Jan 2026"],
  ["Logistik & ODOL", "Edisi 33", "Des 2025"],
  ["3T & Konektivitas Nusantara", "Edisi 32", "Nov 2025"]
];

export default function IdentitasOrganisasiPage() {
  return (
    <main className="dialogPolicyPage">
      <Header activeItem="Tentang Kami" />


      <section className="dialogHero">
        <img src={IMG.hero} alt="" aria-hidden="true" />
        <span className="dialogHeroShade" />
        <div className="wideShell dialogHeroContent">
          <span className="dialogEyebrow">
            <Sparkles size={16} aria-hidden="true" />
            Tentang Kami
          </span>
          <h1>Identitas Organisasi</h1>
          <p>
            Logo, bendera, visi-misi, dan Mars MTI — identitas resmi Masyarakat Transportasi
            Indonesia yang mencerminkan nilai, komitmen, dan semangat organisasi.
          </p>
          <div className="dialogHeroStats">
            <span>
              <strong>1999</strong>
              Tahun berdiri
            </span>
            <span>
              <strong>X Kongres</strong>
              2025 — Bogor
            </span>
            <span>
              <strong>34 Wilayah</strong>
              Seluruh Indonesia
            </span>
          </div>
        </div>
      </section>

      <section className="wideShell dialogIntroStrip">
        {["Logo MTI", "Makna Lambang", "Visi & Misi", "Bendera", "Mars MTI"].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>

      <section className="wideShell dialogContentGrid">
        <div className="dialogFeed">

          {/* ── Logo MTI ─────────────────────────────────────────── */}
          <div className="dialogSectionHead">
            <span>
              <Info size={18} aria-hidden="true" />
              Lambang Organisasi
            </span>
            <h2>Logo resmi Masyarakat Transportasi Indonesia.</h2>
          </div>

          <div className="identitasLogoShowcase">
            <div className="identitasLogoFrame">
              <img src={IMG.logoFull} alt="Logo MTI" />
            </div>
            <div className="identitasLogoDesc">
              <div className="identitasLogoWord">
                <img src={IMG.word} alt="Masyarakat Transportasi Indonesia" />
              </div>
              <p>
                Logo Masyarakat Transportasi Indonesia (MTI) merupakan lambang resmi yang
                digunakan sejak organisasi ini berdiri pada tahun 1999. Logo ini menggabungkan
                simbol-simbol transportasi multimoda dengan nilai-nilai dasar organisasi yang
                tercermin dalam pilihan warna dan bentuk.
              </p>
              <p>
                Lambang MTI dirancang untuk merepresentasikan keterpaduan seluruh moda
                transportasi — darat, laut, dan udara — sebagai satu ekosistem yang saling
                terhubung dan mendukung kemajuan Indonesia.
              </p>
            </div>
          </div>

          {/* ── Makna Warna ──────────────────────────────────────── */}
          <div className="dialogSectionHead" style={{ marginTop: 40 }}>
            <span>
              <Info size={18} aria-hidden="true" />
              Makna Warna
            </span>
            <h2>Filosofi warna dalam identitas visual MTI.</h2>
          </div>

          <div className="identitasWarnaGrid">
            {maknaLogo.map((item) => (
              <div className="identitasWarnaCard" key={item.warna}>
                <span
                  className="identitasWarnaDot"
                  style={{
                    background: item.hex,
                    border: item.hex === "#ffffff" ? "2px solid #e2e8f0" : "none"
                  }}
                />
                <div>
                  <strong>{item.warna}</strong>
                  <em>{item.label}</em>
                  <p>{item.uraian}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Makna Simbol ─────────────────────────────────────── */}
          <div className="dialogSectionHead" style={{ marginTop: 40 }}>
            <span>
              <Info size={18} aria-hidden="true" />
              Makna Simbol
            </span>
            <h2>Elemen visual dan artinya.</h2>
          </div>

          <div className="identitasSimbolGrid">
            {simbolLogo.map((item, i) => (
              <div className="identitasSimbolCard" key={item.simbol}>
                <span className="identitasSimbolNum">0{i + 1}</span>
                <div>
                  <strong>{item.simbol}</strong>
                  <p>{item.uraian}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Visi & Misi ──────────────────────────────────────── */}
          <div className="dialogSectionHead" style={{ marginTop: 40 }}>
            <span>
              <Target size={18} aria-hidden="true" />
              Visi &amp; Misi
            </span>
            <h2>Arah dan tujuan perjuangan MTI.</h2>
          </div>

          <div className="identitasVisiMisi">
            <div className="identitasVisi">
              <span>VISI</span>
              <blockquote>
                &ldquo;Terwujudnya sistem transportasi Indonesia yang aman, selamat, nyaman,
                terjangkau, dan berkelanjutan untuk mendukung pertumbuhan ekonomi nasional
                dan pemerataan pembangunan berlandaskan gotong royong.&rdquo;
              </blockquote>
            </div>
            <div className="identitasMisi">
              <span>MISI</span>
              <ol>
                {misi.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* ── Bendera Organisasi ───────────────────────────────── */}
          <div className="dialogSectionHead" style={{ marginTop: 40 }}>
            <span>
              <Flag size={18} aria-hidden="true" />
              Bendera Organisasi
            </span>
            <h2>Bendera resmi MTI.</h2>
          </div>

          <div className="identitasBenderaWrap">
            <div className="identitasBendera">
              <div className="identitasBenderaField">
                <img src={IMG.logoFull} alt="Logo di Bendera MTI" />
              </div>
              <div className="identitasBenderaStripe" />
            </div>
            <div className="identitasBenderaDesc">
              <p>
                Bendera MTI berwarna dasar biru tua dengan logo MTI di sudut kiri atas dan
                strip merah-putih di sisi bawah yang mencerminkan kebangsaan Indonesia.
                Bendera ini digunakan dalam setiap kegiatan resmi, kongres, dan pertemuan
                MTI baik di tingkat pusat maupun wilayah.
              </p>
              <p>
                Ukuran bendera resmi MTI adalah 90 × 135 cm untuk kegiatan dalam ruangan
                dan 120 × 180 cm untuk kegiatan luar ruangan.
              </p>
            </div>
          </div>

          {/* ── Mars MTI ─────────────────────────────────────────── */}
          <div className="dialogSectionHead" style={{ marginTop: 40 }}>
            <span>
              <Video size={18} aria-hidden="true" />
              Mars MTI
            </span>
            <h2>Lagu mars kebanggaan Masyarakat Transportasi Indonesia.</h2>
          </div>

          <div className="identitasVideoWrap">
            <iframe
              src="https://www.youtube.com/embed/vVv4Q_EkKwA"
              title="Mars MTI — Masyarakat Transportasi Indonesia"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="identitasMarsLirik">
            <h3>Mars Masyarakat Transportasi Indonesia</h3>
            <div className="identitasLirikGrid">
              <p>
                Kami warga transportasi Indonesia<br />
                Bersatu dalam satu tekad dan semangat<br />
                Membangun sistem transportasi bangsa<br />
                Yang aman nyaman adil dan bermanfaat
              </p>
              <p>
                MTI berdiri tegak di garda terdepan<br />
                Sinergi pakar akademisi dan pejuang<br />
                Demi Indonesia yang terus bergerak maju<br />
                Transportasi jaya untuk negeri tercinta
              </p>
            </div>
            <em>*Lirik dapat berbeda dengan versi resmi yang ditetapkan dalam Kongres.</em>
          </div>

        </div>

        <aside className="dialogSidebar" aria-label="Identitas MTI">
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
              <Users size={18} aria-hidden="true" />
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
            <h2>Informasi dan kerja sama dengan MTI.</h2>
            <p>
              Untuk informasi keanggotaan, kegiatan organisasi, dan kerja sama kelembagaan,
              hubungi sekretariat pusat MTI.
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
            <span>Identitas Organisasi</span>
            <h2>Satu lambang, satu tekad: transportasi Indonesia yang adil dan berkelanjutan.</h2>
          </div>
          <div className="mediaNewsBandDesc">
            <p>
              Identitas MTI bukan sekadar logo dan warna — ia adalah pernyataan komitmen bersama
              para insan transportasi Indonesia untuk terus berjuang membangun sistem mobilitas
              yang aman, nyaman, terjangkau, dan berkelanjutan demi kesejahteraan seluruh rakyat.
            </p>
          </div>
          <div className="mediaNewsBandIcon">
            <Flag size={88} strokeWidth={0.8} aria-hidden="true" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
