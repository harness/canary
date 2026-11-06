import { yamlDefaults } from 'monaco-yaml'
import { beforeEach, describe, expect, it } from 'vitest'

import { addUpdateSchema, removeSchema, schemaIdToUri, schemaIdToUrl } from '../schema-utils'

interface SchemaEntry {
  fileMatch: string[]
  schema: unknown
  uri: string
}

// The runtime monaco-yaml is aliased to a mock whose schemas array is mutable; type it as such.
const store = yamlDefaults as unknown as { diagnosticsOptions: { schemas: SchemaEntry[] } }

const makeConfig = (id: string, schema: unknown = { type: 'object' }): SchemaEntry => ({
  fileMatch: [schemaIdToUrl(id)],
  schema,
  uri: `uri-${id}`
})

beforeEach(() => {
  // Reset the shared diagnostics store between tests.
  store.diagnosticsOptions.schemas = []
})

describe('schemaIdToUrl / schemaIdToUri', () => {
  it('builds a file:// URL and matching Uri from an id', () => {
    expect(schemaIdToUrl('abc')).toBe('file://abc')
    expect(schemaIdToUri('abc').toString()).toBe('file://abc')
  })
})

describe('addUpdateSchema', () => {
  it('appends a new schema', () => {
    const config = makeConfig('one')
    addUpdateSchema(config)

    expect(store.diagnosticsOptions.schemas).toEqual([config])
  })

  it('replaces an existing schema that shares the first fileMatch instead of duplicating it', () => {
    addUpdateSchema(makeConfig('one', { type: 'object' }))
    addUpdateSchema(makeConfig('two'))
    const updated = makeConfig('one', { type: 'string' })
    addUpdateSchema(updated)

    const schemas = store.diagnosticsOptions.schemas
    expect(schemas).toHaveLength(2)
    expect(schemas.find(s => s.fileMatch[0] === schemaIdToUrl('one'))?.schema).toEqual({ type: 'string' })
  })
})

describe('removeSchema', () => {
  it('removes the schema whose fileMatch maps to the given id and keeps the rest', () => {
    addUpdateSchema(makeConfig('one'))
    addUpdateSchema(makeConfig('two'))

    removeSchema('one')

    const schemas = store.diagnosticsOptions.schemas
    expect(schemas).toHaveLength(1)
    expect(schemas[0].fileMatch[0]).toBe(schemaIdToUrl('two'))
  })

  it('is a no-op when the id does not match any schema', () => {
    addUpdateSchema(makeConfig('one'))

    removeSchema('missing')

    expect(store.diagnosticsOptions.schemas).toHaveLength(1)
  })
})
