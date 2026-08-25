import { enforceTokenBudget, GET_COMPONENT_TOKEN_BUDGET } from './budgets.js'
import { findComponent } from './catalog.js'
import type { AgentCatalog, AgentComponent, AgentExample, ToolError } from './types.js'

export type PublicComponent = Omit<AgentComponent, 'examples' | 'constraints'> & {
  examples: Array<Omit<AgentExample, 'code'>>
  hasConstraints: boolean
  constraints?: {
    exhaustive: boolean
    dimensions: string[]
  }
  hint: string
}

export function toPublicComponent(component: AgentComponent): PublicComponent {
  const examples = component.examples.map(({ code: _code, ...example }) => example)
  const hasConstraints = Boolean(component.constraints)
  const publicComponent: PublicComponent = {
    ...component,
    examples,
    hasConstraints,
    hint: hasConstraints
      ? 'Call validate_props before unusual variant combinations. Call get_example for snippets.'
      : 'Call get_example for snippets. See TypeScript for the public React API.'
  }

  if (component.constraints) {
    publicComponent.constraints = {
      exhaustive: component.constraints.exhaustive,
      dimensions: component.constraints.dimensions
    }
  }

  return enforceTokenBudget(publicComponent, GET_COMPONENT_TOKEN_BUDGET)
}

export function getComponent(catalog: AgentCatalog, idOrExportName: string): PublicComponent | ToolError {
  const component = findComponent(catalog, idOrExportName)
  if (!component) {
    return {
      error: `Unknown component "${idOrExportName}".`,
      hint: 'Call search_components with a Canary export name or catalog id.'
    }
  }
  return toPublicComponent(component)
}

export function getExample(
  catalog: AgentCatalog,
  idOrExportName: string,
  exampleId?: string
): { id: string; exampleId: string; name: string; purpose: string; import: string; code: string } | ToolError {
  const component = findComponent(catalog, idOrExportName)
  if (!component) {
    return {
      error: `Unknown component "${idOrExportName}".`,
      hint: 'Call search_components with a Canary export name or catalog id.'
    }
  }

  const example = exampleId
    ? component.examples.find(item => item.id === exampleId)
    : (component.examples.find(item => item.recommended) ?? component.examples[0])

  if (!example?.code) {
    return {
      error: exampleId
        ? `No example "${exampleId}" on ${component.exportName}.`
        : `No example source on ${component.exportName}.`,
      hint: 'Call get_component to list example ids, then get_example with exampleId.'
    }
  }

  return {
    id: component.id,
    exampleId: example.id,
    name: example.name,
    purpose: example.purpose,
    import: component.import,
    code: example.code
  }
}
