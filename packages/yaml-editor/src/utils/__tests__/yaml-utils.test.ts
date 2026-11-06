import { describe, expect, it } from 'vitest'

import { parseYamlSafe } from '../yaml-utils'

describe('parseYamlSafe', () => {
  it('parses valid YAML into an object and reports valid syntax', () => {
    const { yamlObject, isYamlSyntaxValid } = parseYamlSafe<{ pipeline: { name: string; stages: number } }>(
      'pipeline:\n  name: build\n  stages: 3\n'
    )

    expect(isYamlSyntaxValid).toBe(true)
    expect(yamlObject).toEqual({ pipeline: { name: 'build', stages: 3 } })
  })

  it('parses scalar and empty documents', () => {
    expect(parseYamlSafe('42')).toEqual({ yamlObject: 42, isYamlSyntaxValid: true })
    // An empty document is syntactically valid YAML and parses to null.
    expect(parseYamlSafe('')).toEqual({ yamlObject: null, isYamlSyntaxValid: true })
  })

  it('flags invalid syntax and leaves the object undefined', () => {
    const { yamlObject, isYamlSyntaxValid } = parseYamlSafe('foo: [bar: baz')

    expect(isYamlSyntaxValid).toBe(false)
    expect(yamlObject).toBeUndefined()
  })
})
