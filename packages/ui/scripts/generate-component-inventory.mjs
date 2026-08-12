import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { generateComponentInventory, serializeComponentInventory } from './component-inventory.mjs'

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outputPath = join(packageRoot, 'catalog/component-inventory.json')
const existingInventory = existsSync(outputPath) ? JSON.parse(readFileSync(outputPath, 'utf8')) : { components: [] }

const inventory = generateComponentInventory({
  packageRoot,
  componentsIndexPath: join(packageRoot, 'src/components/index.ts'),
  portalDocsRoot: resolve(packageRoot, '../../apps/portal/src/content/docs/components'),
  codeConnectRoot: join(packageRoot, 'src/components'),
  existingInventory
})

mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(outputPath, await serializeComponentInventory(inventory, outputPath))

console.log(`Wrote ${inventory.components.length} public exports to ${outputPath}`)
