// Pure logic for the plugin sandbox: no `figma` global, so it can be unit-tested under node.
// `mixed` is figma.mixed, passed in by code.js.

export const hex = c =>
  c ? '#' + [c.r, c.g, c.b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('').toUpperCase() : null

const safe = (v, mixed) => (typeof v === 'symbol' || v === mixed ? 'MIXED' : v)

// Prefer a non-SOLID paint so a gradient/image hiding behind a solid is still reported.
const pickPaint = paints => paints.find(x => x.type !== 'SOLID') || paints[0]

export function firstFill(ch, mixed) {
  let f = ch.fills
  if (f === mixed && ch.vectorNetwork && ch.vectorNetwork.regions) {
    const r = ch.vectorNetwork.regions.find(r => (r.fills || []).length)
    f = r ? r.fills : null
  }
  if (!Array.isArray(f) || !f.length) return { fillHex: null, fillBound: null, fillType: null }
  const p = pickPaint(f)
  return { fillHex: hex(p.color), fillType: p.type, fillBound: !!(p.boundVariables && p.boundVariables.color) }
}

export function firstStroke(ch, mixed) {
  const s = ch.strokes
  const caps = { strokeCap: safe(ch.strokeCap, mixed), strokeJoin: safe(ch.strokeJoin, mixed) }
  if (!Array.isArray(s) || !s.length) return { strokeHex: null, strokeType: null, ...caps }
  const p = pickPaint(s)
  return { strokeHex: hex(p.color), strokeType: p.type, ...caps }
}

export const dump = (c, mixed) => ({
  id: c.id,
  name: c.name,
  type: c.type,
  width: Math.round(c.width),
  height: Math.round(c.height),
  description: c.description || '',
  children: (c.children || []).map(ch => ({
    name: ch.name, type: ch.type, isMask: ch.isMask === true, ...firstFill(ch, mixed), ...firstStroke(ch, mixed)
  }))
})

// Staleness heuristic (whole page only): shipped names missing from the page.
export function missingShipped(dumped, shippedAll, mode) {
  const onPage = new Set(dumped.map(d => d.name.replace(/^\./, '')))
  return mode === 'page' ? [...shippedAll].filter(n => !onPage.has(n)).sort() : []
}

// Already shipped, no errors (whole-page only): its warnings are hidden by default in the panel.
export const isLegacy = (r, shippedAll, mode) =>
  mode === 'page' && !r.errors.length && shippedAll.has(r.name.replace(/^\./, ''))
