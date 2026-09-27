import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const readJSON = async (name) =>
  JSON.parse(await readFile(new URL(`../data/${name}.json`, import.meta.url), 'utf8'));

for (const name of ['berita', 'jurnal', 'artikel', 'kegiatan']) {
  assert.deepEqual(await readJSON(name), [], `${name}.json must be empty`);
}

assert.deepEqual(await readJSON('beranda'), {
  ticker: [],
  leadStory: {},
  heroSide: [],
  regions: [],
  akses: {},
  pengenalan: {
    tag: '',
    title: 'Masyarakat Transportasi Indonesia Wilayah Sumatera Selatan',
    description:
      'Lembaga pemikir (think tank) independen yang menghimpun akademisi, praktisi, birokrat, dan pemerhati transportasi di Sumsel.',
    image: 'https://mti.or.id/wp-content/uploads/2023/07/Dialog-dan-Sinergi-2.jpg'
  },
  visiMisi: {
    tag: 'VISI, MISI & TUJUAN',
    visi:
      'Terwujudnya MTI sebagai organisasi yang menjadi acuan profesional bidang transportasi, menuju terbentuknya sistem transportasi yang berkelanjutan dan sesuai dengan aspirasi segenap pemangku kepentingan.',
    misi: [
      'Menumbuh kembangkan profesionalitas pelaku kegiatan bidang transportasi',
      'Memberikan pelayanan advokasi untuk pengambil keputusan bidang transportasi',
      'Mendorong interaksi sinergis antar pemangku kepentingan untuk peningkatan kualitas layanan transportasi'
    ],
    tujuan: [
      'Meningkatnya jumlah dan kualitas pelaku profesional bidang transportasi bersertifikasi',
      'Meningkatnya jumlah kota dan wilayah yang menerapkan prinsip-prinsip transportasi berkelanjutan',
      'Meningkatnya jumlah regulasi bidang transportasi yang sejalan dengan aspirasi masyarakat dan prinsip transportasi berkelanjutan'
    ],
    image: ''
  },
  programUnggulan: [
    {
      id: 'p1',
      image:
        'https://mti.or.id/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-11-at-20.25.20-scaled.jpeg',
      tag: 'FORUM DISKUSI',
      title: 'Forum Diskusi Transportasi wilayah Sumsel (FDTS)',
      summary:
        'Diskusi berkala membahas isu hangat transportasi lokal bersama Dishub dan operator.'
    },
    {
      id: 'p2',
      image:
        'https://mti.or.id/wp-content/uploads/2023/07/Screenshot-2023-07-01-at-17.28.41.png',
      tag: 'ASPIRASI PUBLIK',
      title: 'MTI Mendengar / Suara Warga',
      summary:
        'Saluran aspirasi masyarakat terkait fasilitas halte, trotoar, dan layanan angkutan umum.'
    },
    {
      id: 'p3',
      image:
        'https://mti.or.id/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-15-at-15.20.45.jpeg',
      tag: 'RISET & KEBIJAKAN',
      title: 'Kajian & Policy Brief',
      summary: 'Ringkasan riset kebijakan yang diserahkan ke pengambil keputusan.'
    }
  ],
  kegiatanHero: {
    eyebrow: 'Kegiatan MTI',
    title: 'Kegiatan Masyarakat Transportasi Sumatera Selatan',
    description:
      'Agenda, diskusi kebijakan, dan aksi nyata Masyarakat Transportasi Indonesia Wilayah Sumatera Selatan dari tahun ke tahun.',
    image: 'https://mti.or.id/wp-content/uploads/2023/07/Dialog-dan-Sinergi-2.jpg'
  }
});

assert.deepEqual(await readJSON('media'), {
  mainVideo: {},
  miniVideos: []
});

console.log('Clean seed contract verified.');
