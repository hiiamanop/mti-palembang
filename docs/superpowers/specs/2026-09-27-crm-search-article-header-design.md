# Spesifikasi Desain: CRM Publik, Pencarian Global, dan Header Artikel & Opini

**Tanggal:** 27 September 2026  
**Status:** Menunggu tinjauan pengguna  
**Target pengguna publik:** Pengunjung website MTI Sumatera Selatan  
**Target pengguna CMS:** Staf organisasi nonteknis

---

## 1. Tujuan

Perubahan ini mempunyai empat tujuan:

1. Mengganti tombol **Berlangganan** di masthead menjadi **Hubungi Kami** yang mengarah ke section CRM pada beranda.
2. Mengganti section Newsletter menjadi formulir CRM sederhana yang menyimpan kontak ke Supabase dan mengirim dua email melalui Resend.
3. Mengaktifkan tombol pencarian navbar melalui modal pencarian global yang mencakup seluruh konten publik website.
4. Menambahkan editor **Header Artikel & Opini** ke CMS serta menyusun menu **Pengelolaan Halaman** sesuai urutan navbar publik.

Perubahan tidak menambahkan RBAC. Seluruh staf CMS tetap memakai satu jenis akun admin.

---

## 2. Masthead dan Section CRM

### 2.1 Tombol masthead

Tombol saat ini:

```text
Berlangganan
```

Diganti menjadi:

```text
Hubungi Kami
```

Tautan tujuan:

```text
/#crm
```

Pada navigasi mobile, tombol **Berlangganan Newsletter** juga diganti menjadi **Hubungi Kami** dengan tujuan yang sama.

Jika tombol ditekan dari halaman selain beranda, browser membuka beranda dan menggulir ke section CRM setelah halaman dimuat.

### 2.2 Section CRM publik

Section Newsletter lama diganti menjadi section **Hubungi MTI Sumsel** dengan `id="crm"`.

Konten section:

- Eyebrow: `KOLABORASI & INFORMASI`
- Judul: `Hubungi MTI Sumatera Selatan`
- Deskripsi singkat mengenai kolaborasi, keanggotaan, kegiatan, dan informasi organisasi.
- Input **Nama Lengkap**.
- Input **Email**.
- Input **Asal Institusi**.
- Input tersembunyi honeypot untuk menolak bot.
- Tombol **Kirim Permintaan Kontak**.

Status pengiriman wajib terlihat dekat formulir:

- Loading: `Mengirim permintaan...`
- Berhasil: `Terima kasih. Permintaan Anda sudah diterima. Konfirmasi telah dikirim ke email Anda.`
- Validasi: pesan spesifik di bawah field bermasalah.
- Gangguan email: data tetap tersimpan dan pengguna diberi pesan bahwa permintaan telah diterima meskipun email konfirmasi tertunda.

### 2.3 Validasi formulir

Validasi dilakukan di browser dan di Server Action:

- Nama lengkap: wajib, 2–120 karakter.
- Email: wajib, format email valid, maksimal 254 karakter.
- Institusi: wajib, 2–160 karakter.
- Honeypot: harus kosong.
- Nilai dipangkas dari whitespace sebelum disimpan.

Server tidak mempercayai validasi browser.

### 2.4 Perlindungan spam

Tanpa CAPTCHA agar alur staf dan pengunjung tetap sederhana. Perlindungan minimal:

- Honeypot tersembunyi.
- Batas maksimal 3 kiriman per alamat email dalam 1 jam.
- Batas maksimal 5 kiriman per hash alamat IP dalam 1 jam.
- IP tidak disimpan secara mentah; server menyimpan hash SHA-256 yang diberi salt dari environment variable.
- Respons penolakan memakai pesan netral dan tidak membocorkan detail mekanisme rate limit.

Karena aplikasi hanya menggunakan satu instance Next.js di VPS, pemeriksaan rate limit dilakukan terhadap data Supabase agar tetap bertahan setelah restart PM2.

---

## 3. Penyimpanan CRM di Supabase

### 3.1 Tabel `public.crm_contacts`

Kolom:

```text
id                       uuid primary key
name                     text not null
email                    text not null
institution              text not null
status                   text not null default 'baru'
ip_hash                   text
internal_email_status    text not null default 'pending'
confirmation_email_status text not null default 'pending'
email_error               text
created_at                timestamptz not null default now()
updated_at                timestamptz not null default now()
```

Constraint status tindak lanjut:

```text
baru | sudah_dihubungi | selesai
```

Constraint status email:

```text
pending | terkirim | gagal
```

