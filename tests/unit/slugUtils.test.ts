import { describe, it, expect } from 'vitest'
import { toSlug } from '@/lib/slug'

describe('toSlug', () => {
  it('handles hyphenated names', () => {
    expect(toSlug('Spider-Man')).toBe('spider-man')
  })
  it('handles spaces', () => {
    expect(toSlug('Doctor Strange')).toBe('doctor-strange')
    expect(toSlug('The Flash')).toBe('the-flash')
  })
  it('handles apostrophes', () => {
    expect(toSlug("Green Lantern")).toBe('green-lantern')
  })
})
