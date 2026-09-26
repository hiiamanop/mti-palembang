# Kegiatan MTI Module Design

## Goal

Replace the three hardcoded activity pages with one CMS-managed Kegiatan MTI module. Berita remains a separate module with unchanged behavior.

## Scope

Create a standalone `kegiatan` table, admin CRUD screen, and public `/kegiatan-mti` page. The public page shows published activities as cards and provides year tabs derived automatically from activity dates.

The module does not include categories, locations, pagination, rich text, multi-image galleries, or detail routes.

## Data Model

Create `public.kegiatan` with:

```sql
id uuid primary key default gen_random_uuid(),
title text not null,
date date not null,
image text,
summary text,
published boolean default false,
created_at timestamptz default now()
```

RLS rules:

- Anonymous visitors can select only rows where `published = true`.
- Authenticated users can select, insert, update, and delete all rows.
- The existing service-role behavior remains unchanged.

`data/kegiatan.json` contains an empty list (`[]`). `scripts/setup.mjs` includes the table in its idempotent list seeding flow and never overwrites existing rows.

## CMS

Add `/admin/kegiatan` and a `Kegiatan MTI` link to the admin sidebar. The dashboard includes a new statistic showing total activities and number published.

The form contains only:

- Judul (required)
- Tanggal kegiatan using native `<input type="date">` (required)
- Gambar using the existing `ImageUpload` component
- Ringkasan

New activities are saved as drafts. The list supports edit, Draft/Publik toggle, and deletion with confirmation.

All write operations use authenticated Server Actions. Supabase errors are returned to and displayed by the form. Title and date are required, and date must be a valid ISO calendar date before insertion or update.

Server Actions:

- `addKegiatanItem(formData)`
- `saveKegiatanItem(id, formData)`
- `deleteKegiatanItem(id)`
- `toggleKegiatanPublished(id)`

After successful writes, revalidate `/kegiatan-mti`, `/admin`, and `/admin/kegiatan` as relevant.

## Data Access

Add `getKegiatan()` in `lib/cms.js`. It maps database rows to:

```js
{
  id,
  title,
  date,
  image,
  summary,
  published
}
```

Results are ordered by `date` descending, then `created_at` descending. RLS ensures anonymous public requests receive only published rows, while authenticated admin requests receive all rows.

## Public Page

Create `/kegiatan-mti` using:

- `app/kegiatan-mti/page.jsx` as the server page that fetches activity data.
- `app/kegiatan-mti/KegiatanClient.jsx` as the small client component that manages the selected year tab.

The page uses the shared `Header` and `Footer`. The header navigation item `Kegiatan MTI` becomes a direct link to `/kegiatan-mti` with no dropdown.

Year behavior:

- `Semua` is always shown and selected initially.
- Years are derived from valid activity dates.
- Years are unique and sorted newest to oldest.
- Selecting a year filters cards in memory with no additional request.
- Years with no published activities do not appear because the public query only returns published rows.

Each card displays:

- Image when present
- Date formatted in Indonesian
- Title
- Summary

Cards are not links. There is no detail page.

When no published activities exist, show:

```text
Belum ada kegiatan yang dipublikasikan.
```

## Legacy Routes and Content Removal

Replace the hardcoded content at these routes with permanent redirects to `/kegiatan-mti`:

```text
/dialog-kebijakan
/mti-dalam-berita
/kegiatan-mti/jalan-jalan
/mti-wilayah/jalan-jalan
```

Use Next.js `permanentRedirect('/kegiatan-mti')`. The large hardcoded article arrays and page markup in those route files are removed.

The routes under `/berita` and the Berita CMS module remain unchanged.

## Navigation

Update `lib/site-config.js` so the shared main navigation contains:

```js
{ label: 'Kegiatan MTI', href: '/kegiatan-mti' }
```

It has no children. Footer activity links should point to `/kegiatan-mti` rather than the removed category pages.

## Error Handling

- Unauthenticated writes redirect to `/admin/login` through existing auth checks.
- Missing title returns `Judul kegiatan wajib diisi.`
- Missing or invalid date returns `Tanggal kegiatan tidak valid.`
- Supabase insert, update, toggle, and delete errors are displayed in the admin interface.
- Public empty data renders an empty state rather than failing.
- Invalid historical rows are excluded from year generation and still cannot break rendering.

## Verification

Verification must prove:

1. Schema and setup are idempotent.
2. Empty Kegiatan seed succeeds.
3. An authenticated admin can create, edit, publish, unpublish, and delete an activity.
4. A draft does not appear publicly.
5. A published activity appears publicly.
6. Year tabs are derived automatically, unique, and sorted newest first.
7. Year selection filters cards correctly.
8. Image upload continues using the existing `media` bucket.
9. All four legacy URLs permanently redirect to `/kegiatan-mti`.
10. Berita behavior remains unchanged.
11. `npm run build` succeeds.

## Non-Goals

- Activity detail pages
- Activity categories
- Location field
- Pagination
- Rich-text editor
- Multi-image gallery
- Migration of current hardcoded activity content
