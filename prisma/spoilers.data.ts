/**
 * Spoiler audit of the seed content. Applied idempotently by
 * prisma/apply-spoilers.ts (and at the end of prisma/seed.ts).
 *
 * An issue key is "Series Name#number(year)". `null` as the unlock issue means
 * "hidden whenever spoiler protection is on" — used where we could not verify
 * a precise issue; every such case is logged in DATA_REVIEW.md.
 */

export interface IssueSeed {
  publisher: 'marvel' | 'dc'
  seriesName: string
  issueNumber: string
  year: number
}

/** Issues that only exist to unlock gated content; not part of any reading path. */
export const UNLOCK_ISSUES: IssueSeed[] = [
  { publisher: 'marvel', seriesName: 'The Amazing Spider-Man', issueNumber: '121', year: 1973 },
  { publisher: 'marvel', seriesName: 'The Amazing Spider-Man', issueNumber: '545', year: 2008 },
  { publisher: 'marvel', seriesName: 'Death of Wolverine', issueNumber: '4', year: 2014 },
  { publisher: 'marvel', seriesName: 'Civil War', issueNumber: '4', year: 2006 },
  { publisher: 'marvel', seriesName: 'X-Men', issueNumber: '101', year: 1976 },
  { publisher: 'marvel', seriesName: 'X-Men', issueNumber: '137', year: 1980 },
  { publisher: 'marvel', seriesName: 'Avengers vs. X-Men', issueNumber: '11', year: 2012 },
  { publisher: 'dc', seriesName: 'Batman', issueNumber: '428', year: 1988 },
  { publisher: 'dc', seriesName: 'Batman', issueNumber: '497', year: 1993 },
  { publisher: 'dc', seriesName: 'Batman: The Killing Joke', issueNumber: '1', year: 1988 },
  { publisher: 'dc', seriesName: 'Crisis on Infinite Earths', issueNumber: '7', year: 1985 },
  { publisher: 'dc', seriesName: 'Crisis on Infinite Earths', issueNumber: '8', year: 1985 },
  { publisher: 'dc', seriesName: 'Green Lantern', issueNumber: '50', year: 1994 },
  { publisher: 'dc', seriesName: 'Final Night', issueNumber: '4', year: 1996 },
  { publisher: 'dc', seriesName: 'Green Arrow', issueNumber: '101', year: 1995 },
  { publisher: 'dc', seriesName: 'Final Crisis', issueNumber: '1', year: 2008 },
]

export const key = (series: string, num: string, year: number) => `${series}#${num}(${year})`

/** [character name, timeline title, unlock issue key | null] */
export const TIMELINE_SPOILERS: [string, string, string | null][] = [
  ['Wolverine', 'Death', key('Death of Wolverine', '4', 2014)],
  ['Captain America', 'Assassinated', key('Captain America', '25', 2007)],
  ['Captain America', 'Bucky Takes the Shield', key('Captain America', '25', 2007)],
  ['Spider-Man', 'Gwen Stacy Dies', key('The Amazing Spider-Man', '121', 1973)],
  ['Spider-Man', 'One More Day', key('The Amazing Spider-Man', '545', 2008)],
  ['Spider-Man', "Kraven's Last Hunt", key('The Amazing Spider-Man', '294', 1987)],
  ['Jean Grey', 'Becomes Phoenix', key('X-Men', '101', 1976)],
  ['Jean Grey', 'Dark Phoenix Saga', key('X-Men', '137', 1980)],
  ['Cyclops', 'Phoenix Force', key('Avengers vs. X-Men', '11', 2012)],
  ['Cyclops', 'Krakoa', null],
  ['Scarlet Witch', 'House of M', key('House of M', '8', 2005)],
  ['Scarlet Witch', "Children's Crusade", null],
  ['Iron Man', 'Civil War — Pro-Registration', key('Civil War', '4', 2006)],
  ['Hulk', 'World War Hulk', key('World War Hulk', '1', 2007)],
  ['Thor', 'Unworthy', null],
  ['Thor', 'Ragnarok', null],
  ['Magneto', "Ripped Out Wolverine's Adamantium", null],
  ['Daredevil', 'Born Again', null],
  ['Doctor Strange', 'Loses the Title', null],
  ['Gamora', 'Infinity Wars Requiem', null],
  ['Batman', 'A Death in the Family', key('Batman', '428', 1988)],
  ['The Joker', 'A Death in the Family', key('Batman', '428', 1988)],
  ['Batman', 'Knightfall — Broken', key('Batman', '497', 1993)],
  ['Batman', 'Batman R.I.P.', key('Batman', '676', 2008)],
  ['The Joker', 'The Killing Joke', key('Batman: The Killing Joke', '1', 1988)],
  ['Superman', 'The Death of Superman', key('Superman', '75', 1992)],
  ['Superman', 'All-Star Superman', key('All-Star Superman', '1', 2005)],
  ['The Flash', 'Dies in Crisis', key('Crisis on Infinite Earths', '8', 1985)],
  ['The Flash', 'Returns', key('The Flash: Rebirth', '1', 2009)],
  ['The Flash', 'Flashpoint', key('Flashpoint', '5', 2011)],
  ['Green Lantern', 'Becomes Parallax', key('Green Lantern', '50', 1994)],
  ['Green Lantern', 'Sacrifices Himself', key('Final Night', '4', 1996)],
  ['Green Lantern', 'Rebirth', null],
  ['Green Arrow', 'Death', key('Green Arrow', '101', 1995)],
  ['Green Arrow', 'Resurrection', null],
  ['Supergirl', 'Crisis on Infinite Earths', key('Crisis on Infinite Earths', '7', 1985)],
  ['Supergirl', 'Returned', null],
  ['Martian Manhunter', 'Final Crisis Sacrifice', key('Final Crisis', '1', 2008)],
  ['Nightwing', 'Becomes Batman', null],
  ['Nightwing', 'Exposed and Hunted', null],
  ["Ra's al Ghul", 'Lazarus Pit Revival', null],
  ['Deathstroke', 'The Judas Contract', key('Tales of the Teen Titans', '44', 1984)],
  ['Zatanna', 'Identity Crisis Fallout', null],
  ['Wonder Woman', 'Becomes God of War', null],
  ['Catwoman', 'Almost Mrs. Wayne', null],
  ['Harley Quinn', 'Leaves the Joker', null],
]

