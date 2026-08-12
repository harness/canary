import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { validateContractCatalog } from './component-contract.mjs'

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const result = validateContractCatalog({ packageRoot })

if (!result.success) {
  for (const error of result.errors) {
    console.error(error)
  }
  process.exitCode = 1
} else {
  const summary = result.contracts.map(contract => `${contract.id} (${contract.status})`).join(', ')
  const noun = result.contracts.length === 1 ? 'contract' : 'contracts'
  console.log(`Validated ${result.contracts.length} component ${noun}: ${summary}`)
}
