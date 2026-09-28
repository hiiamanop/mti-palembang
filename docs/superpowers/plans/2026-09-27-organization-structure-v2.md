# Struktur Organisasi MTI Sumsel Versi 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengganti struktur organisasi 24 jabatan lama menjadi 17 jabatan baru dengan satu input nama per jabatan, grid publik datar, dan migrasi pengosongan nama lama satu kali.

**Architecture:** Definisi tetap 17 jabatan hidup di `lib/organization-structure.js`; singleton Supabase menyimpan `{ version: 2, names }`. Migrasi terpisah mengosongkan nama lama hanya ketika versi belum 2, sementara action CMS selalu menyimpan key yang diizinkan dan publik merender lima kelompok sebagai grid kartu seragam.

**Tech Stack:** Next.js 16 App Router, React 19, Supabase PostgreSQL/JSONB/RLS, JavaScript.

**Spec:** `docs/superpowers/specs/2026-09-27-organization-structure-v2-design.md`

## Global Constraints

- Tepat 17 jabatan dan lima kelompok tetap.
- Satu nama per jabatan.
- Jabatan dan urutan tidak dapat diedit staf.
- Nama kosong dirender `—` dan kartu tetap terlihat.
- Semua nama lama dikosongkan; tidak ada mapping.
- Migrasi pengosongan hanya sekali melalui `version: 2`.
- Setup ulang tidak boleh menghapus nama versi 2.
- Tampilan publik berupa grid kartu datar dengan ukuran visual setara.

---

### Task 1: Ganti konfigurasi struktur tetap dan contract test

**Files:**
- Modify: `lib/organization-structure.js`
- Modify: `scripts/verify-organization-structure.mjs`

**Interfaces:**
- Produces: `ORGANIZATION_GROUPS` dengan group `direction`, `daily`, `organization`, `special`, `secretariat`.
- Produces: `ORGANIZATION_KEYS` sepanjang 17.

- [ ] Ubah verification agar mengharapkan lima kelompok, 17 key unik, role `Pembina`, role `Ketua`, dan fallback `—`.
- [ ] Jalankan verification dan pastikan gagal terhadap struktur lama.
- [ ] Ganti konfigurasi lama dengan 17 jabatan versi 2.
- [ ] Jalankan verification dan pastikan helper lulus.
- [ ] Commit: `feat: define MTI Sumsel organization structure v2`.

### Task 2: Tambah kontrak versi dan migrasi idempotent

**Files:**
- Modify: `data/struktur-organisasi.json`
- Create: `scripts/migrate-organization-v2.mjs`
- Modify: `scripts/verify-organization-structure.mjs`

**Interfaces:**
- Seed baru: `{ "version": 2, "names": {} }`.
- Migration: membaca env Supabase, menulis v2 hanya ketika singleton belum version 2.

- [ ] Perbarui test seed menjadi versi 2 dan tambahkan source assertions untuk migrasi.
- [ ] Jalankan test; expect fail.
- [ ] Ubah seed JSON.
- [ ] Buat migrasi yang memakai admin client: read singleton; skip jika version 2; update `{version:2,names:{}}` jika belum.
- [ ] Uji lokal dengan row lama, jalankan migrasi, isi satu nama v2, jalankan migrasi kembali, dan buktikan nama tetap ada.
- [ ] Commit: `feat: add one-time organization v2 migration`.

### Task 3: Perbarui getter dan save action

**Files:**
- Modify: `lib/cms.js`
- Modify: `app/admin/actions.js`

**Interfaces:**
- `getStrukturOrganisasi()` returns `{ version, names }`.
- `saveStrukturOrganisasi()` persists `{ version: 2, names }`.

- [ ] Tambahkan assertions bahwa version 2 dibaca/disimpan.
- [ ] Ubah getter agar malformed data tetap menghasilkan `{version:2,names:{}}`.
- [ ] Ubah action menyimpan version 2 dan merevalidasi `/admin/tentang-kami/struktur-organisasi`.
- [ ] Jalankan test.
- [ ] Commit: `feat: persist versioned organization v2 names`.

### Task 4: Ubah form CMS menjadi lima kelompok, 17 input

**Files:**
- Modify: `app/admin/struktur-organisasi/StrukturOrganisasiForm.jsx`
- Modify: `app/admin/tentang-kami/struktur-organisasi/page.jsx`

**Interfaces:**
- Consumes: `ORGANIZATION_GROUPS` v2 dan names map.
- Produces: 17 input tetap.

- [ ] Perbarui label kelompok CMS.
- [ ] Hapus badge lama.
- [ ] Pastikan satu input untuk setiap role dan grid responsif.
- [ ] Perbarui heading/deskripsi dari 24 menjadi 17 posisi.
- [ ] Jalankan test dan browser snapshot.
- [ ] Commit: `feat: update organization CMS for 17 fixed positions`.

### Task 5: Ganti halaman publik dengan grid kartu datar

**Files:**
- Modify: `app/struktur-organisasi/page.jsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: lima resolved groups.
- Produces: 17 `.orgFlatCard` di lima section.

- [ ] Ubah verification agar mencari lima kelompok dan flat grid class.
- [ ] Ganti hero copy dengan konteks MTI Sumsel, 17 posisi, 5 kelompok.
- [ ] Ganti intro strip dan markup section lama menjadi satu pola flat grid.
- [ ] Tambah CSS `.orgFlatGrid`, `.orgFlatCard`, role/name styling responsif.
- [ ] Pastikan sidebar/footer tetap dipertahankan.
- [ ] Jalankan browser test desktop/mobile.
- [ ] Commit: `feat: render organization v2 as grouped flat card grid`.

### Task 6: Verifikasi penuh dan deploy

**Files:**
- Run: seluruh `scripts/verify-*.mjs`, `npm audit`, `npm run build`.
- Deploy: VPS.

- [ ] Jalankan semua verifikasi lokal dan build.
- [ ] Push feature branch/main.
- [ ] Pull kode di VPS.
- [ ] Jalankan `scripts/migrate-organization-v2.mjs` dengan URL Supabase lokal VPS.
- [ ] Build dan restart PM2.
- [ ] Query singleton dan buktikan `{version:2,names:{}}` setelah migrasi awal.
- [ ] Verifikasi `/admin/tentang-kami/struktur-organisasi` dan `/struktur-organisasi` melalui browser.
