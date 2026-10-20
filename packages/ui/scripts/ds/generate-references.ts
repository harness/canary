/**
 * Writes an agent reference per component contract, plus a component index.
 *
 *   node scripts/ds/generate-references.ts          write agents/components/
 *   node scripts/ds/generate-references.ts --check  exit 1 if any file is stale, missing or orphaned
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, relative, resolve } from 'node:path'

import { renderIndex, renderReference, type IndexEntry } from './lib/reference.ts'

const PACKAGE_ROOT = resolve(import.meta.dirname, '../..')
const COMPONENTS_DIR = join(PACKAGE_ROOT, 'src/components')
export const OUTPUT_DIR = join(PACKAGE_ROOT, 'agents/components')
const INDEX_PATH = join(OUTPUT_DIR, 'INDEX.md')

const findManifests = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return findManifests(path)
    return entry.name.endsWith('.manifest.json') ? [path] : []
  })

const expectedFiles = (): Map<string, string> => {
  const files = new Map<string, string>()
  const entries: IndexEntry[] = []

  for (const manifestPath of findManifests(COMPONENTS_DIR).sort()) {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
      code: { export: string }
      purpose: { summary: string }
      governance: { guide: string }
    }
    const guidePath = resolve(dirname(manifestPath), manifest.governance.guide)
    const outputPath = join(OUTPUT_DIR, `${basename(manifestPath, '.manifest.json')}.md`)
    files.set(
      outputPath,
      renderReference({ manifest, manifestPath, guideSource: readFileSync(guidePath, 'utf8'), guidePath, outputPath })
    )
    entries.push({ component: manifest.code.export, summary: manifest.purpose.summary, referencePath: outputPath })
  }

  files.set(INDEX_PATH, renderIndex(entries, INDEX_PATH))
  return files
}

const existingFiles = (): string[] =>
  existsSync(OUTPUT_DIR)
    ? readdirSync(OUTPUT_DIR)
        .filter(name => name.endsWith('.md'))
        .map(name => join(OUTPUT_DIR, name))
    : []

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

  mkdirSync(OUTPUT_DIR, { recursive: true })
  for (const [path, content] of expected) writeFileSync(path, content)
  for (const path of orphans) unlinkSync(path)
  console.log(
    `Wrote ${expected.size} file(s) to ${show(OUTPUT_DIR)}${orphans.length ? `, removed ${orphans.length}` : ''}.`
  )
  return 0
}

process.exitCode = main()
