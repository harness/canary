import type { CatalogEntry } from '../schema/schema.js'
import type { CanonicalSnapshot } from './canonical.js'
import { normalizePropName } from './normalize.js'
import type { Finding, InstanceSnapshot } from './types.js'

type AnatomyPart = {
  id?: unknown
  presence?: unknown
  name?: unknown
  bindings?: {
    figma?: {
      kind?: unknown
      property?: unknown
      aliases?: unknown
    }
    react?: { target?: unknown }
  }
}

type StateDefinition = {
  id?: unknown
  description?: unknown
  fidelity?: { figma?: unknown; react?: unknown }
  bindings?: { figma?: { reference?: unknown } }
}

function requirementId(entry: CatalogEntry, evaluator: string): string | undefined {
  const requirement = (entry.requirements ?? []).find(candidate => candidate.evaluator === evaluator)
  return typeof requirement?.id === 'string' ? requirement.id : undefined
}

function hasTextContent(snapshot: InstanceSnapshot): boolean {
  return [...Object.keys(snapshot.properties), ...(snapshot.childNames ?? [])].some(name => {
    const normalized = normalizePropName(name)
    return normalized === 'button text' || normalized === 'text'
  })
}

export function findAnatomyControl(entry: CatalogEntry, rawName: string): AnatomyPart | undefined {
  const normalizedName = normalizePropName(rawName)
  return (entry.anatomy ?? [])
    .map(part => part as AnatomyPart)
    .find(part => {
      const figma = part.bindings?.figma
      if (figma?.kind !== 'property') return false
      const aliases = Array.isArray(figma.aliases)
        ? figma.aliases.filter((alias): alias is string => typeof alias === 'string')
        : []
      const candidates = [typeof figma.property === 'string' ? figma.property : undefined, ...aliases].filter(
        (candidate): candidate is string => Boolean(candidate)
      )
      return candidates.some(candidate => normalizePropName(candidate) === normalizedName)
    })
}

export function evaluateAnatomy(
  snapshot: InstanceSnapshot,
  entry: CatalogEntry,
  canonical: CanonicalSnapshot
): Finding[] {
  const findings: Finding[] = []
  const requiredContent = (entry.anatomy ?? []).find(part => {
    const anatomyPart = part as AnatomyPart
    return anatomyPart.id === 'label-or-icon' && anatomyPart.presence === 'required'
  })

  const isKnownTextSet = snapshot.componentSetName?.toLowerCase().includes('/text') ?? false
  if (requiredContent && isKnownTextSet && canonical.values.iconOnly !== true && !hasTextContent(snapshot)) {
    findings.push({
      code: 'FAIL_REQUIRED_ANATOMY',
      severity: 'fail',
      nodeId: snapshot.nodeId,
      catalogId: entry.id,
      requirementId: requirementId(entry, 'anatomy'),
      propName: 'label-or-icon',
      message: 'Button requires a visible text label unless it is an icon-only Button.'
    })
  }

  for (const rawState of entry.states ?? []) {
    const state = rawState as StateDefinition
    if (state.fidelity?.figma !== 'specification' || state.fidelity?.react !== 'exact') continue

    const stateId = typeof state.id === 'string' ? state.id : 'state'
    const reference = state.bindings?.figma?.reference
    findings.push({
      code: 'INFO_INTENTIONAL_DIFFERENCE',
      severity: 'info',
      nodeId: snapshot.nodeId,
      catalogId: entry.id,
      requirementId: requirementId(entry, 'parity'),
      propName: stateId,
      message:
        typeof reference === 'string'
          ? `${stateId} is intentionally documented as a Figma specification and implemented exactly at runtime. Reference: ${reference}.`
          : `${stateId} is intentionally documented as a Figma specification and implemented exactly at runtime.`
    })
  }

  return findings
}
