export type AttrValue = { kind: 'literal'; value: string } | { kind: 'expression'; value: string } | { kind: 'flag' }

export interface JsxUsage {
  attrs: Map<string, AttrValue>
  hasChildren: boolean
}

const ATTR = /([A-Za-z_][\w-]*)(?:=(?:"([^"]*)"|'([^']*)'|\{([^}]*)\}))?/g

const parseAttrs = (source: string): Map<string, AttrValue> => {
  const attrs = new Map<string, AttrValue>()
  for (const match of source.matchAll(ATTR)) {
    const [, name, double, single, expression] = match
    if (double !== undefined || single !== undefined) {
      attrs.set(name, { kind: 'literal', value: double ?? single })
      continue
    }
    if (expression !== undefined) {
      const literal = /^\s*(['"])(.*)\1\s*$/.exec(expression)
      attrs.set(name, literal ? { kind: 'literal', value: literal[2] } : { kind: 'expression', value: expression })
      continue
    }
    attrs.set(name, { kind: 'flag' })
  }
  return attrs
}

/**
 * Finds every `<Component ...>` usage in a JSX snippet. This is a lightweight
 * parser for manifest examples, not a general JSX parser: attribute
 * expressions may not contain '}' and the component may not nest itself.
 */
export const parseUsages = (code: string, component: string): JsxUsage[] => {
  const pattern = new RegExp(`<${component}\\b([^>]*?)(\\/>|>([\\s\\S]*?)<\\/${component}>)`, 'g')
  return [...code.matchAll(pattern)].map(match => ({
    attrs: parseAttrs(match[1]),
    hasChildren: (match[3] ?? '').trim().length > 0
  }))
}

/** Value of a prop in a usage, falling back to the manifest default. */
export const effectiveValue = (usage: JsxUsage, prop: string, defaults: Map<string, unknown>): unknown => {
  const attr = usage.attrs.get(prop)
  if (!attr) return defaults.get(prop)
  if (attr.kind === 'flag') return true
  if (attr.kind === 'literal') return attr.value
  return undefined
}

export const matchesValue = (actual: unknown, expected: unknown): boolean => {
  if (Array.isArray(expected)) return expected.includes(actual)
  return actual === expected
}
