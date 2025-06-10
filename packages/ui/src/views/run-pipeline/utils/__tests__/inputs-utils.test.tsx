import { describe, expect, it } from 'vitest'

import { pipelineInputs2FormInputs } from '../inputs-utils'

const pipelineInputs = {
  foo: { type: 'string' },
  bar: { type: 'string' },
  baz: { type: 'string' }
}

const options = { prefix: 'input.' }

describe('pipelineInputs2FormInputs', () => {
  it('includes grouped inputs and appends unlisted ones', () => {
    const layout = [
      {
        title: 'Main Group',
        open: true,
        items: ['foo', { title: 'Nested Group', items: ['bar'] }]
      }
    ]

    const result = pipelineInputs2FormInputs({
      pipelineInputs,
      options,
      pipelineInputLayout: layout
    })

    // Assert group
    expect(result).toHaveLength(2)
    expect(result[0].inputType).toBe('group')
    expect(result[0].label).toBe('Main Group')

    // Assert unlisted input
    expect(result[1]).toMatchObject({
      path: 'input.baz'
    })
  })

  it.only('includes duplicate keys in layout', () => {
    const layout = [
      {
        title: 'Main Group',
        open: true,
        items: ['foo', { title: 'Nested Group', items: ['bar', 'baz', 'foo'] }]
      }
    ]

    const result = pipelineInputs2FormInputs({
      pipelineInputs,
      options,
      pipelineInputLayout: layout
    })

    expect(result).toHaveLength(3)
    expect(result[0].inputType).not.toBe('group')
    expect(result[1].inputType).not.toBe('group')
    expect(result[2].inputType).not.toBe('group')
  })
})
