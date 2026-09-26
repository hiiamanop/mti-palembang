# Kegiatan MTI Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone CMS-managed Kegiatan MTI module with one public year-filtered page while preserving the existing Berita module.

**Architecture:** A new `public.kegiatan` table stores activities independently from Berita. Server Components fetch rows through the existing Supabase SSR client, a small client component filters published cards by year, and authenticated Server Actions provide admin CRUD. The four legacy activity URLs become permanent redirects to `/kegiatan-mti`.

**Tech Stack:** Next.js 16 App Router, React 19, Supabase PostgreSQL/Auth/Storage/RLS, JavaScript, native `<input type="date">`

**Spec:** `docs/superpowers/specs/2026-09-26-kegiatan-mti-module-design.md`

## Global Constraints

- Berita remains a separate module with unchanged behavior.
- Kegiatan has only title, date, image, summary, published, and system fields.
- No activity detail page, category, location, pagination, rich-text editor, or gallery.
- New activities are drafts by default.
- Public users can read only published activities.
- Year tabs are derived from published activity dates and sorted newest first.
- Current hardcoded content is not migrated.
- Reuse the existing `ImageUpload` component and `media` Storage bucket.
- Keep all database setup operations idempotent.

## File Structure

- Modify: `supabase/schema.sql` — add `kegiatan` table, RLS, and policies.
- Create: `data/kegiatan.json` — empty list seed.
- Modify: `scripts/setup.mjs` — include Kegiatan in setup.
- Modify: `scripts/verify-clean-seed.mjs` — include Kegiatan in the empty-seed contract.
- Create: `lib/kegiatan.js` — pure date validation, year derivation, filtering, and formatting helpers.
- Create: `scripts/verify-kegiatan.mjs` — runnable assertions for Kegiatan helper behavior and route contracts.
- Modify: `lib/cms.js` — add `getKegiatan()`.
- Modify: `app/admin/actions.js` — add authenticated Kegiatan CRUD actions.
- Create: `app/admin/kegiatan/page.jsx` — Kegiatan admin server page.
- Create: `app/admin/kegiatan/KegiatanForm.jsx` — Kegiatan admin form/list UI.
- Modify: `app/admin/layout.jsx` — add Kegiatan sidebar link.
- Modify: `app/admin/page.jsx` — add Kegiatan dashboard count and quick link.
- Create: `app/kegiatan-mti/page.jsx` — public Kegiatan server page.
- Create: `app/kegiatan-mti/KegiatanClient.jsx` — year tabs and activity cards.
- Modify: `app/globals.css` — public Kegiatan layout and card styles.
- Modify: `lib/site-config.js` — direct Kegiatan navigation/footer links.
- Rewrite: `app/dialog-kebijakan/page.jsx` — permanent redirect.
- Rewrite: `app/mti-dalam-berita/page.jsx` — permanent redirect.
- Rewrite: `app/kegiatan-mti/jalan-jalan/page.jsx` — permanent redirect.
- Rewrite: `app/mti-wilayah/jalan-jalan/page.jsx` — permanent redirect.

---

### Task 1: Add the Kegiatan Database Contract

**Files:**
- Modify: `scripts/verify-clean-seed.mjs`
- Create: `data/kegiatan.json`
- Modify: `supabase/schema.sql`
- Modify: `scripts/setup.mjs`

**Interfaces:**
- Produces: `public.kegiatan(id, title, date, image, summary, published, created_at)`.
- Produces: anonymous published-only reads and authenticated full CRUD.
- Produces: an empty, idempotent `data/kegiatan.json` seed.

- [ ] **Step 1: Extend the clean-seed assertion before creating the seed**

Change the list in `scripts/verify-clean-seed.mjs` from:

```js
for (const name of ['berita', 'jurnal', 'artikel']) {
```

to:

```js
for (const name of ['berita', 'jurnal', 'artikel', 'kegiatan']) {
```

- [ ] **Step 2: Run the check and verify the missing seed fails**

Run:

```bash
node scripts/verify-clean-seed.mjs
```

Expected: FAIL because `data/kegiatan.json` does not exist.

- [ ] **Step 3: Create the empty seed**

Create `data/kegiatan.json`:

```json
[]
```

- [ ] **Step 4: Add the idempotent table and RLS configuration**

Add after `public.artikel` in `supabase/schema.sql`:

```sql
create table if not exists public.kegiatan (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  image text,
  summary text,
  published boolean default false,
  created_at timestamptz default now()
);
```

Enable RLS:

```sql
alter table public.kegiatan enable row level security;
```

Add the public read policy:

```sql
drop policy if exists "kegiatan public read" on public.kegiatan;
create policy "kegiatan public read" on public.kegiatan
  for select using (published = true);
```

Add the admin policy:

```sql
drop policy if exists "kegiatan admin all" on public.kegiatan;
create policy "kegiatan admin all" on public.kegiatan
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
```

- [ ] **Step 5: Add Kegiatan to setup seeding**

In `seed()` in `scripts/setup.mjs`, add:

```js
  await seedList('kegiatan', (i) => ({
    title: i.title,
    date: i.date,
    image: i.image ?? '',
    summary: i.summary ?? '',
    published: i.published ?? false
  }), 'kegiatan.json');
```

Place it after Berita and before Jurnal.

- [ ] **Step 6: Verify the seed contract and apply schema twice**

Run:

```bash
node scripts/verify-clean-seed.mjs
node --env-file=.env.local scripts/setup.mjs
node --env-file=.env.local scripts/setup.mjs
```

Expected both setup runs to succeed; each reports `kegiatan: kosong`.

- [ ] **Step 7: Verify table and policies in local PostgreSQL**

Run:

```bash
node --env-file=.env.local --input-type=module <<'NODE'
import assert from 'node:assert/strict';
import pg from 'pg';
const db = new pg.Client({ connectionString: process.env.SUPABASE_DB_URL });
await db.connect();
const { rows: [table] } = await db.query(`
  select count(*)::int count
  from information_schema.tables
  where table_schema = 'public' and table_name = 'kegiatan'
`);
assert.equal(table.count, 1);
const { rows: policies } = await db.query(`
  select policyname from pg_policies
  where schemaname = 'public' and tablename = 'kegiatan'
  order by policyname
`);
assert.deepEqual(policies.map((row) => row.policyname), ['kegiatan admin all', 'kegiatan public read']);
await db.end();
console.log('Kegiatan schema verified.');
NODE
```

Expected: `Kegiatan schema verified.`

- [ ] **Step 8: Commit the database contract**

```bash
git add data/kegiatan.json scripts/setup.mjs scripts/verify-clean-seed.mjs supabase/schema.sql
git commit -m "feat: add Kegiatan MTI database schema"
```

---

### Task 2: Add Testable Kegiatan Date and Year Logic

**Files:**
- Create: `lib/kegiatan.js`
- Create: `scripts/verify-kegiatan.mjs`

**Interfaces:**
- Produces: `isValidISODate(value): boolean`.
- Produces: `getKegiatanYears(items): number[]`.
- Produces: `filterKegiatanByYear(items, selectedYear): object[]`.
- Produces: `formatKegiatanDate(value): string`.

- [ ] **Step 1: Write the failing helper verification script**

Create `scripts/verify-kegiatan.mjs`:

```js
import assert from 'node:assert/strict';
import {
  filterKegiatanByYear,
  formatKegiatanDate,
  getKegiatanYears,
  isValidISODate
} from '../lib/kegiatan.js';

assert.equal(isValidISODate('2026-02-28'), true);
assert.equal(isValidISODate('2026-02-30'), false);
assert.equal(isValidISODate('26-02-28'), false);
assert.equal(isValidISODate(''), false);

const items = [
  { id: 'a', date: '2025-01-01' },
  { id: 'b', date: '2026-09-20' },
  { id: 'c', date: '2026-01-10' },
  { id: 'd', date: 'invalid' }
];
assert.deepEqual(getKegiatanYears(items), [2026, 2025]);
assert.deepEqual(filterKegiatanByYear(items, 'Semua'), items);
assert.deepEqual(filterKegiatanByYear(items, 2026).map((item) => item.id), ['b', 'c']);
assert.equal(formatKegiatanDate('2026-09-20'), '20 September 2026');
assert.equal(formatKegiatanDate('invalid'), '');

console.log('Kegiatan date and year helpers verified.');
```

