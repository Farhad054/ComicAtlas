# ComicAtlas

A beginner-guidance discovery platform for Marvel and DC comics. Take someone who has never read a comic and get them to **"I know what to read and why"** in a few clicks.

---

## What it does

- **Pick a universe** — Marvel or DC, two big cards, no friction
- **Browse characters** — 14 characters across both publishers, each with a bio, powers, timeline, and connections graph
- **Read a character hub** — first appearance, creators, key life events, ally/villain relationships
- **Follow a reading path** — tiered as Beginner / Essential / Complete, each node has a cover, year, and a "why it matters" note
- **Track your progress** — mark issues read; the path highlights your next unread node
- **Explore events** — Civil War, Infinity Gauntlet, House of M, Flashpoint, Blackest Night — each with a core reading order, optional tie-ins, and an impact map showing how the event changed each character
- **Teams** — X-Men, Fantastic Four, Justice League, Teen Titans — each with rosters, lineups, reading paths, and relationships
- **Spoiler-safe mode** — a header toggle hides plot-sensitive fields until you've read further
- **Search** — live dropdown matches character names, aliases, real names, event names, and teams
- **Adaptation bridge** — on Spider-Man and Batman's hubs, maps films and shows to the reading tier that best matches what you've seen
- **Creator pages** — browse by creator, see every character and team they made

---

## Seed data

| Publisher | Characters |
|---|---|
| Marvel | Wolverine, Spider-Man, Iron Man, Captain America, Thor, Hulk, Black Widow, Doctor Strange |
| DC | Batman, Superman, Wonder Woman, The Flash, The Joker, Green Lantern |

| Publisher | Teams |
|---|---|
| Marvel | X-Men, Fantastic Four |
| DC | Justice League, Teen Titans |

| Publisher | Events |
|---|---|
| Marvel | Civil War, The Infinity Gauntlet, House of M |
| DC | Flashpoint, Blackest Night |

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Database (local) | SQLite via Prisma 7 + `@prisma/adapter-libsql` |
| Database (production) | Postgres via Prisma 7 + `@prisma/adapter-neon` (Neon serverless) |
| Auth | NextAuth.js (credentials — email + password) |
| Hosting | Vercel |
| Tests | Vitest (unit) + Playwright (e2e) |

---

## Local development

### Option A — SQLite (zero setup, recommended for new contributors)

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env
# DATABASE_URL defaults to "file:./dev.db" — no change needed

# 3. Run migrations and seed
npx prisma migrate deploy
npx prisma db seed

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Option B — Local Postgres via Docker

```bash
# 1. Start Postgres
docker compose up -d

# 2. Set DATABASE_URL in .env
# DATABASE_URL="postgresql://comicatlas:comicatlas@localhost:5432/comicatlas"

# 3. Run migrations and seed
npx prisma migrate deploy
npx prisma db seed

# 4. Start dev server
npm run dev
```

### Inspect the database

```bash
npx prisma studio
```

Opens a browser GUI at [http://localhost:5555](http://localhost:5555).

---

## Deploy to Vercel + Neon

### 1. Create a Neon database

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project (e.g. `comicatlas`)
3. Copy the **connection string** from the dashboard — it looks like:
   `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

### 2. Deploy to Vercel

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy (follow the prompts)
vercel
```

Or connect your GitHub repo in the [Vercel dashboard](https://vercel.com/dashboard) — it will auto-deploy on every push to `main`.

### 3. Set environment variables in Vercel

In **Vercel → Project → Settings → Environment Variables**, add:

| Key | Value |
|---|---|
| `DATABASE_URL` | Your Neon connection string |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` to generate one |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |

### 4. Run migrations and seed on Neon

After the first deploy, run these once with `DATABASE_URL` pointing to Neon:

```bash
# In your local terminal, with DATABASE_URL set to Neon
DATABASE_URL="postgresql://..." npx prisma migrate deploy
DATABASE_URL="postgresql://..." npx prisma db seed
```

Or use the Vercel CLI to run a one-off command:

```bash
vercel env pull .env.production.local
DATABASE_URL=$(grep DATABASE_URL .env.production.local | cut -d= -f2-) npx prisma migrate deploy
```

### 5. Verify

Visit your Vercel URL — you should see the full ComicAtlas app backed by Neon Postgres.

---

## Environment variables

Copy `.env.example` to `.env` and fill in your values:

```env
# Local SQLite (default)
DATABASE_URL="file:./dev.db"

NEXTAUTH_SECRET="change-this-to-a-random-32-char-string"
NEXTAUTH_URL="http://localhost:3000"
```

---

## Running tests

```bash
# Unit tests (Vitest)
npm test

# Unit tests in watch mode
npm run test:watch

# E2E tests (Playwright) — requires dev server running
npx playwright test
```

---

## Project structure

```
app/
  page.tsx                        # Publisher landing (Marvel / DC)
  [publisher]/
    page.tsx                      # Character grid
    [character]/
      page.tsx                    # Character hub
      read/page.tsx               # Reading path + progress tracking
  events/
    page.tsx                      # Events list
    [id]/page.tsx                 # Event hub
  teams/
    page.tsx                      # Teams list
    [slug]/page.tsx               # Team hub
  search/page.tsx                 # Full search results page
  creators/
    page.tsx                      # All creators
    [slug]/page.tsx               # Creator detail
  login/page.tsx
  profile/page.tsx
  api/
    auth/                         # NextAuth + register
    progress/                     # Read/unread toggle
    reading-path/                 # Character reading paths
    search/                       # Keyword search endpoint
    spoiler/                      # Spoiler mode toggle
    teams/                        # Team reading paths

components/
  Header.tsx                      # Sticky nav with search + spoiler toggle
  SearchBar.tsx                   # Live search dropdown
  AdaptationBridge.tsx            # "Came from the film?" section
  ConnectionsGraph.tsx            # Ally/villain node diagram
  SpoilerText.tsx                 # Conditionally hides spoiler fields
  SpoilerToggle.tsx               # Header toggle button

prisma/
  schema.prisma                   # Data model
  seed.ts                         # Full seed script
  migrations/                     # Postgres DDL migrations

tests/
  unit/                           # Vitest + Testing Library
  e2e/                            # Playwright
```

---

## What's explicitly out of scope (v1)

Friends/social feed, Taste Match, Comic Wrapped, community reviews, gamification, leaderboards, semantic search, alternate-universe disambiguation, adaptation bridge beyond Spider-Man and Batman.

---

## Roadmap notes

- Cover images for DC characters beyond Batman (need a reliable image source)
- Fuzzy/typo-tolerant search
- Adaptation bridge extended to more characters
- More seed data — aiming for 10 characters per publisher
- `DATA_REVIEW.md` tracks known data gaps and verification TODOs
