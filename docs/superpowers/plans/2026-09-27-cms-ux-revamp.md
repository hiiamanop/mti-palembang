# Rencana Implementasi: Revamp UX CMS MTI Sumsel, Hub Tentang Kami & Halaman Publik Artikel

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merombak pengalaman pengguna (UX) panel admin CMS MTI Sumsel menjadi sederhana, konsisten, dan mudah digunakan oleh staf organisasi non-teknis, dilengkapi dengan fitur "Pratinjau di Tab Baru", Hub Tentang Kami terpadu, dan rute publik baru `/artikel`.

**Architecture:** 
- Navigasi publik di `lib/site-config.js` menambahkan rute baru `/artikel` dan menyusun rapi dropdown `Tentang Kami`.
- Halaman publik `/artikel` merender artikel dan opini yang diambil dari tabel `public.artikel` Supabase dengan filter kategori dan tampilan pembaca artikel yang responsif.
- Fitur pratinjau memanfaatkan serialisasi draf sementara ke `sessionStorage` dengan banner indikator mengambang (`PreviewBanner.jsx`) sehingga staf dapat melihat tampilan website yang sesungguhnya di tab baru sebelum menyimpan ke database publik.
- Panel admin direstrukturisasi menjadi alur halaman tersendiri (`/baru` dan `/[id]`), menggantikan form inline yang membingungkan, dilengkapi hook proteksi perubahan belum disimpan (`useUnsavedChanges`), modal konfirmasi hapus ramah pengguna, dan feedback penyimpanan yang jelas.

**Tech Stack:** Next.js 16 (App Router), React 19, Supabase SSR & Database, Lucide Icons, Vanilla CSS modular.

**Spec:** `docs/superpowers/specs/2026-09-27-cms-ux-revamp-design.md`

## Global Constraints
- Target pengguna utama adalah staf non-teknis: hindari istilah teknis rumit (seperti slug, href, embed URL jika bisa otomatis).
- Setiap tindakan "Simpan" langsung tampil di website publik tanpa proses approval atau RBAC berjenjang.
- Konten tetap memiliki opsi tindakan "Sembunyikan dari Website" untuk kebutuhan khusus.
- Unggah foto wajib divalidasi di browser dan server: format JPG, PNG, atau WebP dengan batas maksimal 5 MB.
- Ukuran banner hero di semua halaman publik wajib konsisten pada tinggi `420px` dan font judul `42px`.
- Seluruh verifikasi lokal harus lolos (`npm run build`, skrip verifikasi) sebelum di-deploy ke VPS `103.208.137.57`.

---

### Task 1: Rute Navigasi Publik & Halaman Publik Baru `/artikel`

**Files:**
- Modify: `lib/site-config.js`
- Create: `app/artikel/page.jsx`
- Create: `app/artikel/[id]/page.jsx`
- Create: `app/artikel/ArtikelClient.jsx`
- Create: `scripts/verify-public-artikel.mjs`

**Interfaces:**
- Consumes: `getArtikel()`, `getArtikelById(id)` dari `lib/cms.js`
- Produces: Rute publik `https://mti-sumsel.or.id/artikel` dan `https://mti-sumsel.or.id/artikel/[id]`

- [ ] **Step 1: Tulis skrip verifikasi kontrak halaman publik artikel**
Buat `scripts/verify-public-artikel.mjs` untuk memverifikasi bahwa `SITE_CONFIG` menyertakan `/artikel`, rute ekspor fungsi komponen ada, dan metadata judul sesuai spesifikasi.

- [ ] **Step 2: Jalankan skrip verifikasi untuk memastikan gagal (RED)**
```bash
node scripts/verify-public-artikel.mjs
```
Ekspektasi: Gagal karena `/artikel` belum terdaftar di `SITE_CONFIG` dan file halaman belum dibuat.

- [ ] **Step 3: Tambahkan rute `/artikel` ke `lib/site-config.js`**
Tambahkan item menu `Artikel & Opini` (`href: '/artikel'`) ke dalam array `navItems` dan `footerLinks`.

- [ ] **Step 4: Buat komponen `app/artikel/ArtikelClient.jsx`**
Komponen client responsif yang menampilkan:
- Tab filter kategori (*Semua*, *Opini*, *Berita Wilayah*, *Analisis*).
- Kolom pencarian judul artikel instan.
- Grid kartu artikel dengan cover, tanggal, badge daerah/kategori, dan ringkasan.
- Tombol "Baca Selengkapnya".