- [ ] **Step 2: Run it and verify the missing module fails**

Run:

```bash
node scripts/verify-kegiatan.mjs
```

Expected: FAIL with module-not-found for `lib/kegiatan.js`.

- [ ] **Step 3: Implement the minimum pure helpers**

Create `lib/kegiatan.js`:

```js
export function isValidISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

export function getKegiatanYears(items) {
  return [...new Set(
    items
      .map((item) => isValidISODate(item.date) ? Number(item.date.slice(0, 4)) : null)
      .filter(Boolean)
  )].sort((a, b) => b - a);
}

export function filterKegiatanByYear(items, selectedYear) {
  if (selectedYear === 'Semua') return items;
  return items.filter(
    (item) => isValidISODate(item.date) && Number(item.date.slice(0, 4)) === selectedYear
  );
}

export function formatKegiatanDate(value) {
  if (!isValidISODate(value)) return '';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(`${value}T00:00:00Z`));
}
```

- [ ] **Step 4: Run the helper verification**

Run:

```bash
node scripts/verify-kegiatan.mjs
```

Expected: PASS and print `Kegiatan date and year helpers verified.`

- [ ] **Step 5: Commit the pure logic**

```bash
git add lib/kegiatan.js scripts/verify-kegiatan.mjs
git commit -m "feat: add Kegiatan date and year helpers"
```

---

### Task 3: Add Kegiatan Data Access and Authenticated Server Actions

**Files:**
- Modify: `lib/cms.js`
- Modify: `app/admin/actions.js`
- Modify: `scripts/verify-kegiatan.mjs`

**Interfaces:**
- Produces: `getKegiatan(): Promise<Kegiatan[]>` ordered newest first.
- Produces: `addKegiatanItem`, `saveKegiatanItem`, `deleteKegiatanItem`, and `toggleKegiatanPublished` returning `{ error?: string, success?: true }`.

- [ ] **Step 1: Extend the verification script with source contracts**

Append to `scripts/verify-kegiatan.mjs`:

```js
import { readFile } from 'node:fs/promises';

const cmsSource = await readFile(new URL('../lib/cms.js', import.meta.url), 'utf8');
assert.match(cmsSource, /export async function getKegiatan\(\)/);
assert.match(cmsSource, /\.from\('kegiatan'\)/);
assert.match(cmsSource, /\.order\('date', \{ ascending: false \}\)/);

const actionsSource = await readFile(new URL('../app/admin/actions.js', import.meta.url), 'utf8');
for (const name of [
  'addKegiatanItem',
  'saveKegiatanItem',
  'deleteKegiatanItem',
  'toggleKegiatanPublished'
]) {
  assert.equal(actionsSource.includes(`export async function ${name}`), true, `${name} missing`);
}
```

- [ ] **Step 2: Run it and verify the missing contracts fail**

Run:

```bash
node scripts/verify-kegiatan.mjs
```

Expected: FAIL because `getKegiatan()` does not exist.

- [ ] **Step 3: Add Kegiatan row mapping and getter**

In `lib/cms.js`, add:

```js
function rowToKegiatan(row) {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    image: row.image ?? '',
    summary: row.summary ?? '',
    published: row.published
  };
}

export async function getKegiatan() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('kegiatan')
    .select('*')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToKegiatan);
}
```

- [ ] **Step 4: Add shared input validation inside admin actions**

Import the date helper in `app/admin/actions.js`:

```js
import { isValidISODate } from '../../lib/kegiatan';
```

