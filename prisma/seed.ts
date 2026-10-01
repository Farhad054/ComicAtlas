// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaLibSql } = require('@prisma/adapter-libsql')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path')

const absDbPath = path.join(process.cwd(), 'dev.db')
const adapter = new PrismaLibSql({ url: 'file://' + absDbPath })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Publishers
  const marvel = await prisma.publisher.upsert({
    where: { slug: 'marvel' },
    update: {},
    create: { name: 'Marvel Comics', slug: 'marvel' },
  })

  const dc = await prisma.publisher.upsert({
    where: { slug: 'dc' },
    update: {},
    create: { name: 'DC Comics', slug: 'dc' },
  })

  // Marvel Issues
  const astonishingXMen1 = await prisma.issue.create({
    data: {
      publisherId: marvel.id,
      seriesName: 'Astonishing X-Men',
      issueNumber: '1',
      year: 2004,
      coverImageUrl: 'https://comicvine.gamespot.com/a/uploads/scale_large/6/67663/2084629-axm01.jpg',
      summary: 'Cyclops and Emma Frost lead a new team of X-Men.',
    },
  })

  const astonishingXMen2 = await prisma.issue.create({
    data: {
      publisherId: marvel.id,
      seriesName: 'Astonishing X-Men',
      issueNumber: '2',
      year: 2004,
      coverImageUrl: 'https://comicvine.gamespot.com/a/uploads/scale_large/6/67663/2084630-axm02.jpg',
      summary: 'The X-Men face a new threat as Cyclops rebuilds the team.',
    },
  })

  const astonishingXMen3 = await prisma.issue.create({
    data: {
      publisherId: marvel.id,
      seriesName: 'Astonishing X-Men',
      issueNumber: '3',
      year: 2004,
      coverImageUrl: null,
      summary: 'Wolverine confronts a ghost from his past.',
    },
  })

  const xMenGodLovesMan1 = await prisma.issue.create({
    data: {
      publisherId: marvel.id,
      seriesName: 'X-Men: God Loves, Man Kills',
      issueNumber: '1',
      year: 1982,
      coverImageUrl: null,
      summary: 'A classic standalone story about prejudice and the X-Men.',
    },
  })

  const wolverineOrigin1 = await prisma.issue.create({
    data: {
      publisherId: marvel.id,
      seriesName: 'Wolverine: Origin',
      issueNumber: '1',
      year: 2001,
      coverImageUrl: null,
      summary: "The true origin of Wolverine's powers finally revealed.",
    },
  })

  const wolverineV1 = await prisma.issue.create({
    data: {
      publisherId: marvel.id,
      seriesName: 'Wolverine',
      issueNumber: '1',
      year: 1982,
      coverImageUrl: null,
      summary: 'The original Wolverine limited series set in Japan.',
    },
  })

  const wolverineWeaponX = await prisma.issue.create({
    data: {
      publisherId: marvel.id,
      seriesName: 'Marvel Comics Presents',
      issueNumber: '72',
      year: 1991,
      coverImageUrl: null,
      summary: 'Weapon X storyline begins — the making of the killing machine.',
    },
  })

  // DC Issues
  const batmanYearOne1 = await prisma.issue.create({
    data: {
      publisherId: dc.id,
      seriesName: 'Batman',
      issueNumber: '404',
      year: 1987,
      coverImageUrl: null,
      summary: 'Bruce Wayne returns to Gotham — Batman: Year One begins.',
    },
  })

  const batmanLongHalloween1 = await prisma.issue.create({
    data: {
      publisherId: dc.id,
      seriesName: 'Batman: The Long Halloween',
      issueNumber: '1',
      year: 1996,
      coverImageUrl: null,
      summary: 'A serial killer strikes only on holidays. Batman investigates.',
    },
  })

  const batmanHushV1 = await prisma.issue.create({
    data: {
      publisherId: dc.id,
      seriesName: 'Batman',
      issueNumber: '608',
      year: 2002,
      coverImageUrl: null,
      summary: 'Hush begins — an enemy who knows Batman better than he knows himself.',
    },
  })

  const supermanBirthright1 = await prisma.issue.create({
    data: {
      publisherId: dc.id,
      seriesName: 'Superman: Birthright',
      issueNumber: '1',
      year: 2003,
      coverImageUrl: null,
      summary: "Clark Kent's journey from Smallville to becoming Superman.",
    },
  })

  const supermanForTomorrow1 = await prisma.issue.create({
    data: {
      publisherId: dc.id,
      seriesName: 'Superman',
      issueNumber: '204',
      year: 2004,
      coverImageUrl: null,
      summary: 'One million people vanish — and Superman is to blame?',
    },
  })

  const supermanAllStar1 = await prisma.issue.create({
    data: {
      publisherId: dc.id,
      seriesName: 'All-Star Superman',
      issueNumber: '1',
      year: 2005,
      coverImageUrl: null,
      summary: "Superman receives a death sentence. What does the Man of Steel do with the time he has left?",
    },
  })

  // Marvel Characters
  const wolverine = await prisma.character.create({
    data: {
      publisherId: marvel.id,
      name: 'Wolverine',
      realName: 'James "Logan" Howlett',
      aliases: JSON.stringify(['Logan', 'Weapon X', 'James Howlett']),
      bio: 'A mutant with a violent past and an even more violent present, Wolverine has enhanced senses, a regenerative healing factor, and retractable adamantium-coated bone claws. A founding X-Man and Avenger, he is one of Marvel\'s most complex and enduring heroes.',
      powers: JSON.stringify(['Regenerative healing factor', 'Adamantium skeleton & claws', 'Enhanced senses', 'Superhuman strength & agility']),
      firstAppearanceYear: 1974,
      firstAppearanceIssue: 'Incredible Hulk #181',
      creators: JSON.stringify(['Roy Thomas', 'Len Wein', 'John Romita Sr.']),
      currentStatusText: 'Currently leading his own X-Force team.',
      imageUrl: 'https://i.annihil.us/u/prod/marvel/i/mg/2/60/537bcaef0f6cf.jpg',
    },
  })

  // Wolverine timeline
  await prisma.timelineEvent.createMany({
    data: [
      { characterId: wolverine.id, year: 1886, title: 'Powers Manifest', description: "Young James Howlett's bone claws erupt for the first time in a moment of trauma.", order: 1 },
      { characterId: wolverine.id, year: 1945, title: 'Weapon X', description: 'Logan is captured and subjected to the Weapon X program — his skeleton is bonded with indestructible adamantium.', order: 2 },
      { characterId: wolverine.id, year: 1974, title: 'First Appearance', description: 'Logan first appears battling the Hulk, setting the stage for his role as one of Marvel\'s most popular heroes.', order: 3 },
      { characterId: wolverine.id, year: 1975, title: 'Joins the X-Men', description: 'Wolverine joins a new team of X-Men alongside Storm, Colossus, and Nightcrawler in Giant-Size X-Men #1.', order: 4 },
      { characterId: wolverine.id, year: 1982, title: 'Solo Series', description: 'Wolverine gets his first solo limited series, set in Japan, exploring his samurai code and inner demons.', order: 5 },
      { characterId: wolverine.id, year: 2014, title: 'Death', description: 'Wolverine loses his healing factor and is encased in adamantium — killed by his own gift.', order: 6 },
    ],
  })

  const spiderMan = await prisma.character.create({
    data: {
      publisherId: marvel.id,
      name: 'Spider-Man',
      realName: 'Peter Parker',
      aliases: JSON.stringify(['Spidey', 'The Amazing Spider-Man', 'Iron Spider']),
      bio: 'Bitten by a radioactive spider, Peter Parker gained incredible powers — but more importantly, a sense of responsibility. The friendly neighborhood Spider-Man is Marvel\'s heart and soul: a working-class hero who juggles impossible odds with wit, heart, and web-shooters.',
      powers: JSON.stringify(['Wall-crawling', 'Spider-sense', 'Superhuman strength & agility', 'Web-shooting']),
      firstAppearanceYear: 1962,
      firstAppearanceIssue: 'Amazing Fantasy #15',
      creators: JSON.stringify(['Stan Lee', 'Steve Ditko']),
      currentStatusText: 'Continuing his adventures as the Amazing Spider-Man.',
      imageUrl: 'https://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b.jpg',
    },
  })

  await prisma.timelineEvent.createMany({
    data: [
      { characterId: spiderMan.id, year: 1962, title: 'Bitten by Radioactive Spider', description: 'Peter Parker gains incredible powers from a spider bite at a science exhibit.', order: 1 },
      { characterId: spiderMan.id, year: 1962, title: "Uncle Ben's Death", description: 'Peter\'s failure to stop a thief costs Uncle Ben his life — teaching him that with great power comes great responsibility.', order: 2 },
      { characterId: spiderMan.id, year: 1973, title: 'Gwen Stacy Dies', description: 'The Green Goblin throws Gwen Stacy from a bridge. Spider-Man\'s attempt to save her snaps her neck — a defining tragedy.', order: 3 },
      { characterId: spiderMan.id, year: 1984, title: 'The Black Suit', description: 'Peter bonds with an alien symbiote on Battleworld, bringing back what appears to be a sleek new costume — but it\'s alive.', order: 4 },
      { characterId: spiderMan.id, year: 2007, title: 'One More Day', description: 'Peter makes a deal with Mephisto to save Aunt May — erasing his marriage to Mary Jane from history.', order: 5 },
    ],
  })

  // DC Characters
  const batman = await prisma.character.create({
    data: {
      publisherId: dc.id,
      name: 'Batman',
      realName: 'Bruce Wayne',
      aliases: JSON.stringify(['The Dark Knight', 'The Caped Crusader', 'The World\'s Greatest Detective']),
      bio: 'After watching his parents murdered before his eyes, billionaire Bruce Wayne spent years training to become the ultimate weapon against crime. As Batman, he patrols Gotham City armed with his mind, his body, and the finest technology money can build — the living proof that a human being, with enough will, can become something extraordinary.',
      powers: JSON.stringify(['Peak human physical condition', 'Master detective', 'Martial arts mastery', 'Advanced technology & gadgets', 'Genius-level intellect']),
      firstAppearanceYear: 1939,
      firstAppearanceIssue: 'Detective Comics #27',
      creators: JSON.stringify(['Bob Kane', 'Bill Finger']),
      currentStatusText: 'Protecting Gotham City from the shadows.',
      imageUrl: 'https://i.annihil.us/u/prod/marvel/i/mg/6/50/58717c519db01.jpg',
    },
  })

  await prisma.timelineEvent.createMany({
    data: [
      { characterId: batman.id, year: 1939, title: 'First Appearance', description: "The Batman debuts in Detective Comics, Gotham's mysterious new vigilante.", order: 1 },
      { characterId: batman.id, year: 1940, title: 'Crime Alley', description: "Thomas and Martha Wayne are shot by Joe Chill in front of young Bruce — the night that creates the Batman.", order: 2 },
      { characterId: batman.id, year: 1987, title: 'Year One', description: "Frank Miller reimagines Batman's first year: the fear, the doubt, the determination to become something more than a man.", order: 3 },
      { characterId: batman.id, year: 1988, title: 'A Death in the Family', description: 'The Joker beats Robin (Jason Todd) to death with a crowbar. Readers voted for his death. Batman carries the guilt forever.', order: 4 },
      { characterId: batman.id, year: 1993, title: 'Knightfall', description: 'Bane breaks Batman\'s back. Bruce is replaced by Jean-Paul Valley as a brutal, unhinged Batman.', order: 5 },
      { characterId: batman.id, year: 2008, title: 'Batman R.I.P.', description: "Grant Morrison's epic dismantles Bruce Wayne's mind — and the Batman identity itself.", order: 6 },
    ],
  })

  const superman = await prisma.character.create({
    data: {
      publisherId: dc.id,
      name: 'Superman',
      realName: 'Kal-El / Clark Kent',
      aliases: JSON.stringify(['Man of Steel', 'Man of Tomorrow', 'The Last Son of Krypton']),
      bio: 'Rocketed from the dying planet Krypton as an infant, Kal-El was raised in Smallville, Kansas as Clark Kent. Under Earth\'s yellow sun, he became the most powerful being on the planet — but the values instilled by Jonathan and Martha Kent made him its greatest hero. Superman stands for hope.',
      powers: JSON.stringify(['Flight', 'Super strength', 'Invulnerability', 'Heat vision', 'X-ray vision', 'Super speed', 'Super breath']),
      firstAppearanceYear: 1938,
      firstAppearanceIssue: 'Action Comics #1',
      creators: JSON.stringify(['Jerry Siegel', 'Joe Shuster']),
      currentStatusText: 'Protecting Earth and beyond as the Man of Steel.',
      imageUrl: null,
    },
  })

  await prisma.timelineEvent.createMany({
    data: [
      { characterId: superman.id, year: 1938, title: 'First Appearance', description: "Superman debuts in Action Comics #1 — the world's first superhero.", order: 1 },
      { characterId: superman.id, year: 1986, title: 'Crisis on Infinite Earths', description: 'The multiverse collapses. Superman\'s history is rebooted with Man of Steel, clarifying his origins for a new generation.', order: 2 },
      { characterId: superman.id, year: 1992, title: 'The Death of Superman', description: 'Doomsday beats Superman to death in the streets of Metropolis. The world mourns. But death, it turns out, is temporary.', order: 3 },
      { characterId: superman.id, year: 2003, title: 'Birthright', description: "Mark Waid's Birthright redefines Clark Kent's journey from Smallville farm boy to the world's greatest hero.", order: 4 },
      { characterId: superman.id, year: 2005, title: 'All-Star Superman', description: "Grant Morrison's love letter to Superman: dying from solar overload, Clark Kent tries to complete 12 legendary labors.", order: 5 },
    ],
  })

  // Reading Paths - Wolverine
  const wolverineBeginner = await prisma.readingPath.create({
    data: {
      characterId: wolverine.id,
      tier: 'beginner',
    },
  })

  await prisma.readingPathNode.createMany({
    data: [
      { readingPathId: wolverineBeginner.id, issueId: astonishingXMen1.id, whyItMatters: 'The best modern entry point — Whedon writes Wolverine as the gruff heart of a new X-Men team. Perfect first issue energy.', required: true, estTimeMinutes: 20, order: 1 },
      { readingPathId: wolverineBeginner.id, issueId: astonishingXMen2.id, whyItMatters: 'The team dynamic snaps into place here. You see exactly who Logan is when surrounded by people he respects (and some he doesn\'t).', required: true, estTimeMinutes: 20, order: 2 },
      { readingPathId: wolverineBeginner.id, issueId: xMenGodLovesMan1.id, whyItMatters: 'A standalone masterpiece about prejudice — no continuity required. Logan\'s rage hits different when the cause is this righteous.', required: false, estTimeMinutes: 45, order: 3 },
    ],
  })

  const wolverineEssential = await prisma.readingPath.create({
    data: {
      characterId: wolverine.id,
      tier: 'essential',
    },
  })

  await prisma.readingPathNode.createMany({
    data: [
      { readingPathId: wolverineEssential.id, issueId: astonishingXMen1.id, whyItMatters: 'Start here — cleanest modern entry point for both Logan and the X-Men.', required: true, estTimeMinutes: 20, order: 1 },
      { readingPathId: wolverineEssential.id, issueId: astonishingXMen2.id, whyItMatters: 'The team establishes itself. Wolverine\'s role as the moral enforcer becomes clear.', required: true, estTimeMinutes: 20, order: 2 },
      { readingPathId: wolverineEssential.id, issueId: wolverineV1.id, whyItMatters: "The original solo series set in Japan. This is Logan distilled: the samurai code, the berserker rage, the man trying to be more than the weapon he was made into.", required: true, estTimeMinutes: 25, order: 3 },
      { readingPathId: wolverineEssential.id, issueId: wolverineWeaponX.id, whyItMatters: 'Barry Windsor-Smith\'s Weapon X is harrowing — the procedure that bonded adamantium to his bones, rendered in clinical horror.', required: true, estTimeMinutes: 25, order: 4 },
      { readingPathId: wolverineEssential.id, issueId: xMenGodLovesMan1.id, whyItMatters: 'A standalone masterpiece. No continuity required, maximum emotional impact.', required: false, estTimeMinutes: 45, order: 5 },
    ],
  })

  const wolverineComplete = await prisma.readingPath.create({
    data: {
      characterId: wolverine.id,
      tier: 'complete',
    },
  })

  await prisma.readingPathNode.createMany({
    data: [
      { readingPathId: wolverineComplete.id, issueId: wolverineOrigin1.id, whyItMatters: "The long-kept secret of Logan's true origin — James Howlett in 19th century Canada. Controversial when released, essential reading now.", required: true, estTimeMinutes: 20, order: 1 },
      { readingPathId: wolverineComplete.id, issueId: astonishingXMen1.id, whyItMatters: "Whedon's run is the essential modern X-Men story. Logan at his best.", required: true, estTimeMinutes: 20, order: 2 },
      { readingPathId: wolverineComplete.id, issueId: astonishingXMen2.id, whyItMatters: 'Continues directly from #1 — read back to back.', required: true, estTimeMinutes: 20, order: 3 },
      { readingPathId: wolverineComplete.id, issueId: astonishingXMen3.id, whyItMatters: "The arc deepens. Logan's past comes calling in Whedon's hands.", required: true, estTimeMinutes: 20, order: 4 },
      { readingPathId: wolverineComplete.id, issueId: wolverineV1.id, whyItMatters: "The Japan series — the soul of everything Wolverine solo stories try to be.", required: true, estTimeMinutes: 25, order: 5 },
      { readingPathId: wolverineComplete.id, issueId: wolverineWeaponX.id, whyItMatters: 'Weapon X. The horror show that explains every nightmare Logan has.', required: true, estTimeMinutes: 25, order: 6 },
      { readingPathId: wolverineComplete.id, issueId: xMenGodLovesMan1.id, whyItMatters: 'God Loves, Man Kills. The X-Men\'s definitive statement on bigotry and survival.', required: false, estTimeMinutes: 45, order: 7 },
    ],
  })

  // Reading Paths - Batman
  const batmanBeginner = await prisma.readingPath.create({
    data: {
      characterId: batman.id,
      tier: 'beginner',
    },
  })

  await prisma.readingPathNode.createMany({
    data: [
      { readingPathId: batmanBeginner.id, issueId: batmanYearOne1.id, whyItMatters: "Frank Miller's Year One is the definitive Batman origin — Gotham as a noir city, Bruce as a scared young man becoming something larger.", required: true, estTimeMinutes: 25, order: 1 },
      { readingPathId: batmanBeginner.id, issueId: batmanLongHalloween1.id, whyItMatters: "Jeph Loeb's holiday thriller bridges Year One to The Dark Knight Returns. One of the best Batman mysteries ever written.", required: false, estTimeMinutes: 25, order: 2 },
    ],
  })

  const batmanEssential = await prisma.readingPath.create({
    data: {
      characterId: batman.id,
      tier: 'essential',
    },
  })

  await prisma.readingPathNode.createMany({
    data: [
      { readingPathId: batmanEssential.id, issueId: batmanYearOne1.id, whyItMatters: 'Year One — start here. No Batman story earns its meaning without this foundation.', required: true, estTimeMinutes: 25, order: 1 },
      { readingPathId: batmanEssential.id, issueId: batmanLongHalloween1.id, whyItMatters: 'A year-long murder mystery during the fall of the mob. Harvey Dent\'s tragedy is the emotional core.', required: true, estTimeMinutes: 25, order: 2 },
      { readingPathId: batmanEssential.id, issueId: batmanHushV1.id, whyItMatters: "Jim Lee draws every major Batman villain in one arc. Hush is a love letter to Batman's world and a terrifying new enemy.", required: true, estTimeMinutes: 25, order: 3 },
    ],
  })

  // Reading Paths - Superman
  const supermanBeginner = await prisma.readingPath.create({
    data: {
      characterId: superman.id,
      tier: 'beginner',
    },
  })

  await prisma.readingPathNode.createMany({
    data: [
      { readingPathId: supermanBeginner.id, issueId: supermanBirthright1.id, whyItMatters: "The best modern Superman origin. Mark Waid understands why Superman matters — this is the story that gets it.", required: true, estTimeMinutes: 25, order: 1 },
      { readingPathId: supermanBeginner.id, issueId: supermanAllStar1.id, whyItMatters: "Grant Morrison's All-Star Superman is pure joy — Superman at his most powerful and most human, facing the one thing he can't punch.", required: false, estTimeMinutes: 25, order: 2 },
    ],
  })

  const supermanEssential = await prisma.readingPath.create({
    data: {
      characterId: superman.id,
      tier: 'essential',
    },
  })

  await prisma.readingPathNode.createMany({
    data: [
      { readingPathId: supermanEssential.id, issueId: supermanBirthright1.id, whyItMatters: 'Birthright — the origin that sticks. Clark Kent before the cape, before Metropolis, before the symbol meant something.', required: true, estTimeMinutes: 25, order: 1 },
      { readingPathId: supermanEssential.id, issueId: supermanForTomorrow1.id, whyItMatters: "Brian Azzarello and Jim Lee's For Tomorrow asks: what is Superman's responsibility when his actions cause harm?", required: true, estTimeMinutes: 25, order: 2 },
      { readingPathId: supermanEssential.id, issueId: supermanAllStar1.id, whyItMatters: "All-Star Superman. The greatest Superman story ever told — and the most accessible. Read this and understand everything.", required: true, estTimeMinutes: 25, order: 3 },
    ],
  })

  // Spider-Man issues
  const amazingFantasy15 = await prisma.issue.create({
    data: {
      publisherId: marvel.id,
      seriesName: 'Amazing Fantasy',
      issueNumber: '15',
      year: 1962,
      coverImageUrl: null,
      summary: 'Spider-Man\'s debut — Peter Parker bitten, Uncle Ben dies, with great power comes great responsibility.',
    },
  })

  const amazingSpiderMan33 = await prisma.issue.create({
    data: {
      publisherId: marvel.id,
      seriesName: 'The Amazing Spider-Man',
      issueNumber: '33',
      year: 1966,
      coverImageUrl: null,
      summary: 'The classic "If This Be My Destiny" conclusion — Spider-Man lifts a machine through sheer force of will.',
    },
  })

  const spiderManBlueV1 = await prisma.issue.create({
    data: {
      publisherId: marvel.id,
      seriesName: 'Spider-Man: Blue',
      issueNumber: '1',
      year: 2002,
      coverImageUrl: null,
      summary: "Jeph Loeb's love letter to Peter and Gwen — a bittersweet look back at Spider-Man's greatest romance.",
    },
  })

  // Spider-Man reading paths
  const spiderManBeginner = await prisma.readingPath.create({
    data: {
      characterId: spiderMan.id,
      tier: 'beginner',
    },
  })

  await prisma.readingPathNode.createMany({
    data: [
      { readingPathId: spiderManBeginner.id, issueId: amazingFantasy15.id, whyItMatters: 'The origin — 11 pages that launched the most relatable superhero ever created. Required reading for any Marvel fan.', required: true, estTimeMinutes: 15, order: 1 },
      { readingPathId: spiderManBeginner.id, issueId: amazingSpiderMan33.id, whyItMatters: "The most iconic Spider-Man moment: trapped under machinery, nearly dead, he lifts it anyway. This is what Peter Parker is made of.", required: true, estTimeMinutes: 20, order: 2 },
      { readingPathId: spiderManBeginner.id, issueId: spiderManBlueV1.id, whyItMatters: 'A perfect standalone. Gorgeous art, real emotion — a great second comic if you loved Amazing Fantasy.', required: false, estTimeMinutes: 20, order: 3 },
    ],
  })

  // Relationships
  await prisma.relationship.createMany({
    data: [
      { characterAId: wolverine.id, characterBId: spiderMan.id, type: 'ally' },
      { characterAId: batman.id, characterBId: superman.id, type: 'ally' },
    ],
  })

  // Event: Civil War
  const civilWarIssue1 = await prisma.issue.create({
    data: {
      publisherId: marvel.id,
      seriesName: 'Civil War',
      issueNumber: '1',
      year: 2006,
      coverImageUrl: null,
      summary: 'The Superhero Registration Act tears the Marvel universe in two.',
    },
  })

  const civilWarIssue7 = await prisma.issue.create({
    data: {
      publisherId: marvel.id,
      seriesName: 'Civil War',
      issueNumber: '7',
      year: 2007,
      coverImageUrl: null,
      summary: 'The war ends. Captain America surrenders. Nothing is the same.',
    },
  })

  const civilWarSpiderMan1 = await prisma.issue.create({
    data: {
      publisherId: marvel.id,
      seriesName: 'The Amazing Spider-Man',
      issueNumber: '532',
      year: 2006,
      coverImageUrl: null,
      summary: 'Spider-Man unmasks before the world — a moment he can never take back.',
    },
  })

  const civilWar = await prisma.event.create({
    data: {
      publisherId: marvel.id,
      name: 'Civil War',
      summary: "When a superhero battle destroys a school in Stamford, Connecticut — killing hundreds of children — the world demands accountability. The US government passes the Superhero Registration Act, forcing all heroes to unmask and work for S.H.I.E.L.D. Iron Man supports it. Captain America goes underground to fight it. Friends become enemies. The Marvel universe tears itself in half.",
      cause: 'The Stamford disaster — New Warriors accidentally trigger an explosion that kills 612 civilians, including school children.',
      imageUrl: null,
    },
  })

  const civilWarPath = await prisma.readingPath.create({
    data: {
      eventId: civilWar.id,
      tier: 'essential',
    },
  })

  await prisma.readingPathNode.createMany({
    data: [
      { readingPathId: civilWarPath.id, issueId: civilWarIssue1.id, whyItMatters: 'The opening shot. The Registration Act is proposed and the battle lines are drawn.', required: true, estTimeMinutes: 20, order: 1 },
      { readingPathId: civilWarPath.id, issueId: civilWarSpiderMan1.id, whyItMatters: "Spider-Man's unmasking is the event's most personal moment — and it haunts him for years after.", required: false, estTimeMinutes: 20, order: 2 },
      { readingPathId: civilWarPath.id, issueId: civilWarIssue7.id, whyItMatters: "The war ends not with a victory but a surrender. Steve Rogers looks around at the destruction and lays down his shield.", required: true, estTimeMinutes: 20, order: 3 },
    ],
  })

  await prisma.impactEntry.createMany({
    data: [
      { eventId: civilWar.id, characterId: wolverine.id, consequenceText: 'Wolverine sided with Iron Man initially but later grew disillusioned with the Registration Act\'s extremes.' },
      { eventId: civilWar.id, characterId: spiderMan.id, consequenceText: 'Peter Parker publicly unmasked as Spider-Man — a decision with catastrophic consequences for his family.' },
    ],
  })

  console.log('Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
