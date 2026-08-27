import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { parseCatalogEntry, parseCatalogManifest } from '../src/schema/schema'
import { validateCanaryPack } from '../src/schema/validate'
import { badge, button, manifest } from './helpers/pilotCatalog'

const canaryDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../catalogs/canary')

describe('parseCatalogEntry', () => {
  it('parses canary button', () => {
    const entry = parseCatalogEntry(button)
    expect(entry.id).toBe('canary.button')
    expect(entry.status).toBe('stable')
    expect(entry.source?.contractPath).toBe('packages/ui/catalog/contracts/button.contract.json')
    expect(entry.source?.contractVersion).toBe('0.9.0')
    expect(entry.source?.sha256).toMatch(/^[a-f0-9]{64}$/)
    expect(entry.shared.find(p => p.name === 'variant')?.values).toContain('primary')
    expect(entry.shared.find(p => p.name === 'size')?.values).toEqual(['md', 'sm', 'xs'])
    expect(entry.constraints?.combinations.find(rule => rule.id === 'icon-semantic-theme-md-sm-xs')?.status).toBe(
      'supported'
    )
  })

  it('parses the Badge engine fixture', () => {
    const entry = parseCatalogEntry(badge)
    expect(entry.id).toBe('canary.badge')
    expect(entry.code.export).toBe('StatusBadge')
  })

  it('rejects missing shared', () => {
    expect(() => parseCatalogEntry({ id: 'x', status: 'draft' })).toThrow()
  })
})

describe('parseCatalogManifest', () => {
  it('parses canary manifest', () => {
    const m = parseCatalogManifest(manifest)
    expect(m.system.id).toBe('canary')
    expect(m.components.map(c => c.id)).toContain('canary.button')
  })
})

describe('validateCanaryPack', () => {
  it('validates bundled canary pack', () => {
    const result = validateCanaryPack(canaryDir)
    expect(result.ok).toBe(true)
    expect(result.errors).toEqual([])
  })
})