Add:

```js
function kegiatanInput(formData) {
  const title = String(formData.get('title') || '').trim();
  const date = String(formData.get('date') || '');
  if (!title) return { error: 'Judul kegiatan wajib diisi.' };
  if (!isValidISODate(date)) return { error: 'Tanggal kegiatan tidak valid.' };
  return {
    row: {
      title,
      date,
      image: String(formData.get('image') || '').trim(),
      summary: String(formData.get('summary') || '').trim()
    }
  };
}

function revalidateKegiatan() {
  revalidatePath('/kegiatan-mti');
  revalidatePath('/admin');
  revalidatePath('/admin/kegiatan');
}
```

- [ ] **Step 5: Add the four authenticated actions**

Add to `app/admin/actions.js`:

```js
export async function addKegiatanItem(formData) {
  const supabase = await checkAuth();
  const input = kegiatanInput(formData);
  if (input.error) return input;
  const { error } = await supabase.from('kegiatan').insert({
    ...input.row,
    published: false
  });
  if (error) return { error: error.message };
  revalidateKegiatan();
  return { success: true };
}

export async function saveKegiatanItem(id, formData) {
  const supabase = await checkAuth();
  const input = kegiatanInput(formData);
  if (input.error) return input;
  const { error } = await supabase.from('kegiatan').update(input.row).eq('id', id);
  if (error) return { error: error.message };
  revalidateKegiatan();
  return { success: true };
}

export async function deleteKegiatanItem(id) {
  const supabase = await checkAuth();
  const { error } = await supabase.from('kegiatan').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidateKegiatan();
  return { success: true };
}

export async function toggleKegiatanPublished(id) {
  const supabase = await checkAuth();
  const { data, error: readError } = await supabase
    .from('kegiatan')
    .select('published')
    .eq('id', id)
    .single();
  if (readError) return { error: readError.message };
  const { error } = await supabase
    .from('kegiatan')
    .update({ published: !data.published })
    .eq('id', id);
  if (error) return { error: error.message };
  revalidateKegiatan();
  return { success: true };
}
```

- [ ] **Step 6: Run helper/source verification and build**

Run:

```bash
node scripts/verify-kegiatan.mjs
npm run build
```

Expected: both exit 0.

- [ ] **Step 7: Commit data access and actions**

```bash
git add lib/cms.js app/admin/actions.js scripts/verify-kegiatan.mjs
git commit -m "feat: add Kegiatan data access and actions"
```

---

### Task 4: Build the Kegiatan Admin Module

**Files:**
- Create: `app/admin/kegiatan/page.jsx`
- Create: `app/admin/kegiatan/KegiatanForm.jsx`
- Modify: `app/admin/layout.jsx`
- Modify: `app/admin/page.jsx`

**Interfaces:**
- Consumes: `getKegiatan()` and the four Task 3 actions.
- Produces: `/admin/kegiatan` CRUD UI and dashboard/sidebar links.

- [ ] **Step 1: Add failing admin-route assertions**

Append to `scripts/verify-kegiatan.mjs`:

```js
for (const path of [
  '../app/admin/kegiatan/page.jsx',
  '../app/admin/kegiatan/KegiatanForm.jsx'
]) {
  await readFile(new URL(path, import.meta.url), 'utf8');
}
```

Run:

```bash
node scripts/verify-kegiatan.mjs
```

Expected: FAIL because the admin files do not exist.

- [ ] **Step 2: Create the admin server page**

Create `app/admin/kegiatan/page.jsx`:

```jsx
import { getKegiatan } from '../../../lib/cms';
import KegiatanForm from './KegiatanForm';

export const metadata = { title: 'Kegiatan MTI - MTI CMS' };

export default async function AdminKegiatanPage() {
  const kegiatan = await getKegiatan();
  return (
    <div>
      <div className="adminPageHeader">
        <div>
          <h1>Kegiatan MTI</h1>
          <p>Kelola daftar kegiatan berdasarkan tanggal</p>
        </div>
      </div>
      <KegiatanForm kegiatan={kegiatan} />
    </div>
  );
}
```