- [ ] **Step 5: Buat halaman `app/artikel/page.jsx` dan `app/artikel/[id]/page.jsx`**
- `app/artikel/page.jsx`: Mengambil data artikel publik (`visible = true`) via `getArtikel()`, merender `Header`, banner hero standar (`dialogHero` 420px, judul "Artikel & Opini Transportasi"), `ArtikelClient`, dan `Footer`.
- `app/artikel/[id]/page.jsx`: Halaman pembaca artikel lengkap dengan format paragraf bersih, tanggal, penulis/daerah, dan tombol kembali ke daftar artikel.

- [ ] **Step 6: Jalankan skrip verifikasi untuk memastikan lolos (GREEN)**
```bash
node scripts/verify-public-artikel.mjs
```
Ekspektasi: PASS.

- [ ] **Step 7: Commit perubahan Task 1**
```bash
git add lib/site-config.js app/artikel/ scripts/verify-public-artikel.mjs
git commit -m "feat: add public /artikel page and update main navigation"
```

---

### Task 2: Infrastruktur Pratinjau Tab Baru & Komponen Feedback CMS

**Files:**
- Create: `lib/preview-storage.js`
- Create: `app/components/shared/PreviewBanner.jsx`
- Create: `app/admin/components/AdminAlert.jsx`
- Create: `app/admin/components/ConfirmDeleteModal.jsx`
- Create: `app/admin/components/useUnsavedChanges.js`
- Create: `scripts/verify-preview-system.mjs`

**Interfaces:**
- Consumes: browser `sessionStorage`, React hooks
- Produces: `savePreviewDraft(key, data)`, `loadPreviewDraft(key)`, `<PreviewBanner />`, `<AdminAlert />`, `<ConfirmDeleteModal />`

- [ ] **Step 1: Tulis skrip verifikasi kontrak sistem pratinjau**
Buat `scripts/verify-preview-system.mjs` untuk menguji helper serialisasi draft dan ketersediaan komponen feedback.

- [ ] **Step 2: Jalankan skrip verifikasi (RED)**
```bash
node scripts/verify-preview-system.mjs
```
Ekspektasi: Gagal karena modul belum dibuat.

- [ ] **Step 3: Implementasikan helper `lib/preview-storage.js`**
Fungsi aman untuk menyimpan dan mengambil data pratinjau draft sementara di browser:
```javascript
export function savePreviewDraft(key, data) { ... }
export function loadPreviewDraft(key) { ... }
export function clearPreviewDraft(key) { ... }
```

- [ ] **Step 4: Buat komponen `app/components/shared/PreviewBanner.jsx`**
Banner bar mengambang di atas halaman publik jika query parameter `?preview=1` aktif:
- Indikator teks kuning/amber kontras: `⚠️ MODE PRATINJAU DRAFT - Konten ini belum disimpan ke website publik`.
- Tombol `Tutup Pratinjau` yang menutup tab atau menghapus parameter pratinjau.

- [ ] **Step 5: Buat komponen `AdminAlert.jsx`, `ConfirmDeleteModal.jsx`, dan `useUnsavedChanges.js`**
- `AdminAlert.jsx`: Banner notifikasi sukses (hijau) atau gagal (merah) yang persisten di atas area tombol form, dilengkapi link verifikasi ke halaman publik terkait.
- `ConfirmDeleteModal.jsx`: Modal popup konfirmasi hapus yang ramah dengan menyebutkan nama item yang akan dihapus, bukan dialog browser standar.
- `useUnsavedChanges.js`: Hook untuk memicu peringatan browser `beforeunload` dan navigasi internal jika form berada dalam status kotor (*dirty*).

- [ ] **Step 6: Jalankan skrip verifikasi (GREEN)**
```bash
node scripts/verify-preview-system.mjs
```
Ekspektasi: PASS.

- [ ] **Step 7: Commit perubahan Task 2**
```bash
git add lib/preview-storage.js app/components/shared/PreviewBanner.jsx app/admin/components/ scripts/verify-preview-system.mjs
git commit -m "feat: add preview session storage and reusable admin feedback components"
```

---

### Task 3: Restrukturisasi Sidebar Admin, Hub Beranda & Hub Tentang Kami

