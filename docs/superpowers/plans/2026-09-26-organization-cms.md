# Struktur Organisasi CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve the current Struktur Organisasi public layout while moving all personal names into a secure CMS singleton with fixed, non-editable job positions.

**Architecture:** Fixed position definitions live in `lib/organization-structure.js`; Supabase stores only a `{ names }` map in one singleton row. The admin form renders fixed labels and name inputs, while the public Server Component resolves empty names to `—` without hiding cards.

**Tech Stack:** Next.js 16 App Router, React 19, Supabase PostgreSQL/RLS, JSONB singleton, JavaScript

**Spec:** `docs/superpowers/specs/2026-09-26-organization-cms-design.md`

## Global Constraints

- Preserve the current public layout and all 24 fixed roles.
- Admin users edit names only; roles, badges, grouping, keys, and order are fixed.
- Every empty role remains visible and displays `—`.
- Do not migrate any existing hardcoded person's name.
- Setup must be idempotent and must not erase saved names.
- Unknown submitted fields must be ignored.
- No photographs, history, role creation, role deletion, or role reordering.

## File Structure

- Create: `lib/organization-structure.js` — fixed role definitions and pure resolver helpers.
- Create: `scripts/verify-organization-structure.mjs` — assertions for role count, stable keys, empty-name fallback, and source contracts.
- Create: `data/struktur-organisasi.json` — empty singleton seed.
- Modify: `supabase/schema.sql` — singleton table and RLS policies.
- Modify: `scripts/setup.mjs` — create the singleton only when absent.
- Modify: `lib/cms.js` — add `getStrukturOrganisasi()`.
- Modify: `app/admin/actions.js` — add `saveStrukturOrganisasi(formData)`.
- Create: `app/admin/struktur-organisasi/page.jsx` — admin server page.
- Create: `app/admin/struktur-organisasi/StrukturOrganisasiForm.jsx` — fixed-role name form.
- Modify: `app/admin/layout.jsx` — sidebar link.
- Modify: `app/admin/page.jsx` — dashboard quick link.
- Modify: `app/struktur-organisasi/page.jsx` — use CMS names while preserving markup/classes.

---

### Task 1: Define and Verify the Fixed Organization Structure

**Files:**
- Create: `lib/organization-structure.js`
- Create: `scripts/verify-organization-structure.mjs`

**Interfaces:**
- Produces: `ORGANIZATION_GROUPS` with exactly 24 stable positions.
- Produces: `ORGANIZATION_KEYS: string[]`.
- Produces: `resolveOrganizationGroup(group, names)` returning fixed metadata plus `name`.

- [ ] **Step 1: Write the failing verification script**

Create `scripts/verify-organization-structure.mjs`:

```js
import assert from 'node:assert/strict';
import {
  ORGANIZATION_GROUPS,
  ORGANIZATION_KEYS,
  resolveOrganizationGroup
} from '../lib/organization-structure.js';

assert.deepEqual(Object.keys(ORGANIZATION_GROUPS), [
  'advisory',
  'experts',
  'leadership',
  'divisions'
]);
assert.equal(ORGANIZATION_KEYS.length, 24);
assert.equal(new Set(ORGANIZATION_KEYS).size, 24, 'organization keys must be unique');

const resolved = resolveOrganizationGroup(ORGANIZATION_GROUPS.leadership, {
  'ketua-umum': '  Nama Ketua  ',
  unknown: 'Ignored'
});
assert.equal(resolved[0].role, 'Ketua Umum');
assert.equal(resolved[0].badge, 'Ketua');
assert.equal(resolved[0].name, 'Nama Ketua');
assert.equal(resolved[1].name, '—');
assert.equal(resolved.some((item) => item.key === 'unknown'), false);

console.log('Fixed organization structure verified.');
```

- [ ] **Step 2: Run it and verify missing module failure**

Run:

```bash
node scripts/verify-organization-structure.mjs
```

Expected: FAIL with module-not-found for `lib/organization-structure.js`.

- [ ] **Step 3: Create the fixed role definitions**

Create `lib/organization-structure.js`:

