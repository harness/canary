import { get, set } from 'lodash-es'

import type { AnyFormikValue, IFormDefinition, IInputDefinition } from '../../types/types'

export const getDefaultValuesFromFormDefinition = (inputs: IFormDefinition): AnyFormikValue => {
  const defaultValues: AnyFormikValue = {}

  // TODO: this implementation is wrong
  inputs.inputs.forEach(input => {
    // add default for nested (group),
    if (input.inputType === 'group') {
      input?.inputs?.forEach(input => {
        if (typeof get(defaultValues, input.path) === 'undefined') {
          set(defaultValues, input.path, input.default)
        }
      })
    }
    if (typeof get(defaultValues, input.path) === 'undefined') {
      set(defaultValues, input.path, input.default)
    }
  })

  return defaultValues
}

export function overrideFormDefinition(base: IFormDefinition, override: IFormDefinition): IFormDefinition {
  const newInputs = base.inputs.map(input => {
    const overrideInput = findInputByPath(override, input.path)
    return overrideInput ? overrideInput : input
  })

  return { ...base, inputs: newInputs }
}

function findInputByPath(formDefinition: IFormDefinition, path: string): IInputDefinition | undefined {
  return formDefinition.inputs.find(input => input.path === path)
}
