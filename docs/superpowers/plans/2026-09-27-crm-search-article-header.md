# CRM, Global Search, and Article Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengganti newsletter dengan CRM yang tersimpan di Supabase dan mengirim dua email Resend, mengaktifkan pencarian global navbar, serta menambahkan editor CMS untuk hero Artikel & Opini.

**Architecture:** Form CRM memakai Server Action publik yang memvalidasi input, menerapkan rate limit berbasis data Supabase, menyimpan kontak, lalu memanggil REST API Resend untuk notifikasi internal dan konfirmasi pengirim. Pencarian memakai Route Handler `/api/search` dan modal client di header. Konfigurasi hero artikel disimpan sebagai `beranda.data.artikelHero` agar tetap idempotent dan mengikuti pola singleton yang sudah ada.

**Tech Stack:** Next.js 16 App Router, React 19, Supabase/PostgreSQL/RLS, Resend REST API via native `fetch`, Vanilla CSS.

**Spec:** `docs/superpowers/specs/2026-09-27-crm-search-article-header-design.md`

## Global Constraints
- Tidak menambah dependency baru untuk email atau pencarian.
- CRM menyimpan data sebelum mengirim email; kegagalan Resend tidak boleh menghapus kontak.
- `RESEND_API_KEY` hanya server-side.
- Form CRM: nama, email, institusi; honeypot dan rate limit wajib aktif.
- Maksimal 5 hasil per kelompok pencarian dan hanya konten publik.
- Urutan menu Pengelolaan Halaman: Beranda, Hero Kegiatan, Header Artikel, Tentang Kami.
- Setup database wajib idempotent dan tidak boleh menimpa konten CMS.

---

### Task 1: CRM Schema, Validation, and Resend Service

**Files:**
- Modify: `supabase/schema.sql`
- Create: `lib/crm.js`
- Create: `lib/resend.js`
- Create: `scripts/verify-crm.mjs`
- Modify: `.env.example`

**Interfaces:**
- Produces: `validateCrmInput(input)`, `hashClientIp(ip)`, `sendCrmEmails(contact)`, table `public.crm_contacts`.
- Email status values: `pending | terkirim | gagal`; workflow status: `baru | sudah_dihubungi | selesai`.

- [ ] Write `scripts/verify-crm.mjs` asserting schema columns/policies, validation messages, and required environment keys.
- [ ] Run `node scripts/verify-crm.mjs`; expect failure because modules/schema do not exist.
- [ ] Add idempotent `crm_contacts` table, constraints, indexes, RLS, authenticated admin policies, and no public policy.
- [ ] Implement input validation and salted SHA-256 IP hashing in `lib/crm.js`.
- [ ] Implement two independent Resend REST calls in `lib/resend.js`, HTML-escaping every contact value; return separate internal and confirmation statuses.
- [ ] Add Resend/CRM variables to `.env.example`.
- [ ] Run `node scripts/verify-crm.mjs`; expect pass.
- [ ] Commit: `feat: add CRM schema validation and Resend email service`.

### Task 2: Public CRM Form and Server Action

**Files:**
- Create: `app/crm-actions.js`
- Replace: `app/components/shared/Newsletter.jsx` with `app/components/shared/CrmContact.jsx`
- Modify: `app/HomeClient.jsx`
- Modify: `app/globals.css`
- Modify: `app/components/layout/Header.jsx`
- Create: `scripts/verify-crm-form.mjs`

**Interfaces:**
- Produces: `submitCrmContact(formData)` returning `{success, emailPending?, error?, fieldErrors?}`.
- Public anchor: `/#crm`.

- [ ] Write failing contract checks for `#crm`, three visible inputs, honeypot, action response handling, and button copy `Hubungi Kami`.
- [ ] Implement Server Action: validate, inspect `headers()`, hash IP, query one-hour limits, insert with service role, send both emails, update statuses.
- [ ] Implement accessible CRM form with loading/success/error states and no false-success state.
- [ ] Replace Newsletter import/render in `HomeClient`; update desktop/mobile masthead CTA to `Hubungi Kami` → `/#crm`.
- [ ] Preserve existing CRM section visual foundation but change copy and make three fields responsive.
- [ ] Run contract checks and build.
- [ ] Commit: `feat: replace newsletter with CRM contact form`.

### Task 3: CRM Admin List and Status Workflow

**Files:**
- Modify: `lib/cms.js`
- Modify: `app/admin/actions.js`
- Create: `app/admin/kontak-crm/page.jsx`
- Create: `app/admin/kontak-crm/CrmContactsTable.jsx`
- Modify: `app/admin/AdminSidebar.jsx`
- Create: `scripts/verify-crm-admin.mjs`

