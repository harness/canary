import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { generateContractArtifacts } from './component-contract-artifacts.mjs'
import { validateContractCatalog } from './component-contract.mjs'

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const result = validateContractCatalog({ packageRoot })
const artifacts = result.success ? generateContractArtifacts({ packageRoot, write: false }) : { stalePaths: [] }

if (!result.success || artifacts.stalePaths.length > 0) {
  for (const error of result.errors) {
    console.error(error)
  }
  for (const path of artifacts.stalePaths) {
    console.error(`Stale generated contract artifact: ${path}`)
  }
  process.exitCode = 1
} else {
  const summary = result.contracts.map(contract => `${contract.id} (${contract.status})`).join(', ')
  const noun = result.contracts.length === 1 ? 'contract' : 'contracts'
  console.log(`Validated ${result.contracts.length} component ${noun}: ${summary}`)
}
