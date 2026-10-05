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
  // Clear existing data in dependency order
  await prisma.impactEntry.deleteMany()
  await prisma.readingPathNode.deleteMany()
  await prisma.readingPath.deleteMany()
  await prisma.readingProgress.deleteMany()
  await prisma.relationship.deleteMany()
  await prisma.timelineEvent.deleteMany()
  await prisma.eventTeam.deleteMany()
  await prisma.teamRelationship.deleteMany()
  await prisma.teamLineup.deleteMany()
  await prisma.teamMembership.deleteMany()
  await prisma.event.deleteMany()
  await prisma.issue.deleteMany()
  await prisma.team.deleteMany()
  await prisma.character.deleteMany()
  await prisma.publisher.deleteMany()

  // Publishers
  const marvel = await prisma.publisher.create({ data: { name: 'Marvel Comics', slug: 'marvel' } })
  const dc = await prisma.publisher.create({ data: { name: 'DC Comics', slug: 'dc' } })

  // ─────────────────────────────────────────────
  // MARVEL ISSUES
  // ─────────────────────────────────────────────
  const astonishingXMen1   = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Astonishing X-Men', issueNumber: '1',   year: 2004, coverImageUrl: null, summary: 'Cyclops and Emma Frost lead a new team of X-Men.' } })
  const astonishingXMen2   = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Astonishing X-Men', issueNumber: '2',   year: 2004, coverImageUrl: null, summary: 'The team dynamic snaps into place — Wolverine as the moral enforcer.' } })
  const astonishingXMen3   = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Astonishing X-Men', issueNumber: '3',   year: 2004, coverImageUrl: null, summary: "Wolverine confronts a ghost from his past." } })
  const xMenGodLoves       = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'X-Men: God Loves, Man Kills', issueNumber: '1', year: 1982, coverImageUrl: null, summary: 'A standalone masterpiece about prejudice and the X-Men.' } })
  const wolverineOrigin1   = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Wolverine: Origin', issueNumber: '1',   year: 2001, coverImageUrl: null, summary: "The true origin of Wolverine's powers revealed." } })
  const wolverineV1        = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Wolverine', issueNumber: '1',           year: 1982, coverImageUrl: null, summary: 'The original Wolverine limited series set in Japan.' } })
  const wolverineWeaponX   = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Marvel Comics Presents', issueNumber: '72', year: 1991, coverImageUrl: null, summary: 'The Weapon X program — the making of the killing machine.' } })

  const amazingFantasy15   = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Amazing Fantasy', issueNumber: '15',    year: 1962, coverImageUrl: null, summary: "Spider-Man's debut — bitten, Uncle Ben dies, great responsibility." } })
  const amazingSpiderMan33 = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'The Amazing Spider-Man', issueNumber: '33', year: 1966, coverImageUrl: null, summary: 'The classic conclusion — Spider-Man lifts a machine through sheer will.' } })
  const spiderManBlue1     = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Spider-Man: Blue', issueNumber: '1',    year: 2002, coverImageUrl: null, summary: "Loeb's love letter to Peter and Gwen — bittersweet and gorgeous." } })
  const spiderManKraven    = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'The Amazing Spider-Man', issueNumber: '294', year: 1987, coverImageUrl: null, summary: "Kraven's Last Hunt concludes — the most harrowing Spider-Man arc ever." } })

  const invincibleIronMan1 = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Invincible Iron Man', issueNumber: '1', year: 2008, coverImageUrl: null, summary: "Fraction and Larroca's modern Iron Man — clean entry point, propulsive story." } })
  const ironManExtremis1   = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Iron Man', issueNumber: '1',            year: 2005, coverImageUrl: null, summary: 'Extremis: Ellis rewires Tony Stark for the 21st century.' } })
  const demonInABottle     = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'The Invincible Iron Man', issueNumber: '128', year: 1979, coverImageUrl: null, summary: "Demon in a Bottle — Tony Stark's alcoholism, the defining Iron Man story." } })
  const ironManArmorWars1  = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Iron Man', issueNumber: '225',          year: 1987, coverImageUrl: null, summary: "Armor Wars begins — Tony discovers his tech is being used by criminals." } })

  const captainAmerica1Brubaker = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Captain America', issueNumber: '1', year: 2005, coverImageUrl: null, summary: "Brubaker's run begins — Steve Rogers hunts a ghost from the Cold War." } })
  const captainAmericaV1   = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Captain America Comics', issueNumber: '1', year: 1941, coverImageUrl: null, summary: "The original Captain America punches Hitler — the first issue." } })
  const whatsWorthFighting = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Captain America', issueNumber: '25',   year: 2007, coverImageUrl: null, summary: "The Death of Captain America — Steve Rogers is shot on the courthouse steps." } })

  const thorGodOfThunder1  = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Thor: God of Thunder', issueNumber: '1', year: 2012, coverImageUrl: null, summary: "Jason Aaron's Thor — three Thors across time face the God Butcher." } })
  const thorV1             = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'The Mighty Thor', issueNumber: '337',  year: 1983, coverImageUrl: null, summary: "Walt Simonson's run begins — Beta Ray Bill lifts Mjolnir. Everything changes." } })
  const thorWorthyRival    = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Thor: God of Thunder', issueNumber: '6', year: 2013, coverImageUrl: null, summary: "Gorr the God Butcher revealed in full — the most frightening Thor villain." } })

  const incredibleHulk181  = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'The Incredible Hulk', issueNumber: '181', year: 1974, coverImageUrl: null, summary: "Wolverine's first full appearance — Hulk vs Weapon X." } })
  const planetHulk1        = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'The Incredible Hulk', issueNumber: '92', year: 2006, coverImageUrl: null, summary: "Planet Hulk begins — the Hulk crash-lands on a gladiator world." } })
  const worldWarHulk1      = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'World War Hulk', issueNumber: '1',    year: 2007, coverImageUrl: null, summary: "Hulk returns from Planet Sakaar to destroy the Illuminati." } })

  const docStrange1        = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Doctor Strange', issueNumber: '1',     year: 2015, coverImageUrl: null, summary: "Jason Aaron's run — Strange is Earth's Sorcerer Supreme facing the Empirikul." } })
  const strangerThings1    = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Strange Tales', issueNumber: '110',   year: 1963, coverImageUrl: null, summary: "Doctor Strange's first appearance — the Ancient One, the Eye of Agamotto." } })
  const docStrangeOmega    = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Doctor Strange', issueNumber: '381',   year: 2018, coverImageUrl: null, summary: "Donny Cates' run — Strange stripped of the Sorcerer Supreme title." } })

  // ─────────────────────────────────────────────
  // DC ISSUES
  // ─────────────────────────────────────────────
  const batmanYearOne1       = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'Batman', issueNumber: '404',          year: 1987, coverImageUrl: null, summary: "Frank Miller's Year One — Bruce Wayne returns to Gotham." } })
  const batmanLongHalloween1 = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'Batman: The Long Halloween', issueNumber: '1', year: 1996, coverImageUrl: null, summary: 'A serial killer strikes only on holidays. Batman investigates.' } })
  const batmanHush1          = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'Batman', issueNumber: '608',          year: 2002, coverImageUrl: null, summary: 'Hush — an enemy who knows Batman better than himself.' } })
  const batmanKnightfall1    = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'Batman', issueNumber: '492',          year: 1993, coverImageUrl: null, summary: "Knightfall begins — Bane releases Arkham's inmates. Batman is broken." } })
  const batmanRIP            = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'Batman', issueNumber: '676',          year: 2008, coverImageUrl: null, summary: "Batman R.I.P. — Morrison dismantles the Dark Knight's mind." } })

  const supermanBirthright1  = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'Superman: Birthright', issueNumber: '1', year: 2003, coverImageUrl: null, summary: "Clark Kent's journey from Smallville to becoming Superman." } })
  const supermanAllStar1     = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'All-Star Superman', issueNumber: '1', year: 2005, coverImageUrl: null, summary: "Superman receives a death sentence. What does the Man of Steel do with the time he has left?" } })
  const supermanForTomorrow1 = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'Superman', issueNumber: '204',        year: 2004, coverImageUrl: null, summary: 'One million people vanish — and Superman is to blame?' } })
  const supermanDeathOf      = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'Superman', issueNumber: '75',         year: 1992, coverImageUrl: null, summary: 'The Death of Superman — Doomsday beats Superman to death in Metropolis.' } })

  const wwYearOne1           = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'Wonder Woman', issueNumber: '1',      year: 1987, coverImageUrl: null, summary: "Perez's origin — Diana leaves Themyscira for the world of Man." } })
  const wwRebirth1           = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'Wonder Woman: Rebirth', issueNumber: '1', year: 2016, coverImageUrl: null, summary: "Greg Rucka rewrites Diana's history — which version is real?" } })
  const wwTrueAmazon         = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'Wonder Woman: The True Amazon', issueNumber: '1', year: 2016, coverImageUrl: null, summary: "Jill Thompson's standalone origin — Diana before the heroics." } })

  const flashRebirth1        = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'The Flash: Rebirth', issueNumber: '1', year: 2009, coverImageUrl: null, summary: "Barry Allen returns from the dead and reclaims the mantle of the Flash." } })
  const flashByGeoffJohns1   = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'The Flash', issueNumber: '164',       year: 2000, coverImageUrl: null, summary: "Geoff Johns' Flash begins — Wally West faces Gorilla Grodd." } })
  const flashBlackestNight   = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'Blackest Night: The Flash', issueNumber: '1', year: 2010, coverImageUrl: null, summary: "Barry Allen faces dead heroes risen as Black Lanterns." } })

  // ─────────────────────────────────────────────
  // MARVEL CHARACTERS (8)
  // ─────────────────────────────────────────────
  const wolverine = await prisma.character.create({
    data: {
      publisherId: marvel.id,
      name: 'Wolverine',
      realName: 'James "Logan" Howlett',
      aliases: JSON.stringify(['Logan', 'Weapon X', 'James Howlett']),
      bio: "A mutant with a violent past and an even more violent present, Wolverine has enhanced senses, a regenerative healing factor, and retractable adamantium-coated bone claws. He's a founding X-Man and Avenger — one of Marvel's most complex and enduring heroes.",
      powers: JSON.stringify(['Regenerative healing factor', 'Adamantium skeleton & claws', 'Enhanced senses', 'Superhuman agility']),
      firstAppearanceYear: 1974, firstAppearanceIssue: 'Incredible Hulk #181',
      creators: JSON.stringify(['Roy Thomas', 'Len Wein', 'John Romita Sr.']),
      currentStatusText: 'Leading X-Force after his resurrection.',
      imageUrl: 'https://i.annihil.us/u/prod/marvel/i/mg/2/60/537bcaef0f6cf.jpg',
    },
  })
  await prisma.timelineEvent.createMany({ data: [
    { characterId: wolverine.id, year: 1886, title: 'Powers Manifest', description: "Young James Howlett's bone claws erupt for the first time in a moment of trauma.", order: 1 },
    { characterId: wolverine.id, year: 1945, title: 'Weapon X', description: "Captured and subjected to the Weapon X program — his skeleton is bonded with indestructible adamantium.", order: 2 },
    { characterId: wolverine.id, year: 1974, title: 'First Appearance', description: "Logan first appears battling the Hulk, setting the stage for his role as one of Marvel's most popular heroes.", order: 3 },
    { characterId: wolverine.id, year: 1975, title: 'Joins the X-Men', description: "Wolverine joins the new X-Men alongside Storm, Colossus, and Nightcrawler in Giant-Size X-Men #1.", order: 4 },
    { characterId: wolverine.id, year: 1982, title: 'Solo Series', description: "His first solo series, set in Japan, explores his samurai code and the man trying to be more than the weapon he was made into.", order: 5 },
    { characterId: wolverine.id, year: 2014, title: 'Death', description: "Wolverine loses his healing factor and is encased in adamantium — killed by his own gift.", order: 6 },
  ]})

  const spiderMan = await prisma.character.create({
    data: {
      publisherId: marvel.id,
      name: 'Spider-Man',
      realName: 'Peter Parker',
      aliases: JSON.stringify(['Spidey', 'The Amazing Spider-Man', 'Iron Spider']),
      bio: "Bitten by a radioactive spider, Peter Parker gained incredible powers — but more importantly, a sense of responsibility. The friendly neighborhood Spider-Man is Marvel's heart and soul: a working-class hero who juggles impossible odds with wit, heart, and web-shooters.",
      powers: JSON.stringify(['Wall-crawling', 'Spider-sense', 'Superhuman strength & agility', 'Web-shooting']),
      firstAppearanceYear: 1962, firstAppearanceIssue: 'Amazing Fantasy #15',
      creators: JSON.stringify(['Stan Lee', 'Steve Ditko']),
      currentStatusText: 'Continuing his adventures as the Amazing Spider-Man.',
      imageUrl: 'https://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b.jpg',
    },
  })
  await prisma.timelineEvent.createMany({ data: [
    { characterId: spiderMan.id, year: 1962, title: 'Bitten by Radioactive Spider', description: "Peter Parker gains incredible powers from a spider bite at a science exhibit.", order: 1 },
    { characterId: spiderMan.id, year: 1962, title: "Uncle Ben's Death", description: "Peter's failure to stop a thief costs Uncle Ben his life — with great power comes great responsibility.", order: 2 },
    { characterId: spiderMan.id, year: 1973, title: 'Gwen Stacy Dies', description: "The Green Goblin throws Gwen from a bridge. Spider-Man's attempt to save her snaps her neck — a defining tragedy.", order: 3 },
    { characterId: spiderMan.id, year: 1984, title: 'The Black Suit', description: "Peter bonds with an alien symbiote on Battleworld — a sleek new costume that's alive.", order: 4 },
    { characterId: spiderMan.id, year: 1987, title: "Kraven's Last Hunt", description: "Kraven buries Spider-Man alive and takes his place. The darkest arc in Spider-Man history.", order: 5 },
    { characterId: spiderMan.id, year: 2007, title: 'One More Day', description: "Peter deals with Mephisto to save Aunt May — erasing his marriage to Mary Jane from history.", order: 6 },
  ]})

  const ironMan = await prisma.character.create({
    data: {
      publisherId: marvel.id,
      name: 'Iron Man',
      realName: 'Tony Stark',
      aliases: JSON.stringify(['Shellhead', 'The Invincible Iron Man', 'Armored Avenger']),
      bio: "A genius billionaire who built a powered armor suit in a cave with a box of scraps. Tony Stark is Marvel's most compelling contradiction — a weapons manufacturer turned hero, a man whose greatest invention is himself. Founder of the Avengers, futurist, recovering alcoholic, and the most prepared person in any room.",
      powers: JSON.stringify(['Powered armor suit', 'Genius-level intellect', 'Flight', 'Energy repulsors', 'Vast financial resources']),
      firstAppearanceYear: 1963, firstAppearanceIssue: 'Tales of Suspense #39',
      creators: JSON.stringify(['Stan Lee', 'Larry Lieber', 'Don Heck', 'Jack Kirby']),
      currentStatusText: 'Continuing to innovate and protect the world as Iron Man.',
      imageUrl: 'https://i.annihil.us/u/prod/marvel/i/mg/9/c0/527bb7b37ff55.jpg',
    },
  })
  await prisma.timelineEvent.createMany({ data: [
    { characterId: ironMan.id, year: 1963, title: 'First Appearance', description: "Tony Stark builds a suit of armor in a Vietnam cave to escape captivity — inventing Iron Man in the process.", order: 1 },
    { characterId: ironMan.id, year: 1979, title: 'Demon in a Bottle', description: "Tony Stark's alcoholism spirals out of control — the story that made Iron Man a genuinely complex character.", order: 2 },
    { characterId: ironMan.id, year: 1987, title: 'Armor Wars', description: "Tony discovers his tech has been stolen by criminals. He goes to war — against heroes and villains alike — to reclaim it.", order: 3 },
    { characterId: ironMan.id, year: 2005, title: 'Extremis', description: "Warren Ellis upgrades Tony for the 21st century — the armor becomes part of his body, his biology.", order: 4 },
    { characterId: ironMan.id, year: 2006, title: 'Civil War — Pro-Registration', description: "Tony supports the Superhero Registration Act. Friends become enemies. He builds a Thor clone that kills Goliath.", order: 5 },
  ]})

  const captainAmerica = await prisma.character.create({
    data: {
      publisherId: marvel.id,
      name: 'Captain America',
      realName: 'Steve Rogers',
      aliases: JSON.stringify(['Cap', 'The First Avenger', 'Nomad']),
      bio: "A frail boy from Brooklyn who volunteered to be America's super-soldier, Steve Rogers embodies the country's ideals rather than its reality. He fights not for what America is, but for what it should be — and when those ideals are betrayed, he fights against the people holding the flag.",
      powers: JSON.stringify(['Peak human strength & agility', 'Enhanced healing', 'Vibranium shield', 'Master tactician', 'Superhuman endurance']),
      firstAppearanceYear: 1941, firstAppearanceIssue: 'Captain America Comics #1',
      creators: JSON.stringify(['Joe Simon', 'Jack Kirby']),
      currentStatusText: 'Defending liberty as the living symbol of American idealism.',
      imageUrl: 'https://i.annihil.us/u/prod/marvel/i/mg/3/50/537ba56d31087.jpg',
    },
  })
  await prisma.timelineEvent.createMany({ data: [
    { characterId: captainAmerica.id, year: 1941, title: 'Created by the Super-Soldier Serum', description: "Steve Rogers volunteers for a dangerous experiment — transforming from a frail kid to the world's first super-soldier.", order: 1 },
    { characterId: captainAmerica.id, year: 1945, title: 'Frozen in Ice', description: "Cap is frozen in the North Atlantic after preventing a bomb from reaching US soil. He won't wake for decades.", order: 2 },
    { characterId: captainAmerica.id, year: 1964, title: 'Revived by the Avengers', description: "The Avengers discover Steve Rogers frozen in the Arctic — still alive, perfectly preserved.", order: 3 },
    { characterId: captainAmerica.id, year: 1974, title: 'Becomes Nomad', description: "Disillusioned by a government conspiracy, Steve Rogers abandons the Captain America identity.", order: 4 },
    { characterId: captainAmerica.id, year: 2007, title: 'Assassinated', description: "In the aftermath of Civil War, Steve Rogers is shot and killed on the courthouse steps — a national tragedy.", order: 5 },
    { characterId: captainAmerica.id, year: 2009, title: 'Bucky Takes the Shield', description: "James 'Bucky' Barnes, the Winter Soldier, becomes the new Captain America.", order: 6 },
  ]})

  const thor = await prisma.character.create({
    data: {
      publisherId: marvel.id,
      name: 'Thor',
      realName: 'Thor Odinson',
      aliases: JSON.stringify(['The God of Thunder', 'Donald Blake', 'Odinson']),
      bio: "The Asgardian God of Thunder, son of Odin. Thor wields the enchanted hammer Mjolnir, which grants flight and mastery of lightning to those deemed worthy. Banished to Earth to learn humility, he became one of the Avengers' most powerful members — a bridge between the mortal world and the mythological.",
      powers: JSON.stringify(['God of Thunder', 'Mjolnir', 'Flight', 'Near-invulnerability', 'Superhuman strength', 'Storm manipulation']),
      firstAppearanceYear: 1962, firstAppearanceIssue: 'Journey into Mystery #83',
      creators: JSON.stringify(['Stan Lee', 'Larry Lieber', 'Jack Kirby']),
      currentStatusText: 'Serving as king of Asgard while protecting the Ten Realms.',
      imageUrl: 'https://i.annihil.us/u/prod/marvel/i/mg/d/d0/5269657a74350.jpg',
    },
  })
  await prisma.timelineEvent.createMany({ data: [
    { characterId: thor.id, year: 1962, title: 'First Appearance', description: "Thor is banished to Earth by Odin and placed in the body of Donald Blake — a disabled medical student.", order: 1 },
    { characterId: thor.id, year: 1983, title: 'Beta Ray Bill', description: "An alien warrior lifts Mjolnir — the first being other than Thor deemed worthy. A seismic moment in Marvel mythology.", order: 2 },
    { characterId: thor.id, year: 2012, title: 'God Butcher', description: "A god-killing entity stalks the universe across three time periods — Thor at his most mythic.", order: 3 },
    { characterId: thor.id, year: 2014, title: 'Unworthy', description: "Nick Fury whispers something to Thor that causes him to drop Mjolnir. He becomes unworthy — and Jane Foster takes up the hammer.", order: 4 },
    { characterId: thor.id, year: 2017, title: 'Ragnarok', description: "Asgard is destroyed. Thor loses his eye. The Asgardians become refugees on Earth.", order: 5 },
  ]})

  const hulk = await prisma.character.create({
    data: {
      publisherId: marvel.id,
      name: 'Hulk',
      realName: 'Bruce Banner',
      aliases: JSON.stringify(['The Incredible Hulk', 'The Green Giant', 'World Breaker', 'Doc Green']),
      bio: "Physicist Bruce Banner was caught in a gamma bomb explosion — and now whenever he gets angry, he becomes the Hulk: an enormous green engine of destruction with near-limitless strength. The Hulk is Marvel's most tragic figure: a brilliant, gentle man trapped in an endless war with his own rage.",
      powers: JSON.stringify(['Near-limitless strength (increases with rage)', 'Regenerative healing factor', 'Near-invulnerability', 'Superhuman leaping']),
      firstAppearanceYear: 1962, firstAppearanceIssue: 'The Incredible Hulk #1',
      creators: JSON.stringify(['Stan Lee', 'Jack Kirby']),
      currentStatusText: 'Searching for peace between Bruce Banner and the Hulk.',
      imageUrl: 'https://i.annihil.us/u/prod/marvel/i/mg/5/a0/538615ca33ab0.jpg',
    },
  })
  await prisma.timelineEvent.createMany({ data: [
    { characterId: hulk.id, year: 1962, title: 'Gamma Bomb Explosion', description: "Bruce Banner pushes Rick Jones out of the test zone — and absorbs the full force of a gamma bomb blast.", order: 1 },
    { characterId: hulk.id, year: 1974, title: 'Wolverine Encounter', description: "The Hulk's first major brawl introduces the world to Logan — who stands his ground against the Green Giant.", order: 2 },
    { characterId: hulk.id, year: 2006, title: 'Exiled to Planet Sakaar', description: "The Illuminati exile the Hulk into space. He crashes on a gladiator planet and becomes its greatest warrior.", order: 3 },
    { characterId: hulk.id, year: 2007, title: 'World War Hulk', description: "His wife dead, his planet destroyed — Hulk returns to Earth to destroy the men who sent him away.", order: 4 },
    { characterId: hulk.id, year: 2014, title: 'Doc Green', description: "An intelligent Hulk who systematically strips other gamma-powered beings of their powers — for their own good.", order: 5 },
  ]})

  const blackWidow = await prisma.character.create({
    data: {
      publisherId: marvel.id,
      name: 'Black Widow',
      realName: 'Natasha Romanoff',
      aliases: JSON.stringify(['Natasha Romanoff', 'Natalie Rushman', 'The Black Widow']),
      bio: "Trained since childhood in the Red Room, Natasha Romanoff is one of the world's greatest spies and assassins — and one of its most conflicted heroes. Her entire life has been a series of lies in service of other people's agendas. The Black Widow's story is about who she chooses to be when she's finally free to choose.",
      powers: JSON.stringify(['Master martial artist', 'Expert spy & infiltrator', 'Wrist-mounted Widow Bites', 'Peak human athleticism', 'Multilingual']),
      firstAppearanceYear: 1964, firstAppearanceIssue: 'Tales of Suspense #52',
      creators: JSON.stringify(['Stan Lee', 'Don Rico', 'Don Heck']),
      currentStatusText: 'Operating as a freelance intelligence asset.',
      imageUrl: 'https://i.annihil.us/u/prod/marvel/i/mg/f/30/50fecad1f395b.jpg',
    },
  })
  await prisma.timelineEvent.createMany({ data: [
    { characterId: blackWidow.id, year: 1964, title: 'First Appearance', description: "Natasha Romanoff debuts as a Soviet spy working against Iron Man.", order: 1 },
    { characterId: blackWidow.id, year: 1970, title: 'Defects to S.H.I.E.L.D.', description: "Natasha defects from the Soviet Union and becomes a S.H.I.E.L.D. agent and hero.", order: 2 },
    { characterId: blackWidow.id, year: 2004, title: 'The Secret History', description: "Richard Morgan's arc reveals the full horror of the Red Room program that created her.", order: 3 },
    { characterId: blackWidow.id, year: 2010, title: 'Avengers: Founding Member', description: "Natasha joins the Avengers, her skill set — no powers, just mastery — proving its worth among gods and monsters.", order: 4 },
  ]})

  const doctorStrange = await prisma.character.create({
    data: {
      publisherId: marvel.id,
      name: 'Doctor Strange',
      realName: 'Stephen Strange',
      aliases: JSON.stringify(['The Sorcerer Supreme', 'Master of the Mystic Arts', 'The Mage']),
      bio: "Stephen Strange was the world's greatest surgeon — brilliant, arrogant, and utterly selfish — until a car accident destroyed his hands and sent him to the Himalayas in search of a cure. He found the Ancient One instead. Now he defends Earth against mystical threats as the Sorcerer Supreme, the living barrier between the real world and unimaginable darkness.",
      powers: JSON.stringify(['Master of the Mystic Arts', 'Sorcery & spellcasting', 'Astral projection', 'Time manipulation', 'Dimensional travel']),
      firstAppearanceYear: 1963, firstAppearanceIssue: 'Strange Tales #110',
      creators: JSON.stringify(['Stan Lee', 'Steve Ditko']),
      currentStatusText: 'Defending reality as the Sorcerer Supreme.',
      imageUrl: 'https://i.annihil.us/u/prod/marvel/i/mg/5/f0/5261a85a501fe.jpg',
    },
  })
  await prisma.timelineEvent.createMany({ data: [
    { characterId: doctorStrange.id, year: 1963, title: 'First Appearance', description: "Stephen Strange debuts in Strange Tales — mysterious, powerful, unlike anything Marvel had done before.", order: 1 },
    { characterId: doctorStrange.id, year: 1963, title: 'Training with the Ancient One', description: "Strange trades his surgical career for the mystic arts — humbled, rebuilt, and eventually chosen as Sorcerer Supreme.", order: 2 },
    { characterId: doctorStrange.id, year: 1978, title: 'Battles Dormammu', description: "Strange faces the ruler of the Dark Dimension in his defining confrontation — winning not through power but sacrifice.", order: 3 },
    { characterId: doctorStrange.id, year: 2015, title: 'The Empirikul Invasion', description: "A science-based cult wages war on magic itself — Strange must fight with a depleted arsenal.", order: 4 },
    { characterId: doctorStrange.id, year: 2018, title: 'Loses the Title', description: "Strange is stripped of the Sorcerer Supreme title — and must earn it back.", order: 5 },
  ]})

  // ─────────────────────────────────────────────
  // DC CHARACTERS (8)
  // ─────────────────────────────────────────────
  const batman = await prisma.character.create({
    data: {
      publisherId: dc.id,
      name: 'Batman',
      realName: 'Bruce Wayne',
      aliases: JSON.stringify(['The Dark Knight', 'The Caped Crusader', "The World's Greatest Detective"]),
      bio: "After watching his parents murdered before his eyes, billionaire Bruce Wayne spent years training to become the ultimate weapon against crime. As Batman, he patrols Gotham City armed with his mind, his body, and the finest technology money can build — the living proof that a human being, with enough will, can become something extraordinary.",
      powers: JSON.stringify(['Peak human physical condition', 'Master detective', 'Martial arts mastery', 'Advanced technology & gadgets', 'Genius-level intellect']),
      firstAppearanceYear: 1939, firstAppearanceIssue: 'Detective Comics #27',
      creators: JSON.stringify(['Bob Kane', 'Bill Finger']),
      currentStatusText: 'Protecting Gotham City from the shadows.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c7/Batman_Infobox.jpg',
    },
  })
  await prisma.timelineEvent.createMany({ data: [
    { characterId: batman.id, year: 1939, title: 'First Appearance', description: "The Batman debuts in Detective Comics — Gotham's mysterious new vigilante.", order: 1 },
    { characterId: batman.id, year: 1940, title: 'Crime Alley', description: "Thomas and Martha Wayne are shot by Joe Chill — the night that creates the Batman.", order: 2 },
    { characterId: batman.id, year: 1987, title: 'Year One', description: "Frank Miller reimagines Batman's first year: the fear, the doubt, the determination to become something more than a man.", order: 3 },
    { characterId: batman.id, year: 1988, title: 'A Death in the Family', description: "The Joker beats Robin (Jason Todd) to death with a crowbar. Readers voted for his death. Batman carries the guilt forever.", order: 4 },
    { characterId: batman.id, year: 1993, title: 'Knightfall — Broken', description: "Bane breaks Batman's back. Bruce is replaced by Jean-Paul Valley as a brutal, unhinged Batman.", order: 5 },
    { characterId: batman.id, year: 2008, title: 'Batman R.I.P.', description: "Grant Morrison's epic dismantles Bruce Wayne's mind — and the Batman identity itself.", order: 6 },
  ]})

  const superman = await prisma.character.create({
    data: {
      publisherId: dc.id,
      name: 'Superman',
      realName: 'Kal-El / Clark Kent',
      aliases: JSON.stringify(['Man of Steel', 'Man of Tomorrow', 'The Last Son of Krypton']),
      bio: "Rocketed from the dying planet Krypton as an infant, Kal-El was raised in Smallville, Kansas as Clark Kent. Under Earth's yellow sun, he became the most powerful being on the planet — but the values instilled by Jonathan and Martha Kent made him its greatest hero. Superman stands for hope.",
      powers: JSON.stringify(['Flight', 'Super strength', 'Invulnerability', 'Heat vision', 'X-ray vision', 'Super speed', 'Super breath']),
      firstAppearanceYear: 1938, firstAppearanceIssue: 'Action Comics #1',
      creators: JSON.stringify(['Jerry Siegel', 'Joe Shuster']),
      currentStatusText: 'Protecting Earth and beyond as the Man of Steel.',
      imageUrl: null,
    },
  })
  await prisma.timelineEvent.createMany({ data: [
    { characterId: superman.id, year: 1938, title: 'First Appearance', description: "Superman debuts in Action Comics #1 — the world's first superhero.", order: 1 },
    { characterId: superman.id, year: 1986, title: 'Crisis on Infinite Earths', description: "The multiverse collapses. Superman's history is rebooted with Man of Steel — his origins clarified for a new generation.", order: 2 },
    { characterId: superman.id, year: 1992, title: 'The Death of Superman', description: "Doomsday beats Superman to death in the streets of Metropolis. The world mourns.", order: 3 },
    { characterId: superman.id, year: 2003, title: 'Birthright', description: "Mark Waid's Birthright redefines Clark Kent's journey from Smallville farm boy to the world's greatest hero.", order: 4 },
    { characterId: superman.id, year: 2005, title: 'All-Star Superman', description: "Grant Morrison's love letter — dying from solar overload, Clark tries to complete 12 legendary labors.", order: 5 },
  ]})

  const wonderWoman = await prisma.character.create({
    data: {
      publisherId: dc.id,
      name: 'Wonder Woman',
      realName: 'Diana Prince',
      aliases: JSON.stringify(['Diana', 'Princess of Themyscira', 'The Amazon Princess']),
      bio: "Born on the hidden island of Themyscira, Diana is a warrior princess of the Amazons, forged from clay and blessed by the gods — or so the story went. She entered the world of Man to stop a war and never left. Wonder Woman is DC's moral compass: more powerful than almost anyone, and more merciful than most.",
      powers: JSON.stringify(['Superhuman strength & speed', 'Flight', 'Lasso of Truth', 'Bracelets of Submission', 'Combat mastery', 'Near-invulnerability']),
      firstAppearanceYear: 1941, firstAppearanceIssue: 'All Star Comics #8',
      creators: JSON.stringify(['William Moulton Marston', 'H.G. Peter']),
      currentStatusText: 'Serving as ambassador and protector of both the mortal world and Themyscira.',
      imageUrl: null,
    },
  })
  await prisma.timelineEvent.createMany({ data: [
    { characterId: wonderWoman.id, year: 1941, title: 'First Appearance', description: "Diana of Themyscira enters the world of Man — the first major female superhero.", order: 1 },
    { characterId: wonderWoman.id, year: 1987, title: 'Perez Reboot', description: "George Perez's landmark run reimagines Diana as a Greek myth hero — grounded, powerful, and mythologically rich.", order: 2 },
    { characterId: wonderWoman.id, year: 1995, title: 'Becomes God of War', description: "Diana becomes the God of War after killing Ares — a dark new role that tests her principles.", order: 3 },
    { characterId: wonderWoman.id, year: 2016, title: 'Year One', description: "Greg Rucka rewrites her origin: the truth of how Diana became Wonder Woman, and which version of her history is real.", order: 4 },
  ]})

  const flash = await prisma.character.create({
    data: {
      publisherId: dc.id,
      name: 'The Flash',
      realName: 'Barry Allen',
      aliases: JSON.stringify(['Barry Allen', 'The Fastest Man Alive', 'The Scarlet Speedster']),
      bio: "Police scientist Barry Allen was struck by a bolt of lightning and doused in chemicals — and became the fastest man alive. The Flash is the heart of the DC universe: optimistic, selfless, and the one hero who literally died to save the world — and came back because the universe needed him.",
      powers: JSON.stringify(['Superhuman speed', 'Speed Force connection', 'Vibration through solid objects', 'Time travel (via speed)', 'Molecular acceleration']),
      firstAppearanceYear: 1956, firstAppearanceIssue: 'Showcase #4',
      creators: JSON.stringify(['Robert Kanigher', 'Carmine Infantino']),
      currentStatusText: 'Racing to protect Central City and the timeline itself.',
      imageUrl: null,
    },
  })
  await prisma.timelineEvent.createMany({ data: [
    { characterId: flash.id, year: 1956, title: 'First Appearance (Silver Age)', description: "Barry Allen's debut launched the Silver Age of Comics — a new Flash for a new era.", order: 1 },
    { characterId: flash.id, year: 1961, title: 'Meets Jay Garrick', description: "Barry meets the Golden Age Flash — establishing the DC multiverse for the first time.", order: 2 },
    { characterId: flash.id, year: 1985, title: 'Dies in Crisis', description: "Barry Allen runs himself to death stopping the Anti-Monitor's antimatter cannon. His death defined heroic sacrifice in comics.", order: 3 },
    { characterId: flash.id, year: 2009, title: 'Returns', description: "Barry Allen returns from the Speed Force — his absence having made the DC universe feel his loss for 23 years.", order: 4 },
    { characterId: flash.id, year: 2011, title: 'Flashpoint', description: "Barry travels back to save his mother — and accidentally creates an alternate universe where everything is wrong.", order: 5 },
  ]})

  const joker = await prisma.character.create({
    data: {
      publisherId: dc.id,
      name: 'The Joker',
      realName: null,
      aliases: JSON.stringify(['The Clown Prince of Crime', 'The Ace of Knaves', 'J']),
      bio: "The most dangerous villain in comics. He has no superpowers, no consistent origin, and no discernible motive beyond chaos — and that's exactly what makes him terrifying. The Joker is Batman's ultimate nemesis: the argument that some evil cannot be rehabilitated, only contained.",
      powers: JSON.stringify(['Master chemist (Joker venom)', 'Unpredictable genius', 'Pain resistance', 'Weapons mastery', 'Psychological warfare']),
      firstAppearanceYear: 1940, firstAppearanceIssue: 'Batman #1',
      creators: JSON.stringify(['Bob Kane', 'Bill Finger', 'Jerry Robinson']),
      currentStatusText: 'Always scheming the next catastrophic plan.',
      imageUrl: null,
    },
  })
  await prisma.timelineEvent.createMany({ data: [
    { characterId: joker.id, year: 1940, title: 'First Appearance', description: "The Joker debuts in Batman #1 — immediately murdering multiple victims. One of comics' most iconic villains from day one.", order: 1 },
    { characterId: joker.id, year: 1988, title: 'A Death in the Family', description: "The Joker beats Robin (Jason Todd) to death with a crowbar. Comics readers voted for Jason to die. They did.", order: 2 },
    { characterId: joker.id, year: 1988, title: 'The Killing Joke', description: "Alan Moore's story: the Joker shoots Barbara Gordon, paralyzing her. One bad day, he argues, is all it takes.", order: 3 },
    { characterId: joker.id, year: 2019, title: 'Joker War', description: "The Joker makes his biggest move — claiming Bruce Wayne's fortune and weaponizing Gotham against Batman.", order: 4 },
  ]})

  const greenLantern = await prisma.character.create({
    data: {
      publisherId: dc.id,
      name: 'Green Lantern',
      realName: 'Hal Jordan',
      aliases: JSON.stringify(['Hal Jordan', 'The Greatest Green Lantern', 'Parallax']),
      bio: "Test pilot Hal Jordan was chosen by a dying alien to receive a power ring — the most powerful weapon in the universe, limited only by imagination and willpower. As Earth's first human Green Lantern, Hal has faced gods, cosmic entities, and his own darkness — including becoming the villain Parallax before redeeming himself.",
      powers: JSON.stringify(['Power Ring (limited only by will)', 'Energy constructs', 'Flight', 'Force fields', 'Space travel']),
      firstAppearanceYear: 1959, firstAppearanceIssue: 'Showcase #22',
      creators: JSON.stringify(['John Broome', 'Gil Kane']),
      currentStatusText: 'Patrolling Sector 2814 as a member of the Green Lantern Corps.',
      imageUrl: null,
    },
  })
  await prisma.timelineEvent.createMany({ data: [
    { characterId: greenLantern.id, year: 1959, title: 'First Appearance', description: "Hal Jordan is chosen by the ring of dying Lantern Abin Sur — beginning his life as an intergalactic police officer.", order: 1 },
    { characterId: greenLantern.id, year: 1994, title: 'Becomes Parallax', description: "The destruction of Coast City drives Hal to madness. He destroys the Green Lantern Corps and becomes the villain Parallax.", order: 2 },
    { characterId: greenLantern.id, year: 1996, title: 'Sacrifices Himself', description: "Hal Jordan sacrifices his life to reignite the sun — partially redeeming himself in death.", order: 3 },
    { characterId: greenLantern.id, year: 2004, title: 'Rebirth', description: "Geoff Johns reveals Hal was possessed by the fear entity Parallax. He is resurrected and reclaims his ring.", order: 4 },
    { characterId: greenLantern.id, year: 2009, title: 'Blackest Night', description: "The ultimate war of the emotional spectrum — Black Lanterns, powered by death itself, rise across the universe.", order: 5 },
  ]})

  // ─────────────────────────────────────────────
  // READING PATHS — WOLVERINE
  // ─────────────────────────────────────────────
  const wolvBeginner  = await prisma.readingPath.create({ data: { characterId: wolverine.id, tier: 'beginner' } })
  const wolvEssential = await prisma.readingPath.create({ data: { characterId: wolverine.id, tier: 'essential' } })
  const wolvComplete  = await prisma.readingPath.create({ data: { characterId: wolverine.id, tier: 'complete' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: wolvBeginner.id,  issueId: astonishingXMen1.id,   whyItMatters: "Whedon writes Wolverine as the gruff heart of a new X-Men team. The best modern entry point.", required: true,  estTimeMinutes: 20, order: 1 },
    { readingPathId: wolvBeginner.id,  issueId: astonishingXMen2.id,   whyItMatters: "The team dynamic snaps into place. You see exactly who Logan is when surrounded by people he respects.",  required: true,  estTimeMinutes: 20, order: 2 },
    { readingPathId: wolvBeginner.id,  issueId: xMenGodLoves.id,       whyItMatters: "A standalone masterpiece about prejudice. Logan's rage hits different when the cause is this righteous.", required: false, estTimeMinutes: 45, order: 3 },
    { readingPathId: wolvEssential.id, issueId: astonishingXMen1.id,   whyItMatters: "Start here — cleanest modern entry point for both Logan and the X-Men.",  required: true,  estTimeMinutes: 20, order: 1 },
    { readingPathId: wolvEssential.id, issueId: wolverineV1.id,        whyItMatters: "The Japan series — Logan distilled: the samurai code, the berserker rage, the man trying to be more than a weapon.", required: true, estTimeMinutes: 25, order: 2 },
    { readingPathId: wolvEssential.id, issueId: wolverineWeaponX.id,   whyItMatters: "Barry Windsor-Smith's Weapon X is harrowing — the procedure that bonded adamantium to his bones.", required: true, estTimeMinutes: 25, order: 3 },
    { readingPathId: wolvEssential.id, issueId: xMenGodLoves.id,       whyItMatters: "A standalone masterpiece. No continuity required, maximum emotional impact.", required: false, estTimeMinutes: 45, order: 4 },
    { readingPathId: wolvComplete.id,  issueId: wolverineOrigin1.id,   whyItMatters: "The long-kept secret of Logan's true origin — James Howlett in 19th century Canada.", required: true, estTimeMinutes: 20, order: 1 },
    { readingPathId: wolvComplete.id,  issueId: astonishingXMen1.id,   whyItMatters: "Whedon's run is the essential modern X-Men story. Logan at his best.", required: true, estTimeMinutes: 20, order: 2 },
    { readingPathId: wolvComplete.id,  issueId: astonishingXMen2.id,   whyItMatters: "Continues directly from #1 — read back to back.", required: true, estTimeMinutes: 20, order: 3 },
    { readingPathId: wolvComplete.id,  issueId: astonishingXMen3.id,   whyItMatters: "The arc deepens. Logan's past comes calling in Whedon's hands.", required: true, estTimeMinutes: 20, order: 4 },
    { readingPathId: wolvComplete.id,  issueId: wolverineV1.id,        whyItMatters: "The Japan series — the soul of everything Wolverine solo stories try to be.", required: true, estTimeMinutes: 25, order: 5 },
    { readingPathId: wolvComplete.id,  issueId: wolverineWeaponX.id,   whyItMatters: "Weapon X. The horror show that explains every nightmare Logan has.", required: true, estTimeMinutes: 25, order: 6 },
    { readingPathId: wolvComplete.id,  issueId: xMenGodLoves.id,       whyItMatters: "God Loves, Man Kills. The X-Men's definitive statement on bigotry and survival.", required: false, estTimeMinutes: 45, order: 7 },
  ]})

  // ─────────────────────────────────────────────
  // READING PATHS — SPIDER-MAN
  // ─────────────────────────────────────────────
  const spmBeginner  = await prisma.readingPath.create({ data: { characterId: spiderMan.id, tier: 'beginner' } })
  const spmEssential = await prisma.readingPath.create({ data: { characterId: spiderMan.id, tier: 'essential' } })
  const spmComplete  = await prisma.readingPath.create({ data: { characterId: spiderMan.id, tier: 'complete' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: spmBeginner.id,  issueId: amazingFantasy15.id,   whyItMatters: "The origin — 11 pages that launched the most relatable superhero ever created.", required: true,  estTimeMinutes: 15, order: 1 },
    { readingPathId: spmBeginner.id,  issueId: amazingSpiderMan33.id, whyItMatters: "The most iconic Spider-Man moment: trapped under machinery, nearly dead, he lifts it anyway.", required: true,  estTimeMinutes: 20, order: 2 },
    { readingPathId: spmBeginner.id,  issueId: spiderManBlue1.id,     whyItMatters: "A perfect standalone. Gorgeous art, real emotion — ideal second comic.", required: false, estTimeMinutes: 20, order: 3 },
    { readingPathId: spmEssential.id, issueId: amazingFantasy15.id,   whyItMatters: "Start here. No exception.", required: true,  estTimeMinutes: 15, order: 1 },
    { readingPathId: spmEssential.id, issueId: amazingSpiderMan33.id, whyItMatters: "The definitive Spider-Man moment — what he is made of when pushed to the edge.", required: true,  estTimeMinutes: 20, order: 2 },
    { readingPathId: spmEssential.id, issueId: spiderManKraven.id,    whyItMatters: "Kraven's Last Hunt is the darkest, most mature Spider-Man arc. Peter buried alive, replaced by a killer.", required: true,  estTimeMinutes: 25, order: 3 },
    { readingPathId: spmEssential.id, issueId: spiderManBlue1.id,     whyItMatters: "Loeb and Sale's love letter to the early years. Gwen Stacy, first dates, the death waiting to come.", required: false, estTimeMinutes: 20, order: 4 },
    { readingPathId: spmComplete.id,  issueId: amazingFantasy15.id,   whyItMatters: "Origin. Mandatory.", required: true,  estTimeMinutes: 15, order: 1 },
    { readingPathId: spmComplete.id,  issueId: amazingSpiderMan33.id, whyItMatters: "The definitive moment. Part of the Master Planner arc — read issues 31-33 together.", required: true,  estTimeMinutes: 20, order: 2 },
    { readingPathId: spmComplete.id,  issueId: spiderManKraven.id,    whyItMatters: "The greatest Spider-Man villain story ever told.", required: true,  estTimeMinutes: 25, order: 3 },
    { readingPathId: spmComplete.id,  issueId: spiderManBlue1.id,     whyItMatters: "Essential reading for the Gwen Stacy relationship — beautiful and heartbreaking.", required: true,  estTimeMinutes: 20, order: 4 },
  ]})

  // ─────────────────────────────────────────────
  // READING PATHS — IRON MAN
  // ─────────────────────────────────────────────
  const imBeginner  = await prisma.readingPath.create({ data: { characterId: ironMan.id, tier: 'beginner' } })
  const imEssential = await prisma.readingPath.create({ data: { characterId: ironMan.id, tier: 'essential' } })
  const imComplete  = await prisma.readingPath.create({ data: { characterId: ironMan.id, tier: 'complete' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: imBeginner.id,  issueId: invincibleIronMan1.id, whyItMatters: "Fraction's 2008 run is the cleanest entry point — modern Tony, great villain, no history needed.", required: true,  estTimeMinutes: 20, order: 1 },
    { readingPathId: imBeginner.id,  issueId: ironManExtremis1.id,   whyItMatters: "Ellis's Extremis is what the Iron Man movies were based on. Short, brilliant, essential.", required: false, estTimeMinutes: 20, order: 2 },
    { readingPathId: imEssential.id, issueId: invincibleIronMan1.id, whyItMatters: "Start here. Modern Tony, great craft, perfect for new readers.", required: true,  estTimeMinutes: 20, order: 1 },
    { readingPathId: imEssential.id, issueId: ironManExtremis1.id,   whyItMatters: "Ellis wires Tony's armor into his nervous system — the story that defined the MCU's Iron Man.", required: true,  estTimeMinutes: 20, order: 2 },
    { readingPathId: imEssential.id, issueId: demonInABottle.id,     whyItMatters: "The alcoholism arc — Tony's worst enemy isn't the villain, it's himself. Comics at their most human.", required: true,  estTimeMinutes: 20, order: 3 },
    { readingPathId: imComplete.id,  issueId: invincibleIronMan1.id, whyItMatters: "Start with Fraction to establish modern Tony before going backward.", required: true,  estTimeMinutes: 20, order: 1 },
    { readingPathId: imComplete.id,  issueId: ironManExtremis1.id,   whyItMatters: "Ellis's Extremis — the pivot between old and new Tony.", required: true,  estTimeMinutes: 20, order: 2 },
    { readingPathId: imComplete.id,  issueId: demonInABottle.id,     whyItMatters: "The story that proved Tony Stark was worth taking seriously.", required: true,  estTimeMinutes: 20, order: 3 },
    { readingPathId: imComplete.id,  issueId: ironManArmorWars1.id,  whyItMatters: "Armor Wars — Tony goes rogue to reclaim his stolen tech, burning bridges with the Avengers.", required: true,  estTimeMinutes: 20, order: 4 },
  ]})

  // ─────────────────────────────────────────────
  // READING PATHS — CAPTAIN AMERICA
  // ─────────────────────────────────────────────
  const capBeginner  = await prisma.readingPath.create({ data: { characterId: captainAmerica.id, tier: 'beginner' } })
  const capEssential = await prisma.readingPath.create({ data: { characterId: captainAmerica.id, tier: 'essential' } })
  const capComplete  = await prisma.readingPath.create({ data: { characterId: captainAmerica.id, tier: 'complete' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: capBeginner.id,  issueId: captainAmerica1Brubaker.id, whyItMatters: "Brubaker's run is the best Captain America story ever written. Cold War thriller, pitch-perfect characterization.", required: true,  estTimeMinutes: 25, order: 1 },
    { readingPathId: capEssential.id, issueId: captainAmerica1Brubaker.id, whyItMatters: "Start here. Brubaker defines Steve Rogers for the 21st century.", required: true,  estTimeMinutes: 25, order: 1 },
    { readingPathId: capEssential.id, issueId: whatsWorthFighting.id,      whyItMatters: "The Death of Captain America — the Civil War aftermath, and why Steve Rogers lays down his shield.", required: true,  estTimeMinutes: 20, order: 2 },
    { readingPathId: capComplete.id,  issueId: captainAmericaV1.id,        whyItMatters: "The original 1941 debut — Cap punches Hitler on the cover. Historical context that makes the character click.", required: false, estTimeMinutes: 20, order: 1 },
    { readingPathId: capComplete.id,  issueId: captainAmerica1Brubaker.id, whyItMatters: "The essential modern run. Read all 65 issues if you can — a genuinely great novel in comic form.", required: true,  estTimeMinutes: 25, order: 2 },
    { readingPathId: capComplete.id,  issueId: whatsWorthFighting.id,      whyItMatters: "The death and its aftermath. Steve's last moments and Bucky inheriting the mantle.", required: true,  estTimeMinutes: 20, order: 3 },
  ]})

  // ─────────────────────────────────────────────
  // READING PATHS — THOR
  // ─────────────────────────────────────────────
  const thorBeginner  = await prisma.readingPath.create({ data: { characterId: thor.id, tier: 'beginner' } })
  const thorEssential = await prisma.readingPath.create({ data: { characterId: thor.id, tier: 'essential' } })
  const thorComplete  = await prisma.readingPath.create({ data: { characterId: thor.id, tier: 'complete' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: thorBeginner.id,  issueId: thorGodOfThunder1.id, whyItMatters: "Jason Aaron's first issue — three Thors, one terrible enemy, and a premise that immediately grabs you.", required: true,  estTimeMinutes: 20, order: 1 },
    { readingPathId: thorBeginner.id,  issueId: thorWorthyRival.id,   whyItMatters: "Gorr the God Butcher fully revealed — the villain who makes you understand why gods might deserve to die.", required: false, estTimeMinutes: 20, order: 2 },
    { readingPathId: thorEssential.id, issueId: thorGodOfThunder1.id, whyItMatters: "Start here — the best Thor run of the modern era.", required: true,  estTimeMinutes: 20, order: 1 },
    { readingPathId: thorEssential.id, issueId: thorWorthyRival.id,   whyItMatters: "The God Butcher arc concludes — Thor sacrificing everything to protect gods across time.", required: true,  estTimeMinutes: 20, order: 2 },
    { readingPathId: thorComplete.id,  issueId: thorV1.id,            whyItMatters: "Walt Simonson's legendary run begins — Beta Ray Bill lifts Mjolnir. Still the benchmark.", required: true,  estTimeMinutes: 25, order: 1 },
    { readingPathId: thorComplete.id,  issueId: thorGodOfThunder1.id, whyItMatters: "Aaron's God of Thunder is the modern essential.", required: true,  estTimeMinutes: 20, order: 2 },
    { readingPathId: thorComplete.id,  issueId: thorWorthyRival.id,   whyItMatters: "The God Butcher arc in full — one of Marvel's best villain stories.", required: true,  estTimeMinutes: 20, order: 3 },
  ]})

  // ─────────────────────────────────────────────
  // READING PATHS — HULK
  // ─────────────────────────────────────────────
  const hulkBeginner  = await prisma.readingPath.create({ data: { characterId: hulk.id, tier: 'beginner' } })
  const hulkEssential = await prisma.readingPath.create({ data: { characterId: hulk.id, tier: 'essential' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: hulkBeginner.id,  issueId: planetHulk1.id,       whyItMatters: "Planet Hulk — the Hulk as gladiator hero, conquering a world that feared him. Self-contained and epic.", required: true,  estTimeMinutes: 25, order: 1 },
    { readingPathId: hulkBeginner.id,  issueId: worldWarHulk1.id,     whyItMatters: "The payoff to Planet Hulk. The Hulk at his angriest — and his most justified.", required: false, estTimeMinutes: 25, order: 2 },
    { readingPathId: hulkEssential.id, issueId: incredibleHulk181.id, whyItMatters: "The first Wolverine vs. Hulk fight — and the context for why both characters matter.", required: false, estTimeMinutes: 20, order: 1 },
    { readingPathId: hulkEssential.id, issueId: planetHulk1.id,       whyItMatters: "Planet Hulk is required reading — the story that proved the Hulk could carry his own epic.", required: true,  estTimeMinutes: 25, order: 2 },
    { readingPathId: hulkEssential.id, issueId: worldWarHulk1.id,     whyItMatters: "World War Hulk — the conclusion. Every Marvel hero against the Hulk, and the Hulk wins.", required: true,  estTimeMinutes: 25, order: 3 },
  ]})

  // ─────────────────────────────────────────────
  // READING PATHS — BLACK WIDOW
  // ─────────────────────────────────────────────
  const bwBeginner = await prisma.readingPath.create({ data: { characterId: blackWidow.id, tier: 'beginner' } })
  const bwEssential = await prisma.readingPath.create({ data: { characterId: blackWidow.id, tier: 'essential' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: bwBeginner.id,  issueId: invincibleIronMan1.id,   whyItMatters: "Natasha appears prominently here — see her in action alongside Fraction's Iron Man before going to her solo.", required: false, estTimeMinutes: 20, order: 1 },
    { readingPathId: bwBeginner.id,  issueId: captainAmerica1Brubaker.id, whyItMatters: "Black Widow is central to Brubaker's Cap — her history with Bucky adds layers to both characters.", required: true,  estTimeMinutes: 25, order: 2 },
    { readingPathId: bwEssential.id, issueId: captainAmerica1Brubaker.id, whyItMatters: "The best Black Widow material is in Brubaker's Cap run — her relationship with Bucky, her past.", required: true,  estTimeMinutes: 25, order: 1 },
    { readingPathId: bwEssential.id, issueId: invincibleIronMan1.id,   whyItMatters: "Natasha as a key player in the modern Marvel spy world.", required: false, estTimeMinutes: 20, order: 2 },
  ]})

  // ─────────────────────────────────────────────
  // READING PATHS — DOCTOR STRANGE
  // ─────────────────────────────────────────────
  const dsBeginner  = await prisma.readingPath.create({ data: { characterId: doctorStrange.id, tier: 'beginner' } })
  const dsEssential = await prisma.readingPath.create({ data: { characterId: doctorStrange.id, tier: 'essential' } })
  const dsComplete  = await prisma.readingPath.create({ data: { characterId: doctorStrange.id, tier: 'complete' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: dsBeginner.id,  issueId: docStrange1.id,    whyItMatters: "Jason Aaron's 2015 run — the best entry point. Strange's world is vivid and the stakes are immediately enormous.", required: true,  estTimeMinutes: 20, order: 1 },
    { readingPathId: dsEssential.id, issueId: docStrange1.id,    whyItMatters: "Start here — Aaron defines Strange for a modern audience while honoring everything that came before.", required: true,  estTimeMinutes: 20, order: 1 },
    { readingPathId: dsEssential.id, issueId: docStrangeOmega.id, whyItMatters: "Cates' run takes Strange in a darker direction — stripped of his title, forced to improvise.", required: true,  estTimeMinutes: 20, order: 2 },
    { readingPathId: dsComplete.id,  issueId: strangerThings1.id, whyItMatters: "Strange Tales #110 — the original. See where Ditko's psychedelic imagination first took shape.", required: false, estTimeMinutes: 15, order: 1 },
    { readingPathId: dsComplete.id,  issueId: docStrange1.id,    whyItMatters: "The modern essential — read this first, then go backward.", required: true,  estTimeMinutes: 20, order: 2 },
    { readingPathId: dsComplete.id,  issueId: docStrangeOmega.id, whyItMatters: "Cates explores what Strange is without the title — and what he'll do to earn it back.", required: true,  estTimeMinutes: 20, order: 3 },
  ]})

  // ─────────────────────────────────────────────
  // READING PATHS — BATMAN
  // ─────────────────────────────────────────────
  const batBeginner  = await prisma.readingPath.create({ data: { characterId: batman.id, tier: 'beginner' } })
  const batEssential = await prisma.readingPath.create({ data: { characterId: batman.id, tier: 'essential' } })
  const batComplete  = await prisma.readingPath.create({ data: { characterId: batman.id, tier: 'complete' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: batBeginner.id,  issueId: batmanYearOne1.id,       whyItMatters: "Frank Miller's Year One — the definitive Batman origin. Gotham as noir, Bruce as a scared young man.", required: true,  estTimeMinutes: 25, order: 1 },
    { readingPathId: batBeginner.id,  issueId: batmanLongHalloween1.id, whyItMatters: "The best Batman mystery ever written. Bridges Year One to The Dark Knight era.", required: false, estTimeMinutes: 25, order: 2 },
    { readingPathId: batEssential.id, issueId: batmanYearOne1.id,       whyItMatters: "Year One — start here. No Batman story earns its meaning without this foundation.", required: true,  estTimeMinutes: 25, order: 1 },
    { readingPathId: batEssential.id, issueId: batmanLongHalloween1.id, whyItMatters: "A year-long holiday murder mystery. Harvey Dent's tragedy is the emotional core.", required: true,  estTimeMinutes: 25, order: 2 },
    { readingPathId: batEssential.id, issueId: batmanHush1.id,          whyItMatters: "Jim Lee draws every major Batman villain. Hush is a love letter to Batman's world and a terrifying new enemy.", required: true,  estTimeMinutes: 25, order: 3 },
    { readingPathId: batComplete.id,  issueId: batmanYearOne1.id,       whyItMatters: "Year One. Required. Full stop.", required: true,  estTimeMinutes: 25, order: 1 },
    { readingPathId: batComplete.id,  issueId: batmanLongHalloween1.id, whyItMatters: "Long Halloween — the mobster era of Gotham, and Harvey Dent's fall.", required: true,  estTimeMinutes: 25, order: 2 },
    { readingPathId: batComplete.id,  issueId: batmanKnightfall1.id,    whyItMatters: "Knightfall — Bane's systematic destruction of Batman, and what happens when Bruce is replaced.", required: true,  estTimeMinutes: 25, order: 3 },
    { readingPathId: batComplete.id,  issueId: batmanHush1.id,          whyItMatters: "Hush — the complete Batman gallery in one prestige arc.", required: true,  estTimeMinutes: 25, order: 4 },
    { readingPathId: batComplete.id,  issueId: batmanRIP.id,            whyItMatters: "Morrison's Batman R.I.P. — the most ambitious Batman story of the modern era.", required: true,  estTimeMinutes: 25, order: 5 },
  ]})

  // ─────────────────────────────────────────────
  // READING PATHS — SUPERMAN
  // ─────────────────────────────────────────────
  const supBeginner  = await prisma.readingPath.create({ data: { characterId: superman.id, tier: 'beginner' } })
  const supEssential = await prisma.readingPath.create({ data: { characterId: superman.id, tier: 'essential' } })
  const supComplete  = await prisma.readingPath.create({ data: { characterId: superman.id, tier: 'complete' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: supBeginner.id,  issueId: supermanBirthright1.id,  whyItMatters: "The best modern Superman origin. Mark Waid understands why Superman matters — this is the story that gets it.", required: true,  estTimeMinutes: 25, order: 1 },
    { readingPathId: supBeginner.id,  issueId: supermanAllStar1.id,     whyItMatters: "All-Star Superman — pure joy. Superman at his most powerful and most human, facing death.", required: false, estTimeMinutes: 25, order: 2 },
    { readingPathId: supEssential.id, issueId: supermanBirthright1.id,  whyItMatters: "Birthright — the origin that sticks. Clark before the cape, before the symbol meant something.", required: true,  estTimeMinutes: 25, order: 1 },
    { readingPathId: supEssential.id, issueId: supermanForTomorrow1.id, whyItMatters: "Azzarello and Lee ask: what is Superman's responsibility when his actions cause harm?", required: true,  estTimeMinutes: 25, order: 2 },
    { readingPathId: supEssential.id, issueId: supermanAllStar1.id,     whyItMatters: "All-Star Superman. The greatest Superman story ever told — and the most accessible.", required: true,  estTimeMinutes: 25, order: 3 },
    { readingPathId: supComplete.id,  issueId: supermanBirthright1.id,  whyItMatters: "Start with Birthright to establish the modern Superman.", required: true,  estTimeMinutes: 25, order: 1 },
    { readingPathId: supComplete.id,  issueId: supermanDeathOf.id,      whyItMatters: "The Death of Superman — the cultural event. Required historical context.", required: true,  estTimeMinutes: 20, order: 2 },
    { readingPathId: supComplete.id,  issueId: supermanForTomorrow1.id, whyItMatters: "For Tomorrow — morally complex Superman at his finest.", required: true,  estTimeMinutes: 25, order: 3 },
    { readingPathId: supComplete.id,  issueId: supermanAllStar1.id,     whyItMatters: "All-Star Superman. The complete statement on who Clark Kent is and why he matters.", required: true,  estTimeMinutes: 25, order: 4 },
  ]})

  // ─────────────────────────────────────────────
  // READING PATHS — WONDER WOMAN
  // ─────────────────────────────────────────────
  const wwBeginner  = await prisma.readingPath.create({ data: { characterId: wonderWoman.id, tier: 'beginner' } })
  const wwEssential = await prisma.readingPath.create({ data: { characterId: wonderWoman.id, tier: 'essential' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: wwBeginner.id,  issueId: wwTrueAmazon.id,  whyItMatters: "Jill Thompson's standalone graphic novel — Diana before the heroics. Beautiful and self-contained.", required: true,  estTimeMinutes: 40, order: 1 },
    { readingPathId: wwBeginner.id,  issueId: wwRebirth1.id,    whyItMatters: "Rucka's Rebirth is a perfect jumping-on point — questions Diana's own history, accessible to new readers.", required: false, estTimeMinutes: 25, order: 2 },
    { readingPathId: wwEssential.id, issueId: wwRebirth1.id,    whyItMatters: "Rucka's Year One (in Rebirth) is the definitive modern Wonder Woman origin.", required: true,  estTimeMinutes: 25, order: 1 },
    { readingPathId: wwEssential.id, issueId: wwYearOne1.id,    whyItMatters: "Perez's 1987 origin — the mythological foundation every great WW story builds on.", required: true,  estTimeMinutes: 25, order: 2 },
    { readingPathId: wwEssential.id, issueId: wwTrueAmazon.id,  whyItMatters: "A standalone origin story from a different angle — highly recommended after Rucka.", required: false, estTimeMinutes: 40, order: 3 },
  ]})

  // ─────────────────────────────────────────────
  // READING PATHS — THE FLASH
  // ─────────────────────────────────────────────
  const flashBeginner  = await prisma.readingPath.create({ data: { characterId: flash.id, tier: 'beginner' } })
  const flashEssential = await prisma.readingPath.create({ data: { characterId: flash.id, tier: 'essential' } })
  const flashComplete  = await prisma.readingPath.create({ data: { characterId: flash.id, tier: 'complete' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: flashBeginner.id,  issueId: flashRebirth1.id,       whyItMatters: "Barry Allen's return — Geoff Johns reintroduces him with everything a new reader needs to know.", required: true,  estTimeMinutes: 20, order: 1 },
    { readingPathId: flashEssential.id, issueId: flashRebirth1.id,       whyItMatters: "Start here. Rebirth is designed for readers who missed 23 years of Barry Allen being dead.", required: true,  estTimeMinutes: 20, order: 1 },
    { readingPathId: flashEssential.id, issueId: flashByGeoffJohns1.id,  whyItMatters: "Johns' Flash run with Wally West — still essential even after Barry's return.", required: true,  estTimeMinutes: 20, order: 2 },
    { readingPathId: flashEssential.id, issueId: flashBlackestNight.id,  whyItMatters: "Blackest Night: The Flash — Barry facing the dead heroes of DC. Emotionally devastating.", required: false, estTimeMinutes: 20, order: 3 },
    { readingPathId: flashComplete.id,  issueId: flashRebirth1.id,       whyItMatters: "Start with Rebirth to establish Barry.", required: true,  estTimeMinutes: 20, order: 1 },
    { readingPathId: flashComplete.id,  issueId: flashByGeoffJohns1.id,  whyItMatters: "Johns' run is the Flash's modern bible.", required: true,  estTimeMinutes: 20, order: 2 },
    { readingPathId: flashComplete.id,  issueId: flashBlackestNight.id,  whyItMatters: "Barry in Blackest Night — his moral clarity tested against literal death.", required: true,  estTimeMinutes: 20, order: 3 },
  ]})

  // ─────────────────────────────────────────────
  // READING PATHS — THE JOKER
  // ─────────────────────────────────────────────
  const jokerBeginner  = await prisma.readingPath.create({ data: { characterId: joker.id, tier: 'beginner' } })
  const jokerEssential = await prisma.readingPath.create({ data: { characterId: joker.id, tier: 'essential' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: jokerBeginner.id,  issueId: batmanYearOne1.id,    whyItMatters: "Year One establishes Gotham before the Joker fully takes hold — essential context.", required: true,  estTimeMinutes: 25, order: 1 },
    { readingPathId: jokerBeginner.id,  issueId: batmanHush1.id,       whyItMatters: "Hush features the Joker prominently and showcases how Batman thinks about him.", required: false, estTimeMinutes: 25, order: 2 },
    { readingPathId: jokerEssential.id, issueId: batmanYearOne1.id,    whyItMatters: "Start with Year One — understand Gotham and Batman before diving into the Joker.", required: true,  estTimeMinutes: 25, order: 1 },
    { readingPathId: jokerEssential.id, issueId: batmanKnightfall1.id, whyItMatters: "Knightfall sets the stage for Arkham Asylum's chaos — the Joker's influence permeates everything.", required: true,  estTimeMinutes: 25, order: 2 },
  ]})

  // ─────────────────────────────────────────────
  // READING PATHS — GREEN LANTERN
  // ─────────────────────────────────────────────
  const glBeginner  = await prisma.readingPath.create({ data: { characterId: greenLantern.id, tier: 'beginner' } })
  const glEssential = await prisma.readingPath.create({ data: { characterId: greenLantern.id, tier: 'essential' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: glBeginner.id,  issueId: flashRebirth1.id,      whyItMatters: "The Flash and Green Lantern are DC's closest friendship — start with Flash Rebirth to understand the universe they share.", required: false, estTimeMinutes: 20, order: 1 },
    { readingPathId: glBeginner.id,  issueId: flashBlackestNight.id, whyItMatters: "Blackest Night is the Green Lantern universe's peak event — spectacular and accessible.", required: true,  estTimeMinutes: 20, order: 2 },
    { readingPathId: glEssential.id, issueId: flashRebirth1.id,      whyItMatters: "Companion piece — understand Barry Allen to understand why Hal Jordan matters.", required: false, estTimeMinutes: 20, order: 1 },
    { readingPathId: glEssential.id, issueId: flashBlackestNight.id, whyItMatters: "Blackest Night: the emotional spectrum turned into war. The GL mythology at its fullest.", required: true,  estTimeMinutes: 20, order: 2 },
  ]})

  // ─────────────────────────────────────────────
  // RELATIONSHIPS
  // ─────────────────────────────────────────────
  await prisma.relationship.createMany({ data: [
    { characterAId: wolverine.id,       characterBId: spiderMan.id,      type: 'ally' },
    { characterAId: wolverine.id,       characterBId: captainAmerica.id, type: 'ally' },
    { characterAId: spiderMan.id,       characterBId: ironMan.id,        type: 'ally' },
    { characterAId: ironMan.id,         characterBId: captainAmerica.id, type: 'ally' },
    { characterAId: ironMan.id,         characterBId: thor.id,           type: 'ally' },
    { characterAId: ironMan.id,         characterBId: hulk.id,           type: 'ally' },
    { characterAId: captainAmerica.id,  characterBId: blackWidow.id,     type: 'ally' },
    { characterAId: doctorStrange.id,   characterBId: thor.id,           type: 'ally' },
    { characterAId: batman.id,          characterBId: superman.id,       type: 'ally' },
    { characterAId: batman.id,          characterBId: joker.id,          type: 'villain' },
    { characterAId: batman.id,          characterBId: wonderWoman.id,    type: 'ally' },
    { characterAId: batman.id,          characterBId: greenLantern.id,   type: 'ally' },
    { characterAId: superman.id,        characterBId: wonderWoman.id,    type: 'ally' },
    { characterAId: superman.id,        characterBId: flash.id,          type: 'ally' },
    { characterAId: flash.id,           characterBId: greenLantern.id,   type: 'ally' },
  ]})

  // ─────────────────────────────────────────────
  // EVENTS
  // ─────────────────────────────────────────────

  // Civil War issues
  const civilWarIssue1    = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Civil War', issueNumber: '1', year: 2006, coverImageUrl: null, summary: 'The Superhero Registration Act tears the Marvel universe in two.' } })
  const civilWarIssue7    = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Civil War', issueNumber: '7', year: 2007, coverImageUrl: null, summary: 'The war ends. Captain America surrenders. Nothing is the same.' } })
  const civilWarSpiderMan = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'The Amazing Spider-Man', issueNumber: '532', year: 2006, coverImageUrl: null, summary: "Spider-Man unmasks before the world." } })

  const civilWar = await prisma.event.create({ data: {
    publisherId: marvel.id, name: 'Civil War',
    summary: "When a superhero battle kills hundreds of civilians including school children, the government passes the Superhero Registration Act — forcing all heroes to unmask and work for S.H.I.E.L.D. Iron Man supports it. Captain America goes underground to fight it. Friends become enemies. The Marvel universe tears itself in half.",
    cause: "The Stamford disaster — the New Warriors accidentally trigger an explosion that kills 612 civilians, including school children.",
    imageUrl: null,
  }})
  const civilWarPath = await prisma.readingPath.create({ data: { eventId: civilWar.id, tier: 'essential' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: civilWarPath.id, issueId: civilWarIssue1.id,    whyItMatters: "The opening shot. The Registration Act is proposed and battle lines are drawn.", required: true, estTimeMinutes: 20, order: 1 },
    { readingPathId: civilWarPath.id, issueId: civilWarSpiderMan.id, whyItMatters: "Spider-Man's unmasking — the event's most personal moment, haunting him for years.", required: false, estTimeMinutes: 20, order: 2 },
    { readingPathId: civilWarPath.id, issueId: civilWarIssue7.id,    whyItMatters: "The war ends not with victory but surrender. Steve Rogers lays down his shield.", required: true, estTimeMinutes: 20, order: 3 },
  ]})
  await prisma.impactEntry.createMany({ data: [
    { eventId: civilWar.id, characterId: wolverine.id,      consequenceText: "Wolverine sided with Iron Man but grew disillusioned — then hunted down the man who ordered the Nitro attack." },
    { eventId: civilWar.id, characterId: spiderMan.id,      consequenceText: "Peter publicly unmasked as Spider-Man. His family was immediately targeted. The fallout consumed years of his life." },
    { eventId: civilWar.id, characterId: ironMan.id,        consequenceText: "Tony Stark became Director of S.H.I.E.L.D. — having won the war, he had to live with what it cost." },
    { eventId: civilWar.id, characterId: captainAmerica.id, consequenceText: "Steve Rogers surrendered to prevent more bloodshed — and was assassinated on the courthouse steps days later." },
  ]})

  // Infinity Gauntlet issues
  const infinityGauntlet1 = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'The Infinity Gauntlet', issueNumber: '1', year: 1991, coverImageUrl: null, summary: "Thanos assembles all six Infinity Gems — omnipotence in his hands." } })
  const infinityGauntlet6 = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'The Infinity Gauntlet', issueNumber: '6', year: 1991, coverImageUrl: null, summary: "The final confrontation — every Marvel hero against a god." } })
  const silverSurferIG    = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Silver Surfer', issueNumber: '34',          year: 1990, coverImageUrl: null, summary: "The Silver Surfer warns Earth of Thanos's coming — the prelude." } })

  const infinityGauntlet = await prisma.event.create({ data: {
    publisherId: marvel.id, name: 'The Infinity Gauntlet',
    summary: "Thanos, driven mad by his love for Death itself, assembles all six Infinity Gems and becomes omnipotent. With a snap, he erases half of all life in the universe to impress her. Earth's remaining heroes — alongside Adam Warlock, Captain Marvel, and cosmic entities — wage a desperate battle against a literal god.",
    cause: "Thanos's obsession with Death — he seeks to demonstrate his love by gifting her with mass death on an unprecedented scale.",
    imageUrl: null,
  }})
  const igPath = await prisma.readingPath.create({ data: { eventId: infinityGauntlet.id, tier: 'essential' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: igPath.id, issueId: silverSurferIG.id,    whyItMatters: "The prelude — the Silver Surfer's warning. Sets the cosmic stakes before the main event.", required: false, estTimeMinutes: 20, order: 1 },
    { readingPathId: igPath.id, issueId: infinityGauntlet1.id, whyItMatters: "The snap happens in issue 1. Thanos erases half of all life — heroes turn to dust before your eyes.", required: true, estTimeMinutes: 20, order: 2 },
    { readingPathId: igPath.id, issueId: infinityGauntlet6.id, whyItMatters: "The final issue — every Marvel hero against Thanos. Epic, operatic, unforgettable.", required: true, estTimeMinutes: 20, order: 3 },
  ]})
  await prisma.impactEntry.createMany({ data: [
    { eventId: infinityGauntlet.id, characterId: spiderMan.id,      consequenceText: "Spider-Man is one of the heroes who vanished with the snap — dead, then restored." },
    { eventId: infinityGauntlet.id, characterId: ironMan.id,        consequenceText: "Iron Man was among the survivors and fought Thanos directly — witnessing what no armor could stop." },
    { eventId: infinityGauntlet.id, characterId: thor.id,           consequenceText: "Thor fought in the final battle against omnipotent Thanos — and lost catastrophically before the reversal." },
    { eventId: infinityGauntlet.id, characterId: hulk.id,           consequenceText: "The Hulk participated in the battle on Thanos's worldship — one of the few strong enough to survive initial contact." },
    { eventId: infinityGauntlet.id, characterId: doctorStrange.id,  consequenceText: "Strange coordinated Earth's mystical response and was among the heroes who challenged Thanos directly." },
  ]})

  // House of M issues
  const houseOfM1 = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'House of M', issueNumber: '1', year: 2005, coverImageUrl: null, summary: "Wanda Maximoff's breakdown reshapes the entire world into a mutant paradise." } })
  const houseOfM8 = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'House of M', issueNumber: '8', year: 2005, coverImageUrl: null, summary: "'No more mutants.' Wanda erases 90% of the world's mutant population." } })

  const houseOfM = await prisma.event.create({ data: {
    publisherId: marvel.id, name: 'House of M',
    summary: "The Scarlet Witch, driven to a breakdown by grief over her lost children, rewrites reality — creating a world where mutants rule and humans are second-class citizens. When the heroes discover the truth and confront her, Wanda whispers three words that change Marvel forever: 'No more mutants.'",
    cause: "Wanda Maximoff's mental collapse after losing her children and Magneto's manipulation of her grief.",
    imageUrl: null,
  }})
  const homPath = await prisma.readingPath.create({ data: { eventId: houseOfM.id, tier: 'essential' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: homPath.id, issueId: houseOfM1.id, whyItMatters: "Reality is rewritten — the world is suddenly very different and no one knows why. Disorienting in the best way.", required: true, estTimeMinutes: 20, order: 1 },
    { readingPathId: homPath.id, issueId: houseOfM8.id, whyItMatters: "'No more mutants.' Three words that decimated the mutant population. The most consequential single issue in a generation.", required: true, estTimeMinutes: 20, order: 2 },
  ]})
  await prisma.impactEntry.createMany({ data: [
    { eventId: houseOfM.id, characterId: wolverine.id,  consequenceText: "In Wanda's world, Logan remembered his past for the first time. When reality was restored, he kept those memories — finally knowing who he really was." },
    { eventId: houseOfM.id, characterId: spiderMan.id,  consequenceText: "In Wanda's world, Peter was famous, married to Gwen (alive), and celebrated. The restoration wiped it all — making reality feel worse by comparison." },
  ]})

  // DC Events — Flashpoint
  const flashpoint1 = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'Flashpoint', issueNumber: '1', year: 2011, coverImageUrl: null, summary: "Barry Allen wakes in a world where Superman never existed and the world is at war." } })
  const flashpoint5 = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'Flashpoint', issueNumber: '5', year: 2011, coverImageUrl: null, summary: "Barry must undo what he did — at an unbearable personal cost." } })

  const flashpointEvent = await prisma.event.create({ data: {
    publisherId: dc.id, name: 'Flashpoint',
    summary: "Barry Allen traveled back in time to save his mother from the Reverse-Flash — and accidentally created a broken timeline. In this world, Superman is a government prisoner, Batman is Thomas Wayne (and a killer), and Aquaman and Wonder Woman are waging a war that is drowning Europe. Barry must destroy his greatest act of love to restore the world — and in doing so, triggers the New 52.",
    cause: "Barry Allen's decision to travel back in time and prevent the Reverse-Flash from killing his mother, Nora Allen.",
    imageUrl: null,
  }})
  const fpPath = await prisma.readingPath.create({ data: { eventId: flashpointEvent.id, tier: 'essential' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: fpPath.id, issueId: flashpoint1.id, whyItMatters: "Barry wakes in the wrong world — disorienting, propulsive, and a love letter to DC continuity.", required: true, estTimeMinutes: 20, order: 1 },
    { readingPathId: fpPath.id, issueId: flashpoint5.id, whyItMatters: "The heartbreaking conclusion — Barry chooses the world over his mother. Thomas Wayne's letter to Bruce.", required: true, estTimeMinutes: 20, order: 2 },
  ]})
  await prisma.impactEntry.createMany({ data: [
    { eventId: flashpointEvent.id, characterId: flash.id,    consequenceText: "Barry undoes his own act of love — letting his mother die, restoring the timeline, and triggering the New 52 relaunch." },
    { eventId: flashpointEvent.id, characterId: batman.id,   consequenceText: "In the Flashpoint timeline, Bruce Wayne died in Crime Alley — and Thomas Wayne became a brutal, gun-wielding Batman." },
    { eventId: flashpointEvent.id, characterId: superman.id, consequenceText: "In the Flashpoint timeline, Kal-El's rocket was captured by the US government. He never became Superman." },
  ]})

  // Blackest Night
  const blackestNight1 = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'Blackest Night', issueNumber: '1', year: 2009, coverImageUrl: null, summary: "Black Lantern rings resurrect dead heroes and villains to attack the living." } })
  const blackestNight8 = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'Blackest Night', issueNumber: '8', year: 2010, coverImageUrl: null, summary: "The Entity of Life intervenes — and twelve heroes are resurrected by White Lantern rings." } })

  const blackestNight = await prisma.event.create({ data: {
    publisherId: dc.id, name: 'Blackest Night',
    summary: "Nekron, the embodiment of death, sends Black Lantern rings to reanimate DC's dead heroes and villains — turning them into weapons against the living. The emotional spectrum of all Lantern Corps must unite to fight what is essentially death itself. The most ambitious Green Lantern story ever told, pulling in the entire DC universe.",
    cause: "Nekron's long-planned invasion of the living universe, using the accumulated dead of DC Comics as his army.",
    imageUrl: null,
  }})
  const bnPath = await prisma.readingPath.create({ data: { eventId: blackestNight.id, tier: 'essential' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: bnPath.id, issueId: blackestNight1.id,  whyItMatters: "The Black Lanterns rise — dead heroes attack the living. The horror-comic premise lands perfectly.", required: true, estTimeMinutes: 20, order: 1 },
    { readingPathId: bnPath.id, issueId: flashBlackestNight.id, whyItMatters: "Barry Allen's tie-in — the best single-character Blackest Night story. Essential companion reading.", required: false, estTimeMinutes: 20, order: 2 },
    { readingPathId: bnPath.id, issueId: blackestNight8.id,  whyItMatters: "The White Lantern revelation — twelve heroes resurrected. An enormous, emotional payoff.", required: true, estTimeMinutes: 20, order: 3 },
  ]})
  await prisma.impactEntry.createMany({ data: [
    { eventId: blackestNight.id, characterId: batman.id,      consequenceText: "A Black Lantern ring tried to reanimate Bruce Wayne's corpse — while Batman was actually trapped in the past after Final Crisis." },
    { eventId: blackestNight.id, characterId: superman.id,    consequenceText: "Superman was turned into a Black Lantern briefly, forced to attack those he loved — testing the limits of his will." },
    { eventId: blackestNight.id, characterId: flash.id,       consequenceText: "Barry Allen faced dead heroes he'd known — and had to fight through grief and guilt to survive and fight back." },
    { eventId: blackestNight.id, characterId: greenLantern.id, consequenceText: "Hal Jordan united every Lantern Corps — friends and enemies — into a unified front against Nekron." },
  ]})

  // Event chain links
  await prisma.event.update({ where: { id: flashpointEvent.id }, data: { leadsToEventId: blackestNight.id } })

  // ─────────────────────────────────────────────
  // NEW CHARACTERS — WORKSTREAM 2
  // ─────────────────────────────────────────────

  // DAREDEVIL
  const daredevil = await prisma.character.create({
    data: {
      publisherId: marvel.id,
      name: 'Daredevil',
      realName: 'Matt Murdock',
      aliases: JSON.stringify(["The Man Without Fear", "The Devil of Hell's Kitchen", "Kingpin of Hell's Kitchen"]),
      bio: "Blinded by a radioactive canister as a child, Matt Murdock's remaining senses were amplified to superhuman levels. By day he's a lawyer fighting for justice in the courtroom. By night he's Daredevil — the one hero who patrols Hell's Kitchen because nobody else will. Frank Miller made him Marvel's darkest, most psychologically complex street-level hero.",
      powers: JSON.stringify(['Radar sense', 'Enhanced senses', 'Peak acrobatics', 'Billy club', 'Legal expertise']),
      firstAppearanceYear: 1964,
      firstAppearanceIssue: 'Daredevil #1',
      creators: JSON.stringify(['Stan Lee', 'Bill Everett']),
      currentStatusText: "Protecting Hell's Kitchen as both lawyer and vigilante.",
      imageUrl: 'https://i.annihil.us/u/prod/marvel/i/mg/d/03/58232dc09de4f.jpg',
    },
  })
  await prisma.timelineEvent.createMany({ data: [
    { characterId: daredevil.id, year: 1964, title: 'First Appearance', description: "Matt Murdock is blinded by a radioactive canister, and his remaining senses amplify to superhuman levels. Billy Club vigilante born.", order: 1 },
    { characterId: daredevil.id, year: 1986, title: 'Born Again', description: "Kingpin discovers Daredevil's identity and systematically destroys Matt Murdock's life — his job, his home, his sanity.", order: 2 },
    { characterId: daredevil.id, year: 1993, title: 'Falls of the Kingpin', description: "Murdock helps bring down Fisk, reclaiming his life and identity after years of destruction.", order: 3 },
    { characterId: daredevil.id, year: 1998, title: "Kevin Smith's Guardian Devil", description: "Smith's run restores the book to prestige status, bringing in a new villain and testing Matt's faith.", order: 4 },
    { characterId: daredevil.id, year: 2011, title: "Mark Waid's Run", description: "Swashbuckling Daredevil reimagined — new tone without losing depth. The best modern entry point.", order: 5 },
  ]})

  const ddIssue1_1964 = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Daredevil', issueNumber: '1', year: 1964, coverImageUrl: null, summary: "The Man Without Fear's origin — blinded lawyer becomes vigilante." } })
  const ddIssue227_1986 = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Daredevil', issueNumber: '227', year: 1986, coverImageUrl: null, summary: "Born Again begins — Karen Page sells Matt's identity. Kingpin begins his destruction." } })
  const ddIssue1_2011 = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Daredevil', issueNumber: '1', year: 2011, coverImageUrl: null, summary: "Mark Waid's run — Daredevil reinvented without ignoring history. The best entry point." } })

  const ddBeginner  = await prisma.readingPath.create({ data: { characterId: daredevil.id, tier: 'beginner' } })
  const ddEssential = await prisma.readingPath.create({ data: { characterId: daredevil.id, tier: 'essential' } })
  const ddComplete  = await prisma.readingPath.create({ data: { characterId: daredevil.id, tier: 'complete' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: ddBeginner.id,  issueId: ddIssue1_2011.id,   whyItMatters: "Waid's run is the perfect entry — accessible, exciting, doesn't require history.", required: true,  estTimeMinutes: 20, order: 1 },
    { readingPathId: ddEssential.id, issueId: ddIssue227_1986.id, whyItMatters: "Born Again: the greatest Daredevil story. Miller strips everything from Matt.", required: true,  estTimeMinutes: 20, order: 1 },
    { readingPathId: ddEssential.id, issueId: ddIssue1_2011.id,   whyItMatters: "Then jump to Waid's lighter modern run.", required: true,  estTimeMinutes: 20, order: 2 },
    { readingPathId: ddComplete.id,  issueId: ddIssue1_1964.id,   whyItMatters: "The original origin — start here for full context.", required: false, estTimeMinutes: 20, order: 1 },
    { readingPathId: ddComplete.id,  issueId: ddIssue227_1986.id, whyItMatters: "Born Again: the greatest Daredevil story. Miller strips everything from Matt.", required: true,  estTimeMinutes: 20, order: 2 },
    { readingPathId: ddComplete.id,  issueId: ddIssue1_2011.id,   whyItMatters: "Mark Waid's run — Daredevil reinvented without ignoring history.", required: true,  estTimeMinutes: 20, order: 3 },
  ]})

  // BLACK PANTHER
  const blackPanther = await prisma.character.create({
    data: {
      publisherId: marvel.id,
      name: 'Black Panther',
      realName: "T'Challa",
      aliases: JSON.stringify(['King of Wakanda', 'The Black Panther']),
      bio: "T'Challa is king of Wakanda, the world's most technologically advanced nation — and the Black Panther, its ceremonial protector empowered by the heart-shaped herb. The first Black superhero in mainstream American comics, T'Challa is a king, a scientist, and a warrior who fights not just for survival but for sovereignty.",
      powers: JSON.stringify(['Superhuman senses & strength (heart-shaped herb)', 'Vibranium suit', 'Genius intellect', 'Master tactician', 'Martial arts mastery']),
      firstAppearanceYear: 1966,
      firstAppearanceIssue: 'Fantastic Four #52',
      creators: JSON.stringify(['Stan Lee', 'Jack Kirby']),
      currentStatusText: 'Ruling Wakanda while protecting it from both external threats and internal dissent.',
      imageUrl: null,
    },
  })
  await prisma.timelineEvent.createMany({ data: [
    { characterId: blackPanther.id, year: 1966, title: 'First Appearance', description: "T'Challa debuts in Fantastic Four #52 — joins the FF, tests them on his own terms.", order: 1 },
    { characterId: blackPanther.id, year: 1988, title: 'Solo Series', description: "Peter B. Gillis writes Black Panther's first extended solo series.", order: 2 },
    { characterId: blackPanther.id, year: 1998, title: "Priest's Landmark Run", description: "Christopher Priest's run begins — political, shrewd, unlike anything in Marvel.", order: 3 },
    { characterId: blackPanther.id, year: 2005, title: 'Reclaims Wakandan Throne', description: "T'Challa regains the Wakandan throne after House of M fallout.", order: 4 },
    { characterId: blackPanther.id, year: 2016, title: "Coates' Run", description: "Ta-Nehisi Coates' run — Wakanda in social turmoil, T'Challa questions his right to rule.", order: 5 },
  ]})

  const bpFF52 = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Fantastic Four', issueNumber: '52', year: 1966, coverImageUrl: null, summary: "T'Challa's debut — he tests the Fantastic Four on his own terms." } })
  const bpIssue1_1998 = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Black Panther', issueNumber: '1', year: 1998, coverImageUrl: null, summary: "Christopher Priest's definitive run begins." } })
  const bpIssue1_2016 = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Black Panther', issueNumber: '1', year: 2016, coverImageUrl: null, summary: "Coates's run — Wakanda in revolution, T'Challa the reluctant king." } })

  const bpBeginner  = await prisma.readingPath.create({ data: { characterId: blackPanther.id, tier: 'beginner' } })
  const bpEssential = await prisma.readingPath.create({ data: { characterId: blackPanther.id, tier: 'essential' } })
  const bpComplete  = await prisma.readingPath.create({ data: { characterId: blackPanther.id, tier: 'complete' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: bpBeginner.id,  issueId: bpIssue1_1998.id, whyItMatters: "Priest's run is the essential starting point — political intrigue, sharp characterisation.", required: true, estTimeMinutes: 20, order: 1 },
    { readingPathId: bpEssential.id, issueId: bpIssue1_1998.id, whyItMatters: "Priest's run is the essential starting point — political intrigue, sharp characterisation.", required: true, estTimeMinutes: 20, order: 1 },
    { readingPathId: bpEssential.id, issueId: bpIssue1_2016.id, whyItMatters: "Coates continues what Priest established — Wakanda under pressure, T'Challa questioning sovereignty.", required: true, estTimeMinutes: 20, order: 2 },
    { readingPathId: bpComplete.id,  issueId: bpFF52.id,        whyItMatters: "T'Challa's debut — the original appearance in Fantastic Four. Historical context.", required: false, estTimeMinutes: 20, order: 1 },
    { readingPathId: bpComplete.id,  issueId: bpIssue1_1998.id, whyItMatters: "Priest's definitive run — where the character came into his own.", required: true, estTimeMinutes: 20, order: 2 },
    { readingPathId: bpComplete.id,  issueId: bpIssue1_2016.id, whyItMatters: "Coates's run — the modern essential.", required: true, estTimeMinutes: 20, order: 3 },
  ]})

  // AQUAMAN
  const aquaman = await prisma.character.create({
    data: {
      publisherId: dc.id,
      name: 'Aquaman',
      realName: 'Arthur Curry',
      aliases: JSON.stringify(['King of Atlantis', 'Orin']),
      bio: "Half-human, half-Atlantean, Arthur Curry has always been caught between two worlds — and fully accepted by neither. As Aquaman, he commands the seas, speaks to marine life, and rules an empire beneath the waves. Often mocked, rarely understood, consistently underestimated — which is exactly how Geoff Johns preferred it before he made Aquaman undeniable.",
      powers: JSON.stringify(['Superhuman strength (water-enhanced)', 'Telepathy with sea life', 'Atlantean durability', 'Trident']),
      firstAppearanceYear: 1941,
      firstAppearanceIssue: 'More Fun Comics #73',
      creators: JSON.stringify(['Paul Norris']),
      currentStatusText: 'Ruling Atlantis while serving as a member of the Justice League.',
      imageUrl: null,
    },
  })
  await prisma.timelineEvent.createMany({ data: [
    { characterId: aquaman.id, year: 1941, title: 'First Appearance', description: "Arthur Curry debuts in More Fun Comics #73 — the king of the seas arrives.", order: 1 },
    { characterId: aquaman.id, year: 1993, title: 'Loses His Hand', description: "Arthur's hand is devoured by piranhas — replaced by a harpoon in a darker, grittier direction.", order: 2 },
    { characterId: aquaman.id, year: 2011, title: 'New 52 Relaunch', description: "Geoff Johns rebuilds Aquaman from a punchline into a force — the definitive modern take.", order: 3 },
    { characterId: aquaman.id, year: 2016, title: 'Rebirth', description: "Dan Abnett continues the modern Aquaman with the Rebirth line.", order: 4 },
  ]})

  const aquamanIssue1_2011 = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'Aquaman', issueNumber: '1', year: 2011, coverImageUrl: null, summary: "Geoff Johns rebuilds Aquaman from a punchline into a force — essential." } })
  const aquamanIssue17_2013 = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'Aquaman', issueNumber: '17', year: 2013, coverImageUrl: null, summary: "Throne of Atlantis begins — war between surface and the deep." } })

  const aquaBeginner  = await prisma.readingPath.create({ data: { characterId: aquaman.id, tier: 'beginner' } })
  const aquaEssential = await prisma.readingPath.create({ data: { characterId: aquaman.id, tier: 'essential' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: aquaBeginner.id,  issueId: aquamanIssue1_2011.id,  whyItMatters: "Johns rebuilds Aquaman — best entry point, no prior reading needed.", required: true, estTimeMinutes: 20, order: 1 },
    { readingPathId: aquaEssential.id, issueId: aquamanIssue1_2011.id,  whyItMatters: "Start here. Johns makes Aquaman undeniable.", required: true, estTimeMinutes: 20, order: 1 },
    { readingPathId: aquaEssential.id, issueId: aquamanIssue17_2013.id, whyItMatters: "Throne of Atlantis — war between surface and the deep. Aquaman's epic crossover.", required: true, estTimeMinutes: 20, order: 2 },
  ]})

  // GREEN ARROW
  const greenArrow = await prisma.character.create({
    data: {
      publisherId: dc.id,
      name: 'Green Arrow',
      realName: 'Oliver Queen',
      aliases: JSON.stringify(['Ollie', 'The Emerald Archer']),
      bio: "A billionaire stranded on a desert island who remade himself into a survival expert and vigilante — then came home and decided Gotham already had a Batman, so he'd fight injustice with arrows instead. Oliver Queen is DC's loudest progressive voice: loud, self-righteous, often wrong, and genuinely trying. Denny O'Neil and Neal Adams made him matter.",
      powers: JSON.stringify(['Master archer (trick arrows)', 'Expert martial artist', 'Acrobatics', 'Street-level savvy']),
      firstAppearanceYear: 1941,
      firstAppearanceIssue: 'More Fun Comics #73',
      creators: JSON.stringify(['Morton Weisinger', 'George Papp']),
      currentStatusText: 'Protecting Star City as the Emerald Archer.',
      imageUrl: null,
    },
  })
  await prisma.timelineEvent.createMany({ data: [
    { characterId: greenArrow.id, year: 1941, title: 'First Appearance', description: "Oliver Queen debuts in More Fun Comics #73 as the Emerald Archer.", order: 1 },
    { characterId: greenArrow.id, year: 1969, title: 'Political Voice', description: "Denny O'Neil and Neal Adams redefine Green Arrow as a progressive political voice alongside Green Lantern.", order: 2 },
    { characterId: greenArrow.id, year: 1987, title: 'The Longbow Hunters', description: "Mike Grell's dark, adult, grounded take — trick arrows stripped, replaced with brutal reality.", order: 3 },
    { characterId: greenArrow.id, year: 1995, title: 'Death', description: "Oliver Queen is blown up on an airplane — a dramatic end to a long era.", order: 4 },
    { characterId: greenArrow.id, year: 2001, title: 'Resurrection', description: "Kevin Smith resurrects Oliver Queen — the return of the Emerald Archer.", order: 5 },
    { characterId: greenArrow.id, year: 2007, title: 'Year One', description: "Andy Diggle and Jock tell the best version of the island origin story.", order: 6 },
  ]})

  const gaLongbow1 = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'Green Arrow: The Longbow Hunters', issueNumber: '1', year: 1987, coverImageUrl: null, summary: "Mike Grell strips the trick arrows and makes Green Arrow a serious adult thriller." } })
  const gaYearOne1 = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'Green Arrow: Year One', issueNumber: '1', year: 2007, coverImageUrl: null, summary: "The best retelling of the island origin — Diggle and Jock." } })

  const gaBeginner  = await prisma.readingPath.create({ data: { characterId: greenArrow.id, tier: 'beginner' } })
  const gaEssential = await prisma.readingPath.create({ data: { characterId: greenArrow.id, tier: 'essential' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: gaBeginner.id,  issueId: gaYearOne1.id,  whyItMatters: "The best retelling of the island origin — Diggle and Jock. Perfect entry point.", required: true, estTimeMinutes: 20, order: 1 },
    { readingPathId: gaEssential.id, issueId: gaLongbow1.id,  whyItMatters: "Grell strips the trick arrows and makes Green Arrow a serious adult thriller.", required: true, estTimeMinutes: 20, order: 1 },
    { readingPathId: gaEssential.id, issueId: gaYearOne1.id,  whyItMatters: "The best island origin — Diggle and Jock. Essential companion to Longbow Hunters.", required: true, estTimeMinutes: 20, order: 2 },
  ]})

  // ─────────────────────────────────────────────
  // TEAMS — WORKSTREAM 1
  // ─────────────────────────────────────────────

  // Clear existing team data (teams were wiped at start with character.deleteMany)
  await prisma.teamRelationship.deleteMany()
  await prisma.eventTeam.deleteMany()
  await prisma.teamLineup.deleteMany()
  await prisma.teamMembership.deleteMany()
  await prisma.team.deleteMany()

  // Look up existing characters
  const wolverineChar       = await prisma.character.findFirst({ where: { name: 'Wolverine' } })
  const batmanChar          = await prisma.character.findFirst({ where: { name: 'Batman' } })
  const supermanChar        = await prisma.character.findFirst({ where: { name: 'Superman' } })
  const wonderWomanChar     = await prisma.character.findFirst({ where: { name: 'Wonder Woman' } })
  const flashChar           = await prisma.character.findFirst({ where: { name: 'The Flash' } })
  const greenLanternChar    = await prisma.character.findFirst({ where: { name: 'Green Lantern' } })

  // ── X-MEN ──
  const xMenTeam = await prisma.team.create({
    data: {
      publisherId: marvel.id,
      slug: 'x-men',
      name: 'X-Men',
      bio: "Mutants born with extraordinary abilities, hated and feared by the world they protect. Founded by Professor Charles Xavier with a dream: peaceful coexistence between humans and mutants. The X-Men have never stopped fighting for that dream, even when the world gave them every reason to stop.",
      baseOfOperations: "Xavier's School for Gifted Youngsters, Westchester, NY",
      firstAppearanceIssue: 'X-Men #1',
      firstAppearanceYear: 1963,
      creators: JSON.stringify(['Stan Lee', 'Jack Kirby']),
    },
  })

  // Memberships
  await prisma.teamMembership.create({ data: { teamId: xMenTeam.id, characterId: wolverineChar!.id, displayName: 'Wolverine', role: 'Field Leader' } })
  await prisma.teamMembership.createMany({ data: [
    { teamId: xMenTeam.id, characterId: null, displayName: 'Cyclops',     role: 'Field Commander' },
    { teamId: xMenTeam.id, characterId: null, displayName: 'Jean Grey',   role: 'Telepath' },
    { teamId: xMenTeam.id, characterId: null, displayName: 'Storm',       role: 'Weather Manipulation' },
    { teamId: xMenTeam.id, characterId: null, displayName: 'Nightcrawler',role: 'Teleportation' },
    { teamId: xMenTeam.id, characterId: null, displayName: 'Colossus',    role: 'Steel Form' },
    { teamId: xMenTeam.id, characterId: null, displayName: 'Rogue',       role: 'Power Absorption' },
    { teamId: xMenTeam.id, characterId: null, displayName: 'Gambit',      role: 'Kinetic Energy' },
    { teamId: xMenTeam.id, characterId: null, displayName: 'Beast',       role: 'Super-Intellect' },
    { teamId: xMenTeam.id, characterId: null, displayName: 'Iceman',      role: 'Cryokinesis' },
    { teamId: xMenTeam.id, characterId: null, displayName: 'Professor X', role: 'Founder' },
  ]})

  // Lineups
  await prisma.teamLineup.createMany({ data: [
    { teamId: xMenTeam.id, name: 'Original X-Men (1963)',       years: '1963–1975', memberDisplayNames: JSON.stringify(['Cyclops', 'Jean Grey', 'Beast', 'Iceman', 'Angel']) },
    { teamId: xMenTeam.id, name: 'Giant-Size X-Men #1 (1975)',  years: '1975',      memberDisplayNames: JSON.stringify(['Wolverine', 'Storm', 'Nightcrawler', 'Colossus', 'Thunderbird', 'Banshee', 'Sunfire']) },
    { teamId: xMenTeam.id, name: 'Whedon/Cassaday Era (2004)',  years: '2004–2008', memberDisplayNames: JSON.stringify(['Cyclops', 'Emma Frost', 'Wolverine', 'Kitty Pryde', 'Beast', 'Colossus']) },
  ]})

  // Issues for X-Men reading path
  const xmen1_1963 = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'X-Men', issueNumber: '1', year: 1963, coverImageUrl: null, summary: "The origin. Xavier's dream stated plainly. Required context for every X-Men story that follows." } })
  const gsXMen1_1975 = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Giant-Size X-Men', issueNumber: '1', year: 1975, coverImageUrl: null, summary: "The new team. Wolverine joins. This issue invented modern X-Men." } })
  // astonishingXMen1 already exists — reuse
  // xMenGodLoves already exists — reuse

  const xmenPath = await prisma.readingPath.create({ data: { teamId: xMenTeam.id, tier: 'essential' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: xmenPath.id, issueId: xmen1_1963.id,       whyItMatters: "The origin. Xavier's dream stated plainly. Required context for every X-Men story that follows.", required: true,  estTimeMinutes: 20, order: 1 },
    { readingPathId: xmenPath.id, issueId: gsXMen1_1975.id,     whyItMatters: "The new team. Wolverine joins. This issue invented modern X-Men.", required: true,  estTimeMinutes: 25, order: 2 },
    { readingPathId: xmenPath.id, issueId: astonishingXMen1.id, whyItMatters: "Whedon's run is the best entry point for new readers — fresh start, no continuity needed.", required: true,  estTimeMinutes: 20, order: 3 },
    { readingPathId: xmenPath.id, issueId: xMenGodLoves.id,     whyItMatters: "The definitive statement on what the X-Men are for.", required: false, estTimeMinutes: 45, order: 4 },
  ]})

  // ── FANTASTIC FOUR ──
  const ffTeam = await prisma.team.create({
    data: {
      publisherId: marvel.id,
      slug: 'fantastic-four',
      name: 'Fantastic Four',
      bio: "The First Family of Marvel. Four scientists bombarded by cosmic rays became something more — and became the template for everything that followed. Reed Richards, Sue Storm, Johnny Storm, and Ben Grimm aren't just heroes; they're explorers, parents, friends, and the blueprint for the entire Marvel Universe.",
      baseOfOperations: 'Baxter Building, New York City',
      firstAppearanceIssue: 'Fantastic Four #1',
      firstAppearanceYear: 1961,
      creators: JSON.stringify(['Stan Lee', 'Jack Kirby']),
    },
  })

  await prisma.teamMembership.createMany({ data: [
    { teamId: ffTeam.id, characterId: null, displayName: 'Mr. Fantastic / Reed Richards', role: 'Leader, genius-level intellect, elasticity' },
    { teamId: ffTeam.id, characterId: null, displayName: 'Invisible Woman / Sue Storm',   role: 'Force fields, invisibility' },
    { teamId: ffTeam.id, characterId: null, displayName: 'Human Torch / Johnny Storm',    role: 'Fire generation, flight' },
    { teamId: ffTeam.id, characterId: null, displayName: 'The Thing / Ben Grimm',         role: 'Superhuman strength, rock-like skin' },
    { teamId: ffTeam.id, characterId: null, displayName: 'She-Hulk',                      role: 'Temporary member' },
    { teamId: ffTeam.id, characterId: null, displayName: 'Spider-Man',                    role: 'Temporary member' },
  ]})

  await prisma.teamLineup.createMany({ data: [
    { teamId: ffTeam.id, name: 'Original Four (1961)',     years: '1961–present', memberDisplayNames: JSON.stringify(['Mr. Fantastic', 'Invisible Woman', 'Human Torch', 'The Thing']) },
    { teamId: ffTeam.id, name: 'New Fantastic Four (1990)', years: '1990',        memberDisplayNames: JSON.stringify(['Spider-Man', 'Wolverine', 'Hulk', 'Ghost Rider']) },
  ]})

  const ff1_1961 = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Fantastic Four', issueNumber: '1', year: 1961, coverImageUrl: null, summary: "The origin — four explorers, one cosmic ray, the birth of the Marvel Universe." } })
  const ff48_1966 = await prisma.issue.create({ data: { publisherId: marvel.id, seriesName: 'Fantastic Four', issueNumber: '48', year: 1966, coverImageUrl: null, summary: "The Galactus Trilogy begins — the first true Marvel cosmic story." } })

  const ffPath = await prisma.readingPath.create({ data: { teamId: ffTeam.id, tier: 'essential' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: ffPath.id, issueId: ff1_1961.id,  whyItMatters: "The origin — four explorers, one cosmic ray, the birth of the Marvel Universe.", required: true, estTimeMinutes: 20, order: 1 },
    { readingPathId: ffPath.id, issueId: ff48_1966.id, whyItMatters: "The Galactus Trilogy. The first true Marvel cosmic story — Reed Richards saves the Earth with a machine. One of the most important single issues ever published.", required: true, estTimeMinutes: 20, order: 2 },
  ]})

  // ── JUSTICE LEAGUE ──
  const jlTeam = await prisma.team.create({
    data: {
      publisherId: dc.id,
      slug: 'justice-league',
      name: 'Justice League',
      bio: "When one hero isn't enough. The Justice League is DC's greatest assembly — Superman's power, Batman's mind, Wonder Woman's courage, the Flash's speed — united to face threats no individual could stop. Founded in the Silver Age, the League has been Earth's last line of defense for over sixty years.",
      baseOfOperations: 'Hall of Justice (later the Watchtower satellite)',
      firstAppearanceIssue: 'The Brave and the Bold #28',
      firstAppearanceYear: 1960,
      creators: JSON.stringify(['Gardner Fox', 'Mike Sekowsky']),
    },
  })

  await prisma.teamMembership.create({ data: { teamId: jlTeam.id, characterId: batmanChar!.id,      displayName: 'Batman',       role: 'Strategist' } })
  await prisma.teamMembership.create({ data: { teamId: jlTeam.id, characterId: supermanChar!.id,    displayName: 'Superman',     role: 'Heavy hitter' } })
  await prisma.teamMembership.create({ data: { teamId: jlTeam.id, characterId: wonderWomanChar!.id, displayName: 'Wonder Woman', role: 'Warrior' } })
  await prisma.teamMembership.create({ data: { teamId: jlTeam.id, characterId: flashChar!.id,       displayName: 'The Flash',    role: 'Speed' } })
  await prisma.teamMembership.create({ data: { teamId: jlTeam.id, characterId: greenLanternChar!.id,displayName: 'Green Lantern',role: 'Space cop' } })
  await prisma.teamMembership.createMany({ data: [
    { teamId: jlTeam.id, characterId: null, displayName: 'Aquaman',        role: 'Founding member, Atlantean strength' },
    { teamId: jlTeam.id, characterId: null, displayName: 'Martian Manhunter', role: 'Shape-shifting telepath, founding member' },
    { teamId: jlTeam.id, characterId: null, displayName: 'Hawkgirl',       role: 'Flight and Nth metal mace' },
    { teamId: jlTeam.id, characterId: null, displayName: 'Cyborg',         role: 'Cybernetic enhancements' },
    { teamId: jlTeam.id, characterId: null, displayName: 'Black Canary',   role: 'Canary Cry, martial arts' },
  ]})

  await prisma.teamLineup.createMany({ data: [
    { teamId: jlTeam.id, name: 'Founding Seven (1960)',      years: '1960',      memberDisplayNames: JSON.stringify(['Superman', 'Batman', 'Wonder Woman', 'The Flash', 'Green Lantern', 'Aquaman', 'Martian Manhunter']) },
    { teamId: jlTeam.id, name: 'Big Seven / Morrison Era (1997)', years: '1997–2000', memberDisplayNames: JSON.stringify(['Superman', 'Batman', 'Wonder Woman', 'The Flash', 'Green Lantern (Kyle Rayner)', 'Aquaman', 'Martian Manhunter']) },
  ]})

  // EventTeams — JL in Blackest Night and Flashpoint
  await prisma.eventTeam.createMany({ data: [
    { eventId: blackestNight.id,   teamId: jlTeam.id },
    { eventId: flashpointEvent.id, teamId: jlTeam.id },
  ]})

  const jla1_1997  = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'JLA', issueNumber: '1',  year: 1997, coverImageUrl: null, summary: "Grant Morrison's relaunch — the League restored to its 'big seven.'" } })
  const jla43_2000 = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'JLA', issueNumber: '43', year: 2000, coverImageUrl: null, summary: "Tower of Babel: Batman's contingency plans to defeat the JLA are stolen." } })

  const jlPath = await prisma.readingPath.create({ data: { teamId: jlTeam.id, tier: 'essential' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: jlPath.id, issueId: jla1_1997.id,  whyItMatters: "Grant Morrison restores the League to its 'big seven.' The definitive modern template.", required: true, estTimeMinutes: 20, order: 1 },
    { readingPathId: jlPath.id, issueId: jla43_2000.id, whyItMatters: "Tower of Babel: Batman's contingency plans to defeat the JLA are stolen. Essential Batman-within-League story.", required: true, estTimeMinutes: 20, order: 2 },
  ]})

  // ── TEEN TITANS ──
  const ttTeam = await prisma.team.create({
    data: {
      publisherId: dc.id,
      slug: 'teen-titans',
      name: 'Teen Titans',
      bio: "The sidekicks grew up. The Teen Titans started as a club for Robin, Kid Flash, and Aqualad — and became something far greater. Under Marv Wolfman and George Pérez, they became DC's most emotionally complex team: young heroes dealing with identity, loss, and what it costs to carry on a legacy.",
      baseOfOperations: 'Titans Tower, San Francisco',
      firstAppearanceIssue: 'The Brave and the Bold #54',
      firstAppearanceYear: 1964,
      creators: JSON.stringify(['Bob Haney', 'Bruno Premiani']),
    },
  })

  await prisma.teamMembership.createMany({ data: [
    { teamId: ttTeam.id, characterId: null, displayName: 'Robin / Dick Grayson',  role: 'Founder, acrobatics, detective skills' },
    { teamId: ttTeam.id, characterId: null, displayName: 'Wonder Girl / Donna Troy', role: 'Amazon strength and speed' },
    { teamId: ttTeam.id, characterId: null, displayName: 'Kid Flash / Wally West', role: 'Speed Force, founder' },
    { teamId: ttTeam.id, characterId: null, displayName: 'Aqualad / Garth',        role: 'Atlantean strength and water control' },
    { teamId: ttTeam.id, characterId: null, displayName: 'Cyborg / Victor Stone',  role: 'Cybernetic enhancements' },
    { teamId: ttTeam.id, characterId: null, displayName: "Starfire / Koriand'r",   role: 'Solar energy blasts, flight' },
    { teamId: ttTeam.id, characterId: null, displayName: 'Raven',                  role: 'Empathy, soul-self projection, healing' },
    { teamId: ttTeam.id, characterId: null, displayName: 'Beast Boy / Changeling', role: 'Animal transformation' },
    { teamId: ttTeam.id, characterId: null, displayName: 'Terra',                  role: 'Geokinesis', leftNote: 'Revealed as a traitor working for Deathstroke. Died in the Judas Contract arc.' },
  ]})

  await prisma.teamLineup.createMany({ data: [
    { teamId: ttTeam.id, name: 'Original Titans (1964)',   years: '1964–1980', memberDisplayNames: JSON.stringify(['Robin', 'Wonder Girl', 'Kid Flash', 'Aqualad', 'Speedy']) },
    { teamId: ttTeam.id, name: 'New Teen Titans (1980)',   years: '1980–1988', memberDisplayNames: JSON.stringify(['Robin', 'Wonder Girl', 'Kid Flash', 'Raven', 'Starfire', 'Cyborg', 'Beast Boy']) },
  ]})

  const ntt1_1980 = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'The New Teen Titans', issueNumber: '1', year: 1980, coverImageUrl: null, summary: "Wolfman and Pérez launch the definitive Titans. Raven, Starfire, Cyborg join." } })
  const ntt2_1980 = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'The New Teen Titans', issueNumber: '2', year: 1980, coverImageUrl: null, summary: "The team establishes itself. Read back-to-back with #1." } })
  const tott44_1984 = await prisma.issue.create({ data: { publisherId: dc.id, seriesName: 'Tales of the Teen Titans', issueNumber: '44', year: 1984, coverImageUrl: null, summary: "The Judas Contract begins. Terra's betrayal." } })

  const ttPath = await prisma.readingPath.create({ data: { teamId: ttTeam.id, tier: 'essential' } })
  await prisma.readingPathNode.createMany({ data: [
    { readingPathId: ttPath.id, issueId: ntt1_1980.id,  whyItMatters: "Wolfman and Pérez launch the definitive Titans. Raven, Starfire, Cyborg join. DC's answer to the X-Men.", required: true, estTimeMinutes: 20, order: 1 },
    { readingPathId: ttPath.id, issueId: ntt2_1980.id,  whyItMatters: "The team establishes itself. Read back-to-back with #1.", required: true, estTimeMinutes: 20, order: 2 },
    { readingPathId: ttPath.id, issueId: tott44_1984.id,whyItMatters: "The Judas Contract begins. Terra's betrayal. The most devastating arc in Titans history.", required: true, estTimeMinutes: 25, order: 3 },
  ]})

  console.log('Seed complete — 8 Marvel + 4 new characters, 6 DC + 2 new characters, 3 Marvel events, 2 DC events, 4 teams.')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })
