import { set } from 'lodash-es'

import { IFormDefinition, IInputDefinition } from '../../types'

export function collectDefaultValues(formDefinition: IFormDefinition): Record<string, unknown> {
  const values: Record<string, unknown> = {}

  const traverse = (inputs: IInputDefinition[]) => {
    inputs.forEach(input => {
      const { default: defaultValue, path, inputs: children } = input

      if (Array.isArray(children)) {
        // dive into nested group/accordion
        traverse(children)
      } else if (defaultValue !== undefined) {
        // leaf field – set default only if defined
        set(values, path, defaultValue)
      }
    })
  }

  if (Array.isArray(formDefinition.inputs)) {
    traverse(formDefinition.inputs)
  }

  return values
}
