import type { CatalogEntry, CatalogProp } from '../schema/schema.js'
import { evaluateAnatomy, findAnatomyControl } from './anatomy.js'
import { canonicalizeSnapshot } from './canonical.js'
import { evaluateConstraints } from './constraints.js'
import { componentDisplayName, matchComponent, type CatalogIndex } from './match.js'
import { normalizeFigmaValue, normalizePropName } from './normalize.js'
import { suggestClosestValue } from './suggest.js'
import type { Finding, InstanceSnapshot, ProposalDraft } from './types.js'

export type CheckOptions = {
  treatMissingLibraryFlagAs: 'warn' | 'ignore'
  /** When true, emit FAIL_UNMAPPED for unmatched instances (Canary may enable for ❖). */
  strictUnmapped?: boolean
  /** Only emit FAIL_UNMAPPED when mainComponentName starts with one of these. */
  unmappedNamePrefixes?: string[]
}

type IdentityMatch = 'componentKey' | 'componentSetKey' | 'name'

export type InstanceResult = {
  snapshot: InstanceSnapshot
  catalogId?: string
  /** `unmapped` means nothing was verified — it is never a pass. */
  status: 'checked' | 'unmapped'
  ok: boolean
  findings: Finding[]
}

export type CheckReport = {
  findings: Finding[]
  instances: InstanceResult[]
  summary: {
    pass: number
    fail: number
    warn: number
    info: number
    /** Instances with no catalog entry — counted apart from pass and fail. */
    unmapped: number
    instanceCount: number
    mappedCount: number
  }
}

const DEFAULT_OPTS: CheckOptions = {
  treatMissingLibraryFlagAs: 'ignore',
  strictUnmapped: false,
  unmappedNamePrefixes: ['❖']
}

function findProp(list: CatalogProp[], figmaName: string): CatalogProp | undefined {
  const norm = normalizePropName(figmaName)
  return list.find(p => {
    const candidates = [p.name, p.figmaProperty, ...(p.figmaPropertyAliases ?? [])]
      .filter(Boolean)
      .map(n => normalizePropName(String(n)))
    return candidates.includes(norm)
  })
}

function actualString(value: string | boolean | number): string {
  return String(value)
}

/** What the canvas node actually is, for the detached-copy message. */
function detachedKind(nodeType: string | undefined): string | null {
  if (nodeType === 'COMPONENT' || nodeType === 'COMPONENT_SET') {
    return 'a local component'
  }
  if (nodeType === 'FRAME' || nodeType === 'GROUP') {
    return 'a detached frame'
  }
  return null
}

function detachedMessage(snapshot: InstanceSnapshot, entry: CatalogEntry): string {
  const library = entry.figma.library ?? 'the system library'
  const kind = detachedKind(snapshot.nodeType)
  if (kind) {
    return `"${snapshot.nodeName}" is ${kind}, not the ${entry.figma.name} library instance. Replace it from ${library}.`
  }
  return `"${snapshot.nodeName}" is not a team-library instance (detached or local). Relink to ${library}.`
}

