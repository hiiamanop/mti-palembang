# Spesifikasi Desain: Struktur Organisasi MTI Sumsel Versi 2

**Tanggal:** 27 September 2026  
**Status:** Disetujui secara konseptual  
**Target:** Halaman publik `/struktur-organisasi` dan CMS `/admin/tentang-kami/struktur-organisasi`

## 1. Tujuan

Mengganti struktur organisasi lama yang berisi 24 jabatan menjadi struktur baru berisi 17 jabatan tetap. Setiap jabatan hanya memiliki satu kolom nama, tidak dapat ditambah, dihapus, diubah, atau diurutkan ulang oleh staf CMS.

Semua nama lama dikosongkan satu kali ketika struktur versi 2 diterapkan. Setelah migrasi versi 2 selesai, deployment atau setup berikutnya tidak boleh menghapus nama yang sudah diisi staf.

## 2. Struktur Tetap

Konfigurasi tunggal tetap berada di `lib/organization-structure.js`.

### Pengarah

1. `pembina` — Pembina
2. `penasehat` — Penasehat

### Pengurus Harian

3. `ketua` — Ketua
4. `sekretaris` — Sekretaris
5. `wakil-sekretaris` — Wakil Sekretaris
6. `bendahara` — Bendahara
7. `wakil-bendahara` — Wakil Bendahara

### Bidang Organisasi

8. `bidang-pengembangan-wilayah-keanggotaan` — Pengembangan Wilayah dan Keanggotaan
9. `bidang-kerja-sama-kemitraan` — Kerja Sama / Kemitraan Antar Lembaga
10. `bidang-komunikasi-publik-humas` — Komunikasi Publik & Humas
11. `bidang-pendidikan-profesi` — Pendidikan Profesi
12. `bidang-pengembangan-insan-muda` — Pengembangan Insan Muda

### Bidang Khusus

13. `bidang-khusus-transportasi-perkeretaapian` — Transportasi Perkeretaapian
14. `bidang-khusus-jalan-raya` — Jalan Raya
15. `bidang-khusus-udara` — Udara
16. `bidang-khusus-laut-sdp` — Laut dan SDP

### Sekretariat

17. `sekretariat` — Sekretariat

## 3. Kontrak Data

Singleton `public.struktur_organisasi` tetap digunakan. Struktur JSON versi 2:

```json
{
  "version": 2,
  "names": {
    "pembina": "",
    "penasehat": ""
  }
}
```

`names` hanya boleh berisi key yang terdaftar pada konfigurasi 17 jabatan. Nama kosong valid dan dirender sebagai `—`.

## 4. Migrasi Satu Kali

Migrasi dilakukan secara eksplisit dan idempotent:

1. Baca singleton `id = 1`.
2. Jika `data.version` belum bernilai `2`, tulis `{ version: 2, names: {} }`.
3. Jika `data.version` sudah `2`, jangan mengubah apa pun.
4. Setup reguler tetap menggunakan `seedSingletonIfMissing`, sehingga tidak menimpa data CMS.

Migrasi tidak memetakan atau mempertahankan nama dari struktur lama sesuai keputusan pengguna.

## 5. CMS

Form CMS menampilkan lima kartu kelompok sesuai urutan struktur:

1. Pengarah
2. Pengurus Harian
3. Bidang Organisasi
4. Bidang Khusus
5. Sekretariat

Setiap jabatan memiliki tepat satu input nama lengkap. Label jabatan berasal dari konfigurasi, bukan dari data atau FormData pengguna.

Server Action:

- Mengiterasi hanya `ORGANIZATION_KEYS` versi 2.
- Memangkas whitespace.
- Menyimpan `{ version: 2, names }`.
- Mengabaikan field asing.
- Mengembalikan `{ success: true }` atau `{ error: string }`.
- Merevalidasi halaman publik dan CMS.

## 6. Tampilan Publik

Halaman publik menggunakan grid kartu datar, bukan bagan dan bukan garis hierarki.

Setiap kelompok memiliki judul bagian. Semua kartu mempunyai gaya visual setara:

```text
Nama Jabatan
Nama Pengurus / —
```

Aturan:

- Semua 17 kartu selalu terlihat.
- Kartu tidak diberi nomor bidang.
- Kartu tidak memakai badge jabatan.
- Tidak ada kartu ketua yang dibuat lebih besar dari kartu lain.
- Grid responsif memakai minimal lebar kartu yang sama dan menyusun ulang otomatis pada ponsel.

Hero halaman diperbarui agar tidak menyebut Kongres Nasional Jakarta atau struktur pusat. Ringkasan hero menggunakan konteks MTI Sumatera Selatan dan angka 17 posisi / 5 kelompok.

## 7. Penghapusan Struktur Lama

Hapus seluruh key lama dari konfigurasi:

- Dewan Pembina lama beserta anggota bernomor.
- Majelis Pakar lama beserta anggota bernomor.
- Ketua Umum, wakil ketua umum, sekretaris jenderal, dan bendahara umum.
- Sepuluh Bidang Teknis lama.

Tidak ada nama personal lama yang ditulis ke key baru.

## 8. Verifikasi

Verifikasi otomatis harus membuktikan:

1. Kelompok tepat: `direction`, `daily`, `organization`, `special`, `secretariat`.
2. Jumlah jabatan tepat 17 dan semua key unik.
3. Nama kosong menjadi `—`.
4. Form CMS memakai 17 key tetap.
5. Save action menyimpan `version: 2`.
6. Migrasi mengosongkan struktur lama hanya jika versi belum 2.
7. Migrasi ulang tidak menghapus nama versi 2.
8. Halaman publik menampilkan lima judul kelompok dan grid kartu datar.
9. Tidak ada key struktur lama yang tersisa dalam konfigurasi atau halaman publik.
10. Semua skrip verifikasi dan `npm run build` berhasil.

## 9. Deployment

1. Jalankan verifikasi lokal dan build.
2. Push ke branch fitur dan `main` secara non-destruktif.
3. Deploy kode ke VPS.
4. Jalankan migrasi versi 2 satu kali pada database VPS.
5. Build dan restart PM2.
6. Verifikasi CMS menampilkan 17 input kosong dan publik menampilkan 17 kartu bertanda `—`.

## 10. Di Luar Cakupan

- Banyak nama per jabatan.
- Foto pengurus.
- Penyuntingan judul jabatan.
- Penambahan/penghapusan/reordering jabatan dari CMS.
- Bagan dengan garis hierarki.
- Migrasi nama struktur lama.
