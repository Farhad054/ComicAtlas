import { prisma } from '../../lib/prisma'

/** Strings that must never reach the HTML while spoiler protection is on. */
export const GATED = {
  wolverineDeath: 'killed by his own gift',
  civilWarSeven: 'Steve Rogers lays down his shield',
  capAssassination: 'shot and killed on the courthouse steps',
  capImpact: 'assassinated on the courthouse steps',
  capPathNote: 'why Steve Rogers lays down his shield',
  terraFate: 'Died in the Judas Contract arc',
  houseOfMOutcome: 'No more mutants',
  gwenStacy: 'throws Gwen from a bridge',
} as const

export async function eventPath(name: string): Promise<string> {
  const event = await prisma.event.findFirstOrThrow({ where: { name } })
  return `/events/${event.id}`
}