- [ ] **Step 3: Create the minimal client CRUD UI**

Create `app/admin/kegiatan/KegiatanForm.jsx` with:

- `useState(false)` for add form visibility.
- `useState(null)` for edited row ID.
- `useState('')` for status/error.
- `useTransition()` and `useRouter()`.
- `KegiatanFields` containing required title/date, `ImageUpload name="image"`, and summary textarea.
- Submit handlers that inspect action results, display `result.error`, close forms on success, and call `router.refresh()`.
- Toggle and delete handlers that display Supabase errors and refresh on success.
- A table with image, title, date, Draft/Publik status, Edit, and Hapus.

Use these exact action imports:

```js
import {
  addKegiatanItem,
  deleteKegiatanItem,
  saveKegiatanItem,
  toggleKegiatanPublished
} from '../actions';
```

Use this native date input:

```jsx
<input
  name="date"
  type="date"
  defaultValue={item?.date || ''}
  required
/>
```

Use the existing upload control:

```jsx
<ImageUpload name="image" defaultValue={item?.image || ''} />
```

- [ ] **Step 4: Add Kegiatan to the sidebar**

In `app/admin/layout.jsx`, insert after Berita:

```jsx
<Link href="/admin/kegiatan" className="adminNavItem">Kegiatan MTI</Link>
```

- [ ] **Step 5: Add Kegiatan dashboard data and links**

In `app/admin/page.jsx`:

1. Import `getKegiatan`.
2. Add it to the existing `Promise.all`.
3. Add this statistic after Berita:

```js
{
  label: 'Total Kegiatan',
  value: kegiatan.length,
  sub: `${kegiatan.filter((item) => item.published).length} Dipublikasi`,
  href: '/admin/kegiatan',
  color: '#2e6fd0'
}
```

4. Add this quick link after Kelola Berita:

```jsx
<Link href="/admin/kegiatan" className="adminBtn adminBtnSecondary">
  Kelola Kegiatan
</Link>
```

- [ ] **Step 6: Run verification and build**

Run:

```bash
node scripts/verify-kegiatan.mjs
npm run build
```

Expected: admin files exist and build exits 0.

- [ ] **Step 7: Commit the CMS module**

```bash
git add app/admin/kegiatan app/admin/layout.jsx app/admin/page.jsx scripts/verify-kegiatan.mjs
git commit -m "feat: add Kegiatan MTI admin module"
```

---

### Task 5: Build the Public Year-Tabbed Kegiatan Page

**Files:**
- Create: `app/kegiatan-mti/page.jsx`
- Create: `app/kegiatan-mti/KegiatanClient.jsx`
- Modify: `app/globals.css`
- Modify: `scripts/verify-kegiatan.mjs`

**Interfaces:**
- Consumes: `getKegiatan()`, `getKegiatanYears`, `filterKegiatanByYear`, and `formatKegiatanDate`.
- Produces: `/kegiatan-mti` with automatic year tabs and non-linked cards.

- [ ] **Step 1: Add failing public-route assertions**

Append to `scripts/verify-kegiatan.mjs`:

```js
for (const path of [
  '../app/kegiatan-mti/page.jsx',
  '../app/kegiatan-mti/KegiatanClient.jsx'
]) {
  await readFile(new URL(path, import.meta.url), 'utf8');
}
```

Run:

```bash
node scripts/verify-kegiatan.mjs
```

Expected: FAIL because the public files do not exist.

- [ ] **Step 2: Create the public server page**

Create `app/kegiatan-mti/page.jsx`:

```jsx
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { getKegiatan } from '../../lib/cms';
import KegiatanClient from './KegiatanClient';

export const metadata = {
  title: 'Kegiatan MTI | MTI SUMSEL',
  description: 'Daftar kegiatan Masyarakat Transportasi Indonesia Sumatera Selatan.'
};

export default async function KegiatanPage() {
  const kegiatan = await getKegiatan();
  return (
    <main className="kegiatanPage">
      <Header activeItem="Kegiatan MTI" />
      <section className="kegiatanHero">
        <div className="wideShell">
          <span>Kegiatan MTI</span>
          <h1>Kegiatan Masyarakat Transportasi Indonesia</h1>
          <p>Agenda dan aktivitas MTI Sumatera Selatan dari tahun ke tahun.</p>
        </div>
      </section>
      <KegiatanClient kegiatan={kegiatan} />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 3: Create the year-tab client component**

Create `app/kegiatan-mti/KegiatanClient.jsx`:

```jsx
'use client';

import { useMemo, useState } from 'react';
import {
  filterKegiatanByYear,
  formatKegiatanDate,
  getKegiatanYears
} from '../../lib/kegiatan';

export default function KegiatanClient({ kegiatan }) {
  const [selectedYear, setSelectedYear] = useState('Semua');
  const years = useMemo(() => getKegiatanYears(kegiatan), [kegiatan]);
  const visible = useMemo(
    () => filterKegiatanByYear(kegiatan, selectedYear),
    [kegiatan, selectedYear]
  );

  return (
    <section className="wideShell kegiatanContent">
      <div className="kegiatanTabs" role="tablist" aria-label="Filter kegiatan berdasarkan tahun">
        {['Semua', ...years].map((year) => (
          <button
            key={year}
            type="button"
            role="tab"
            aria-selected={selectedYear === year}
            className={selectedYear === year ? 'active' : ''}
            onClick={() => setSelectedYear(year)}
          >
            {year}
          </button>
        ))}
      </div>

      {visible.length ? (
        <div className="kegiatanGrid">
          {visible.map((item) => (
            <article className="kegiatanCard" key={item.id}>
              {item.image ? <img src={item.image} alt="" /> : null}
              <div>
                <time dateTime={item.date}>{formatKegiatanDate(item.date)}</time>
                <h2>{item.title}</h2>
                {item.summary ? <p>{item.summary}</p> : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="kegiatanEmpty">Belum ada kegiatan yang dipublikasikan.</p>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Add focused public-page styles**

Add to `app/globals.css`:

```css
.kegiatanHero {
  padding: 72px 0 56px;
  color: var(--white);
  background: linear-gradient(135deg, var(--blue), var(--sky));
}

.kegiatanHero span,
.kegiatanHero h1,
.kegiatanHero p {
  display: block;
  max-width: 760px;
  margin-inline: auto;
  text-align: center;
}

.kegiatanHero span {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.kegiatanHero h1 {
  margin-top: 12px;
  margin-bottom: 14px;
  font-size: clamp(32px, 5vw, 54px);
}

.kegiatanHero p { margin-bottom: 0; }
.kegiatanContent { padding-block: 48px 80px; }

.kegiatanTabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.kegiatanTabs button {
  padding: 9px 18px;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--text);
  background: var(--white);
}

.kegiatanTabs button.active {
  color: var(--white);
  border-color: var(--blue);
  background: var(--blue);
}

.kegiatanGrid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.kegiatanCard {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--white);
  box-shadow: var(--shadow);
}

.kegiatanCard > img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.kegiatanCard > div { padding: 22px; }
.kegiatanCard time { color: var(--sky); font-size: 12px; font-weight: 800; }
.kegiatanCard h2 { margin: 8px 0 10px; font-size: 20px; }
.kegiatanCard p { margin: 0; color: var(--text); line-height: 1.7; }
.kegiatanEmpty { padding: 64px 20px; text-align: center; color: var(--muted); }

@media (max-width: 900px) {
  .kegiatanGrid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 600px) {
  .kegiatanGrid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 5: Run helper verification and build**

Run:

```bash
node scripts/verify-kegiatan.mjs
npm run build
```

Expected: helper assertions pass and `/kegiatan-mti` appears in the route list.

- [ ] **Step 6: Commit the public page**

```bash
git add app/kegiatan-mti/page.jsx app/kegiatan-mti/KegiatanClient.jsx app/globals.css scripts/verify-kegiatan.mjs
git commit -m "feat: add year-filtered Kegiatan MTI page"
```

---

### Task 6: Replace Legacy Activity Pages and Navigation

**Files:**
- Rewrite: `app/dialog-kebijakan/page.jsx`
- Rewrite: `app/mti-dalam-berita/page.jsx`
- Rewrite: `app/kegiatan-mti/jalan-jalan/page.jsx`
- Rewrite: `app/mti-wilayah/jalan-jalan/page.jsx`
- Modify: `lib/site-config.js`
- Modify: `scripts/verify-kegiatan.mjs`

**Interfaces:**
- Produces: HTTP 308 redirects from all four legacy routes.
- Produces: direct header/footer links to `/kegiatan-mti` with no category dropdown.

- [ ] **Step 1: Add source assertions for redirect contracts and navigation**

Append to `scripts/verify-kegiatan.mjs`:

```js
for (const path of [
  '../app/dialog-kebijakan/page.jsx',
  '../app/mti-dalam-berita/page.jsx',
  '../app/kegiatan-mti/jalan-jalan/page.jsx',
  '../app/mti-wilayah/jalan-jalan/page.jsx'
]) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  assert.match(source, /permanentRedirect\('\/kegiatan-mti'\)/);
}

const siteConfig = await readFile(new URL('../lib/site-config.js', import.meta.url), 'utf8');
assert.match(siteConfig, /label: 'Kegiatan MTI', href: '\/kegiatan-mti'/);
assert.equal(siteConfig.includes("href: '/dialog-kebijakan'"), false);
assert.equal(siteConfig.includes("href: '/mti-dalam-berita'"), false);
assert.equal(siteConfig.includes("href: '/kegiatan-mti/jalan-jalan'"), false);
```

- [ ] **Step 2: Run and verify redirect assertions fail**

Run:

```bash
node scripts/verify-kegiatan.mjs
```

Expected: FAIL because legacy pages still contain hardcoded content.

- [ ] **Step 3: Replace each legacy page with the same permanent redirect**

Write this complete content to all four route files:

```jsx
import { permanentRedirect } from 'next/navigation';

export default function LegacyKegiatanPage() {
  permanentRedirect('/kegiatan-mti');
}
```

- [ ] **Step 4: Make the shared navigation direct and category-free**

In `lib/site-config.js`, replace the current Kegiatan item and children with:

```js
{ label: 'Kegiatan MTI', href: '/kegiatan-mti' },
```

Replace the Kegiatan footer column items with one direct item:

```js
{
  title: 'Kegiatan',
  items: [{ label: 'Kegiatan MTI', href: '/kegiatan-mti' }]
},
```

- [ ] **Step 5: Run source verification and production build**

Run:

```bash
node scripts/verify-kegiatan.mjs
npm run build
```

Expected: all assertions pass and all routes compile.

- [ ] **Step 6: Run redirect checks against a development server**

Start:

```bash
npm run dev
```

From another terminal:

```bash
for path in dialog-kebijakan mti-dalam-berita kegiatan-mti/jalan-jalan mti-wilayah/jalan-jalan; do
  curl -sI "http://localhost:3000/$path" | grep -Ei 'HTTP/1.1 308|location: /kegiatan-mti'
done
```

Expected: each route reports 308 and `location: /kegiatan-mti`.

- [ ] **Step 7: Commit redirects and navigation**

```bash
git add app/dialog-kebijakan/page.jsx app/mti-dalam-berita/page.jsx app/kegiatan-mti/jalan-jalan/page.jsx app/mti-wilayah/jalan-jalan/page.jsx lib/site-config.js scripts/verify-kegiatan.mjs
git commit -m "refactor: consolidate activity pages into Kegiatan MTI"
```

---

### Task 7: Verify the Complete Module End to End

**Files:**
- Read: `.env.local`
- Exercise: local Supabase, CMS actions, public page, legacy redirects, and Berita.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: verified draft/public behavior and a clean repository state.

- [ ] **Step 1: Verify clean seed, helper logic, audit, and build**

Run:

```bash
node scripts/verify-clean-seed.mjs
node scripts/verify-clean-home.mjs
node scripts/verify-site-navigation.mjs
node scripts/verify-kegiatan.mjs
npm audit
npm run build
```

Expected: all scripts pass, audit reports 0 vulnerabilities, build exits 0.

- [ ] **Step 2: Create a draft through the authenticated Supabase client**

Run:

```bash
node --env-file=.env.local --input-type=module <<'NODE'
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
const user = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const { error: loginError } = await user.auth.signInWithPassword({
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD
});
assert.ifError(loginError);
const { data, error } = await user.from('kegiatan').insert({
  title: 'Verifikasi Kegiatan MTI',
  date: '2026-09-26',
  image: '',
  summary: 'Data sementara untuk verifikasi.',
  published: false
}).select().single();
assert.ifError(error);
console.log(data.id);
await user.auth.signOut();
NODE
```

Store the printed ID privately as `KEGIATAN_ID` for the next checks.

- [ ] **Step 3: Prove anonymous users cannot read the draft**

Run:

```bash
node --env-file=.env.local --input-type=module <<'NODE'
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
const anon = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const { data, error } = await anon.from('kegiatan').select('*').eq('title', 'Verifikasi Kegiatan MTI');
assert.ifError(error);
assert.deepEqual(data, []);
console.log('Draft hidden from public.');
NODE
```

- [ ] **Step 4: Publish through an authenticated session and prove public visibility**

Run:

```bash
node --env-file=.env.local --input-type=module <<'NODE'
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
const user = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
let result = await user.auth.signInWithPassword({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
assert.ifError(result.error);
let update = await user.from('kegiatan').update({ published: true }).eq('title', 'Verifikasi Kegiatan MTI');
assert.ifError(update.error);
await user.auth.signOut();
const anon = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const { data, error } = await anon.from('kegiatan').select('*').eq('title', 'Verifikasi Kegiatan MTI');
assert.ifError(error);
assert.equal(data.length, 1);
console.log('Published activity visible publicly.');
NODE
```

- [ ] **Step 5: Verify the public page and year tab in a browser**

Start `npm run dev`, then inspect `http://localhost:3000/kegiatan-mti`:

- The `2026` tab exists.
- The verification card appears under Semua and 2026.
- The card is not a link.
- Header/footer use the shared MTI SUMSEL components.
- Mobile layout has one column.

- [ ] **Step 6: Verify admin CRUD visually**

Open `http://localhost:3000/admin/kegiatan` and verify:

- Existing verification row appears.
- Editing title/date/summary saves and refreshes.
- Image upload stores a URL from local Supabase Storage.
- Toggle changes Publik to Draft and removes it from the public page.
- Delete confirmation appears and deletion removes the row.
- Dashboard activity count returns to zero after deletion.

- [ ] **Step 7: Verify legacy redirects and Berita regression**

Run:

```bash
for path in dialog-kebijakan mti-dalam-berita kegiatan-mti/jalan-jalan mti-wilayah/jalan-jalan; do
  curl -sI "http://localhost:3000/$path" | grep -Ei 'HTTP/1.1 308|location: /kegiatan-mti'
done
curl -sI http://localhost:3000/admin/berita | grep -E 'HTTP/1.1 (200|307)'
```

Expected: legacy routes redirect and Berita still responds normally.

- [ ] **Step 8: Run final verification and inspect Git state**

Stop the dev server, then run:

```bash
node scripts/verify-clean-seed.mjs
node scripts/verify-clean-home.mjs
node scripts/verify-site-navigation.mjs
node scripts/verify-kegiatan.mjs
npm audit
npm run build
git diff --check
git status --short
```

Expected: all checks pass, audit reports 0 vulnerabilities, build exits 0, and only intentional files are changed.