**Files:**
- Modify: `app/admin/layout.jsx`
- Modify: `app/admin/beranda/page.jsx`
- Create: `app/admin/beranda/HeroPengenalanEditor.jsx`
- Create: `app/admin/beranda/VisiMisiEditor.jsx`
- Create: `app/admin/beranda/ProgramUnggulanEditor.jsx`
- Create: `app/admin/tentang-kami/page.jsx`
- Create: `app/admin/tentang-kami/sejarah/page.jsx`
- Create: `app/admin/tentang-kami/struktur-organisasi/page.jsx`
- Create: `app/admin/tentang-kami/identitas/page.jsx`
- Create: `app/admin/hero-kegiatan/page.jsx`
- Modify: `app/globals.css` (admin styles)

**Interfaces:**
- Consumes: `getSingleton()`, `saveSingleton()`, `getStrukturOrganisasi()`
- Produces: Navigasi sidebar terkelompok, Hub Beranda 3 kartu, Hub Tentang Kami 3 kartu, Editor mandiri Hero Kegiatan

- [ ] **Step 1: Tulis skrip verifikasi navigasi admin dan keberadaan rute hub**
Buat `scripts/verify-admin-hubs.mjs` yang memeriksa keberadaan rute `/admin/tentang-kami`, `/admin/hero-kegiatan`, dan kelompok navigasi di `app/admin/layout.jsx`.

- [ ] **Step 2: Jalankan skrip verifikasi (RED)**
```bash
node scripts/verify-admin-hubs.mjs
```
Ekspektasi: Gagal karena rute hub belum tersedia.

- [ ] **Step 3: Perbarui `app/admin/layout.jsx`**
Kelompokkan menu navigasi sidebar:
- **Dashboard**
- **PENGELOLAAN HALAMAN**: Beranda, Tentang Kami (Hub), Hero Halaman Kegiatan
- **KONTEN BERKALA**: Kegiatan MTI, Artikel & Opini, Berita, Jurnal AKSES, Media Video
- Tambahkan styling penanda aktif (`adminNavItemActive`) berdasarkan `usePathname()`.

- [ ] **Step 4: Refactor Hub Beranda (`app/admin/beranda/page.jsx`)**
Ubah halaman dari 7 tab bertumpuk menjadi halaman ringkasan 3 kartu bersih:
1. Kartu Hero Pengenalan
2. Kartu Visi, Misi & Tujuan
3. Kartu Program Unggulan
Masing-masing kartu memiliki tombol editor fokus dengan preview di tab baru. Pisahkan tab lama *Hero Kegiatan* ke rutenya sendiri.

- [ ] **Step 5: Buat Hub Tentang Kami (`app/admin/tentang-kami/page.jsx`) dan sub-halamannya**
- `page.jsx`: Menampilkan 3 kartu profil organisasi: Sejarah MTI, Struktur Organisasi (24 Nama), Identitas Organisasi.
- Sub-halaman `/tentang-kami/struktur-organisasi/page.jsx`: Memindahkan form 24 jabatan tetap dengan antarmuka yang lebih lapang, tombol pratinjau tab baru ke `/struktur-organisasi?preview=1`, dan tombol simpan.
- Sub-halaman `/tentang-kami/sejarah/page.jsx` dan `/tentang-kami/identitas/page.jsx`.

- [ ] **Step 6: Buat Halaman Khusus Hero Kegiatan (`app/admin/hero-kegiatan/page.jsx`)**
Form mandiri untuk mengelola banner atas `/kegiatan-mti`:
- Judul banner (default: *Kegiatan Masyarakat Transportasi Sumatera Selatan*).
- Teks pengantar / subjudul.
- Foto banner dokumentasi (validasi maks 5 MB).
- Tombol `↗ Pratinjau di Tab Baru` (membuka `/kegiatan-mti?preview=1`) dan `Simpan ke Website`.

- [ ] **Step 7: Jalankan skrip verifikasi (GREEN)**
```bash
node scripts/verify-admin-hubs.mjs
```
Ekspektasi: PASS.

- [ ] **Step 8: Commit perubahan Task 3**
```bash
git add app/admin/layout.jsx app/admin/beranda/ app/admin/tentang-kami/ app/admin/hero-kegiatan/ app/globals.css scripts/verify-admin-hubs.mjs
git commit -m "feat: revamp admin sidebar, beranda hub, and introduce tentang-kami hub"
```

---

### Task 4: Standarisasi Editor Halaman Terisolasi (`/baru` & `/[id]`) untuk Modul Konten

