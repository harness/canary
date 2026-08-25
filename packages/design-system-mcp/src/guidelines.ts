import fuzzysort from 'fuzzysort'

import { findComponent } from './catalog.js'
import type { AgentCatalog, AgentFoundation, AgentToken, ToolError } from './types.js'

export function getGuidelines(catalog: AgentCatalog, id: string): AgentFoundation | ToolError {
  const needle = id.trim().toLowerCase()
  const page = catalog.foundations.find(foundation => foundation.id === needle)
  if (!page) {
    return {
      error: `Unknown guidelines id "${id}".`,
      hint: `Known ids: ${catalog.foundations.map(foundation => foundation.id).join(', ') || 'none'}.`
    }
  }
  return page
}

export function getTokens(
  catalog: AgentCatalog,
  options: { query?: string; componentId?: string } = {}
): { tokens: AgentToken[] } {
  let tokens = catalog.tokens

  if (options.componentId) {
    const component = findComponent(catalog, options.componentId)
    const family = component?.family ?? options.componentId.replace(/^canary\./, '')
    tokens = tokens.filter(token => token.id.includes(`.${family}.`) || token.id.endsWith(`.${family}`))
  }

  if (options.query?.trim()) {
    const ranked = fuzzysort.go(options.query.trim(), tokens, {
      keys: ['id', 'description', 'kind'],
      threshold: -100000
    })
    tokens = ranked.map(result => result.obj)
  }

  return { tokens }
}

export function compactInventory(catalog: AgentCatalog) {
  return catalog.components.map(component => ({
    id: component.id,
    exportName: component.exportName,
    confidence: component.confidence,
    category: component.category
  }))
}
