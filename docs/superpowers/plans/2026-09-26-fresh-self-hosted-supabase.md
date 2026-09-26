# Fresh Self-Hosted Supabase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Run a fresh local self-hosted Supabase stack and connect the MTI Next.js CMS to empty, structurally valid content.

**Architecture:** Supabase's pinned official Docker Compose stack lives in the sibling directory `../mti-supabase-local`; only application configuration and seed behavior live in this repository. The existing schema, RLS, Auth clients, and Storage integration remain unchanged, while tracked JSON seeds become an empty baseline and CMS-backed homepage sections render only when populated.

**Tech Stack:** Docker Desktop, Docker Compose, Supabase self-hosted `self-hosted/v0.8.2`, PostgreSQL, Supabase Auth/Storage/PostgREST, Next.js 16, Node.js 24

**Spec:** `docs/superpowers/specs/2026-09-26-fresh-self-hosted-supabase-design.md`

## Global Constraints

- Do not read from, modify, migrate, or delete the current Supabase Cloud project.
- Keep generated Supabase secrets, database files, Docker configuration, and `.env.local` out of Git.
- Use `http://127.0.0.1:8000` as the local Supabase public URL and `http://localhost:3000` as the Auth site URL.
- Preserve the existing schema, RLS policies, public `media` bucket, and current Supabase client libraries.
- List tables must start at zero rows; `beranda` and `media` must each have one structurally valid empty singleton row.
- Existing uncommitted dependency security updates in `package.json` and `package-lock.json` are unrelated and must not be reverted.

## File Structure

- Modify: `data/beranda.json` — empty, structurally valid homepage singleton seed.
- Modify: `data/media.json` — empty, structurally valid media singleton seed.
- Modify: `data/berita.json` — empty news list seed.
- Modify: `data/jurnal.json` — empty journal list seed.
- Modify: `data/artikel.json` — empty article list seed.
- Modify: `scripts/setup.mjs` — treat empty list seeds as a successful no-op and surface count-query errors.
- Create: `scripts/verify-clean-seed.mjs` — small Node assertion check for the clean seed contract.
- Modify: `app/HomeClient.jsx` — remove sample CMS fallbacks and omit empty CMS-backed sections.
- Create: `scripts/verify-clean-home.mjs` — source-level regression check that forbidden sample fallbacks do not return.
- Modify: `.env.example` — document local self-hosted values without real secrets.
- Create outside Git: `../mti-supabase-local/` — official pinned Docker Compose deployment and generated secrets/data.
- Create ignored: `.env.local` — local application/API/database/admin credentials.

---

### Task 1: Replace Sample Seeds with a Clean Baseline

**Files:**
- Create: `scripts/verify-clean-seed.mjs`
- Modify: `scripts/setup.mjs:91-105`
- Modify: `data/beranda.json`
- Modify: `data/media.json`
- Modify: `data/berita.json`
- Modify: `data/jurnal.json`
- Modify: `data/artikel.json`

**Interfaces:**
- Consumes: the existing `scripts/setup.mjs` JSON seed loading flow.
- Produces: zero list rows, one `beranda` singleton shaped as `{ ticker, leadStory, heroSide, regions, akses }`, and one `media` singleton shaped as `{ mainVideo, miniVideos }`.

- [ ] **Step 1: Write the failing clean-seed check**

Create `scripts/verify-clean-seed.mjs`:

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const readJSON = async (name) =>
  JSON.parse(await readFile(new URL(`../data/${name}.json`, import.meta.url), 'utf8'));

for (const name of ['berita', 'jurnal', 'artikel']) {
  assert.deepEqual(await readJSON(name), [], `${name}.json must be empty`);
}

assert.deepEqual(await readJSON('beranda'), {
  ticker: [],
  leadStory: {},
  heroSide: [],
  regions: [],
  akses: {}
});

assert.deepEqual(await readJSON('media'), {
  mainVideo: {},
  miniVideos: []
});

console.log('Clean seed contract verified.');
```

- [ ] **Step 2: Run the check and verify it fails for the sample data**

Run:

```bash
node scripts/verify-clean-seed.mjs
```

Expected: FAIL with `berita.json must be empty`.

- [ ] **Step 3: Replace the five JSON files with the clean baseline**

Write `[]` to `data/berita.json`, `data/jurnal.json`, and `data/artikel.json`.

Write this to `data/beranda.json`:

```json
{
  "ticker": [],
  "leadStory": {},
  "heroSide": [],
  "regions": [],
  "akses": {}
}
```

Write this to `data/media.json`:

```json
{
  "mainVideo": {},
  "miniVideos": []
}
```

- [ ] **Step 4: Make empty list seeding a successful no-op**

In `seedList` in `scripts/setup.mjs`, replace the count/read/insert flow with:

```js
  const { count, error: countError } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true });
  if (countError) throw countError;
  if (count && count > 0) {
    console.log(`  ✓ ${table}: sudah ada ${count} baris (dilewati)`);
    return;
  }
  const items = await readJSON(file);
  if (items.length === 0) {
    console.log(`  ✓ ${table}: kosong`);
    return;
  }
  const rows = items.map(rowsFn);
  const { error } = await supabase.from(table).insert(rows);
  if (error) throw error;
  console.log(`  ✓ ${table}: ${rows.length} baris di-seed`);