**Files:**
- Modify: `app/admin/kegiatan/page.jsx`
- Create: `app/admin/kegiatan/baru/page.jsx`
- Create: `app/admin/kegiatan/[id]/page.jsx`
- Create: `app/admin/kegiatan/KegiatanEditorForm.jsx`
- Modify: `app/admin/artikel/page.jsx`
- Create: `app/admin/artikel/baru/page.jsx`
- Create: `app/admin/artikel/[id]/page.jsx`
- Create: `app/admin/artikel/ArtikelEditorForm.jsx`
- Modify: `app/admin/berita/page.jsx`
- Modify: `app/admin/berita/[id]/BeritaForm.jsx`
- Modify: `app/admin/jurnal/page.jsx`
- Modify: `app/admin/actions.js`

**Interfaces:**
- Consumes: Server Actions `addKegiatanItem`, `saveKegiatanItem`, `addArtikelItem`, `saveArtikelItem`, `deleteKegiatanItem`, `deleteArtikelItem`
- Produces: Antarmuka form satu kolom lapang, tombol `↗ Pratinjau di Tab Baru`, feedback `AdminAlert`, konfirmasi hapus aman `ConfirmDeleteModal`

- [ ] **Step 1: Tulis skrip verifikasi kontrak editor terisolasi**
Buat `scripts/verify-content-editors.mjs` untuk memverifikasi bahwa form tidak lagi mengembang di dalam tabel dan Server Actions mengembalikan objek terverifikasi `{ success: true }` atau `{ error: string }`.

- [ ] **Step 2: Jalankan skrip verifikasi (RED)**
```bash
node scripts/verify-content-editors.mjs
```
Ekspektasi: Gagal karena sub-rute `/baru` dan `/[id]` belum lengkap untuk kegiatan dan artikel.

- [ ] **Step 3: Standarisasi Modul Kegiatan MTI**
- Ubah `app/admin/kegiatan/page.jsx` menjadi tabel ringkas dengan pencarian judul, tombol status tampilan (*Tampil* / *Disembunyikan*), tombol edit yang membuka `/admin/kegiatan/[id]`, dan tombol hapus dengan modal konfirmasi.
- Buat `app/admin/kegiatan/baru/page.jsx` dan `[id]/page.jsx` menggunakan `KegiatanEditorForm.jsx`:
  - Input: Judul, Tanggal, Foto Dokumentasi (maks 5 MB), Ringkasan.
  - Tombol: `← Kembali`, `↗ Pratinjau di Tab Baru`, `Simpan ke Website`.
  - Integrasi dengan `useUnsavedChanges` dan `AdminAlert`.

- [ ] **Step 4: Standarisasi Modul Artikel & Opini**
- Ubah `app/admin/artikel/page.jsx` menjadi tabel ringkas serupa dengan filter kategori dan pencarian.
- Buat `app/admin/artikel/baru/page.jsx` dan `[id]/page.jsx` menggunakan `ArtikelEditorForm.jsx`:
  - Input: Judul, Kategori (*Opini*, *Berita Wilayah*, *Analisis*), Penulis / Daerah, Foto Sampul (maks 5 MB), Ringkasan, Isi Artikel Lengkap.
  - Tombol: `← Kembali`, `↗ Pratinjau di Tab Baru`, `Simpan ke Website`.

- [ ] **Step 5: Standarisasi Modul Berita & Jurnal**
- Perbarui `BeritaForm.jsx` dan `JurnalForm.jsx` agar menyertakan tombol pratinjau tab baru, feedback `AdminAlert`, dan validasi batas upload 5 MB yang konsisten.

- [ ] **Step 6: Jalankan skrip verifikasi (GREEN)**
```bash
node scripts/verify-content-editors.mjs
```
Ekspektasi: PASS.

- [ ] **Step 7: Commit perubahan Task 4**
```bash
git add app/admin/kegiatan/ app/admin/artikel/ app/admin/berita/ app/admin/jurnal/ app/admin/actions.js scripts/verify-content-editors.mjs
git commit -m "feat: standardize isolated page editors with live preview and user-friendly feedback"
```

---

### Task 5: Integrasi Komponen Pratinjau pada Halaman Publik (`?preview=1`)

**Files:**
- Modify: `app/kegiatan-mti/KegiatanClient.jsx`
- Modify: `app/kegiatan-mti/page.jsx`
- Modify: `app/artikel/ArtikelClient.jsx`
- Modify: `app/HomeClient.jsx`
- Modify: `app/struktur-organisasi/page.jsx`

**Interfaces:**
- Consumes: `loadPreviewDraft` dari `lib/preview-storage.js`, `<PreviewBanner />`
- Produces: Tampilan visual pratinjau yang aman dan terisolasi untuk sesi admin

- [ ] **Step 1: Tulis skrip verifikasi integrasi pratinjau di halaman publik**
Buat `scripts/verify-preview-integration.mjs` untuk memastikan komponen publik mendeteksi state pratinjau dan menyertakan banner indikator.

- [ ] **Step 2: Jalankan skrip verifikasi (RED)**
```bash
node scripts/verify-preview-integration.mjs
```
Ekspektasi: Gagal karena pembacaan draft pratinjau belum dihubungkan.

- [ ] **Step 3: Hubungkan pratinjau di `app/kegiatan-mti/KegiatanClient.jsx` & `page.jsx`**
Jika `preview=1` ada di URL, baca draf dari `sessionStorage`:
- Tambahkan atau perbarui item kegiatan di daftar dengan data draft.
- Tampilkan `<PreviewBanner />` di bagian paling atas halaman.

- [ ] **Step 4: Hubungkan pratinjau di `app/artikel/ArtikelClient.jsx` & `app/HomeClient.jsx`**
Mungkinkan pratinjau artikel baru dan perubahan Beranda (Visi Misi, Program Unggulan) secara real-time sebelum disimpan.

- [ ] **Step 5: Jalankan skrip verifikasi (GREEN)**
```bash
node scripts/verify-preview-integration.mjs
```
Ekspektasi: PASS.

- [ ] **Step 6: Commit perubahan Task 5**
```bash
git add app/kegiatan-mti/ app/artikel/ app/HomeClient.jsx app/struktur-organisasi/ scripts/verify-preview-integration.mjs
git commit -m "feat: enable seamless client-side draft preview on public pages"
```

---

### Task 6: Verifikasi Penuh, Uji Browser Lokal & Deployment ke VPS Produksi

**Files:**
- Run: Seluruh skrip verifikasi (`scripts/verify-*.mjs`)
- Run: `npm audit`, `npm run build`
- Deploy: VPS `103.208.137.57`

**Interfaces:**
- Consumes: Git repository origin, SSH deploy ke VPS
- Produces: Website produksi `https://mti-sumsel.or.id` dengan CMS baru yang aktif dan stabil

- [ ] **Step 1: Jalankan seluruh suite pengujian dan verifikasi lokal**
```bash
node scripts/verify-clean-seed.mjs
node scripts/verify-clean-home.mjs
node scripts/verify-site-navigation.mjs
node scripts/verify-kegiatan.mjs
node scripts/verify-organization-structure.mjs
node scripts/verify-image-upload.mjs
node scripts/verify-public-artikel.mjs
node scripts/verify-preview-system.mjs
node scripts/verify-admin-hubs.mjs
node scripts/verify-content-editors.mjs
node scripts/verify-preview-integration.mjs
npm audit
npm run build
```
Ekspektasi: Semua script verifikasi dan `next build` berhasil 100% tanpa error.

- [ ] **Step 2: Uji alur di browser lokal (`orca_browser`)**
- Buka `http://localhost:3000/admin`.
- Uji navigasi sidebar baru, Hub Beranda, dan Hub Tentang Kami.
- Buka form tambah kegiatan, isi draf, klik `↗ Pratinjau di Tab Baru`, verifikasi banner pratinjau muncul di tab baru.
- Buka halaman publik `http://localhost:3000/artikel`, verifikasi filter kategori dan kartu artikel berfungsi.

- [ ] **Step 3: Push commit ke GitHub `origin/main`**
```bash
git push origin HEAD:feat/self-hosted-supabase
git push origin HEAD:main
```

- [ ] **Step 4: Deploy dan build di VPS produksi**
Jalankan di VPS `103.208.137.57`:
- Pull update terbaru dari `origin/main`.
- Jalankan `npm ci` dan `npm run build`.
- Restart service `pm2 restart mti-sumsel --update-env`.
- Verifikasi status Nginx, PM2, dan respon HTTP:
  ```bash
  curl -fsSI https://mti-sumsel.or.id/artikel
  curl -fsSI https://mti-sumsel.or.id/admin
  ```

- [ ] **Step 5: Verifikasi akhir end-to-end pada domain publik HTTPS**
Verifikasi via browser bahwa `https://mti-sumsel.or.id/artikel` tampil sempurna dan admin CMS dapat diakses staf dengan mulus.
