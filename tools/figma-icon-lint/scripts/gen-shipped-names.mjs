#!/usr/bin/env node
/**
 * Writes src/shipped-names.json: the asset keys that already ship in canary, read from the three
 * generated name maps. Re-run on every build; it is a second safety net, never the primary check.
 */
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const maps = {
  icon: 'packages/ui/src/components/icon-v2/icon-name-map.ts',
  logo: 'packages/ui/src/components/logo-v2/logo-name-map.ts',
  symbol: 'packages/ui/src/components/logo-v2/symbol-name-map.ts'
}
const out = {}
for (const [kind, rel] of Object.entries(maps)) {
  const src = readFileSync(path.join(root, rel), 'utf8')
  // import Foo from './icons/foo-bar.svg'  ->  foo-bar
  out[kind] = [...src.matchAll(/from '\.\/[a-z-]+\/([^']+)\.svg'/g)].map(m => m[1]).sort()
}
writeFileSync(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/shipped-names.json'),
  JSON.stringify(out)
)
console.log(`shipped names: ${out.icon.length} icons, ${out.logo.length} logos, ${out.symbol.length} symbols`)
