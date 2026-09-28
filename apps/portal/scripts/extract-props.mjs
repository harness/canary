#!/usr/bin/env node
/**
 * Extracts a controls schema from a handful of @harnessio/ui component
 * source files, the same way Storybook derives argTypes, using
 * react-docgen-typescript against their actual TypeScript prop types +
 * JSDoc comments. Output feeds DocsPage.Playground.
 *
 * Usage: pnpm --filter portal schemas
 *
 * Pilot scope: add a component's source path to PILOT_COMPONENT_FILES once
 * you've verified its prop shape docgens cleanly (plain interfaces/cva
 * variants work well; complex discriminated unions may need a manual
 * schema override instead).
 */
import { withCustomConfig } from 'react-docgen-typescript'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '../../..')
const UI_SRC = path.join(REPO_ROOT, 'packages/ui/src')

const PILOT_COMPONENT_FILES = [
  path.join(UI_SRC, 'components/counter-badge.tsx'),
  path.join(UI_SRC, 'components/spacer.tsx')
]
const OUTPUT_DIR = path.resolve(__dirname, '../src/data/component-schemas')
const TSCONFIG_PATH = path.join(REPO_ROOT, 'packages/ui/tsconfig.json')

const parser = withCustomConfig(TSCONFIG_PATH, {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true
})

/** Map a react-docgen-typescript prop descriptor to a control type + options. */
function inferControlType(prop) {
  const typeName = prop.type.name

  if (typeName === 'enum') {
    return {
      type: 'select',
      options: prop.type.value.map(v => String(v.value).replace(/^"(.*)"$/, '$1'))
    }
  }
  if (typeName === 'boolean') return { type: 'boolean' }
  if (typeName === 'number') return { type: 'number' }
  if (/color$/i.test(prop.name)) return { type: 'color' }
  return { type: 'text' }
}

function parseDefault(prop) {
  const raw = prop.defaultValue?.value
  if (raw === undefined) return undefined
  try {
    return JSON.parse(raw)
  } catch {
    return raw
  }
}

function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  for (const file of PILOT_COMPONENT_FILES) {
    if (!fs.existsSync(file)) {
      console.warn(`skipped ${file}: not found`)
      continue
    }

    let docs
    try {
      docs = parser.parse(file)
    } catch (err) {
      console.warn(`skipped ${file}: ${err.message}`)
      continue
    }

    for (const doc of docs) {
      if (Object.keys(doc.props).length === 0) continue

      const props = Object.values(doc.props)
        // Drop framework-internal props not meaningful as a control.
        .filter(p => !['children', 'key', 'ref'].includes(p.name))
        .map(prop => {
          const control = inferControlType(prop)
          return {
            name: prop.name,
            description: prop.description || undefined,
            required: prop.required,
            defaultValue: parseDefault(prop),
            ...control
          }
        })

      const schema = { componentName: doc.displayName, props }
      const outPath = path.join(OUTPUT_DIR, `${doc.displayName}.json`)
      fs.writeFileSync(outPath, JSON.stringify(schema, null, 2))
      console.log(`wrote ${outPath}`)
    }
  }
}

main()
