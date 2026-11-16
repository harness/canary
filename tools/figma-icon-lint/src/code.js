// Runs in Figma's plugin sandbox. Builds the same dump the figma_execute snippet builds, then
// hands it to the SHARED rules (lint-rules.mjs). No rule logic lives here.
import { lintPage } from '../../../.claude/skills/publish-ds-icon-logo/scripts/lint-rules.mjs'
import shipped from './shipped-names.json'
import { dump as dumpComponent, isLegacy, missingShipped } from './plugin-logic.mjs'

const PAGES = { 'icons-to-dev': 'icon', 'brands-to-dev': 'logo' }
const MAIN_FILE_KEY = 'NYeN8I4D3anR9it8ds0lyr'

figma.showUI(__html__, { width: 420, height: 520 })

const dump = c => dumpComponent(c, figma.mixed)

function pageOf(node) {
  while (node && node.type !== 'PAGE') node = node.parent
  return node
}

async function run(mode) {
  const sel = figma.currentPage.selection
  let page = figma.currentPage
  let components
  let only = null
  if (mode === 'selection') {
    if (!sel.length) return figma.ui.postMessage({ kind: 'notice', text: 'Select one or more components first.' })
    components = sel.flatMap(n => (n.type === 'COMPONENT' ? [n] : n.findAllWithCriteria ? n.findAllWithCriteria({ types: ['COMPONENT'] }) : []))
    page = pageOf(sel[0])
  } else {
    components = page.findAllWithCriteria({ types: ['COMPONENT'] })
  }
  const type = PAGES[page.name]
  if (!type) {
    return figma.ui.postMessage({ kind: 'notice', text: `Go to the "icons-to-dev" or "brands-to-dev" page (this is "${page.name}").` })
  }
  const dumped = components.map(dump)
  const shippedNames = mode === 'selection' ? new Set(shipped[type === 'icon' ? 'icon' : 'logo']) : undefined
  let res
  try {
    res = lintPage({ page: page.name, type, components: dumped }, { shippedNames })
  } catch (e) {
    return figma.ui.postMessage({ kind: 'notice', text: String(e.message || e) })
  }
  const shippedAll = new Set(shipped[type === 'icon' ? 'icon' : 'logo'])
  const idByName = new Map(dumped.map(d => [d.name, d.id]))
  // Staleness: the page is the permanent catalogue, so a shipped name missing from it means the
  // branch is behind main, or someone deleted/renamed a component.
  const missing = missingShipped(dumped, shippedAll, mode)
  figma.ui.postMessage({
    kind: 'result',
    page: page.name,
    scope: mode,
    onMain: figma.fileKey === MAIN_FILE_KEY,
    errorCount: res.errorCount,
    warnCount: res.warnCount,
    items: res.results
      .filter(r => r.errors.length || r.warnings.length)
      .map(r => ({
        id: idByName.get(r.name),
        name: r.name,
        errors: r.errors,
        warnings: r.warnings,
        // Already shipped (whole-page runs only): its warnings are old news, hidden by default in the panel.
        legacy: isLegacy(r, shippedAll, mode)
      })),
    collisions: res.collisions,
    missing,
    checked: res.components.length
  })
}

figma.ui.onmessage = async msg => {
  if (msg.kind === 'lint') await run(msg.mode)
  if (msg.kind === 'select') {
    const n = await figma.getNodeByIdAsync(msg.id)
    if (n && n.type !== 'DOCUMENT' && n.type !== 'PAGE') {
      await figma.setCurrentPageAsync(pageOf(n))
      figma.currentPage.selection = [n]
      figma.viewport.scrollAndZoomIntoView([n])
    }
  }
}
