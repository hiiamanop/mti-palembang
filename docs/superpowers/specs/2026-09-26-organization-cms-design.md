# Struktur Organisasi CMS Design

## Goal

Preserve the current public `/struktur-organisasi` layout and fixed position structure while moving every person's name from hardcoded source code into a dedicated Supabase-backed CMS module.

## Scope

The four existing public sections remain:

1. Dewan Pembina
2. Majelis Pakar
3. Pengurus Harian
4. Bidang Teknis

Job titles, grouping, labels, badges, and ordering remain fixed in code. Admin users can edit only names. Every card remains visible when its name is empty and displays `—`.

## Fixed Structure Configuration

Create `lib/organization-structure.js` as the single source of truth for positions. Each position has a stable key and display metadata.

Example:

```js
{
  key: 'ketua-umum',
  role: 'Ketua Umum',
  badge: 'Ketua'
}
```

Groups:

### Dewan Pembina

- `ketua-dewan-pembina` — Ketua Dewan Pembina
- `anggota-dewan-pembina-1` — Anggota Dewan Pembina
- `anggota-dewan-pembina-2` — Anggota Dewan Pembina

### Majelis Pakar

- `ketua-majelis-pakar` — Ketua Majelis Pakar
- `anggota-majelis-pakar-1` — Anggota Majelis Pakar
- `anggota-majelis-pakar-2` — Anggota Majelis Pakar
- `anggota-majelis-pakar-3` — Anggota Majelis Pakar

### Pengurus Harian

- `ketua-umum` — Ketua Umum — badge `Ketua`
- `wakil-ketua-umum-1` — Wakil Ketua Umum I — badge `Wakil`
- `wakil-ketua-umum-2` — Wakil Ketua Umum II — badge `Wakil`
- `sekretaris-jenderal` — Sekretaris Jenderal — badge `Sekjen`
- `wakil-sekretaris-jenderal` — Wakil Sekretaris Jenderal — badge `Wakil Sekjen`
- `bendahara-umum` — Bendahara Umum — badge `Bendahara`
- `wakil-bendahara-umum` — Wakil Bendahara Umum — badge `Wakil Bendahara`

### Bidang Teknis

- `bidang-transportasi-jalan` — Transportasi Jalan
- `bidang-transportasi-kereta-api` — Transportasi Kereta Api
- `bidang-transportasi-laut` — Transportasi Laut
- `bidang-transportasi-udara` — Transportasi Udara
- `bidang-transportasi-perkotaan-tod` — Transportasi Perkotaan & TOD
- `bidang-keselamatan-transportasi` — Keselamatan Transportasi
- `bidang-logistik-supply-chain` — Logistik & Supply Chain
- `bidang-kebijakan-regulasi` — Kebijakan & Regulasi
- `bidang-transportasi-perdesaan-3t` — Transportasi Perdesaan & 3T
- `bidang-riset-inovasi-teknologi` — Riset, Inovasi & Teknologi

The CMS never accepts job titles, keys, badges, grouping, or ordering from user input.

## Database

Create a singleton table:

```sql
create table if not exists public.struktur_organisasi (
  id int primary key default 1,
  data jsonb not null,
  constraint struktur_organisasi_singleton check (id = 1)
);
```

Initial value:

```json
{
  "names": {}
}
```

All names begin empty. Existing hardcoded names are not migrated.

RLS:

- Public users may select the singleton row.
- Authenticated users may select and update it.
- Existing service-role behavior remains unchanged.

The setup process upserts the initial singleton only during first initialization. Re-running setup must not erase names entered through CMS.

## Data Access

Add `getStrukturOrganisasi()` to `lib/cms.js`. It returns:

```js
{
  names: {
    "ketua-umum": "",
    "sekretaris-jenderal": ""
  }
}
```

Missing or malformed `names` returns an empty object.

A pure helper maps fixed position definitions to names:

```js
resolveOrganizationGroup(group, names)
```

Each result contains the fixed metadata plus:

```js
name: names[position.key]?.trim() || '—'
```

## CMS

Add `/admin/struktur-organisasi` and a sidebar link labeled `Struktur Organisasi`.

The page loads the singleton and renders one form divided into four sections. Every fixed role receives one text input named by its stable key:

```text
Ketua Umum
[Nama lengkap __________________]
```

The admin cannot add, remove, reorder, or rename roles.

One button saves the complete names map:

```text
Simpan Struktur Organisasi
```

Server Action:

```js
saveStrukturOrganisasi(formData)
```

The action:

1. Verifies authentication with the existing `checkAuth()` helper.
2. Iterates only over known keys from `lib/organization-structure.js`.
3. Reads and trims each matching form value.
4. Ignores unknown submitted fields.
5. Updates the singleton JSON.
6. Revalidates `/struktur-organisasi`, `/admin`, and `/admin/struktur-organisasi`.
7. Returns `{ success: true }` or `{ error: message }`.

The dashboard adds a quick link to the new CMS page. No additional dashboard statistic is required because the number of roles is fixed.

## Public Page

`app/struktur-organisasi/page.jsx` becomes an async Server Component that fetches names and resolves the four fixed groups.

The current visual layout is preserved:

- Existing hero and page intro
- Dewan Pembina cards
- Majelis Pakar cards
- Pengurus Harian cards and badges
- Bidang Teknis numbered cards
- Existing sidebar and footer

Only the data source changes. Every name renders as:

```jsx
<strong>{position.name}</strong>
```

or, for Bidang Teknis:

```jsx
<small>{position.name}</small>
```

An unfilled role renders `—`; no card is hidden.

## Removal of Hardcoded Personal Data

Remove all existing personal-name arrays from `app/struktur-organisasi/page.jsx`:

- `leadership`
- `advisory`
- `experts`
- `divisions` head values

No current person's name may remain hardcoded in the repository after migration.

## Error Handling

- Unauthenticated saves redirect through existing admin auth handling.
- Empty names are valid and persist as empty strings.
- Unknown form keys are ignored.
- Supabase read errors fail the page using existing behavior.
- Supabase update errors appear in the admin form.
- Missing singleton data resolves to all `—` rather than breaking rendering.

## Verification

Verification must prove:

1. Setup creates the singleton table and row idempotently.
2. Re-running setup does not erase saved names.
3. All 24 fixed roles are rendered in the CMS.
4. CMS inputs cannot change role titles or order.
5. Saving trims names and ignores unknown fields.
6. Empty names display `—` publicly.
7. Filled names display in their correct fixed positions.
8. Every public card remains visible when empty.
9. No previous hardcoded person's name remains in source code.
10. Existing public layout remains structurally unchanged.
11. `npm run build` succeeds.

## Non-Goals

- Editing job titles
- Adding/removing/reordering roles
- Uploading member photographs
- Historical leadership periods
- Multiple organization structures
- Migrating existing hardcoded names
