import {
  ArrowRight,
  Building2,
  CalendarDays,
  Download,
  Users
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export const metadata = {
  title: "Sejarah MTI | Masyarakat Transportasi Indonesia",
  description:
    "Sejarah berdiri dan perjalanan Masyarakat Transportasi Indonesia sejak 1999 hingga kini sebagai organisasi profesi transportasi terkemuka di Indonesia."
};

const IMG = {
  logo: "https://mti.or.id/wp-content/uploads/2023/01/cropped-cropped-MTI_LOGO_PNG-1-270x270.png",
  hero: "https://mti.or.id/wp-content/uploads/2023/07/Dialog-dan-Sinergi-2.jpg",
  akses36: "https://mti.or.id/wp-content/uploads/2026/04/36.jpg"
};



const milestones = [
  {
    year: "1999",
    title: "Pendirian MTI di Bandung",
    text:
      "Masyarakat Transportasi Indonesia dideklarasikan pada 14 Maret 1999 di Bandung, diprakarsai oleh para akademisi, pakar, dan praktisi transportasi. MTI lahir dari kebutuhan akan wadah independen yang mampu merumuskan kajian dan rekomendasi kebijakan transportasi berbasis keilmuan.",
    tag: "Fondasi"
  },
  {
    year: "2001",
    title: "Kongres I MTI – Jakarta",
    text:
      "Kongres pertama menetapkan Anggaran Dasar, struktur kepengurusan, dan program kerja. MTI menegaskan dirinya sebagai organisasi profesi yang independen, berorientasi kepentingan publik, dan berfungsi sebagai mitra strategis pemerintah dalam pembangunan sistem transportasi nasional.",
    tag: "Kongres I"
  },
  {
    year: "2004",
    title: "Kongres II – Surabaya",
    text:
      "MTI memperkuat jaringan wilayah dengan membentuk kepengurusan daerah di seluruh Indonesia. Agenda perluasan keanggotaan membawa praktisi, birokrat, dan akademisi dari berbagai provinsi ke dalam satu forum nasional yang aktif menghasilkan rekomendasi kebijakan.",
    tag: "Kongres II"
  },
  {
    year: "2007",
    title: "Kongres III – Bandung",
    text:
      "MTI semakin dikenal sebagai rujukan kebijakan transportasi. Pada kongres ketiga, organisasi memperluas cakupan isu—dari transportasi perkotaan, perdesaan, hingga logistik dan keselamatan jalan—sekaligus memperkuat kehadiran di forum kebijakan nasional.",
    tag: "Kongres III"
  },
  {
    year: "2010",
    title: "Kongres IV – Makassar",
    text:
      "Fokus pada konektivitas Indonesia Timur menjadi warna kuat Kongres IV. MTI mendorong percepatan pembangunan infrastruktur transportasi di kawasan 3T (Terdepan, Terluar, Tertinggal) dan merumuskan agenda riset bersama perguruan tinggi daerah.",
    tag: "Kongres IV"
  },
  {
    year: "2013",
    title: "Kongres V – Palembang",
    text:
      "Keselamatan jalan dan transportasi publik menjadi prioritas utama. MTI mempublikasikan kajian tentang angka kecelakaan lalu lintas di Indonesia dan mengadvokasi penerapan standar keselamatan yang lebih ketat serta peningkatan kualitas layanan angkutan umum.",
    tag: "Kongres V"
  },
  {
    year: "2016",
    title: "Kongres VI – Yogyakarta",
    text:
      "Di era masifnya pembangunan infrastruktur nasional, MTI mendorong integrasi moda transportasi dan konsep Transit Oriented Development (TOD) sebagai kerangka utama perencanaan kota. Kolaborasi dengan Kementerian Perhubungan semakin menguat.",
    tag: "Kongres VI"
  },
  {
    year: "2019",
    title: "Kongres VII & HUT ke-20 MTI",
    text:
      "Dua dekade perjalanan MTI ditandai dengan komitmen yang semakin kuat pada riset berbasis data, advokasi kebijakan berbasis bukti, dan perluasan kerja sama internasional. MTI mulai aktif di forum EASTS (Eastern Asia Society for Transportation Studies).",
    tag: "Kongres VII"
  },
  {
    year: "2021",
    title: "Kongres VIII – Format Hybrid",
    text:
      "Pandemi mendorong MTI beradaptasi dengan forum virtual dan hybrid. Selama periode ini MTI menghasilkan serangkaian rekomendasi kebijakan transportasi publik yang aman di masa COVID-19, termasuk penerapan protokol kesehatan di angkutan umum.",
    tag: "Kongres VIII"
  },
  {
    year: "2023",
    title: "Kongres IX – Bali",
    text:
      "MTI merumuskan agenda transportasi hijau dan transisi energi menuju Net Zero Emission 2060. Dekarbonisasi sektor transportasi, elektrifikasi kendaraan, dan integrasi energi terbarukan menjadi bagian dari rekomendasi kebijakan yang diserahkan kepada pemerintah.",
    tag: "Kongres IX"
  },
  {
    year: "2025",
    title: "Kongres X MTI – Jakarta",
    text:
      "Kongres X menetapkan Arah Kebijakan Transportasi Indonesia 2025–2030 dengan lima pilar: keselamatan, konektivitas, logistik efisien, transportasi hijau, dan inklusi sosial. AKSES Utama Edisi 12 mendokumentasikan seluruh rumusan dan rekomendasi kongres untuk para pemangku kebijakan.",
    tag: "Kongres X"
  }
];

const aksesItems = [
  ["Transportasi Publik & Mudik", "Edisi 36", "Mar 2026"],
  ["Keselamatan Jalan Nasional", "Edisi 35", "Feb 2026"],
  ["TOD & Kota Berkelanjutan", "Edisi 34", "Jan 2026"],
  ["Logistik & ODOL", "Edisi 33", "Des 2025"],
  ["3T & Konektivitas Nusantara", "Edisi 32", "Nov 2025"]
];

const tentangLinks = [
  { label: "Sejarah MTI", href: "/sejarah-mti", active: true },
  { label: "Struktur Organisasi", href: "/struktur-organisasi" },
  { label: "Identitas Organisasi", href: "/identitas-organisasi" }
];

export default function SejarahMTIPage() {
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
          <h1>Sejarah Masyarakat Transportasi Indonesia</h1>
          <p>
            Perjalanan panjang MTI sejak 1999 — dari deklarasi di Bandung hingga menjadi lembaga
            pemikir transportasi nasional yang diakui di tingkat internasional.
          </p>
          <div className="dialogHeroStats" aria-label="Ringkasan halaman">
            <span>
              <strong>1999</strong>
              Tahun berdiri
            </span>
            <span>
              <strong>10</strong>
              Kongres nasional
            </span>
            <span>
              <strong>34</strong>
              MTI Wilayah
            </span>
          </div>
        </div>
      </section>

      <section className="wideShell dialogContentGrid">
        <div className="dialogFeed">
          <div className="dialogSectionHead">
            <span>
              <Building2 size={18} aria-hidden="true" />
              Perjalanan Organisasi
            </span>
            <h2>Dari deklarasi 1999 hingga arah kebijakan 2025–2030.</h2>
          </div>

          <div className="sejarahIntro">
            <p>
              Masyarakat Transportasi Indonesia (MTI) adalah organisasi profesi nirlaba yang
              menghimpun akademisi, pakar, praktisi, dan birokrat di bidang transportasi. Lahir pada
              <strong> 14 Maret 1999 di Bandung</strong>, MTI hadir sebagai respons atas kebutuhan
              akan lembaga independen yang mampu menghasilkan kajian dan rekomendasi kebijakan
              transportasi yang objektif, berbasis ilmu pengetahuan, dan berorientasi kepentingan
              publik.
            </p>
            <p>
              Selama lebih dari dua dekade, MTI telah menyelenggarakan 10 kali Kongres Nasional,
              menerbitkan ratusan kajian dan rekomendasi kebijakan, serta aktif berkontribusi dalam
              forum transportasi internasional termasuk EASTS Conference. Dengan jaringan
              kepengurusan wilayah di 34 provinsi, MTI menjadi wadah sinergi antara dunia
              akademis, industri, dan pengambil kebijakan.
            </p>
          </div>

          <div className="sejarahTimeline">
            {milestones.map((m) => (
              <div className="sejarahMilestone" key={m.year}>
                <div className="sejarahYearCol">
                  <span className="sejarahYear">{m.year}</span>
                  <span className="sejarahLine" aria-hidden="true" />
                </div>
                <div className="sejarahCopy">
                  <span className="sejarahTag">{m.tag}</span>
                  <h3>{m.title}</h3>
                  <p>{m.text}</p>
                </div>
              </div>
            ))}
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
            <span>Profil Organisasi</span>
            <h2>Lebih dari 25 tahun membangun kebijakan transportasi Indonesia yang lebih baik.</h2>
          </div>
          <div className="mediaNewsBandDesc">
            <p>
              MTI berdiri di persimpangan antara akademia, industri, dan kebijakan publik — hadir
              sebagai suara independen yang konsisten memperjuangkan transportasi yang aman,
              terjangkau, dan berkelanjutan untuk seluruh rakyat Indonesia.
            </p>
          </div>
          <div className="mediaNewsBandIcon">
            <Building2 size={88} strokeWidth={0.8} aria-hidden="true" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
