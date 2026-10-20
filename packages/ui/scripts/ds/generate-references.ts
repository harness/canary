/**
 * Writes an agent reference per component and pattern contract, plus an index of both.
 *
 *   node scripts/ds/generate-references.ts          write agents/components/ and agents/patterns/
 *   node scripts/ds/generate-references.ts --check  exit 1 if any file is stale, missing or orphaned
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

import { findContracts, kebabOf, patternName } from './lib/contracts.ts'
import { renderIndex, renderPattern, renderReference, type IndexEntry } from './lib/reference.ts'

const PACKAGE_ROOT = resolve(import.meta.dirname, '../..')
export const OUTPUT_DIR = join(PACKAGE_ROOT, 'agents/components')
export const PATTERN_OUTPUT_DIR = join(PACKAGE_ROOT, 'agents/patterns')
const INDEX_PATH = join(OUTPUT_DIR, 'INDEX.md')

interface Contract {
  manifestPath: string
  manifest: {
    id?: string
    code?: { export: string }
    purpose: { summary: string }
    governance: { guide: string }
    components?: { export: string; manifest?: string | null }[]
  }
  guidePath: string
  guideSource: string
}

const load = (manifestPath: string): Contract => {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Contract['manifest']
  const guidePath = resolve(dirname(manifestPath), manifest.governance.guide)
  return { manifestPath, manifest, guidePath, guideSource: readFileSync(guidePath, 'utf8') }
}

const expectedFiles = (): Map<string, string> => {
  const files = new Map<string, string>()
  const components = findContracts(PACKAGE_ROOT, ['component']).map(load)
  const patterns = findContracts(PACKAGE_ROOT, ['pattern']).map(load)
  const componentRefs = new Map(
    components.map(c => [c.manifest.code?.export ?? '', join(OUTPUT_DIR, `${kebabOf(c.manifestPath)}.md`)])
  )
  const patternRefs = patterns.map(p => ({
    contract: p,
    name: patternName(p.manifest.id ?? ''),
    referencePath: join(PATTERN_OUTPUT_DIR, `${kebabOf(p.manifestPath)}.md`)
  }))

  const entries: IndexEntry[] = components.map(contract => {
    const component = contract.manifest.code?.export ?? ''
    const outputPath = componentRefs.get(component) ?? ''
    const usedIn = patternRefs
      .filter(p => (p.contract.manifest.components ?? []).some(c => c.export === component && c.manifest))
      .map(p => ({ name: p.name, referencePath: p.referencePath }))
    files.set(outputPath, renderReference({ ...contract, outputPath, usedIn }))
    return { component, summary: contract.manifest.purpose.summary, referencePath: outputPath }
  })

  const patternEntries: IndexEntry[] = patternRefs.map(({ contract, name, referencePath }) => {
    files.set(referencePath, renderPattern({ ...contract, outputPath: referencePath, name, componentRefs }))
    return { component: name, summary: contract.manifest.purpose.summary, referencePath }
  })

  files.set(INDEX_PATH, renderIndex(entries, INDEX_PATH, patternEntries))
  return files
}

const existingFiles = (): string[] =>
  [OUTPUT_DIR, PATTERN_OUTPUT_DIR].flatMap(dir =>
    existsSync(dir)
      ? readdirSync(dir)
          .filter(name => name.endsWith('.md'))
          .map(name => join(dir, name))
      : []
  )

const main = (): number => {
  const check = process.argv.includes('--check')
  const expected = expectedFiles()
  const orphans = existingFiles().filter(path => !expected.has(path))
  const show = (path: string): string => relative(PACKAGE_ROOT, path)

  if (check) {
    const stale = [...expected].filter(([path, content]) => !existsSync(path) || readFileSync(path, 'utf8') !== content)
    for (const [path] of stale) console.error(`stale   ${show(path)}`)
    for (const path of orphans) console.error(`orphan  ${show(path)}`)
    if (stale.length + orphans.length === 0) {
      console.log(`ok   ${expected.size} reference file(s) are current.`)
      return 0
    }
    console.error('\nAgent references are out of date. Run `pnpm ds:generate` in packages/ui and commit the result.')
    return 1
  }

  for (const path of expected.keys()) mkdirSync(dirname(path), { recursive: true })
  for (const [path, content] of expected) writeFileSync(path, content)
  for (const path of orphans) unlinkSync(path)
  console.log(
    `Wrote ${expected.size} file(s) to ${show(OUTPUT_DIR)} and ${show(PATTERN_OUTPUT_DIR)}${orphans.length ? `, removed ${orphans.length}` : ''}.`
  )
  return 0
}

process.exitCode = main()
