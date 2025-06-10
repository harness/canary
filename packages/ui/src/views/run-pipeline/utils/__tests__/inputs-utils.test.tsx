import label from 'tailwind-utils-config/components/label'
import { describe, expect, it } from 'vitest'

import { pipelineInputs2FormInputs } from '../inputs-utils'

const pipelineInputs = {
  foo: {
    type: 'string',
    label: 'Foo Input',
    description: 'This is the foo input',
    default: 'foo-default',
    required: true
  },
  bar: {
    type: 'string',
    label: 'Bar Input',
    description: 'This is the bar input',
    default: 'bar-default',
    required: false
  },
  baz: {
    type: 'string',
    label: 'Baz Input',
    description: 'This is the baz input',
    default: 'baz-default',
    required: false
  }
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
    expect(result[0]).toMatchObject({
      inputType: 'group',
      path: '',
      label: 'Main Group'
    })

    // Assert unlisted input
    expect(result[1]).toMatchObject({
      inputType: 'text',
      path: 'input.baz'
    })
  })

  it('includes grouped inputs with no label', () => {
    const layout = [
      {
        open: true,
        items: ['foo', { items: ['bar', 'baz'] }]
      }
    ]

    const result = pipelineInputs2FormInputs({
      pipelineInputs,
      options,
      pipelineInputLayout: layout
    })

    // Assert that all inputs are rendered as flat (not grouped) inputs
    expect(result).toHaveLength(3)
    expect(result[0].inputType).not.toBe('group')
    expect(result[1].inputType).not.toBe('group')
    expect(result[2].inputType).not.toBe('group')
  })

  it('includes duplicate keys in layout', () => {
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
    // Assert that all inputs are rendered as flat (not grouped) inputs
    expect(result[0].inputType).not.toBe('group')
    expect(result[1].inputType).not.toBe('group')
    expect(result[2].inputType).not.toBe('group')
  })
})
