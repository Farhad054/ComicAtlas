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
- **Spoiler-safe mode** — a header toggle hides plot-sensitive fields (current status, event consequences) until you've read further
- **Search** — live dropdown in the header matches character names, aliases, real names, and event names
- **Adaptation bridge** — on Spider-Man and Batman's hubs, maps films and shows to the reading tier that best matches what you've seen
- **Creator pages** — browse by creator, see their characters and essential reading picks

---

## Seed data

| Publisher | Characters |
|---|---|
| Marvel | Wolverine, Spider-Man, Iron Man, Captain America, Thor, Hulk, Black Widow, Doctor Strange |
| DC | Batman, Superman, Wonder Woman, The Flash, The Joker, Green Lantern |

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
| Database | SQLite via Prisma 7 + `@prisma/adapter-libsql` |
| Auth | NextAuth.js (credentials — email + password) |

---

## Getting started

```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Seed with characters, events, and reading paths
npx prisma db seed

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Inspect the database

```bash
npx prisma studio
```

Opens a browser GUI at [http://localhost:5555](http://localhost:5555).

---

## Environment variables

Create a `.env` file at the project root:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
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
  search/page.tsx                 # Full search results page
  creators/
    page.tsx                      # All creators
    [slug]/page.tsx               # Creator detail
  login/page.tsx
  profile/page.tsx
  api/
    auth/                         # NextAuth + register
    progress/                     # Read/unread toggle
    search/                       # Keyword search endpoint
    spoiler/                      # Spoiler mode toggle

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
```

---

## What's explicitly out of scope (v1)

Friends/social feed, Taste Match, Comic Wrapped, community reviews, gamification, leaderboards, semantic search, alternate-universe disambiguation, adaptation bridge for characters beyond Spider-Man and Batman.

---

## Roadmap notes

- Cover images for DC characters beyond Batman (need a reliable image source)
- Fuzzy/typo-tolerant search
- Adaptation bridge extended to more characters
- More seed data — aiming for 10 characters per publisher
