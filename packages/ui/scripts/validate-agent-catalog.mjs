import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { z } from 'zod'

import { compileAgentCatalog } from './compile-agent-catalog.mjs'

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')

const envelopeSchema = z
  .object({
    formatVersion: z.literal(1),
    sourceInventoryCount: z.number().int().nonnegative(),
    sourceSha256: z.string().regex(/^[a-f0-9]{64}$/),
    records: z.array(z.record(z.string(), z.unknown()))
  })
  .strict()

const confidenceSchema = z.enum(['stable', 'fallback', 'unreviewed'])

const componentRecordSchema = z
  .object({
    id: z.string(),
    exportName: z.string(),
    import: z.string(),
    package: z.literal('@harnessio/ui'),
    family: z.string(),
    aliases: z.array(z.string()),
    summary: z.string(),
    confidence: confidenceSchema,
    useWhen: z.array(z.string()),
    avoidWhen: z.array(z.string()),
    related: z.array(z.string()),
    props: z.array(z.unknown()),
    do: z.array(z.string()),
    dont: z.array(z.string()),
    examples: z.array(z.unknown()),
    sourcePath: z.string()
  })
  .passthrough()

try {
  const result = compileAgentCatalog({ packageRoot, write: false })
  const envelopes = Object.entries(result.files).map(([relativePath, contents]) => {
    const parsed = JSON.parse(contents)
    const envelope = envelopeSchema.parse(parsed)
    if ('generatedAt' in parsed) {
      throw new Error(`${relativePath} includes generatedAt`)
    }
    return { relativePath, envelope }
  })

  const componentsEnvelope = envelopes.find(item => item.relativePath.endsWith('components.json'))
  if (!componentsEnvelope) throw new Error('Missing compiled components.json')

  for (const record of componentsEnvelope.envelope.records) {
    const component = componentRecordSchema.parse(record)
    if (component.confidence === 'stable' && !record.contractVersion) {
      throw new Error(`${component.id} is stable without a contractVersion`)
    }
    if (component.confidence === 'unreviewed' && (component.do.length > 0 || component.dont.length > 0)) {
      throw new Error(`${component.id} is unreviewed but has invented do/don't`)
    }
  }

  console.log(
    `Validated agent catalog: ${result.catalog.components.length} components, ${result.catalog.icons.length} icons`
  )
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
