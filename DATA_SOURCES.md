# Data Sources

ComicAtlas uses the following external data sources.

---

## Comic Vine

- **URL:** https://comicvine.gamespot.com/api/
- **License:** Free for non-commercial use with attribution required
- **Attribution:** "Data provided by Comic Vine (comicvine.gamespot.com)"
- **Terms:** https://www.gamespot.com/api/terms-of-use/

### What we use

| Field | Source |
|-------|--------|
| Character images (`imageUrl`) | `character/{id}/?field_list=image` → `super_url` |
| Team images (`imageUrl`) | `team/{id}/?field_list=image` → `super_url` |

### Rate limits

The Comic Vine free tier allows **200 requests per hour**.

The import script (`npm run import:images`) enforces a 1.1-second delay between requests (~55 req/min). Cached responses in `.cache/cv/` are served from disk on subsequent runs, so each character is only fetched once unless `--force` is passed.

### Import scripts

```bash
# Fetch images for all characters/teams in the manifest that are missing them
npm run import:images -- --only-missing

# Re-fetch a single character (bypasses cache)
npm run import:images -- --char "Wolverine" --force

# Preview changes without writing to DB
npm run import:images -- --dry-run

# Find the correct Comic Vine ID for a character
npm run cv:search -- "Character Name" character
npm run cv:search -- "Team Name" team
```

### Manifest

`scripts/cv-manifest.json` maps each character/team in the DB to its Comic Vine ID. If a new character is added to `prisma/seed.ts` and needs an image:

1. Run `npm run cv:search -- "<Name>" character` to find the correct ID
2. Add an entry to `cv-manifest.json`
3. Run `npm run import:images -- --char "<Name>"`

### Image override

If a Comic Vine image is incorrect or low quality, set `imageOverrideUrl` directly in the DB or seed. The import script skips any record that has `imageOverrideUrl` set.

---

## Marvel CDN (i.annihil.us)

Several characters have images hosted at `i.annihil.us` — the Marvel image CDN. These are direct URLs from the Marvel Comics API (separate from Comic Vine) used in the original seed data for 8 characters.

**Note:** These URLs may expire or change. The Comic Vine import provides a more stable alternative.

---

## Character and story data

All character bios, timelines, reading paths, and event descriptions are **original editorial content** written for ComicAtlas, informed by publicly available information about comics published by Marvel Comics and DC Comics.

This project is not affiliated with, endorsed by, or connected to Marvel Comics, DC Comics, or their parent companies.