```js
export const ORGANIZATION_GROUPS = {
  advisory: [
    { key: 'ketua-dewan-pembina', role: 'Ketua Dewan Pembina' },
    { key: 'anggota-dewan-pembina-1', role: 'Anggota Dewan Pembina' },
    { key: 'anggota-dewan-pembina-2', role: 'Anggota Dewan Pembina' }
  ],
  experts: [
    { key: 'ketua-majelis-pakar', role: 'Ketua Majelis Pakar' },
    { key: 'anggota-majelis-pakar-1', role: 'Anggota Majelis Pakar' },
    { key: 'anggota-majelis-pakar-2', role: 'Anggota Majelis Pakar' },
    { key: 'anggota-majelis-pakar-3', role: 'Anggota Majelis Pakar' }
  ],
  leadership: [
    { key: 'ketua-umum', role: 'Ketua Umum', badge: 'Ketua' },
    { key: 'wakil-ketua-umum-1', role: 'Wakil Ketua Umum I', badge: 'Wakil' },
    { key: 'wakil-ketua-umum-2', role: 'Wakil Ketua Umum II', badge: 'Wakil' },
    { key: 'sekretaris-jenderal', role: 'Sekretaris Jenderal', badge: 'Sekjen' },
    { key: 'wakil-sekretaris-jenderal', role: 'Wakil Sekretaris Jenderal', badge: 'Wakil Sekjen' },
    { key: 'bendahara-umum', role: 'Bendahara Umum', badge: 'Bendahara' },
    { key: 'wakil-bendahara-umum', role: 'Wakil Bendahara Umum', badge: 'Wakil Bendahara' }
  ],
  divisions: [
    { key: 'bidang-transportasi-jalan', name: 'Transportasi Jalan' },
    { key: 'bidang-transportasi-kereta-api', name: 'Transportasi Kereta Api' },
    { key: 'bidang-transportasi-laut', name: 'Transportasi Laut' },
    { key: 'bidang-transportasi-udara', name: 'Transportasi Udara' },
    { key: 'bidang-transportasi-perkotaan-tod', name: 'Transportasi Perkotaan & TOD' },
    { key: 'bidang-keselamatan-transportasi', name: 'Keselamatan Transportasi' },
    { key: 'bidang-logistik-supply-chain', name: 'Logistik & Supply Chain' },
    { key: 'bidang-kebijakan-regulasi', name: 'Kebijakan & Regulasi' },
    { key: 'bidang-transportasi-perdesaan-3t', name: 'Transportasi Perdesaan & 3T' },
    { key: 'bidang-riset-inovasi-teknologi', name: 'Riset, Inovasi & Teknologi' }
  ]
};

export const ORGANIZATION_KEYS = Object.values(ORGANIZATION_GROUPS)
  .flat()
  .map((position) => position.key);

export function resolveOrganizationGroup(group, names = {}) {
  return group.map((position) => ({
    ...position,
    name: typeof names[position.key] === 'string' && names[position.key].trim()
      ? names[position.key].trim()
      : '—'
  }));
}
```

- [ ] **Step 4: Run verification**

```bash
node scripts/verify-organization-structure.mjs
```

Expected: PASS with `Fixed organization structure verified.`

- [ ] **Step 5: Commit fixed structure**

```bash
git add lib/organization-structure.js scripts/verify-organization-structure.mjs
git commit -m "feat: define fixed organization structure roles"
```

---

### Task 2: Add the Organization Singleton Database Contract

**Files:**
- Create: `data/struktur-organisasi.json`
- Modify: `supabase/schema.sql`
- Modify: `scripts/setup.mjs`
- Modify: `scripts/verify-organization-structure.mjs`

**Interfaces:**
- Produces: `public.struktur_organisasi(id=1, data={ names: {} })`.
- Produces: public read and authenticated update policies.
- Guarantees: rerunning setup does not overwrite saved names.

- [ ] **Step 1: Add seed assertion before creating the file**

Append to `scripts/verify-organization-structure.mjs`:

```js
import { readFile } from 'node:fs/promises';

const seed = JSON.parse(
  await readFile(new URL('../data/struktur-organisasi.json', import.meta.url), 'utf8')
);
assert.deepEqual(seed, { names: {} });
```

Run:

```bash
node scripts/verify-organization-structure.mjs
```

Expected: FAIL because the seed file does not exist.

- [ ] **Step 2: Create the empty singleton seed**

Create `data/struktur-organisasi.json`:

```json
{
  "names": {}
}
```

- [ ] **Step 3: Add singleton table and RLS**

Add to `supabase/schema.sql` after `public.media`:

```sql
create table if not exists public.struktur_organisasi (
  id int primary key default 1,
  data jsonb not null,
  constraint struktur_organisasi_singleton check (id = 1)
);
```

Enable RLS:

```sql
alter table public.struktur_organisasi enable row level security;
```

Add public policy:

```sql
drop policy if exists "struktur organisasi public read" on public.struktur_organisasi;
create policy "struktur organisasi public read" on public.struktur_organisasi
  for select using (true);
```

Add authenticated policy:

```sql
drop policy if exists "struktur organisasi admin all" on public.struktur_organisasi;
create policy "struktur organisasi admin all" on public.struktur_organisasi
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
```

- [ ] **Step 4: Add non-destructive singleton initialization**

Add this helper to `scripts/setup.mjs`:

```js
async function seedSingletonIfMissing(table, file) {
  const { count, error: countError } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true });
  if (countError) throw countError;
  if (count && count > 0) {
    console.log(`  ✓ ${table}: sudah ada (dilewati)`);
    return;
  }
  const data = await readJSON(file);
  const { error } = await supabase.from(table).insert({ id: 1, data });
  if (error) throw error;
  console.log(`  ✓ ${table}: singleton dibuat`);
}
```

Call it in `seed()` after existing singleton seeds:

```js
await seedSingletonIfMissing('struktur_organisasi', 'struktur-organisasi.json');
```

- [ ] **Step 5: Apply setup twice**

```bash
node --env-file=.env.local scripts/setup.mjs
node --env-file=.env.local scripts/setup.mjs
```

Expected: first run creates the singleton; second run reports `sudah ada (dilewati)`.

- [ ] **Step 6: Prove setup preserves saved names**

Run:

```bash
node --env-file=.env.local --input-type=module <<'NODE'
import assert from 'node:assert/strict';
import pg from 'pg';
const db = new pg.Client({ connectionString: process.env.SUPABASE_DB_URL });
await db.connect();
await db.query(`update public.struktur_organisasi set data = '{"names":{"ketua-umum":"Preserve Me"}}' where id = 1`);
await db.end();
NODE
node --env-file=.env.local scripts/setup.mjs
node --env-file=.env.local --input-type=module <<'NODE'
import assert from 'node:assert/strict';
import pg from 'pg';
const db = new pg.Client({ connectionString: process.env.SUPABASE_DB_URL });
await db.connect();
const { rows: [row] } = await db.query('select data from public.struktur_organisasi where id = 1');
assert.equal(row.data.names['ketua-umum'], 'Preserve Me');
await db.query(`update public.struktur_organisasi set data = '{"names":{}}' where id = 1`);
await db.end();
console.log('Organization singleton preservation verified.');
NODE
```

- [ ] **Step 7: Commit database contract**

```bash
git add data/struktur-organisasi.json supabase/schema.sql scripts/setup.mjs scripts/verify-organization-structure.mjs
git commit -m "feat: add organization structure singleton storage"
```

---

### Task 3: Add Data Access and Secure Save Action

**Files:**
- Modify: `lib/cms.js`
- Modify: `app/admin/actions.js`
- Modify: `scripts/verify-organization-structure.mjs`

**Interfaces:**
- Produces: `getStrukturOrganisasi(): Promise<{ names: Record<string,string> }>`.
- Produces: `saveStrukturOrganisasi(formData): Promise<{ success?: true, error?: string }>`.

- [ ] **Step 1: Add failing source-contract assertions**

Append:

```js
const cmsSource = await readFile(new URL('../lib/cms.js', import.meta.url), 'utf8');
assert.match(cmsSource, /export async function getStrukturOrganisasi\(\)/);

const actionsSource = await readFile(new URL('../app/admin/actions.js', import.meta.url), 'utf8');
assert.match(actionsSource, /export async function saveStrukturOrganisasi\(formData\)/);
assert.match(actionsSource, /ORGANIZATION_KEYS/);
```

Run and expect failure.

- [ ] **Step 2: Add data getter**

Add to `lib/cms.js`:

```js
export async function getStrukturOrganisasi() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('struktur_organisasi')
    .select('data')
    .eq('id', 1)
    .single();
  if (error) throw error;
  return {
    names: data?.data?.names && typeof data.data.names === 'object'
      ? data.data.names
      : {}
  };
}
```

- [ ] **Step 3: Add secure save action**

Import:

```js
import { ORGANIZATION_KEYS } from '../../lib/organization-structure';
```

Add:

```js
export async function saveStrukturOrganisasi(formData) {
  const supabase = await checkAuth();
  const names = Object.fromEntries(
    ORGANIZATION_KEYS.map((key) => [key, String(formData.get(key) || '').trim()])
  );
  const { error } = await supabase
    .from('struktur_organisasi')
    .update({ data: { names } })
    .eq('id', 1);
  if (error) return { error: error.message };
  revalidatePath('/struktur-organisasi');
  revalidatePath('/admin');
  revalidatePath('/admin/struktur-organisasi');
  return { success: true };
}
```

- [ ] **Step 4: Run verification and build**

```bash
node scripts/verify-organization-structure.mjs
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add lib/cms.js app/admin/actions.js scripts/verify-organization-structure.mjs
git commit -m "feat: add organization names data access and secure save action"
```

---

### Task 4: Build the Fixed-Role Admin Form

**Files:**
- Create: `app/admin/struktur-organisasi/page.jsx`
- Create: `app/admin/struktur-organisasi/StrukturOrganisasiForm.jsx`
- Modify: `app/admin/layout.jsx`
- Modify: `app/admin/page.jsx`
- Modify: `scripts/verify-organization-structure.mjs`

**Interfaces:**
- Consumes: fixed groups, names map, and `saveStrukturOrganisasi`.
- Produces: `/admin/struktur-organisasi` with exactly 24 name inputs.

- [ ] **Step 1: Add failing file and input-count assertions**

Append:

```js
const adminFormSource = await readFile(
  new URL('../app/admin/struktur-organisasi/StrukturOrganisasiForm.jsx', import.meta.url),
  'utf8'
);
assert.match(adminFormSource, /ORGANIZATION_GROUPS/);
assert.match(adminFormSource, /Simpan Struktur Organisasi/);
```

Run and expect missing file failure.

- [ ] **Step 2: Create server page**

Create `app/admin/struktur-organisasi/page.jsx`:

```jsx
import { getStrukturOrganisasi } from '../../../lib/cms';
import StrukturOrganisasiForm from './StrukturOrganisasiForm';

export const metadata = { title: 'Struktur Organisasi - MTI CMS' };

export default async function AdminStrukturOrganisasiPage() {
  const data = await getStrukturOrganisasi();
  return (
    <div>
      <div className="adminPageHeader">
        <div>
          <h1>Struktur Organisasi</h1>
          <p>Isi nama pengurus pada jabatan yang sudah ditetapkan</p>
        </div>
      </div>
      <StrukturOrganisasiForm names={data.names} />
    </div>
  );
}
```

- [ ] **Step 3: Create fixed-role form**

Create `StrukturOrganisasiForm.jsx` as a client component. It imports `ORGANIZATION_GROUPS` and `saveStrukturOrganisasi`, renders these four group labels:

```js
const GROUP_LABELS = {
  advisory: 'Dewan Pembina',
  experts: 'Majelis Pakar',
  leadership: 'Pengurus Harian',
  divisions: 'Bidang Teknis'
};
```

For every fixed position, render:

```jsx
<div className="adminFormGroup">
  <label htmlFor={position.key}>
    {position.role || position.name}
  </label>
  <input
    id={position.key}
    name={position.key}
    defaultValue={names[position.key] || ''}
    placeholder="Nama lengkap"
  />
</div>
```

Render no add/delete/reorder controls. Submit with `useTransition`, display errors, call `router.refresh()`, and use one button labeled `Simpan Struktur Organisasi`.

- [ ] **Step 4: Add sidebar and dashboard links**

Add sidebar link after Kegiatan MTI:

```jsx
<Link href="/admin/struktur-organisasi" className="adminNavItem">
  Struktur Organisasi
</Link>
```

Add dashboard quick link:

```jsx
<Link href="/admin/struktur-organisasi" className="adminBtn adminBtnSecondary">
  Struktur Organisasi
</Link>
```

- [ ] **Step 5: Verify build**

```bash
node scripts/verify-organization-structure.mjs
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add app/admin/struktur-organisasi app/admin/layout.jsx app/admin/page.jsx scripts/verify-organization-structure.mjs
git commit -m "feat: add fixed-role organization structure CMS"
```

---

### Task 5: Connect the Existing Public Layout to CMS Names

