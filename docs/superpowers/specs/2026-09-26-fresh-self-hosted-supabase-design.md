# Fresh Self-Hosted Supabase Design

## Goal

Run a fresh Supabase instance locally with Docker, point the Next.js application at it, and start the CMS with no sample editorial content. The existing Supabase Cloud project is not read, modified, or migrated.

## Scope

The local instance provides the services this application already uses:

- PostgreSQL and PostgREST for CMS data
- Supabase Auth for the administrator login
- Supabase Storage for the public `media` bucket
- Supabase Studio for local administration

The application continues using `@supabase/ssr` and `@supabase/supabase-js`. No data-access abstraction or replacement backend is needed.

“Clear” means all Supabase-managed editorial content starts empty. Fixed application chrome, navigation, organizational text, and identity assets remain in the codebase.

## Local Architecture

Use Supabase's official self-hosted Docker Compose release in a sibling directory named `mti-supabase-local`, outside this Git repository. Pin the self-hosted release instead of following moving image tags. This keeps generated secrets, database files, and Docker configuration out of the application repository while matching the deployment model intended for the VPS.

Local endpoints:

- Supabase API and Studio gateway: `http://127.0.0.1:8000`
- Next.js application: `http://localhost:3000`
- Auth site URL: `http://localhost:3000`

The Supabase stack generates new local API keys and database credentials. They are not copied from Supabase Cloud and are not committed.

## Initial Data

The existing schema and RLS policies in `supabase/schema.sql` remain authoritative. The existing Storage configuration in `supabase/storage.sql` creates a public `media` bucket whose writes require authentication.

List tables start with zero rows:

- `public.berita`
- `public.jurnal`
- `public.artikel`

The two singleton rows required by the current application are initialized with structurally valid empty JSON:

```json
{
  "beranda": {
    "ticker": [],
    "leadStory": {},
    "heroSide": [],
    "regions": [],
    "akses": {}
  },
  "media": {
    "mainVideo": {},
    "miniVideos": []
  }
}
```

The tracked seed files become this clean baseline:

- `data/berita.json`: `[]`
- `data/jurnal.json`: `[]`
- `data/artikel.json`: `[]`
- `data/beranda.json`: the empty `beranda` object above
- `data/media.json`: the empty `media` object above

`scripts/setup.mjs` treats an empty list as a valid no-op rather than attempting an empty Supabase insert. It still applies schema and Storage SQL, creates the local administrator, and upserts the two singleton records.

## Authentication and Secrets

Setup creates one local email/password administrator through the Supabase Admin API. The credentials are local-only and stored in ignored environment files. Existing cloud users and sessions are not copied.

The application uses these values in `.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=<local publishable key>
SUPABASE_SERVICE_ROLE_KEY=<local secret key>
SUPABASE_DB_URL=<local Postgres connection string>
ADMIN_EMAIL=<local administrator email>
ADMIN_PASSWORD=<local administrator password>
```

The browser receives only the publishable key. The secret key remains server-side for image uploads and setup.

## Empty Homepage Behavior

The current homepage contains fallback editorial copy and a fallback YouTube URL. Those fallbacks would make a clean database look populated, so they are removed.

Supabase-backed homepage sections render only when they contain data:

- Ticker: at least one ticker item
- AKSES showcase and banner: at least one AKSES field
- Lead/sorotan area: a lead story title or at least one side story
- News: at least one published news item
- Regional content: at least one region item
- Media: a main video URL or at least one visible mini video

No empty iframe, broken image, or old sample copy is rendered. Fixed header, navigation, newsletter, footer, and non-CMS pages remain available.

The admin forms continue accepting the empty singleton objects. Administrators can add the first ticker item, story, video, news item, journal, or article through the existing CMS.

## Error Handling

Setup fails immediately when a required environment variable is missing. SQL execution, account creation, singleton insertion, or Storage setup errors stop the setup command with a non-zero exit code.

Repeated setup is safe:

- Tables use `create table if not exists`
- Policies are dropped and recreated
- The `media` bucket is upserted
- Existing administrator creation is skipped
- Singleton rows are upserted
- Empty list seeds remain no-ops

## Verification

Verification must prove:

1. Every Docker service is healthy.
2. Database list tables each contain zero rows.
3. `beranda` and `media` each contain exactly one valid singleton row.
4. The `media` Storage bucket exists and is public.
5. The generated administrator can sign in.
6. The homepage loads without sample Supabase content, fallback video, or broken CMS images.
7. The admin dashboard reports zero news, media, journals, and articles.
8. A new image can be uploaded to local Storage.
9. `npm run build` succeeds.

## Non-Goals

- Migrating or deleting the current Supabase Cloud project
- Importing current JSON sample content
- Deploying Supabase to the VPS
- Configuring production DNS, HTTPS, SMTP, backups, or monitoring
- Replacing fixed branding and static informational pages

The later VPS deployment will reuse the same self-hosted architecture but requires a separate production design for HTTPS, durable backups, SMTP, firewall rules, and secret management.
