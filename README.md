# Project BYTE

Project BYTE is a Next.js 16 application with:

- Public-facing pages for courses, organizations, and news
- Admin dashboard for managing users, news, organizations, and trainees
- Magic-link admin authentication with NextAuth
- Supabase Postgres + Prisma (via `@prisma/adapter-pg`) for persistent data
- Supabase Storage for media uploads

## Clone From GitHub (Fail-Safe)

Use either HTTPS or SSH.

### Option A: HTTPS (recommended if SSH is not configured)

```bash
git clone https://github.com/<your-org-or-user>/project-byte.git
cd project-byte
```

### Option B: SSH (recommended if your SSH key is already added to GitHub)

```bash
git clone git@github.com:<your-org-or-user>/project-byte.git
cd project-byte
```

## Prerequisites

- Node.js 20+
- npm 10+
- A Supabase project (provides Postgres + Storage) — or any hosted/local Postgres if you only need the DB
- Access to SMTP credentials (for magic-link auth)

## First-Time Setup

1. Install dependencies:

```bash
npm install
```

2. Create your local environment file:

```bash
cp .env.example .env.local
```

Then fill `.env.local` with real values. The keys the app actually reads:

```dotenv
# Supabase Postgres — use the Session pooler URL (port 5432) from
# Supabase Dashboard → Project Settings → Database → Connection string.
# Do NOT use the Transaction pooler (port 6543): @prisma/adapter-pg uses
# prepared statements, which pgbouncer transaction mode breaks.
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"   # generate: openssl rand -base64 32

SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="smtp-user"
SMTP_PASS="smtp-password"
SMTP_FROM="Project BYTE <no-reply@example.com>"

# Supabase Storage (can be the same project as DATABASE_URL, or a separate project)
SUPABASE_URL="https://<project-ref>.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="<service-role-jwt>"

# Public site URL for robots.txt / sitemap.xml (optional in dev, required in prod)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

URL-encode special characters in the DB password (e.g. `@` → `%40`, `#` → `%23`). URL-encoding is not needed if the password is alphanumeric.

3. Sync database schema:

```bash
npx prisma generate
npx prisma db push
```

> First run against a fresh Supabase project will create empty tables. Rerun `db push` any time `prisma/schema.prisma` changes.

4. Seed a super admin:

```bash
# 1. Open prisma/seed.ts and set SUPER_ADMIN_EMAIL to your admin email.
# 2. Run the seeder (idempotent — safe to re-run):
npx tsx prisma/seed.ts
```

5. Start local development:

```bash
npm run dev
```

App runs at `http://localhost:3000`.

## Common Commands

```bash
npm run dev    # start local dev server
npm run build  # production build
npm run start  # run production server
npm run lint   # run ESLint
```

## Clone/Setup Troubleshooting

- `Repository not found`:
  - Confirm repo path and permissions.
  - If private, make sure you are logged in to GitHub and have access.

- `Permission denied (publickey)` with SSH:
  - Your SSH key is not configured in GitHub. Use HTTPS clone or register your key.

- `npm install` fails:
  - Verify Node and npm versions.
  - Remove `node_modules` and `package-lock.json`, then run `npm install` again.

- Auth redirects do not work:
  - Ensure `NEXTAUTH_URL` matches your local URL.
  - Ensure `NEXTAUTH_SECRET` is set.

- Upload endpoints fail:
  - Re-check `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
  - Ensure the `byte-images` bucket exists in your Supabase project (Dashboard → Storage → New bucket).

- Database connection errors:
  - Validate `DATABASE_URL` (pooler host, correct region, URL-encoded password).
  - If you see `prepared statement "sX" already exists`, your `DATABASE_URL` is pointing at the Transaction pooler (port `6543`). Switch to the Session pooler (port `5432`).
  - Ensure the Supabase project is not paused (free-tier projects pause after inactivity).

## Notes

- `.env*` is gitignored; keep secrets in local or secure deployment environments.
- Prisma client is generated into `lib/generated/prisma`.
