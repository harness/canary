import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { renderReference } from './lib/reference.ts'

const DIR = resolve(import.meta.dirname, '../../src/components/status-badge')
const MANIFEST_PATH = resolve(DIR, 'status-badge.manifest.json')
const GUIDE_PATH = resolve(DIR, 'status-badge.guide.md')
const GUIDE_SOURCE = readFileSync(GUIDE_PATH, 'utf8')

const render = (guideSource: string): string =>
  renderReference({
    manifest: JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')),
    manifestPath: MANIFEST_PATH,
    guideSource,
    guidePath: GUIDE_PATH,
    outputPath: resolve(import.meta.dirname, '../../agents/components/status-badge.md')
  })

describe('reference: guide intro', () => {
  it('renders the intro under About this guide, before Use when', () => {
    const out = render(GUIDE_SOURCE)
    const about = out.indexOf('## About this guide')
    expect(about).toBeGreaterThan(-1)
    expect(out.indexOf('Rules for choosing between StatusBadge and Tag')).toBeGreaterThan(about)
    expect(out.indexOf('## Use when')).toBeGreaterThan(about)
    expect(out).not.toContain('# Status Badge Guide')
  })

  it('drops HTML comments, which hold notes for authors', () => {
    const guide = GUIDE_SOURCE.replace('# Status Badge Guide\n', '# Status Badge Guide\n\n<!-- Author note. -->\n')
    expect(render(guide)).not.toContain('Author note.')
  })

  it('omits the section when the guide has no intro', () => {
    const guide = GUIDE_SOURCE.replace(/# Status Badge Guide\n[\s\S]*?(?=\n## )/, '# Status Badge Guide\n')
    expect(render(guide)).not.toContain('## About this guide')
  })
})

describe('reference: section bodies', () => {
  it('drops HTML comments from rule and Do sections', () => {
    const guide = GUIDE_SOURCE.replace(
      '## SBD-001 — StatusBadge represents state, Tag represents attribute\n',
      '## SBD-001 — StatusBadge represents state, Tag represents attribute\n\n<!-- Rule note. -->\n'
    ).replace("### Do's\n", "### Do's\n\n<!-- Do note. -->\n")
    const out = render(guide)
    expect(out).not.toContain('Rule note.')
    expect(out).not.toContain('Do note.')
    expect(out).toContain('`StatusBadge` is for something that _changes_')
  })
})