**Files:**
- Modify: `app/struktur-organisasi/page.jsx`
- Modify: `scripts/verify-organization-structure.mjs`

**Interfaces:**
- Consumes: `getStrukturOrganisasi`, `ORGANIZATION_GROUPS`, `resolveOrganizationGroup`.
- Preserves: existing page classes, section order, and card markup.

- [ ] **Step 1: Add hardcoded-name regression assertions**

Append:

```js
const publicSource = await readFile(
  new URL('../app/struktur-organisasi/page.jsx', import.meta.url),
  'utf8'
);
for (const oldName of [
  'Tulus Abadi',
  'Agus Taufik Mulyono',
  'Bambang Susantono',
  'Wimpy Santosa',
  'Siti Maimunah',
  'Russ Bona Frazila'
]) {
  assert.equal(publicSource.includes(oldName), false, `hardcoded person remains: ${oldName}`);
}
assert.match(publicSource, /getStrukturOrganisasi/);
assert.match(publicSource, /resolveOrganizationGroup/);
```

Run and expect failure.

- [ ] **Step 2: Remove hardcoded arrays**

Delete `leadership`, `advisory`, `experts`, and `divisions` from `app/struktur-organisasi/page.jsx`.

- [ ] **Step 3: Fetch and resolve names**

Import:

```js
import { getStrukturOrganisasi } from '../../lib/cms';
import {
  ORGANIZATION_GROUPS,
  resolveOrganizationGroup
} from '../../lib/organization-structure';
```

Change the component to async and add:

```js
const { names } = await getStrukturOrganisasi();
const advisory = resolveOrganizationGroup(ORGANIZATION_GROUPS.advisory, names);
const experts = resolveOrganizationGroup(ORGANIZATION_GROUPS.experts, names);
const leadership = resolveOrganizationGroup(ORGANIZATION_GROUPS.leadership, names);
const divisions = resolveOrganizationGroup(ORGANIZATION_GROUPS.divisions, names);
```

- [ ] **Step 4: Preserve card markup with resolved fields**

Use stable keys:

```jsx
key={p.key}
```

Keep advisory/expert names as `p.name`; leadership names as `p.name`; divisions use fixed title `d.name` and CMS name `d.name` conflicts with resolved `name`, so change fixed division metadata in configuration from `name` to `role` before implementation, and render:

```jsx
<strong>{d.role}</strong>
<small>{d.name}</small>
```

Update the helper verification accordingly so all positions consistently use `role` for titles and `name` for resolved personal names.

- [ ] **Step 5: Verify all 24 cards remain visible when empty**

Start dev server and inspect `/struktur-organisasi`. Confirm:

- 3 Dewan Pembina cards
- 4 Majelis Pakar cards
- 7 Pengurus Harian cards
- 10 Bidang Teknis cards
- Every empty name displays `—`

- [ ] **Step 6: Commit**

```bash
git add app/struktur-organisasi/page.jsx lib/organization-structure.js scripts/verify-organization-structure.mjs
git commit -m "refactor: source organization names from CMS"
```

---

### Task 6: End-to-End Verification

**Files:**
- Exercise: local Supabase, admin form, public page.

- [ ] **Step 1: Run automated checks**

```bash
node scripts/verify-clean-seed.mjs
node scripts/verify-clean-home.mjs
node scripts/verify-site-navigation.mjs
node scripts/verify-kegiatan.mjs
node scripts/verify-organization-structure.mjs
npm audit
npm run build
```

Expected: all checks pass, zero vulnerabilities, build exits 0.

- [ ] **Step 2: Verify CMS save and unknown-field rejection**

Use an authenticated Supabase session or the CMS form to save:

```text
ketua-umum = "  Nama Ketua Sumsel  "
unknown-field = "Must Be Ignored"
```

Verify the stored map contains `ketua-umum: "Nama Ketua Sumsel"` and does not contain `unknown-field`.

- [ ] **Step 3: Verify public mapping**

Open `/struktur-organisasi` and confirm:

- Ketua Umum displays `Nama Ketua Sumsel`.
- All other unfilled cards display `—`.
- No cards disappear.
- Layout classes and group order remain unchanged.

- [ ] **Step 4: Reset test data and run final checks**

Set the singleton back to `{ "names": {} }`, rerun automated checks, run `git diff --check`, and confirm `git status --short` contains only intentional changes.
