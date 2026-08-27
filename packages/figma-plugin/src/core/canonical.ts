import type { CatalogEntry, CatalogProp } from '../schema/schema.js'
import { normalizeFigmaValue, normalizePropName } from './normalize.js'
import type { InstanceSnapshot } from './types.js'

export type CanonicalValue = string | boolean | number | null
export type CanonicalValueSource = 'property' | 'componentName' | 'fallback'

export type CanonicalSnapshot = {
  values: Record<string, CanonicalValue>
  sources: Record<string, CanonicalValueSource>
}

const propertyCandidateCache = new WeakMap<CatalogEntry, Map<string, string[]>>()

function propertyCandidates(entry: CatalogEntry): Map<string, string[]> {
  const cached = propertyCandidateCache.get(entry)
  if (cached) return cached

  const candidates = new Map<string, string[]>()
  for (const property of entry.shared) {
    const binding = property.figmaBinding
    candidates.set(
      property.name,
      [
        property.name,
        binding?.kind === 'property' ? binding.property : undefined,
        ...(binding?.kind === 'property' ? (binding.aliases ?? []) : []),
        property.figmaProperty,
        ...(property.figmaPropertyAliases ?? [])
      ]
        .filter((candidate): candidate is string => Boolean(candidate))
        .map(normalizePropName)
    )
  }
  propertyCandidateCache.set(entry, candidates)
  return candidates
}

function findPropertyValue(
  normalizedProperties: Map<string, string | boolean | number>,
  candidates: string[]
): string | boolean | number | undefined {
  for (const candidate of candidates) {
    const rawValue = normalizedProperties.get(candidate)
    if (rawValue !== undefined) return rawValue
  }
  return undefined
}

function componentNameValue(snapshot: InstanceSnapshot, property: CatalogProp): CanonicalValue | undefined {
  const binding = property.figmaBinding
  if (binding?.kind !== 'componentName') return undefined

  const source = snapshot[binding.source]
  if (source) {
    const normalizedSource = source.toLowerCase()
    const match = binding.matches.find(({ contains }) => normalizedSource.includes(contains.toLowerCase()))
    if (match) return match.value
  }
  return undefined
}

export function canonicalizeSnapshot(snapshot: InstanceSnapshot, entry: CatalogEntry): CanonicalSnapshot {
  const values: Record<string, CanonicalValue> = {}
  const sources: Record<string, CanonicalValueSource> = {}
  const candidatesByProperty = propertyCandidates(entry)
  const normalizedProperties = new Map(
    Object.entries(snapshot.properties).map(([name, value]) => [normalizePropName(name), value])
  )

  for (const property of entry.shared) {
    const binding = property.figmaBinding
    if (!binding) continue

    if (binding.kind === 'componentName') {
      const fromName = componentNameValue(snapshot, property)
      if (fromName !== undefined) {
        values[property.name] = fromName
        sources[property.name] = 'componentName'
        continue
      }
    }

    const rawValue = findPropertyValue(normalizedProperties, candidatesByProperty.get(property.name) ?? [])
    if (rawValue !== undefined) {
      values[property.name] = normalizeFigmaValue(rawValue, property)
      sources[property.name] = 'property'
      continue
    }

    if (binding.kind === 'componentName' && binding.fallback !== undefined) {
      values[property.name] = binding.fallback
      sources[property.name] = 'fallback'
      continue
    }

    if (property.default !== undefined) {
      values[property.name] = property.default
      sources[property.name] = 'fallback'
    }
  }

  return { values, sources }
}
