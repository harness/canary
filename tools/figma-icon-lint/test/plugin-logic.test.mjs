// Unit tests for the pure plugin-sandbox logic (paint picking, dump shape, staleness, legacy flag).
import assert from 'assert'

import { lintPage } from '../../../.claude/skills/publish-ds-icon-logo/scripts/lint-rules.mjs'
import { dump, firstFill, firstStroke, isLegacy, missingShipped } from '../src/plugin-logic.mjs'

const MIXED = Symbol('mixed')
const solid = (r, g, b, extra = {}) => ({ type: 'SOLID', color: { r, g, b }, ...extra })
const gradient = { type: 'GRADIENT_LINEAR' }

// ── paint picking (regression: a gradient behind a solid must not be hidden) ──
assert.deepStrictEqual(firstFill({ fills: [solid(1, 1, 1)] }, MIXED), { fillHex: '#FFFFFF', fillType: 'SOLID', fillBound: false })
assert.strictEqual(firstFill({ fills: [solid(1, 1, 1), gradient] }, MIXED).fillType, 'GRADIENT_LINEAR', 'solid then gradient')
assert.strictEqual(firstFill({ fills: [gradient, solid(1, 1, 1)] }, MIXED).fillType, 'GRADIENT_LINEAR', 'gradient then solid')
assert.strictEqual(firstFill({ fills: [solid(1, 1, 1), { type: 'IMAGE' }] }, MIXED).fillType, 'IMAGE', 'solid then image')
assert.strictEqual(firstStroke({ strokes: [solid(0, 0, 0), gradient] }, MIXED).strokeType, 'GRADIENT_LINEAR', 'stroke gradient behind solid')
assert.strictEqual(firstFill({ fills: [solid(1, 1, 1, { boundVariables: { color: {} } })] }, MIXED).fillBound, true)
assert.deepStrictEqual(firstFill({ fills: [] }, MIXED), { fillHex: null, fillBound: null, fillType: null })
// mixed fills fall back to the first vector-network region that has fills
assert.strictEqual(
  firstFill({ fills: MIXED, vectorNetwork: { regions: [{ fills: [] }, { fills: [solid(0, 0, 0)] }] } }, MIXED).fillHex,
  '#000000'
)
// mixed stroke caps/joins are reported as the string MIXED
const st = firstStroke({ strokes: [solid(0, 0, 0)], strokeCap: MIXED, strokeJoin: 'ROUND' }, MIXED)
assert.strictEqual(st.strokeCap, 'MIXED')
assert.strictEqual(st.strokeJoin, 'ROUND')

// ── end to end: the dump of a solid+gradient layer makes the shared rules error ──
const comp = fills => ({
  id: '1:1', name: '.brand', type: 'COMPONENT', width: 22.2, height: 22, description: '#123456',
  children: [{ name: 'V', type: 'VECTOR', fills, strokes: [] }]
})
const d = dump(comp([solid(1, 1, 1), gradient]), MIXED)
assert.strictEqual(d.width, 22)
assert.strictEqual(lintPage({ page: 'brands-to-dev', type: 'logo', components: [d] }).errorCount, 1, 'gradient behind solid is an error')
assert.strictEqual(lintPage({ page: 'brands-to-dev', type: 'logo', components: [dump(comp([solid(1, 1, 1)]), MIXED)] }).errorCount, 0)

// ── staleness heuristic ──
const shipped = new Set(['a', 'b', 'c'])
const onPage = names => names.map(name => ({ name }))
assert.deepStrictEqual(missingShipped(onPage(['.a', '.b', '.c']), shipped, 'page'), [], 'nothing missing')
assert.deepStrictEqual(missingShipped(onPage(['.a', '.extra']), shipped, 'page'), ['b', 'c'], 'missing, sorted; extras ignored')
assert.deepStrictEqual(missingShipped(onPage(['a']), shipped, 'page'), ['b', 'c'], 'leading dot optional')
assert.deepStrictEqual(missingShipped(onPage([]), shipped, 'selection'), [], 'never on selection runs')

// ── legacy flag ──
assert.strictEqual(isLegacy({ name: '.a', errors: [] }, shipped, 'page'), true, 'shipped, no errors')
assert.strictEqual(isLegacy({ name: '.a', errors: ['x'] }, shipped, 'page'), false, 'errors always show')
assert.strictEqual(isLegacy({ name: '.new', errors: [] }, shipped, 'page'), false, 'not shipped')
assert.strictEqual(isLegacy({ name: '.a', errors: [] }, shipped, 'selection'), false, 'selection runs never hide')

console.log('✅ plugin-logic tests passed')

// ── open stroke on a closed shape + dashed stroke ──
{
  const vec = (segments, loops, extra = {}) => ({
    id: '1', type: 'VECTOR', name: 'v', fills: [solid(0, 0, 0)], strokes: [solid(0, 0, 0)],
    vectorNetwork: { segments: segments.map(([start, end]) => ({ start, end })), regions: [{ loops }] }, ...extra
  })
  const lintKid = ch => lintPage(
    { page: 'icons-to-dev', type: 'icon', components: [{ ...dump({ id: 'c', name: '.x', type: 'COMPONENT', width: 16, height: 16, children: [ch] }, MIXED) }] }
  ).results[0]
  const tri = [[0, 1], [1, 2], [2, 0]]

  // closed triangle, fill region skips segment 2 -> error
  let r = lintKid(vec(tri, [[0, 1]]))
  assert.ok(r.errors.some(e => e.includes('open stroke')), 'closed + skipped edge errors')
  // the verified fix: region covers every segment -> clean
  r = lintKid(vec(tri, [[0, 1, 2]]))
  assert.ok(!r.errors.some(e => e.includes('open stroke')), 'full region passes')
  // open geometry (vertex of degree 1) with fill + stroke is deliberate -> no error
  r = lintKid(vec([[0, 1], [1, 2]], [[0]]))
  assert.ok(!r.errors.some(e => e.includes('open stroke')), 'open geometry not flagged')
  // closed triangle + a dangling open edge (the .ai-verify shape) -> no error
  r = lintKid(vec([...tri, [2, 3]], [[0, 1, 2]]))
  assert.ok(!r.errors.some(e => e.includes('open stroke')), 'closed + open subpath not flagged')
  // no stroke -> no error
  r = lintKid(vec(tri, [[0, 1]], { strokes: [] }))
  assert.ok(!r.errors.some(e => e.includes('open stroke')), 'fill only not flagged')
  // hidden stroke -> no error
  r = lintKid(vec(tri, [[0, 1]], { strokes: [solid(0, 0, 0, { visible: false })] }))
  assert.ok(!r.errors.some(e => e.includes('open stroke')), 'hidden stroke not flagged')

  // dashes warn; solid strokes do not
  r = lintKid(vec(tri, [[0, 1, 2]], { dashPattern: [2, 2] }))
  assert.ok(r.warnings.some(w => w.includes('stroke-dasharray')), 'dash warns')
  r = lintKid(vec(tri, [[0, 1, 2]], { dashPattern: [] }))
  assert.ok(!r.warnings.some(w => w.includes('stroke-dasharray')), 'empty dash silent')
}
console.log('open-stroke and dash checks ok')
