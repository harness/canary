import { describe, expect, it } from 'vitest'

import { InputFactory } from '@harnessio/forms'

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

const inputComponentFactory = new InputFactory()

const options = { prefix: 'input.' }

describe('pipelineInputs2FormInputs', () => {
  it('handles layout with groups and appends missing inputs (Rule 2)', () => {
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
      pipelineInputLayout: layout,
      inputComponentFactory
    })

    // Expect group + one unlisted input
    expect(result).toHaveLength(2)

    expect(result[0]).toMatchObject({
      inputType: 'accordion',
      path: '',
      inputs: [
        {
          inputType: 'group',
          path: '',
          label: 'Main Group'
        }
      ]
    })
    expect(result[1]).toMatchObject({ path: 'input.baz' }) // 'baz' not in layout
  })

  it('flattens unnamed groups (no label)', () => {
    const layout = [
      {
        open: true,
        items: ['foo', { items: ['bar', 'baz'] }]
      }
    ]

    const result = pipelineInputs2FormInputs({
      pipelineInputs,
      options,
      pipelineInputLayout: layout,
      inputComponentFactory
    })

    // All inputs should be flat
    expect(result).toHaveLength(3)
    result.forEach(input => expect(input.inputType).not.toBe('group'))
  })

  it('includes duplicate keys only once (Rule 1)', () => {
    const layout = [
      {
        title: 'Main Group',
        open: true,
        items: ['foo', { title: 'Nested Group', items: ['bar', 'baz', 'foo'] }] // 'foo' duplicated
      }
    ]

    const result = pipelineInputs2FormInputs({
      pipelineInputs,
      options,
      pipelineInputLayout: layout,
      inputComponentFactory
    })

    const flatInputs = result.flatMap(item => (item.inputType === 'accordion' ? item.inputs?.[0].inputs : [item]))

    const fooInputs = flatInputs.filter(i => i && i.path === 'input.foo')
    expect(fooInputs).toHaveLength(1) // 'foo' should appear only once
  })

  it('renders flat input list when no layout is provided (Rule 3)', () => {
    const result = pipelineInputs2FormInputs({ pipelineInputs, options, inputComponentFactory })
    expect(result).toHaveLength(3)
    result.forEach(input => expect(input.inputType).not.toBe('group'))
  })

  it('ignores non-existent keys in layout (Rule 4)', () => {
    const layout = ['foo', 'qux', 'bar'] // 'qux' does not exist

    const result = pipelineInputs2FormInputs({
      pipelineInputs,
      options,
      pipelineInputLayout: layout,
      inputComponentFactory
    })

    // Should only include 'foo', 'bar', and 'baz' (baz is appended)
    const paths = result.map(i => (i.inputType === 'group' ? null : i.path)).filter(Boolean)
    expect(paths).toContain('input.foo')
    expect(paths).toContain('input.bar')
    expect(paths).toContain('input.baz')
    expect(paths).not.toContain('input.qux')
  })
})
