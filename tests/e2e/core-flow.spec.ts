import { test, expect } from '@playwright/test'

test('publisher landing loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('MARVEL')).toBeVisible()
  await expect(page.getByText('DC')).toBeVisible()
})

test('marvel character grid loads', async ({ page }) => {
  await page.goto('/marvel')
  await expect(page.getByText('Spider-Man')).toBeVisible()
})

test('spider-man hub: key sections present', async ({ page }) => {
  await page.goto('/marvel/spider-man')
  await expect(page.getByText('Peter Parker')).toBeVisible()
  await expect(page.getByText('Key Life Events')).toBeVisible()
  await expect(page.getByText(/came from a film/i)).toBeVisible()
})

test('reading path loads with tiers', async ({ page }) => {
  await page.goto('/marvel/spider-man/read')
  await expect(page.getByText('Beginner')).toBeVisible()
  await expect(page.getByText('Essential')).toBeVisible()
})

test('batman hub loads', async ({ page }) => {
  await page.goto('/dc/batman')
  await expect(page.getByText('Bruce Wayne')).toBeVisible()
  await expect(page.getByText(/came from a film/i)).toBeVisible()
})

test('events page loads', async ({ page }) => {
  await page.goto('/events')
  await expect(page.getByText('Civil War')).toBeVisible()
})

test('teams page loads', async ({ page }) => {
  await page.goto('/teams')
  await expect(page.getByText('X-Men')).toBeVisible()
  await expect(page.getByText('Justice League')).toBeVisible()
})

test('x-men team hub loads', async ({ page }) => {
  await page.goto('/teams/x-men')
  await expect(page.getByText(/mutants born with/i)).toBeVisible()
})

test('search returns character results', async ({ page }) => {
  await page.goto('/search?q=batman')
  await expect(page.getByText('Batman')).toBeVisible()
})

test('search returns alias match', async ({ page }) => {
  await page.goto('/search?q=Logan')
  await expect(page.getByText('Wolverine')).toBeVisible()
})
