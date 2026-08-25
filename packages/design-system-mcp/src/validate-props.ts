import { findComponent } from './catalog.js'
import type { AgentCatalog, AgentComponent, ToolError, ValidatePropsResult } from './types.js'

function defaultsFromComponent(component: AgentComponent): Record<string, string | boolean | number> {
  const defaults: Record<string, string | boolean | number> = {}
  for (const prop of component.props) {
    if (prop.default !== undefined) defaults[prop.name] = prop.default
  }
  return defaults
}

function matchesCombination(
  values: Record<string, string | boolean | number>,
  conditions: Record<string, Array<string | boolean | number>>
): boolean {
  return Object.entries(conditions).every(([dimension, allowed]) =>
    allowed.some(candidate => candidate === values[dimension])
  )
}

export function validateProps(
  catalog: AgentCatalog,
  idOrExportName: string,
  props: Record<string, unknown>
): ValidatePropsResult | ToolError {
  const component = findComponent(catalog, idOrExportName)
  if (!component) {
    return {
      error: `Unknown component "${idOrExportName}".`,
      hint: 'Call search_components with a Canary export name or catalog id.'
    }
  }

  if (!component.constraints) {
    return {
      status: 'unknown',
      message: `${component.exportName} has no contract constraints. Treat TypeScript and get_example as the authority.`,
      ruleId: undefined
    }
  }

  const filled: Record<string, string | boolean | number> = { ...defaultsFromComponent(component) }
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined) continue
    if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number') {
      filled[key] = value
    }
  }

  const missing = component.constraints.dimensions.filter(dimension => filled[dimension] === undefined)
  if (missing.length > 0) {
    return {
      status: 'invalid',
      message: `Cannot evaluate ${component.exportName} because ${missing.join(', ')} is still missing after filling documented defaults.`
    }
  }

  const combinations = component.constraints.combinations ?? []
  const matches = combinations.filter(rule => matchesCombination(filled, rule.conditions))

  if (component.constraints.exhaustive && matches.length !== 1) {
    return {
      status: 'invalid',
      message:
        matches.length === 0
          ? `${component.exportName} combination is not covered by the exhaustive contract matrix.`
          : `${component.exportName} combination matches multiple contract rules: ${matches.map(rule => rule.id).join(', ')}.`
    }
  }

  if (matches.length === 0) {
    return {
      status: 'unsupported',
      message: `${component.exportName} combination is not a supported contract rule.`
    }
  }

  const rule = matches[0]
  const migration = component.migrations?.find(item => item.id === rule.migrationId)?.instructions

  if (rule.status === 'deprecated') {
    return {
      status: 'deprecated',
      ruleId: rule.id,
      message: rule.description ?? `${component.exportName} combination is deprecated.`,
      ...(migration ? { migration } : {})
    }
  }

  if (rule.status === 'unsupported') {
    return {
      status: 'unsupported',
      ruleId: rule.id,
      message: rule.description ?? `${component.exportName} combination is unsupported.`
    }
  }

  return {
    status: 'supported',
    ruleId: rule.id,
    message: rule.description ?? `${component.exportName} combination is supported.`
  }
}
