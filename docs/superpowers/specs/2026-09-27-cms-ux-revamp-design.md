# Spesifikasi Desain: Revamp UX CMS MTI Sumsel, Hub Tentang Kami & Halaman Publik Artikel

**Tanggal:** 27 September 2026  
**Status:** Draf Tinjauan Pengguna  
**Target Pengguna:** Staf organisasi MTI Sumatera Selatan (non-teknis)

---

## 1. Latar Belakang & Tujuan
CMS saat ini memiliki beberapa kelemahan pengalaman pengguna (UX) yang menyulitkan staf organisasi non-teknis:
1. Alur penyimpanan tidak memberikan umpan balik (feedback) yang konsisten dan jelas (beberapa aksi memicu status semu atau notifikasi cepat hilang).
2. Navigasi CMS terlalu terfragmentasi: pengaturan "Hero Kegiatan" menempel di form Beranda, sementara halaman Tentang Kami hanya diwakili form sempit Struktur Organisasi.
3. Halaman publik belum memiliki rute khusus `/artikel` di navbar utama, meskipun data dan modul admin artikel sudah tersedia di backend.
4. Tidak ada mekanisme pratinjau (*preview*) sebelum konten benar-benar disimpan ke website publik.
5. Formulir pengeditan bercampur di bawah baris tabel (inline), menyebabkan layout memanjang dan sempit pada layar laptop atau tablet.

Tujuan proyek ini adalah merombak CMS MTI Sumsel menjadi alat kerja yang sederhana, manusiawi, aman, dan mudah digunakan staf tanpa latar belakang teknis (tanpa istilah rumit, tanpa RBAC yang berlebihan), serta melengkapi navigasi publik dengan Hub Tentang Kami dan halaman `/artikel`.

---

## 2. Arsitektur Informasi & Navigasi

### 2.1 Navigasi Website Publik (`SITE_CONFIG`)
Menu header website publik diperbarui menjadi 4 bagian terstruktur:
1. **Beranda** (`/`)
2. **Kegiatan MTI** (`/kegiatan-mti`)
3. **Artikel & Opini** (`/artikel` — rute publik baru dengan daftar artikel, filter kategori, kartu responsif, dan pembaca artikel)
4. **Tentang Kami** (menu dropdown):
   - **Sejarah MTI** (`/sejarah-mti`)
   - **Struktur Organisasi** (`/struktur-organisasi`)
   - **Identitas Organisasi** (`/identitas-organisasi`)

### 2.2 Navigasi Panel Admin CMS (`/admin`)
Sidebar admin dikelompokkan secara logis dengan penanda menu aktif yang tegas:
```text
[MTI SUMSEL CMS]
Dashboard

PENGELOLAAN HALAMAN
• Beranda (Hub 3 kartu: Hero Pengenalan, Visi & Misi, Program Unggulan)
• Tentang Kami (Hub 3 kartu: Sejarah MTI, Struktur Organisasi, Identitas Organisasi)
• Hero Halaman Kegiatan (Banner judul & foto atas /kegiatan-mti)

KONTEN BERKALA
• Kegiatan MTI (Daftar agenda kegiatan per tanggal)
• Artikel & Opini (Daftar tulisan dan opini publik)
• Berita (Daftar berita siaran pers)
• Jurnal AKSES (Edisi publikasi berkala)
• Media Video (Video YouTube sorotan)

[Lihat Website ↗]  [Keluar]
```

---

## 3. Alur Kerja Konten & Pratinjau (UX Flow)

### 3.1 Pola Alur Form Terstandarisasi
Setiap modul konten berkala (Kegiatan, Artikel, Berita, Jurnal) mengikuti siklus halaman terisolasi:
1. **Halaman Daftar (`/admin/<modul>`)**:
   - Header halaman dengan deskripsi singkat bahasa Indonesia yang mudah dipahami.
   - Tombol utama yang kontras: `+ Tambah <Modul> Baru`.
   - Tabel bersih dengan pencarian judul instan dan status tampilan (*Tampil* / *Disembunyikan*).
   - Tombol tindakan per baris: `Edit` (berpindah ke halaman form) dan `Hapus` (dialog konfirmasi aman).
2. **Halaman Formulir (`/admin/<modul>/baru` atau `/admin/<modul>/[id]`)**:
   - Form satu kolom lapang dan teratur dengan pengelompokan field yang logis.
   - Label bahasa Indonesia yang jelas, tanpa singkatan teknis (misal: "Judul", "Tanggal Kegiatan", "Foto Dokumentasi", "Ringkasan", "Isi Lengkap").
   - Batas unggah foto terpampang jelas: **Format JPG, PNG, WebP (Maksimal 5 MB)** dengan validasi instan di browser dan server.

### 3.2 Alur Pratinjau di Tab Baru (New Tab Preview)
1. Di setiap halaman editor form, tersedia tombol sekunder:
   ```html
   <button type="button" class="adminBtnSecondary">↗ Pratinjau di Tab Baru</button>
   ```
2. Saat diklik:
   - Data form saat itu diserialisasi ke `sessionStorage` browser dengan key pratinjau spesifik (misal `mti_preview_<module>`).
   - Browser membuka tab baru ke rute pratinjau yang sesuai (misal: `/kegiatan-mti?preview=1`, `/artikel?preview=1`, atau `/?preview=1`).
   - Komponen halaman publik membaca data sesi pratinjau jika parameter `preview=1` aktif dan merender draf tersebut.
   - Di bagian atas halaman pratinjau ditampilkan banner bar:
     ```text
     [⚠️ MODE PRATINJAU DRAFT - Konten ini belum disimpan ke website publik]
     ```
   - Pengunjung publik biasa tetap melihat data database yang sah (tanpa melihat draft).
3. Setelah puas memeriksa tampilan, staf kembali ke tab CMS dan menekan **`Simpan ke Website`**.

### 3.3 Status Penyimpanan & Umpan Balik
- Setiap Server Action mengembalikan struktur respons yang terverifikasi:
  ```json
  { "success": true } atau { "error": "Pesan kesalahan yang mudah dipahami" }
  ```
- Saat berhasil, CMS menampilkan banner hijau persisten dengan tautan verifikasi:
  ```text
  ✓ Perubahan berhasil disimpan dan sudah tampil di website! [Lihat Halaman Publik ↗]
  ```
- Jika gagal, tampilkan banner merah dengan akar masalah yang jelas (misal: "Ukuran gambar melebihi 5 MB" atau "Judul tidak boleh kosong").

### 3.4 Perlindungan Data (Unsaved Changes Warning)
- Jika staf telah mengubah nilai input form (*dirty state*) lalu mencoba menutup tab atau mengklik link navigasi sidebar sebelum menekan tombol Simpan, browser memunculkan peringatan konfirmasi:
  ```text
  "Perubahan yang Anda ketik belum disimpan. Yakin ingin meninggalkan halaman ini?"
  ```

---

## 4. Rincian Modul Pengelolaan Halaman

### 4.1 Hub Beranda (`/admin/beranda`)
Halaman ringkasan terdiri dari 3 kartu:
- **Kartu 1: Hero Pengenalan** (Judul organisasi, narasi singkat, foto background berbayang).
- **Kartu 2: Visi, Misi & Tujuan** (Teks visi, daftar butir misi, sasaran tujuan organisasi).
- **Kartu 3: Program Unggulan** (3 kartu inisiatif utama: judul, kategori, ringkasan, foto dokumentasi).

### 4.2 Hub Tentang Kami (`/admin/tentang-kami`)
Halaman terpadu baru yang merangkum seluruh profil organisasi:
- **Kartu 1: Sejarah MTI** (Teks pengantar perjalanan organisasi, foto banner hero sejarah, milestone sejarah).
- **Kartu 2: Struktur Organisasi** (Formulir pengisian 24 nama pengurus pada posisi jabatan baku Sumsel).
- **Kartu 3: Identitas Organisasi** (Makna logo, filosofi warna organisasi, URL video mars resmi).

### 4.3 Hero Halaman Kegiatan (`/admin/hero-kegiatan`)
- Halaman mandiri terpisah dari beranda khusus untuk mengatur banner hero atas `/kegiatan-mti` (Judul: *Kegiatan Masyarakat Transportasi Sumatera Selatan*, subjudul pengantar, dan foto dokumentasi).

---

## 5. Rincian Halaman Publik Baru: `/artikel`
- Memanfaatkan data tabel `public.artikel` yang sudah ada di Supabase.
- Header banner standar (tinggi 420px, judul 42px, background foto sinematik berbayang).
- Filter kategori yang elegan: *Semua*, *Opini*, *Berita Wilayah*, *Analisis*.
- Kartu grid artikel responsif (gambar cover, tanggal, nama daerah/penulis, ringkasan).
- Detail modal baca atau halaman dinamis yang nyaman dibaca di desktop maupun ponsel.

---

## 6. Rencana Verifikasi & Uji Kualitas
1. **Unit & Contract Verification**:
   - Pengujian fungsi validasi gambar (maks 5 MB, tipe mime).
   - Pengujian sanitasi data dan validasi form di server action.
2. **End-to-End Browser Flow**:
   - Menambah kegiatan baru & artikel baru via CMS.
   - Menguji tombol *Pratinjau di Tab Baru* dan memastikan tab baru menampilkan draf dengan benar.
   - Menyimpan konten dan memverifikasi langsung di website publik (`/artikel` dan `/kegiatan-mti`).
   - Menguji peringatan *unsaved changes* saat form ditinggalkan.
   - Menguji responsive layout pada tampilan viewport ponsel (375px) dan desktop (1280px).
3. **Build & Deploy Safety**:
   - `npm run build` berhasil 100% tanpa peringatan tipe atau breaking changes.
   - Deploy ke VPS `103.208.137.57` dengan status PM2 online dan Nginx `200 OK`.