### 3.2 RLS

- Tidak ada policy insert publik langsung.
- Server Action publik menyimpan data menggunakan service-role client setelah validasi dan rate limiting.
- Hanya pengguna `authenticated` yang boleh membaca, memperbarui status, dan menghapus data CRM melalui CMS.
- Data CRM tidak pernah dirender ke halaman publik atau endpoint pencarian.

### 3.3 Idempotensi schema

Perubahan `supabase/schema.sql` harus menggunakan `create table if not exists`, `drop policy if exists`, dan `create policy` agar setup ulang tidak menghapus data kontak yang sudah tersimpan.

`scripts/setup.mjs` hanya menjalankan schema; tidak membuat seed data CRM.

---

## 4. Integrasi Resend

### 4.1 Konfigurasi environment

Environment produksi:

```env
RESEND_API_KEY=re_xxxxxxxxx
CRM_FROM_EMAIL=MTI Sumsel <kontak@mti-sumsel.or.id>
CRM_REPLY_TO=mtiwilayahsumsel@gmail.com
CRM_NOTIFICATION_EMAIL=mtiwilayahsumsel@gmail.com
CRM_RATE_LIMIT_SALT=<nilai-acak-kuat>
```

`RESEND_API_KEY` hanya digunakan di server dan tidak boleh memakai prefix `NEXT_PUBLIC_`.

### 4.2 Domain Resend

Domain `mti-sumsel.or.id` diverifikasi di Resend menggunakan record DNS SPF dan DKIM yang diberikan Resend. Record ditambahkan melalui DNSCloud.ID tanpa mengubah nameserver yang sudah digunakan.

Alamat pengirim:

```text
MTI Sumsel <kontak@mti-sumsel.or.id>
```

Alamat balasan:

```text
mtiwilayahsumsel@gmail.com
```

### 4.3 Alur transaksi

Urutan wajib:

1. Validasi input dan rate limit.
2. Simpan data kontak ke Supabase dengan kedua status email `pending`.
3. Kirim notifikasi internal ke `mtiwilayahsumsel@gmail.com`.
4. Kirim konfirmasi otomatis ke email pengirim.
5. Perbarui kedua status email menjadi `terkirim` atau `gagal` secara independen.
6. Jika salah satu email gagal, data kontak tidak dihapus.

### 4.4 Email internal

Subjek:

```text
Kontak baru dari website MTI Sumsel — {nama}
```

Isi:

- Nama lengkap.
- Email.
- Asal institusi.
- Waktu masuk.
- Tautan menuju `/admin/kontak-crm`.

### 4.5 Email konfirmasi pengirim

Subjek:

```text
Permintaan Anda telah diterima — MTI Sumatera Selatan
```

Isi singkat:

- Sapaan menggunakan nama pengirim.
- Konfirmasi bahwa permintaan telah diterima.
- Informasi bahwa tim MTI Sumsel akan menindaklanjuti.
- Informasi balasan diarahkan ke `mtiwilayahsumsel@gmail.com`.

### 4.6 Pemakaian paket Resend Free

Satu formulir mengonsumsi dua email. Berdasarkan batas paket Free yang berlaku saat desain dibuat (3.000 email/bulan dan 100 email/hari), kapasitas efektif adalah sekitar 1.500 formulir/bulan atau 50 formulir/hari. Aplikasi harus menangani respons limit Resend sebagai kegagalan email tanpa menghilangkan data CRM.

Integrasi menggunakan REST API Resend melalui `fetch` bawaan Node.js agar tidak menambah dependency baru.

---

## 5. Pengelolaan Kontak CRM di CMS

### 5.1 Navigasi

Tambahkan kelompok terpisah pada sidebar:

```text
HUBUNGAN PUBLIK
• Kontak CRM
```

Rute:

```text
/admin/kontak-crm
```

### 5.2 Daftar kontak

Daftar berisi:

- Nama.
- Email.
- Institusi.
- Waktu masuk.
- Status tindak lanjut.
- Status email internal.
- Status email konfirmasi.
- Tindakan.

Filter:

- Semua.
- Baru.
- Sudah Dihubungi.
- Selesai.

Pencarian:

- Nama.
- Email.
- Institusi.

### 5.3 Tindakan staf

- Buka email menggunakan tautan `mailto:` dengan alamat pengirim.
- Ubah status mengikuti urutan `Baru → Sudah Dihubungi → Selesai`.
- Boleh memilih status sebelumnya jika diperlukan.
- Menghapus kontak memerlukan modal konfirmasi yang menyebut nama kontak.

