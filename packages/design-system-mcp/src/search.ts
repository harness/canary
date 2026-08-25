import fuzzysort from 'fuzzysort'

import { enforceTokenBudget, SEARCH_HIT_TOKEN_BUDGET } from './budgets.js'
import type { AgentCatalog, AgentComponent, AgentIcon, ComponentSearchHit, IconSearchHit } from './types.js'

const CONFIDENCE_RANK: Record<AgentComponent['confidence'], number> = {
  stable: 2,
  fallback: 1,
  unreviewed: 0
}

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

function tokens(value: string): string[] {
  return normalize(value)
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
}

export function aliasOrExactHit(query: string, component: AgentComponent): string | undefined {
  const needle = normalize(query)
  if (!needle) return undefined
  if (needle === normalize(component.exportName) || needle === normalize(component.id)) {
    return `exact ${component.exportName}`
  }

  const queryTokens = tokens(query)
  for (const alias of component.aliases) {
    const aliasNeedle = normalize(alias)
    if (!aliasNeedle) continue
    if (needle === aliasNeedle || needle.includes(aliasNeedle)) return `alias ${alias}`
    const aliasTokens = tokens(alias)
    if (aliasTokens.length === 1 && queryTokens.includes(aliasTokens[0])) return `alias ${alias}`
  }

  return undefined
}

function componentHaystack(component: AgentComponent): string {
  return [
    component.exportName,
    component.id,
    component.family,
    component.category,
    component.summary,
    ...component.aliases,
    ...component.useWhen,
    ...(component.members ?? [])
  ]
    .filter(Boolean)
    .join(' ')
}

function iconHaystack(icon: AgentIcon): string {
  return [icon.name, ...icon.synonyms].join(' ')
}

export function searchComponents(catalog: AgentCatalog, query: string, limit = 8): ComponentSearchHit[] {
  const rows = catalog.components.map(component => ({ component, haystack: componentHaystack(component) }))
  const fuzzy = fuzzysort.go(query, rows, { key: 'haystack', threshold: -100000 })
  const fuzzyById = new Map(fuzzy.map(result => [result.obj.component.id, result.score]))

  const ranked = catalog.components
    .map(component => {
      const why = aliasOrExactHit(query, component)
      const fuzzyScore = fuzzyById.get(component.id)
      if (why === undefined && fuzzyScore === undefined) return undefined
      return {
        id: component.id,
        exportName: component.exportName,
        summary: component.summary,
        confidence: component.confidence,
        score: (why ? 10_000 : 0) + CONFIDENCE_RANK[component.confidence] * 100 + (fuzzyScore ?? (why ? 0 : -50_000)),
        why: why ?? 'fuzzy match'
      } satisfies ComponentSearchHit
    })
    .filter((hit): hit is ComponentSearchHit => Boolean(hit))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map(hit => enforceTokenBudget(hit, SEARCH_HIT_TOKEN_BUDGET))

  return ranked
}

export function searchIcons(catalog: AgentCatalog, query: string, limit = 8): IconSearchHit[] {
  const needle = normalize(query)
  const rows = catalog.icons.map(icon => ({ icon, haystack: iconHaystack(icon) }))
  const fuzzy = fuzzysort.go(query, rows, { key: 'haystack', threshold: -100000 })
  const fuzzyByName = new Map(fuzzy.map(result => [result.obj.icon.name, result.score]))

  return catalog.icons
    .map(icon => {
      const synonymHit = icon.synonyms.some(
        synonym => needle.includes(normalize(synonym)) || normalize(synonym) === needle
      )
      const nameHit = needle === icon.name || needle.includes(icon.name)
      const fuzzyScore = fuzzyByName.get(icon.name)
      if (!synonymHit && !nameHit && fuzzyScore === undefined) return undefined
      return {
        name: icon.name,
        usage: icon.usage,
        synonyms: icon.synonyms,
        score: (synonymHit || nameHit ? 10_000 : 0) + (fuzzyScore ?? -50_000)
      }
    })
    .filter((hit): hit is NonNullable<typeof hit> => Boolean(hit))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map(({ score: _score, ...hit }) => enforceTokenBudget(hit, SEARCH_HIT_TOKEN_BUDGET))
}
