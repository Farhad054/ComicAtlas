/**
 * Spoiler gating. Pure functions only — no I/O — so the rules can be unit
 * tested. Callers load a SpoilerContext (see lib/spoilerContext.ts) and pass
 * every gated field through gate()/gateText() on the server, before render.
 */

export const SPOILER_COOKIE = 'ca_spoilers'
export const HIDDEN_PLACEHOLDER = "Hidden until you've read further"

export interface SpoilerContext {
  /** True when the viewer asked to be protected from spoilers. */
  protect: boolean
  /** Issue ids the viewer has marked as read. Empty for signed-out viewers. */
  readIssueIds: ReadonlySet<string>
}

export interface SpoilerGate {
  isSpoiler: boolean
  spoilerAfterIssueId: string | null
}

export type Gated<T> = { hidden: false; value: T } | { hidden: true }

export function isHidden(ctx: SpoilerContext, gate: SpoilerGate): boolean {
  if (!ctx.protect) return false
  if (!gate.isSpoiler) return false
  if (gate.spoilerAfterIssueId && ctx.readIssueIds.has(gate.spoilerAfterIssueId)) return false
  return true
}

/** Returns the value only if the viewer may see it; otherwise a value-free marker. */
export function gate<T>(ctx: SpoilerContext, g: SpoilerGate, value: T): Gated<T> {
  return isHidden(ctx, g) ? { hidden: true } : { hidden: false, value }
}

export const SAFE_DEFAULT_CONTEXT: SpoilerContext = { protect: true, readIssueIds: new Set() }
