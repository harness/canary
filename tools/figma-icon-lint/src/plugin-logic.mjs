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

// Paints that actually render: Figma keeps hidden (visible:false) and 0-opacity paints in the array.
const shows = p => p.visible !== false && (p.opacity === undefined || p.opacity > 0)

// Geometry for the open-stroke rule: segment endpoints and each fill region's loops (segment indexes).
// Only VECTORs carry a vectorNetwork. Kept compact so a whole-page dump stays small.
export function vectorGeometry(ch, mixed) {
  if (ch.type !== 'VECTOR') return {}
  const out = {}
  const fills = ch.fills === mixed ? null : ch.fills
  const strokes = ch.strokes
  out.fillVisible = Array.isArray(fills) ? fills.some(shows) : ch.fills === mixed
  out.strokeVisible = Array.isArray(strokes) && strokes.some(shows)
  try {
    const n = ch.vectorNetwork
    if (n && Array.isArray(n.segments)) {
      out.segments = n.segments.map(s => [s.start, s.end])
      out.regions = (n.regions || []).map(r => (r.loops || []).map(l => [...l]))
    }
  } catch (e) {
    // vectorNetwork unreadable: the rule skips this node rather than guessing
  }
  return out
}

const dashOf = (ch, mixed) => {
  const d = ch.dashPattern
  return Array.isArray(d) && d.length && d !== mixed ? [...d] : null
}

export const dump = (c, mixed) => ({
  id: c.id,
  name: c.name,
  type: c.type,
  width: Math.round(c.width),
  height: Math.round(c.height),
  description: c.description || '',
  children: (c.children || []).map(ch => ({
    name: ch.name, type: ch.type, isMask: ch.isMask === true, ...firstFill(ch, mixed), ...firstStroke(ch, mixed),
    dashPattern: dashOf(ch, mixed), ...vectorGeometry(ch, mixed)
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