export function checkInstance(
  snapshot: InstanceSnapshot,
  entry: CatalogEntry | null,
  opts: CheckOptions = DEFAULT_OPTS,
  identityMatch?: IdentityMatch
): InstanceResult {
  const findings: Finding[] = []
  const reportedDesignOnly = new Set<string>()

  if (!entry) {
    return {
      snapshot,
      status: 'unmapped',
      ok: false,
      findings
    }
  }

  const hasVerifiedKeyIdentity = identityMatch === 'componentKey' || identityMatch === 'componentSetKey'
  const canonical = canonicalizeSnapshot(snapshot, entry)

  if (snapshot.isFromLibrary === false && !hasVerifiedKeyIdentity) {
    findings.push({
      code: 'FAIL_DETACHED',
      severity: 'fail',
      nodeId: snapshot.nodeId,
      catalogId: entry.id,
      message: detachedMessage(snapshot, entry)
    })
  } else if (snapshot.isFromLibrary === null && opts.treatMissingLibraryFlagAs === 'warn') {
    findings.push({
      code: 'WARN_NAME_MISMATCH',
      severity: 'warn',
      nodeId: snapshot.nodeId,
      catalogId: entry.id,
      message: 'Could not determine whether this instance comes from the team library.'
    })
  }

  if (findings.some(finding => finding.code === 'FAIL_DETACHED')) {
    return {
      snapshot,
      catalogId: entry.id,
      status: 'checked',
      ok: false,
      findings
    }
  }

  for (const [rawName, rawValue] of Object.entries(snapshot.properties)) {
    const designOnly = findProp(entry.designOnly, rawName)
    if (designOnly) {
      if (reportedDesignOnly.has(designOnly.name)) continue
      reportedDesignOnly.add(designOnly.name)
      const hint = designOnly.mapsTo ?? entry.bindings?.[`figma.${designOnly.name}`] ?? entry.bindings?.[rawName]
      findings.push({
        code: 'DESIGN_ONLY_OK',
        severity: 'info',
        nodeId: snapshot.nodeId,
        catalogId: entry.id,
        propName: designOnly.name,
        actual: actualString(rawValue),
        message: `Design-only control "${designOnly.name}" is allowed; do not implement as a React prop.`,
        bindingHint: hint
      })
      continue
    }

    const shared = findProp(entry.shared, rawName)
    if (shared) {
      const normalized = normalizeFigmaValue(rawValue, shared)
      if (shared.type === 'enum' && shared.values) {
        const ok = shared.values.some(v => v === normalized)
        if (!ok) {
          const suggestion = suggestClosestValue(String(normalized), shared.values)
          const didYouMean = suggestion ? ` Did you mean \`${suggestion}\`?` : ''
          const proposeDefaults: Partial<ProposalDraft> = {
            type: 'shared',
            title: `Add ${entry.id} ${shared.name} value "${normalized}"`,
            problem: `Needed ${shared.name}="${actualString(rawValue)}" but catalog shared values do not include it.`,
            attemptedWorkaround: suggestion
              ? `Closest catalog value: ${suggestion}. Other values: ${shared.values.join(', ')}`
              : `Tried existing values: ${shared.values.join(', ')}`,
            requestedChange: `${entry.code.export}.${shared.name} += "${normalized}"`,
            surfaces: ['Code (@harnessio/ui)', 'Catalog (legal API & bindings)', 'Figma library'],
            catalogId: entry.id,
            figmaNodeId: snapshot.nodeId
          }
          findings.push({
            code: 'FAIL_SHARED_VALUE',
            severity: 'fail',
            nodeId: snapshot.nodeId,
            catalogId: entry.id,
            propName: shared.name,
            actual: actualString(normalized),
            expected: shared.values,
            message: `"${shared.name}" value "${normalized}" is not in catalog shared allow-list.${didYouMean}`,
            proposeDefaults
          })
        }
      }
      // boolean/string/number shared props: presence is enough for v1
      continue
    }

    // codeOnly props should never appear as Figma failures if somehow present — ignore
    const codeOnly = findProp(entry.codeOnly, rawName)
    if (codeOnly) {
      continue
    }

    const anatomyControl = findAnatomyControl(entry, rawName)
    if (anatomyControl) {
      const anatomyId =
        typeof anatomyControl.id === 'string' ? anatomyControl.id : rawName.replace(/#[\d:]+$/u, '').trim()
      if (reportedDesignOnly.has(anatomyId)) continue
      reportedDesignOnly.add(anatomyId)
      const reactTarget = anatomyControl.bindings?.react?.target
      findings.push({
        code: 'INFO_INTENTIONAL_DIFFERENCE',
        severity: 'info',
        nodeId: snapshot.nodeId,
        catalogId: entry.id,
        propName: anatomyId,
        actual: actualString(rawValue),
        message: `Figma anatomy control "${anatomyId}" maps to React composition, not a standalone prop.`,
        bindingHint: typeof reactTarget === 'string' ? reactTarget : undefined
      })
      continue
    }

    // Preserve human-readable name (strip #id only; keep original casing)
    const displayName = rawName.replace(/#[\d:]+$/u, '').trim()
    const heuristicType = typeof rawValue === 'boolean' ? 'designOnly' : 'shared'
    findings.push({
      code: 'FAIL_UNKNOWN_PROP',
      severity: 'fail',
      nodeId: snapshot.nodeId,
      catalogId: entry.id,
      propName: displayName,
      actual: actualString(rawValue),
      message: `Figma property "${rawName}" is not in shared or designOnly for ${entry.id}.`,
      proposeDefaults: {
        type: heuristicType,
        title: `Clarify ${entry.id} prop "${displayName}"`,
        problem: `Canvas uses "${rawName}" which is not catalogued.`,
        attemptedWorkaround: 'Checked shared and designOnly lists.',
        requestedChange:
          heuristicType === 'designOnly'
            ? `Add designOnly "${displayName}" with composition binding`
            : `Add shared "${displayName}" or document as designOnly`,
        surfaces: ['Catalog (legal API & bindings)', 'Figma library'],
        catalogId: entry.id,
        figmaNodeId: snapshot.nodeId
      }
    })
  }

  const hasPropertyFailure = findings.some(({ code }) => code === 'FAIL_SHARED_VALUE' || code === 'FAIL_UNKNOWN_PROP')
  if (!hasPropertyFailure) {
    findings.push(...evaluateAnatomy(snapshot, entry, canonical))
    findings.push(...evaluateConstraints(canonical, entry, snapshot.nodeId).findings)
  }

  const ok = !findings.some(f => f.severity === 'fail')
  return {
    snapshot,
    catalogId: entry.id,
    status: 'checked',
    ok,
    findings
  }
}

/**
 * An unmapped instance has no allow-list to check against, so it is reported
 * as unverified — never as a pass. Strict mode turns the ❖ ones into failures.
 */
function unmappedResult(snapshot: InstanceSnapshot, opts: CheckOptions): InstanceResult {
  // Never the raw `mainComponentName`: for a variant that is the property
  // combination, so the message would read back the designer's own settings.
  const name = componentDisplayName(snapshot)
  const prefixes = opts.unmappedNamePrefixes ?? ['❖']
  const looksLikeSystem = prefixes.some(p => name.startsWith(p))

  const proposeDefaults: Partial<ProposalDraft> = {
    type: 'component',
    title: `Catalog missing component for ${name}`,
    problem: `Instance "${name}" could not be matched to a catalog id.`,
    attemptedWorkaround: 'Checked componentKey, component-set key, and figmaNames.',
    requestedChange: `Add catalog entry + manifest mapping for ${name}`,
    surfaces: ['Catalog (legal API & bindings)', 'Figma library'],
    figmaNodeId: snapshot.nodeId
  }

  const finding: Finding =
    opts.strictUnmapped && looksLikeSystem
      ? {
          code: 'FAIL_UNMAPPED',
          severity: 'fail',
          nodeId: snapshot.nodeId,
          message: `"${name}" looks like a system component but has no catalog entry.`,
          proposeDefaults
        }
      : {
          code: 'INFO_UNMAPPED',
          severity: 'info',
          nodeId: snapshot.nodeId,
          message: `Not in catalog — can’t verify "${name}". Propose it if it should be a system component.`,
          proposeDefaults
        }

  return {
    snapshot,
    status: 'unmapped',
    ok: false,
    findings: [finding]
  }
}

export function checkInstances(
  snapshots: InstanceSnapshot[],
  index: CatalogIndex,
  opts: CheckOptions = DEFAULT_OPTS
): CheckReport {
  const instances: InstanceResult[] = []
  const allFindings: Finding[] = []
  const reported = new Set<string>()
  let mappedCount = 0
  let pass = 0
  let fail = 0
  let warn = 0
  let info = 0
  let unmapped = 0

  for (const snapshot of snapshots) {
    const match = matchComponent(snapshot, index)

    if (match.status === 'unmapped') {
      // Icon slots and other inner parts of a component already on the report
      // are not findings of their own — they would bury the real result.
      if (snapshot.parentNodeId && reported.has(snapshot.parentNodeId)) {
        continue
      }
      const result = unmappedResult(snapshot, opts)
      instances.push(result)
      allFindings.push(...result.findings)
      reported.add(snapshot.nodeId)
      unmapped += 1
      // The unmapped chip owns these; counting them twice would read as noise.
      if (result.findings.some(f => f.severity === 'fail')) fail += 1
      continue
    }

    mappedCount += 1
    const result = checkInstance(snapshot, match.entry, opts, match.via)
    instances.push(result)
    allFindings.push(...result.findings)
    reported.add(snapshot.nodeId)

    if (result.ok) pass += 1
    else fail += 1

    for (const f of result.findings) {
      if (f.severity === 'warn') warn += 1
      if (f.severity === 'info') info += 1
    }
  }

  return {
    findings: allFindings,
    instances,
    summary: {
      pass,
      fail,
      warn,
      info,
      unmapped,
      instanceCount: instances.length,
      mappedCount
    }
  }
}