**Interfaces:**
- Produces: `getCrmContacts()`, `updateCrmContactStatus(id,status)`, `deleteCrmContact(id)`.

- [ ] Write failing checks for CRM route, sidebar group, statuses, search/filter controls, and safe deletion.
- [ ] Add CMS data mapper/query and authenticated actions with whitelist status validation.
- [ ] Build responsive admin table with search, status filters, email-status badges, `mailto:` action, status selector, and shared delete modal.
- [ ] Add `HUBUNGAN PUBLIK → Kontak CRM` after content groups.
- [ ] Run contract checks and build.
- [ ] Commit: `feat: add CRM contact management to admin`.

### Task 4: Global Search API

**Files:**
- Create: `lib/search.js`
- Create: `app/api/search/route.js`
- Create: `scripts/verify-global-search.mjs`

**Interfaces:**
- Produces: `GET /api/search?q=...` returning `{groups:[{key,label,items}]}` with maximum five items per group.

- [ ] Write failing tests for query normalization, static suggestions, grouping, limits, safe URLs, and public-only filters.
- [ ] Define static page index and pure helpers in `lib/search.js`.
- [ ] Implement dynamic route using parallel Supabase reads for kegiatan, artikel, berita, jurnal, and media; select minimal fields and filter visible content.
- [ ] Return static suggestions for empty/one-character query; dynamic content from two characters.
- [ ] Run tests and route smoke test.
- [ ] Commit: `feat: add grouped global search API`.

### Task 5: Search Modal in Header

**Files:**
- Create: `app/components/layout/SearchModal.jsx`
- Modify: `app/components/layout/Header.jsx`
- Modify: `app/globals.css`
- Create: `scripts/verify-search-modal.mjs`

**Interfaces:**
- Consumes: `/api/search?q=`.
- Produces: keyboard-accessible modal opened by existing search button.

- [ ] Write failing checks for dialog semantics, debounce, AbortController, Escape, arrow navigation, Enter, backdrop close, and focus restoration.
- [ ] Implement modal with 250ms debounce, grouped results, initial suggestions, loading/empty/error states, and safe external link behavior.
- [ ] Wire desktop search button and ensure modal works independently of mobile menu.
- [ ] Add responsive modal styling at 375px and desktop.
- [ ] Run checks and browser keyboard flow.
- [ ] Commit: `feat: activate global search modal in site header`.

### Task 6: Editable Article Hero and CMS Ordering

**Files:**
- Modify: `data/beranda.json`
- Modify: `lib/cms.js`
- Modify: `app/admin/actions.js`
- Create: `app/admin/header-artikel/page.jsx`
- Create: `app/admin/header-artikel/ArtikelHeroForm.jsx`
- Modify: `app/artikel/page.jsx`
- Create: `app/artikel/ArtikelHero.jsx`
- Modify: `app/admin/AdminSidebar.jsx`
- Modify: `scripts/verify-clean-seed.mjs`
- Create: `scripts/verify-article-hero.mjs`

**Interfaces:**
- Produces: `getArtikelHero()`, `saveArtikelHero(formData)`, preview key `artikelHero`.

- [ ] Write failing checks for seed contract, CMS route, sidebar order, fallback hero, and preview wiring.
- [ ] Add `artikelHero` seed and getter without changing singleton overwrite behavior.
- [ ] Implement authenticated action validating title/description and revalidating `/artikel`.
- [ ] Build CMS editor with image upload, preview tab, feedback, and unsaved changes guard.
- [ ] Extract article hero client wrapper that reads preview session data while preserving 420px/42px standard.
- [ ] Reorder CMS page-management items: Beranda, Hero Kegiatan, Header Artikel, Tentang Kami.
- [ ] Run checks and build.
- [ ] Commit: `feat: add editable article hero and align CMS page order`.

### Task 7: Full Verification, Production Schema, Resend Configuration, and Deploy

**Files:**
- Run all `scripts/verify-*.mjs`
- Run `npm audit` and `npm run build`
- Deploy repository and idempotent schema to VPS.

- [ ] Run all verification scripts, audit, build, and `git diff --check`.
- [ ] Browser-test CRM success/error UI, search modal keyboard flow, CMS CRM workflow, article hero preview, mobile sidebar, and desktop layout.
- [ ] Push feature branch and main using non-destructive integration.
- [ ] Pull/build/restart PM2 on VPS and run `scripts/setup.mjs` with local Supabase URL so schema is applied without overwriting content.
- [ ] Add production Resend variables only after user provides API key and DNS domain is verified.
- [ ] Verify `https://mti-sumsel.or.id`, `/#crm`, `/api/search`, `/artikel`, and `/admin/kontak-crm`.
