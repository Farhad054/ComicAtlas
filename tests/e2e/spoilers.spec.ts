import { test, expect } from '@playwright/test'
import { GATED, eventPath } from './helpers'
import { prisma } from '../../lib/prisma'

const PLACEHOLDER = /hidden until you.ve read further/i

test.describe('spoiler toggle (browser)', () => {
  test('defaults to protected, flips, and persists across navigation and reload', async ({ page }) => {
    await page.goto('/marvel/wolverine')
    await expect(page.getByRole('button', { name: /spoilers hidden/i })).toBeVisible()
    await expect(page.getByText(GATED.wolverineDeath)).toHaveCount(0)
    await expect(page.getByText(PLACEHOLDER).first()).toBeVisible()

    await page.getByRole('button', { name: /spoilers hidden/i }).click()
    await expect(page.getByRole('button', { name: /spoilers visible/i })).toBeVisible()
    await expect(page.getByText(GATED.wolverineDeath)).toBeVisible()

    // survives client navigation and a full reload
    await page.goto(await eventPath('Civil War'))
    await expect(page.getByText(GATED.civilWarSeven)).toBeVisible()
    await page.reload()
    await expect(page.getByRole('button', { name: /spoilers visible/i })).toBeVisible()
    await expect(page.getByText(GATED.civilWarSeven)).toBeVisible()

    // flip back: gated text disappears again
    await page.getByRole('button', { name: /spoilers visible/i }).click()
    await expect(page.getByRole('button', { name: /spoilers hidden/i })).toBeVisible()
    await expect(page.getByText(GATED.civilWarSeven)).toHaveCount(0)
    await page.goto('/marvel/wolverine')
    await expect(page.getByText(GATED.wolverineDeath)).toHaveCount(0)
  })
})

test.describe('raw server HTML', () => {
  const pages: [string, () => Promise<string>, string][] = [
    ['wolverine hub', async () => '/marvel/wolverine', GATED.wolverineDeath],
    ['captain america hub', async () => '/marvel/captain-america', GATED.capAssassination],
    ['spider-man hub', async () => '/marvel/spider-man', GATED.gwenStacy],
    ['civil war event (reading order)', () => eventPath('Civil War'), GATED.civilWarSeven],
    ['civil war event (impact map)', () => eventPath('Civil War'), GATED.capImpact],
    ['house of m event (outcome)', () => eventPath('House of M'), GATED.houseOfMOutcome],
    ['captain america reading path', async () => '/marvel/captain-america/read?tier=essential', GATED.capPathNote],
    ['teen titans team page', async () => '/teams/teen-titans', GATED.terraFate],
  ]

  for (const [label, getPath, secret] of pages) {
    test(`${label}: gated text absent with protection on, present with it off`, async ({ request }) => {
      const path = await getPath()

      const noCookie = await (await request.get(path)).text()
      expect(noCookie, 'default visitor must be protected').not.toContain(secret)

      const on = await (await request.get(path, { headers: { Cookie: 'ca_spoilers=1' } })).text()
      expect(on).not.toContain(secret)
      expect(on).toMatch(PLACEHOLDER)

      const off = await (await request.get(path, { headers: { Cookie: 'ca_spoilers=0' } })).text()
      expect(off, 'control: visible when protection is off').toContain(secret)
    })
  }

  test('reading path and team pages are server-rendered', async ({ request }) => {
    for (const path of ['/marvel/spider-man/read', '/teams/x-men']) {
      const html = await (await request.get(path)).text()
      expect(html).not.toMatch(/Loading (reading path|team)/i)
    }
  })
})

test.describe('signed-in progress unlocks content', () => {
  const email = `e2e+${Date.now()}@example.test`
  const password = 'correct-horse-battery'

  test.afterAll(async () => {
    const user = await prisma.user.findUnique({ where: { email } })
    if (user) {
      await prisma.readingProgress.deleteMany({ where: { userId: user.id } })
      await prisma.user.delete({ where: { id: user.id } })
    }
  })

  test('marking the issue read reveals it; unmarking hides it again; preference is stored on the account', async ({ page, request }) => {
    const res = await request.post('/api/auth/register', { data: { email, password } })
    expect(res.ok()).toBeTruthy()

    await page.goto('/login')
    await page.locator('input[type=email]').fill(email)
    await page.locator('input[type=password]').fill(password)
    await page.getByRole('button', { name: 'Sign In' }).click()
    await page.waitForURL('/')

    const created = await prisma.user.findUniqueOrThrow({ where: { email } })
    expect(created.spoilerModeOn).toBe(true)

    await page.goto('/marvel/captain-america')
    await expect(page.getByText(GATED.capAssassination)).toHaveCount(0)

    await page.goto('/marvel/captain-america/read?tier=essential')
    await expect(page.getByText(GATED.capPathNote)).toHaveCount(0)
    const node = page.locator('div.rounded-xl', { hasText: 'Captain America #25' }).last()
    await node.getByRole('button', { name: 'Mark as read' }).click()
    await expect(page.getByText(GATED.capPathNote)).toBeVisible()

    await page.goto('/marvel/captain-america')
    await expect(page.getByText(GATED.capAssassination)).toBeVisible()

    await page.goto('/marvel/captain-america/read?tier=essential')
    await page.locator('div.rounded-xl', { hasText: 'Captain America #25' }).last()
      .getByRole('button', { name: '✓ Read' }).click()
    await expect(page.getByText(GATED.capPathNote)).toHaveCount(0)
    await page.goto('/marvel/captain-america')
    await expect(page.getByText(GATED.capAssassination)).toHaveCount(0)

    // preference stored on the user record
    await page.getByRole('button', { name: /spoilers hidden/i }).click()
    await expect(page.getByRole('button', { name: /spoilers visible/i })).toBeVisible()
    await expect.poll(async () => (await prisma.user.findUniqueOrThrow({ where: { email } })).spoilerModeOn).toBe(false)
  })
})