/** [character name, unlock issue key | null] for Character.currentStatusText */
export const STATUS_SPOILERS: [string, string | null][] = [
  ['Wolverine', null],
  ['Jean Grey', null],
  ['Scarlet Witch', key('House of M', '8', 2005)],
]

/** [team slug, member displayName, unlock issue key | null] for TeamMembership.leftNote */
export const MEMBERSHIP_SPOILERS: [string, string, string | null][] = [
  ['teen-titans', 'Terra', key('Tales of the Teen Titans', '44', 1984)],
]

/** [issue key, substring of whyItMatters]. The node unlocks after its own issue is read. */
export const PATH_NODE_SPOILERS: [string, string][] = [
  [key('The Amazing Spider-Man', '294', 1987), 'buried alive'],
  [key('Spider-Man: Blue', '1', 2002), 'the death waiting to come'],
  [key('Captain America', '25', 2007), 'Death of Captain America'],
  [key('Captain America', '25', 2007), 'The death and its aftermath'],
  [key('Civil War', '7', 2007), 'lays down his shield'],
  [key('The Amazing Spider-Man', '532', 2006), 'unmasking'],
  [key('Thor: God of Thunder', '6', 2013), 'sacrificing everything'],
  [key('Batman', '492', 1993), 'when Bruce is replaced'],
  [key('Superman', '75', 1992), 'The Death of Superman'],
  [key('The Flash: Rebirth', '1', 2009), 'Barry Allen being dead'],
  [key('Blackest Night', '8', 2010), 'twelve heroes resurrected'],
  [key('Tales of the Teen Titans', '44', 1984), "Terra's betrayal"],
  [key('Batman: The Long Halloween', '1', 1996), "Harvey Dent's tragedy"],
  [key('Wolverine: Origin', '1', 2001), 'James Howlett'],
  [key('World War Hulk', '1', 2007), 'the Hulk wins'],
]

/** Event outcome text split out of the public summary. */
export const EVENT_OUTCOMES: {
  event: string
  summary: string
  outcome: string
  unlock: string
}[] = [
  {
    event: 'House of M',
    summary:
      "The Scarlet Witch, driven to a breakdown by grief over her lost children, rewrites reality — creating a world where mutants rule and humans are second-class citizens. When the heroes discover the truth and confront her, the aftermath changes Marvel for years to come.",
    outcome: "Wanda whispers three words that change Marvel forever: 'No more mutants.'",
    unlock: key('House of M', '8', 2005),
  },
  {
    event: 'Flashpoint',
    summary:
      'Barry Allen traveled back in time to save his mother from the Reverse-Flash — and accidentally created a broken timeline. In this world, Superman is a government prisoner, Batman is Thomas Wayne (and a killer), and Aquaman and Wonder Woman are waging a war that is drowning Europe.',
    outcome:
      'Barry must destroy his greatest act of love to restore the world — and in doing so, triggers the New 52.',
    unlock: key('Flashpoint', '5', 2011),
  },
]

/** Spoiler-free replacements for bios that gave away plot. */
export const BIO_REWRITES: Record<string, string> = {
  'The Flash':
    'Police scientist Barry Allen was struck by a bolt of lightning and doused in chemicals — and became the fastest man alive. The Flash is the heart of the DC universe: optimistic, selfless, and the hero other heroes look to when the stakes are highest.',
  'Jean Grey':
    'One of the most powerful telepaths and telekinetics in the Marvel universe, Jean Grey is inseparable from the Phoenix Force — the cosmic entity that amplifies her abilities and tests her control. Her story redefined what a superhero saga could be, and it keeps asking whether the Phoenix and Jean are the same person.',
  'Scarlet Witch':
    'Wanda Maximoff is perhaps the most dangerous person in the Marvel universe — not because of raw power, but because she can rewrite reality, and her grief makes that power hard to control. Scarlet Witch embodies the terrible cost of compassion without control.',
}
