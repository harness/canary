import { get, set } from 'lodash-es'

import type { AnyFormValue, IFormDefinition, IInputDefinition } from '../../types/types'

export const getDefaultValuesFromFormDefinition = (formDef: IFormDefinition): AnyFormValue => {
  const defaultValues: AnyFormValue = {}

  const populateDefaults = (inputs: IInputDefinition[]) => {
    inputs.forEach(input => {
      const { path, default: def, inputType, inputs: children } = input

      if ((inputType === 'group' || inputType === 'accordion') && Array.isArray(children)) {
        // dive into nested group/accordion
        populateDefaults(children)
      } else {
        // leaf field – only set if not already defined
        if (get(defaultValues, path) === undefined) {
          set(defaultValues, path, def)
        }
      }
    })
  }

  if (Array.isArray(formDef.inputs)) {
    populateDefaults(formDef.inputs)
  }

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
