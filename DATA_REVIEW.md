# DATA_REVIEW.md

Items flagged for manual verification before publishing. Check against Marvel/DC wikis, the Grand Comics Database (gcd.org), or the actual issues.

## Issue numbers / dates to verify

- [ ] **Kraven's Last Hunt** — seeded as ASM #294 (1987). The arc spans *Web of Spider-Man* #31–32, *ASM* #293–294, *Spectacular Spider-Man* #131–132. Only the conclusion is seeded. Consider expanding the reading path to include all 6 parts.
- [ ] **Wolverine: Origin #1** — listed as 2001. Release was November 2001. Likely correct.
- [ ] **Daredevil: Born Again** — seeded as *Daredevil* #227. The arc runs through #233. Reading path should note "read issues #227–233."
- [ ] **Fantastic Four #48** — first part of the Galactus Trilogy (FF #48–50, 1966). Correct.
- [ ] **JLA #43 (Tower of Babel)** — the arc actually runs JLA #43–46 (2000). Seeded as single issue; reading path should note the full arc.
- [ ] **Aquaman #17 (Throne of Atlantis)** — cross-over with Justice League #15–17. Seeded as Aquaman entry only.
- [ ] **Green Arrow: The Longbow Hunters #1** — 1987 prestige format mini-series, 3 issues. Reading path should note all 3.
- [ ] **Tales of the Teen Titans #44** — The Judas Contract starts here and runs through #44, Annual #3, and NTT #42 in flashback. Single issue seeded.

## Creator credits to verify

- [ ] **Batman** — Bill Finger was historically uncredited until 2015. Seeded with both Kane and Finger, which is the correct modern attribution.
- [ ] **Green Arrow** — co-created by Morton Weisinger and George Papp (*More Fun Comics* #73, 1941). Verify this is correct.
- [ ] **Aquaman** — credited to Paul Norris for *More Fun Comics* #73. Some sources also credit Mort Weisinger as editor/co-creator.
- [ ] **Teen Titans** — credited to Bob Haney and Bruno Premiani (*Brave and the Bold* #54, 1964). Verify.

## Image URLs (may 404 over time)

- [ ] **Daredevil**: `https://i.annihil.us/u/prod/marvel/i/mg/d/03/58232dc09de4f.jpg` — verify before launch
- [ ] **Marvel CDN (annihil.us)** — all 8 Marvel character images use this CDN. It has been stable but is not officially documented. Consider downloading and self-hosting.

## Continuity / accuracy notes

- [ ] **X-Men Thunderbird** — listed in Giant-Size X-Men #1 lineup. He died in *X-Men* #95 (1975). The listing is historically accurate but his death is not noted.
- [ ] **Teen Titans Terra** — `leftNote` marks her as a traitor/deceased. This is a spoiler — confirm it is gated by spoiler mode.
- [ ] **House of M** — seeded as 8-issue limited series (2005). Wolverine retaining his memories is a major consequence; correctly noted in impact entries.
- [ ] **Civil War** — Spider-Man's unmasking is in ASM #532. He later re-masks via *One More Day*. The reading path should probably note this consequence.
- [ ] **Infinity Gauntlet** — prelude seeded as *Silver Surfer* #34 (1990). Verify this is the right issue for the Thanos/Death setup.

## Reading path gaps

- [ ] No reading paths exist yet for: Black Widow (only 2 nodes via other characters), The Joker (redirects through Batman stories), Green Lantern (redirects through Flash/Blackest Night).
- [ ] Daredevil: Born Again arc is listed as a single issue — should be noted as a 7-issue arc.

## Spoiler audit (Workstream A)

Flags live in `prisma/spoilers.data.ts` and are applied by `npm run db:spoilers` (also run at the end of the seed).

### Unlock issues created (not in any reading path)
Added only so gated content has an issue to unlock on. Numbers are from memory of the publication record; verify against Comic Vine before relying on them:
Amazing Spider-Man #121 (1973) and #545 (2008); Death of Wolverine #4 (2014); Civil War #4 (2006); X-Men #101 (1976) and #137 (1980); Avengers vs. X-Men #11 (2012); Batman #428 (1988) and #497 (1993); Batman: The Killing Joke #1 (1988); Crisis on Infinite Earths #7 and #8 (1985); Green Lantern #50 (1994); Final Night #4 (1996); Green Arrow #101 (1995); Final Crisis #1 (2008).

### Gated with no unlock issue (`spoilerAfterIssueId = null`)
These stay hidden while protection is on, until the viewer turns it off. Not verified well enough to pick an issue:
Wolverine status (resurrection); Jean Grey status; Cyclops "Krakoa"; Scarlet Witch "Children's Crusade"; Thor "Unworthy" and "Ragnarok"; Magneto adamantium; Daredevil "Born Again"; Doctor Strange "Loses the Title"; Gamora "Infinity Wars Requiem"; Green Lantern "Rebirth"; Green Arrow "Resurrection"; Supergirl "Returned"; Nightwing "Becomes Batman" and "Exposed and Hunted"; Ra's "Lazarus Pit Revival"; Zatanna "Identity Crisis Fallout"; Wonder Woman "Becomes God of War"; Catwoman "Almost Mrs. Wayne"; Harley "Leaves the Joker".

### Existing facts that look wrong (not changed)
- Nightwing "Becomes Batman" is dated 2004; Dick Grayson took the cowl in 2009.
- Martian Manhunter "Final Crisis Sacrifice" is dated 2009; Final Crisis #1 was 2008.
- "Tales of the Teen Titans #44" path note says "The Judas Contract begins"; the arc ran #42–44, so #44 is the conclusion. Terra's death being in #44 is also from memory.
- Gamora "Infinity Wars Requiem" description ("collapses the universe in half") is unverified.

### Content rewritten
Bios of The Flash, Jean Grey and Scarlet Witch gave away deaths and the "No more mutants" outcome; rewritten spoiler-free. House of M and Flashpoint summaries had their endings moved into the gated `outcomeText`.

### Not gated
- `Relationship` rows have a type only, no text, so there is nothing to hide.
- Timeline *titles* that match public comic names (e.g. "World War Hulk") are gated with their descriptions but cannot be fully hidden if the issue is listed in a path.