```

- [ ] **Step 5: Run the clean-seed check**

Run:

```bash
node scripts/verify-clean-seed.mjs
```

Expected: PASS and print `Clean seed contract verified.`

- [ ] **Step 6: Commit the clean baseline**

```bash
git add scripts/setup.mjs scripts/verify-clean-seed.mjs data/*.json
git commit -m "feat: start Supabase CMS with empty content"
```

---

### Task 2: Make the Homepage Truly Empty-Safe

**Files:**
- Create: `scripts/verify-clean-home.mjs`
- Modify: `app/HomeClient.jsx:129-136,295-512`

**Interfaces:**
- Consumes: `HomeClient` props supplied by `app/page.jsx`.
- Produces: boolean section guards derived directly from existing data; no new component or public API.

- [ ] **Step 1: Write the failing fallback regression check**

Create `scripts/verify-clean-home.mjs`:

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../app/HomeClient.jsx', import.meta.url), 'utf8');
const forbidden = [
  'https://www.youtube.com/embed/0_jL04tc3TY',
  "aksesData?.edition || 'Edisi 36'",
  "aksesData?.date || 'Maret 2026'",
  'Jurnal transportasi dengan tampilan editorial yang lebih kuat.'
];

for (const value of forbidden) {
  assert.equal(source.includes(value), false, `sample fallback remains: ${value}`);
}

for (const guard of ['tickerItems.length > 0', 'hasAkses', 'hasHero', 'news.length > 0', 'regions.length > 0', 'hasMedia']) {
  assert.equal(source.includes(guard), true, `missing empty-state guard: ${guard}`);
}

console.log('Clean homepage guards verified.');
```

- [ ] **Step 2: Run the check and verify it fails for the current fallback content**

Run:

```bash
node scripts/verify-clean-home.mjs
```

Expected: FAIL with `sample fallback remains`.

- [ ] **Step 3: Replace fallback values with direct empty values and section flags**

In `HomeClient`, replace the current media and AKSES fallback constants with:

```js
  const mainVideoUrl = mediaData?.mainVideo?.url || '';
  const miniVideos = mediaData?.miniVideos?.filter((v) => v.visible) || [];
  const hasMedia = Boolean(mainVideoUrl || miniVideos.length);

  const aksesEdition = aksesData?.edition || '';
  const aksesDate = aksesData?.date || '';
  const aksesTopic = aksesData?.topic || '';
  const aksesTitle = aksesData?.title || '';
  const aksesDescription = aksesData?.description || '';
  const hasAkses = Boolean(
    aksesEdition || aksesDate || aksesTopic || aksesTitle || aksesDescription
  );
  const hasHero = Boolean(leadStory?.title || heroSide.length);
```

- [ ] **Step 4: Guard each CMS-backed homepage section**

Wrap sections with these exact conditions:

```jsx
{tickerItems.length > 0 ? <section className="tickerBand">...</section> : null}
{hasAkses ? <section className="wideShell aksesShowcase">...</section> : null}
{hasHero ? <section className="wideShell heroGrid">...</section> : null}
{news.length > 0 ? <section className="wideShell newsSection">...</section> : null}
{hasAkses ? <section className="aksesFullBanner">...</section> : null}
{regions.length > 0 ? <section className="regionalBand">...</section> : null}
{hasMedia ? <section className="wideShell mediaSection">...</section> : null}
```

Inside the media section, render the main iframe only when `mainVideoUrl` is non-empty:

```jsx
{mainVideoUrl ? (
  <div className="videoFrame">
    <iframe
      src={mainVideoUrl}
      title={mediaData?.mainVideo?.title || 'MTI di Media'}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
) : null}
```

Keep the existing markup inside each condition unchanged. In the top navigation, render `AKSES Nusantara` without a sample edition when `aksesEdition` is empty.

- [ ] **Step 5: Run the regression check and production build**

Run:

```bash
node scripts/verify-clean-home.mjs
npm run build
```

Expected: the check prints `Clean homepage guards verified.` and the Next.js build exits 0.

- [ ] **Step 6: Commit empty-safe rendering**

```bash
git add app/HomeClient.jsx scripts/verify-clean-home.mjs
git commit -m "fix: hide empty homepage CMS sections"
```

---

### Task 3: Provision the Pinned Local Supabase Docker Stack

**Files:**
- Create outside Git: `../mti-supabase-local/**`
- Modify: `.env.example`
- Create ignored: `.env.local`

**Interfaces:**
- Consumes: Docker Desktop and the official Supabase self-hosted release.
- Produces: local API/Studio at `http://127.0.0.1:8000`, local database access, generated publishable/secret keys, and application environment values.

- [ ] **Step 1: Verify Docker is running and ports are free**

Run:

```bash
docker info >/dev/null
for port in 3000 5432 6543 8000; do
  ! lsof -nP -iTCP:$port -sTCP:LISTEN >/dev/null || { echo "Port $port is in use"; exit 1; }
done
```

Expected: exit 0. If Docker is not running, start Docker Desktop and repeat. Stop rather than killing an unknown process when a required port is occupied.

- [ ] **Step 2: Install the pinned official self-hosted configuration outside the repository**

Run from the application repository:

```bash
rm -rf /tmp/mti-supabase-source
git clone --depth 1 --branch self-hosted/v0.8.2 \
  https://github.com/supabase/supabase /tmp/mti-supabase-source
mkdir -p ../mti-supabase-local
cp -R /tmp/mti-supabase-source/docker/. ../mti-supabase-local/
printf 'ref=self-hosted/v0.8.2\n' > ../mti-supabase-local/.supabase-version
cp ../mti-supabase-local/.env.example ../mti-supabase-local/.env
```

Expected: `../mti-supabase-local/docker-compose.yml` and `.env` exist.

- [ ] **Step 3: Generate local secrets and configure local URLs**

Run:

```bash
cd ../mti-supabase-local
sh utils/generate-keys.sh
sh utils/add-new-auth-keys.sh
```

Set these entries in `../mti-supabase-local/.env` without changing generated secrets:

```dotenv
SUPABASE_PUBLIC_URL=http://127.0.0.1:8000
API_EXTERNAL_URL=http://127.0.0.1:8000/auth/v1
SITE_URL=http://localhost:3000
```

Generate a local administrator password with `openssl rand -base64 24` for `.env.local`; do not add it to the Docker stack or Git.

- [ ] **Step 4: Use a named Storage volume on macOS if the pinned stack uses a bind mount**

Inspect the Storage service in `docker-compose.yml`. If it mounts `./volumes/storage:/var/lib/storage`, replace only that mount with `mti-storage:/var/lib/storage` and declare this top-level volume:

```yaml
volumes:
  mti-storage:
```

If the pinned release already uses a named volume, make no change.

- [ ] **Step 5: Pull and start the stack**

Run:

```bash
cd ../mti-supabase-local
docker compose pull
sh run.sh start
docker compose ps
```

Expected: every enabled service reports `Up` and every service with a health check reports `healthy`.

- [ ] **Step 6: Create the ignored application environment file**

Read generated values with:

```bash
cd ../mti-supabase-local
sh run.sh secrets
```

Create `<application-repository>/.env.local` with:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUPABASE_PUBLISHABLE_KEY from run.sh secrets>
SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SECRET_KEY from run.sh secrets>
SUPABASE_DB_URL=<Supavisor session connection string printed by run.sh secrets>
ADMIN_EMAIL=admin@mti.local
ADMIN_PASSWORD=<generated local password>
```

Confirm Git ignores it:

```bash
git check-ignore .env.local
```

Expected: `.env.local` is printed.

- [ ] **Step 7: Update the public environment template**

Replace `.env.example` with placeholders and local defaults:

```dotenv
# Local self-hosted Supabase API
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_LOCAL_PUBLISHABLE_KEY

# Server-only key; never expose it to browser code
SUPABASE_SERVICE_ROLE_KEY=YOUR_LOCAL_SECRET_KEY

# Copy the local session connection string shown by: sh run.sh secrets
SUPABASE_DB_URL=postgresql://postgres.YOUR_TENANT:YOUR_PASSWORD@127.0.0.1:5432/postgres

# Local CMS administrator created by scripts/setup.mjs
ADMIN_EMAIL=admin@mti.local
ADMIN_PASSWORD=GENERATE_A_STRONG_LOCAL_PASSWORD
```

- [ ] **Step 8: Commit only the safe application template**

```bash
git add .env.example
git commit -m "docs: configure local self-hosted Supabase"
```

---

### Task 4: Initialize and Verify the Fresh CMS

**Files:**
- Read: `.env.local`
- Read: `supabase/schema.sql`
- Read: `supabase/storage.sql`
- Execute: `scripts/setup.mjs`

**Interfaces:**
- Consumes: the local Supabase API/database credentials and clean seeds from Tasks 1–3.
- Produces: schema, RLS, Storage bucket, one local administrator, empty list tables, and required singleton rows.

- [ ] **Step 1: Run the application setup against local Supabase**

From the application repository, run:

```bash
node --env-file=.env.local scripts/setup.mjs
```

Expected: schema and Storage SQL complete, the local admin is created, each list table reports `kosong`, and both singleton tables report `1 baris (upsert)`.

- [ ] **Step 2: Run setup a second time to prove idempotence**

Run:

```bash
node --env-file=.env.local scripts/setup.mjs
```

Expected: existing admin is skipped, list tables remain empty, and singleton upserts succeed.

- [ ] **Step 3: Verify database counts and singleton shapes**

Use the local database URL from `.env.local` without printing credentials:

```bash
node --env-file=.env.local --input-type=module <<'NODE'
import pg from 'pg';
const db = new pg.Client({ connectionString: process.env.SUPABASE_DB_URL, ssl: { rejectUnauthorized: false } });
await db.connect();
const { rows } = await db.query(`
  select
    (select count(*)::int from public.berita) berita,
    (select count(*)::int from public.jurnal) jurnal,
    (select count(*)::int from public.artikel) artikel,
    (select count(*)::int from public.beranda) beranda,
    (select count(*)::int from public.media) media,
    (select count(*)::int from auth.users) users,
    (select count(*)::int from storage.buckets where id = 'media' and public) public_media_bucket
`);
console.log(rows[0]);
const singletons = await db.query('select (select data from public.beranda) beranda, (select data from public.media) media');
console.log(singletons.rows[0]);
await db.end();
NODE
```

Expected counts:

```text
berita=0 jurnal=0 artikel=0 beranda=1 media=1 users=1 public_media_bucket=1
```

Expected singleton JSON matches Task 1 exactly.

- [ ] **Step 4: Verify authentication through the local API**

Run without printing the password or tokens:

```bash
node --env-file=.env.local --input-type=module <<'NODE'
import { createClient } from '@supabase/supabase-js';
const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const { data, error } = await client.auth.signInWithPassword({
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD
});
if (error || !data.user) throw error || new Error('Admin login returned no user');
await client.auth.signOut();
console.log('Local admin login verified.');
NODE
```

Expected: `Local admin login verified.`

- [ ] **Step 5: Verify Storage upload and cleanup through the server-only client**

Run:

```bash
node --env-file=.env.local --input-type=module <<'NODE'
import { createClient } from '@supabase/supabase-js';
const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});
const path = `verification/${Date.now()}.txt`;
const { error: uploadError } = await client.storage.from('media').upload(path, new Blob(['ok'], { type: 'text/plain' }));
if (uploadError) throw uploadError;
const { data } = client.storage.from('media').getPublicUrl(path);
const response = await fetch(data.publicUrl);
if (!response.ok || await response.text() !== 'ok') throw new Error(`Public Storage verification failed: ${response.status}`);
const { error: removeError } = await client.storage.from('media').remove([path]);
if (removeError) throw removeError;
console.log('Local Storage upload verified.');
NODE
```

Expected: `Local Storage upload verified.`

- [ ] **Step 6: Start Next.js and inspect public/admin behavior**

Start the app:

```bash
npm run dev
```

Then verify from another terminal:

```bash
curl -fsS http://localhost:3000/ > /tmp/mti-home.html
! rg '0_jL04tc3TY|Edisi 36|Mudik 2026' /tmp/mti-home.html
curl -sI http://localhost:3000/admin | rg 'HTTP/|location: /admin/login'
```

Expected: homepage request succeeds without sample CMS content; unauthenticated `/admin` redirects to `/admin/login`.

Open `http://localhost:3000/admin/login`, sign in with the local credentials from `.env.local`, and verify dashboard totals are all zero.

- [ ] **Step 7: Run final automated verification**

Stop the dev server, then run:

```bash
node scripts/verify-clean-seed.mjs
node scripts/verify-clean-home.mjs
npm audit
npm run build
cd ../mti-supabase-local && docker compose ps
```

Expected: both checks pass, audit reports zero vulnerabilities, build exits 0, and all Docker services remain up/healthy.

- [ ] **Step 8: Record final repository state**

Run:

```bash
git status --short
git log -5 --oneline
```

Expected: only the pre-existing dependency security updates may remain uncommitted; `.env.local` and `../mti-supabase-local` do not appear in repository status.
