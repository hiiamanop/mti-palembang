import {
  ArrowRight,
  Download,
  MapPin,
  Sparkles,
  Users
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export const metadata = {
  title: "Struktur MTI Wilayah | Masyarakat Transportasi Indonesia",
  description:
    "Daftar Ketua MTI Wilayah di 34 provinsi Indonesia sebagai ujung tombak pengembangan kebijakan dan advokasi transportasi di tingkat daerah."
};

const IMG = {
  logo: "https://mti.or.id/wp-content/uploads/2023/01/cropped-cropped-MTI_LOGO_PNG-1-270x270.png",
  hero: "https://mti.or.id/wp-content/uploads/2023/07/Dialog-dan-Sinergi-2.jpg",
  akses36: "https://mti.or.id/wp-content/uploads/2026/04/36.jpg"
};

const ticker = [
  { tag: "KEBIJAKAN", text: "Menhub paparkan lima prioritas transportasi nasional di Kongres X MTI" },
  { tag: "MUDIK 2026", text: "MTI usul pembatasan angkutan barang dikurangi 50% jadi 7-8 hari" },
  { tag: "AGENDA", text: "16th EASTS Conference - sinergi MTI di kancah internasional" },
  { tag: "JURNAL", text: "AKSES Nusantara Edisi 36 Maret 2026 telah terbit" }
];

const regions = [
  {
    name: "Sumatera",
    color: "#1d4ed8",
    wilayah: [
      { provinsi: "Aceh", ketua: "Dr. Ir. Yusrizal Bakar, M.T." },
      { provinsi: "Sumatera Utara", ketua: "Prof. Dr. Ir. Budi Hartadi Susilo, M.T." },
      { provinsi: "Sumatera Barat", ketua: "Dr. Ir. Mudrika Pasha, M.T." },
      { provinsi: "Riau", ketua: "Ir. Elviriadi, M.Si." },
      { provinsi: "Kepulauan Riau", ketua: "Capt. Andri Kurniawan, M.M." },
      { provinsi: "Jambi", ketua: "Dr. Ir. Guntur, M.T." },
      { provinsi: "Sumatera Selatan", ketua: "Prof. Dr. Ir. Erika Buchari, M.Sc." },
      { provinsi: "Kepulauan Bangka Belitung", ketua: "Ir. Hery Irawan, M.T." },
      { provinsi: "Bengkulu", ketua: "Dr. Ir. Andi Herius, M.T." },
      { provinsi: "Lampung", ketua: "Dr. Ir. Dwi Herianto, M.T." }
    ]
  },
  {
    name: "Jawa",
    color: "#7c3aed",
    wilayah: [
      { provinsi: "DKI Jakarta", ketua: "Dr. Ir. Harya Setyaka, M.T." },
      { provinsi: "Jawa Barat", ketua: "Prof. Dr. Ir. Harun al-Rasyid Lubis, M.Sc." },
      { provinsi: "Banten", ketua: "Dr. Ir. Elly Nurachmah, M.T." },
      { provinsi: "Jawa Tengah", ketua: "Dr. Ir. M. Zudhy Irawan, M.T." },
      { provinsi: "DI Yogyakarta", ketua: "Prof. Dr. Ir. Ahmad Munawar, M.Sc." },
      { provinsi: "Jawa Timur", ketua: "Dr. Ir. Wahju Herijanto, M.T." }
    ]
  },
  {
    name: "Bali & Nusa Tenggara",
    color: "#0891b2",
    wilayah: [
      { provinsi: "Bali", ketua: "Dr. Ir. I Gusti Gede Adnyana, M.T." },
      { provinsi: "Nusa Tenggara Barat", ketua: "Dr. Ir. Suryawan Murtiadi, M.T." },
      { provinsi: "Nusa Tenggara Timur", ketua: "Ir. Paulina Veronika Letek, M.T." }
    ]
  },
  {
    name: "Kalimantan",
    color: "#059669",
    wilayah: [
      { provinsi: "Kalimantan Barat", ketua: "Dr. Ir. Nurul Wardhani, M.T." },
      { provinsi: "Kalimantan Tengah", ketua: "Ir. Mahendra Wardhana, M.T." },
      { provinsi: "Kalimantan Selatan", ketua: "Dr. Ir. Adhi Muhtadi, M.T." },
      { provinsi: "Kalimantan Timur", ketua: "Dr. Ir. Rahayu Sulistyorini, M.T." },
      { provinsi: "Kalimantan Utara", ketua: "Ir. Budianto Ontowiryo, M.T." }
    ]
  },
  {
    name: "Sulawesi",
    color: "#d97706",
    wilayah: [
      { provinsi: "Sulawesi Utara", ketua: "Dr. Ir. James A. Timboeleng, M.T." },
      { provinsi: "Gorontalo", ketua: "Ir. Frangky Hadjaratie, M.T." },
      { provinsi: "Sulawesi Tengah", ketua: "Dr. Ir. Moh. Adnan Bakhri, M.T." },
      { provinsi: "Sulawesi Barat", ketua: "Ir. Syamsul Arifin, M.T." },
      { provinsi: "Sulawesi Selatan", ketua: "Prof. Dr. Ir. Mubassirang Pasra, M.T." },
      { provinsi: "Sulawesi Tenggara", ketua: "Dr. Ir. Romy Talanipa, M.T." }
    ]
  },
  {
    name: "Maluku & Papua",
    color: "#be123c",
    wilayah: [
      { provinsi: "Maluku", ketua: "Dr. Ir. Arthur H. S. Simanjuntak, M.T." },
      { provinsi: "Maluku Utara", ketua: "Ir. Denny Suryady, M.T." },
      { provinsi: "Papua Barat", ketua: "Dr. Ir. Yohanis Rante Madika, M.T." },
      { provinsi: "Papua", ketua: "Ir. Binsar Simamora, M.T." }
    ]
  }
];

const aksesItems = [
  ["Transportasi Publik & Mudik", "Edisi 36", "Mar 2026"],
  ["Keselamatan Jalan Nasional", "Edisi 35", "Feb 2026"],
  ["TOD & Kota Berkelanjutan", "Edisi 34", "Jan 2026"],
  ["Logistik & ODOL", "Edisi 33", "Des 2025"],
  ["3T & Konektivitas Nusantara", "Edisi 32", "Nov 2025"]
];

const wilayahLinks = [
  { label: "Struktur MTI Wilayah", href: "/struktur-mti-wilayah", active: true },
  { label: "Kegiatan Wilayah", href: "/mti-wilayah/jalan-jalan" }
];

export default function StrukturMTIWilayahPage() {
  return (
    <main className="dialogPolicyPage">
      <Header activeItem="Tentang Kami" />

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
            MTI Wilayah
          </span>
          <h1>Struktur MTI Wilayah</h1>
          <p>
            Jaringan kepengurusan MTI di 34 provinsi Indonesia yang menjadi ujung tombak advokasi
            kebijakan transportasi di tingkat daerah.
          </p>
          <div className="dialogHeroStats" aria-label="Ringkasan halaman">
            <span>
              <strong>34</strong>
              Provinsi aktif
            </span>
            <span>
              <strong>6</strong>
              Kawasan regional
            </span>
            <span>
              <strong>2025–2028</strong>
              Periode kepengurusan
            </span>
          </div>
        </div>
      </section>

      <section className="wideShell dialogIntroStrip" aria-label="Kawasan regional">
        {regions.map((r) => (
          <span key={r.name}>{r.name}</span>
        ))}
      </section>

      <section className="wideShell dialogContentGrid">
        <div className="dialogFeed">
          <div className="dialogSectionHead">
            <span>
              <MapPin size={18} aria-hidden="true" />
              Kepengurusan Wilayah
            </span>
            <h2>Ketua MTI Wilayah di seluruh Indonesia.</h2>
          </div>

          <div className="wilayahAccordion">
            {regions.map((region) => (
              <details key={region.name} className="wilayahGroup" open>
                <summary className="wilayahGroupHeader" style={{ "--region-color": region.color }}>
                  <span className="wilayahRegionDot" />
                  <span className="wilayahRegionName">{region.name}</span>
                  <span className="wilayahRegionCount">{region.wilayah.length} provinsi</span>
                  <span className="wilayahChevron" aria-hidden="true" />
                </summary>
                <div className="wilayahProvinceGrid">
                  {region.wilayah.map((w) => (
                    <div className="wilayahProvinceCard" key={w.provinsi}>
                      <MapPin size={14} aria-hidden="true" />
                      <div>
                        <strong>{w.provinsi}</strong>
                        <small>{w.ketua}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>

        <aside className="dialogSidebar" aria-label="MTI Wilayah">
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
              <MapPin size={18} aria-hidden="true" />
              <h2>MTI Wilayah</h2>
            </div>
            <div className="sejarahSideLinks">
              {wilayahLinks.map((link) => (
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
              <Users size={18} aria-hidden="true" />
              <h2>Tentang Kami</h2>
            </div>
            <div className="sejarahSideLinks">
              {[
                { label: "Sejarah MTI", href: "/sejarah-mti" },
                { label: "Struktur Organisasi", href: "/struktur-organisasi" },
                { label: "Identitas Organisasi", href: "#" }
              ].map((link) => (
                <a key={link.label} href={link.href}>
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
              Untuk informasi kepengurusan wilayah, keanggotaan, dan agenda regional, hubungi
              sekretariat pusat.
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
            <span>Jaringan Nasional</span>
            <h2>34 provinsi, satu visi: transportasi Indonesia yang aman dan berkeadilan.</h2>
          </div>
          <div className="mediaNewsBandDesc">
            <p>
              MTI Wilayah hadir sebagai perpanjangan tangan organisasi di tingkat daerah — aktif
              mengadvokasi kebijakan transportasi lokal, mendampingi pemerintah daerah, dan
              membangun ekosistem riset transportasi yang berakar pada kebutuhan nyata masyarakat.
            </p>
          </div>
          <div className="mediaNewsBandIcon">
            <MapPin size={88} strokeWidth={0.8} aria-hidden="true" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
