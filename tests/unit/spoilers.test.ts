import { describe, it, expect } from 'vitest'
import { gate, isHidden, type SpoilerContext, type SpoilerGate } from '@/lib/spoilers'

const gated = (after: string | null): SpoilerGate => ({ isSpoiler: true, spoilerAfterIssueId: after })
const ctx = (protect: boolean, read: string[] = []): SpoilerContext => ({
  protect,
  readIssueIds: new Set(read),
})

describe('isHidden', () => {
  it('shows everything when protection is off', () => {
    expect(isHidden(ctx(false), gated('issue-1'))).toBe(false)
    expect(isHidden(ctx(false), gated(null))).toBe(false)
  })

  it('never hides content that is not flagged', () => {
    expect(isHidden(ctx(true), { isSpoiler: false, spoilerAfterIssueId: 'issue-1' })).toBe(false)
  })

  it('hides flagged content when protected and nothing is read (signed-out)', () => {
    expect(isHidden(ctx(true), gated('issue-1'))).toBe(true)
  })

  it('stays hidden while only unrelated issues are read', () => {
    expect(isHidden(ctx(true, ['other']), gated('issue-1'))).toBe(true)
  })

  it('reveals once the dependent issue is read', () => {
    expect(isHidden(ctx(true, ['issue-1']), gated('issue-1'))).toBe(false)
  })

  it('re-hides after the issue is unmarked', () => {
    const read = new Set(['issue-1'])
    const c: SpoilerContext = { protect: true, readIssueIds: read }
    expect(isHidden(c, gated('issue-1'))).toBe(false)
    read.delete('issue-1')
    expect(isHidden(c, gated('issue-1'))).toBe(true)
  })

  it('keeps flagged content with no unlocking issue hidden regardless of progress', () => {
    expect(isHidden(ctx(true, ['issue-1', 'issue-2']), gated(null))).toBe(true)
  })
})

describe('gate', () => {
  it('returns a marker that carries no text when hidden', () => {
    const result = gate(ctx(true), gated('issue-1'), 'Wolverine dies')
    expect(result).toEqual({ hidden: true })
    expect(JSON.stringify(result)).not.toContain('Wolverine')
  })

  it('returns the value when visible', () => {
    expect(gate(ctx(true, ['issue-1']), gated('issue-1'), 'Wolverine dies')).toEqual({
      hidden: false,
      value: 'Wolverine dies',
    })
  })
})