Setiap aksi menampilkan `AdminAlert` sukses atau gagal yang persisten.

---

## 6. Modal Pencarian Global

### 6.1 Interaksi dasar

Tombol kaca pembesar pada `Header.jsx` membuka modal pencarian global.

Perilaku:

- Fokus langsung berpindah ke kolom pencarian.
- `Escape` menutup modal.
- Klik backdrop menutup modal.
- `ArrowDown` dan `ArrowUp` memindahkan pilihan hasil.
- `Enter` membuka hasil terpilih.
- Fokus keyboard tidak keluar dari modal selama modal terbuka.
- Body tidak dapat scroll selama modal terbuka.

### 6.2 Saran awal

Saat query kosong, modal menampilkan saran halaman cepat:

- Beranda.
- Kegiatan MTI.
- Artikel & Opini.
- Sejarah MTI.
- Struktur Organisasi.
- Identitas Organisasi.
- Jurnal AKSES.

### 6.3 Sumber pencarian

Pencarian mencakup konten yang boleh dilihat publik:

1. **Halaman statis** — indeks konstan di kode.
2. **Kegiatan** — hanya `published = true`.
3. **Artikel & Opini** — hanya `visible = true`.
4. **Berita** — hanya `published = true`.
5. **Jurnal** — hanya `visible = true`.
6. **Media Video** — hanya item dengan `visible = true`, ditambah video utama jika tersedia.

Data CRM tidak pernah masuk indeks pencarian.

### 6.4 Endpoint pencarian

Route Handler:

```text
GET /api/search?q=<query>
```

Aturan:

- Query dipangkas, maksimal 100 karakter.
- Query kosong mengembalikan saran halaman statis saja.
- Pencarian konten dinamis baru dilakukan mulai 2 karakter.
- Maksimal 5 hasil per kelompok.
- Hanya memilih kolom yang diperlukan: judul, ringkasan, kategori, tanggal, href.
- Respons berbentuk kelompok hasil agar UI mudah dipahami staf dan pengunjung.
- Modal melakukan debounce 250 ms dan membatalkan request lama dengan `AbortController`.

### 6.5 Tujuan hasil

- Halaman statis mengarah ke rute masing-masing.
- Kegiatan mengarah ke `/kegiatan-mti` karena belum memiliki halaman detail.
- Artikel mengarah ke `/artikel/[id]`.
- Berita memakai nilai `href` yang sudah ada.
- Jurnal mengarah ke `/aksesnusantara` atau `downloadUrl` bila tersedia dan aman.
- Media memakai `href` item; URL eksternal dibuka sesuai target yang aman.

### 6.6 Empty, loading, dan error state

- Loading: `Mencari konten...`
- Tidak ditemukan: `Tidak ada hasil untuk “{query}”. Coba kata kunci lain.`
- Error jaringan: `Pencarian sedang tidak tersedia. Silakan coba kembali.`

---

## 7. Header Artikel & Opini yang Dapat Diedit

### 7.1 Penyimpanan

Tambahkan objek `artikelHero` pada singleton `public.beranda.data`:

```json
{
  "artikelHero": {
    "title": "Artikel & Opini Transportasi",
    "description": "Kajian mendalam, analisis kebijakan, dan perspektif kritis para pakar Masyarakat Transportasi Indonesia Wilayah Sumatera Selatan.",
    "image": ""
  }
}
```

Setup dan seed wajib idempotent serta tidak menimpa `artikelHero` yang sudah disimpan oleh staf.

### 7.2 CMS

Rute baru:

```text
/admin/header-artikel
```

Field editor:

- Judul hero.
- Deskripsi pengantar.
- Gambar latar hero (JPG, PNG, WebP; maksimal 5 MB).

Tindakan:

- `Pratinjau di Tab Baru` membuka `/artikel?preview=1`.
- `Simpan Header Artikel` langsung memperbarui halaman publik.
- Sukses menampilkan link `Lihat Halaman Publik`.

### 7.3 Halaman publik

`app/artikel/page.jsx` mengambil `artikelHero` dari CMS dengan fallback baku. Hero tetap mengikuti standar website:

- Tinggi 420px.
- Judul 42px desktop.
- Padding kiri dan kanan mengikuti `.wideShell`.
- Shadow overlay tetap sama dengan hero halaman lainnya.

---

## 8. Urutan Navigasi CMS

Kelompok **PENGELOLAAN HALAMAN** harus mengikuti urutan navbar publik:

```text
1. Beranda
2. Hero Halaman Kegiatan
3. Header Artikel & Opini
4. Tentang Kami
```

Kelompok **KONTEN BERKALA**:

```text
1. Kegiatan MTI
2. Artikel & Opini
3. Berita
4. Jurnal AKSES
5. Media Video
```

Kelompok **HUBUNGAN PUBLIK**:

```text
1. Kontak CRM
```

Menu aktif tetap diberi background biru dan indikator visual yang jelas.

---

## 9. Data Flow

### 9.1 CRM

```text
Browser
  → Server Action submitCrmContact(FormData)
  → validasi + honeypot + rate limit Supabase
  → insert crm_contacts
  → Resend internal notification
  → Resend sender confirmation
  → update email statuses
  → success/error response ke form
```

### 9.2 Pencarian

```text
Tombol Cari
  → SearchModal
  → debounce query 250 ms
  → GET /api/search?q=...
  → Supabase public-visible content + static page index
  → grouped JSON response
  → keyboard-accessible result list
```

### 9.3 Header Artikel

```text
CMS Header Artikel
  → saveArtikelHero(FormData)
  → public.beranda.data.artikelHero
  → revalidatePath('/artikel')
  → hero publik membaca data terbaru
```

---

## 10. Penanganan Error

### CRM

- Insert database gagal: tampilkan pesan gagal dan jangan mengirim email.
- Email internal gagal: simpan `internal_email_status = gagal`.
- Email konfirmasi gagal: simpan `confirmation_email_status = gagal`.
- Salah satu email gagal setelah insert: respons publik tetap menyatakan data diterima, tanpa menjanjikan konfirmasi email terkirim.
- API key Resend belum dikonfigurasi: data tetap disimpan, kedua status email `gagal`, error dicatat tanpa membocorkan API key.

### Pencarian

- Abort request bukan error pengguna.
- Error jaringan menampilkan pesan yang dapat dicoba ulang.
- URL eksternal divalidasi agar hanya protokol `http:` atau `https:` yang boleh dirender sebagai hasil.

### CMS

- Semua Server Action mengembalikan `{ success: true }` atau `{ error: string }`.
- Tidak boleh menampilkan notifikasi sukses sebelum hasil action diperiksa.

---

## 11. Keamanan

- `RESEND_API_KEY` dan service-role Supabase hanya tersedia di server.
- Semua data form dianggap tidak tepercaya dan di-escape saat dimasukkan ke HTML email.
- Email recipient konfirmasi hanya berasal dari alamat email yang sudah divalidasi.
- Endpoint pencarian tidak menggunakan service-role untuk data publik bila client server anon sudah cukup; RLS memastikan hanya konten tampil yang terbaca.
- CRM menggunakan service-role hanya setelah validasi dan rate limiting server.
- Tidak ada field CRM yang dimasukkan ke indeks pencarian publik.
- Tidak ada RBAC baru.

---

## 12. Verifikasi

### Contract tests

- Schema `crm_contacts` dan RLS.
- Validasi nama, email, institusi, honeypot, dan rate limit.
- Mapping respons Resend ke status `terkirim` atau `gagal`.
- Search index hanya mengembalikan konten publik.
- Batas maksimal 5 hasil per kelompok.
- `artikelHero` memiliki fallback dan tidak ditimpa setup ulang.

### Browser tests

- Tombol **Hubungi Kami** menggulir ke `#crm` dari beranda dan halaman lain.
- Form CRM sukses menampilkan feedback, menyimpan data, dan dapat dilihat di CMS.
- Modal search terbuka, fokus ke input, mendukung keyboard, dan menutup dengan Escape.
- Saran awal dan pencarian seluruh kelompok konten tampil benar.
- Editor Header Artikel menyimpan dan melakukan pratinjau di tab baru.
- Sidebar desktop dan mobile mengikuti urutan baru.
- Layout diperiksa pada 375px, 768px, 1280px.

### Build dan produksi

```text
seluruh scripts/verify-*.mjs
npm audit
npm run build
```

Setelah lolos, deploy ke VPS, jalankan schema idempotent, tambahkan environment Resend, build ulang, restart PM2, lalu uji domain HTTPS.

---

## 13. Di Luar Cakupan

- RBAC atau level pengguna berbeda.
- Pipeline sales lengkap, deal value, reminder, atau histori komunikasi kompleks.
- CAPTCHA pihak ketiga.
- Sinkronisasi kontak ke platform CRM eksternal.
- Broadcast newsletter massal.
- Halaman hasil pencarian terpisah; pencarian hanya menggunakan modal navbar.
