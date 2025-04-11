import { forOwn } from 'lodash-es'

import { IInputDefinition } from '@harnessio/forms'

/** pipeline inputs to form inputs conversion */
export function pipelineInputs2FormInputs(
  pipelineInputs: Record<string, any>,
  options: { prefix?: string }
): IInputDefinition[] {
  const formInputs: IInputDefinition[] = []

  forOwn(pipelineInputs, (value, key) => {
    const formInput = pipelineInput2FormInput(key, value, options)
    formInputs.push(formInput)
  })

  return formInputs
}

/** pipeline input to form input conversion */
export function pipelineInput2FormInput(
  name: string,
  inputProps: Record<string, unknown>,
  options: { prefix?: string }
): IInputDefinition {
  return {
    inputType: pipelineInputType2FormInputType(inputProps.type as string),
    path: options.prefix + name,
    // TODO: custom function - check if already exists
    label: name,
    default: inputProps.default,
    required: inputProps.required as boolean

    // TODO: validation
    // validation: ... use inputProps.pattern
  }
}

/** pipeline input type to form input type conversion */
function pipelineInputType2FormInputType(type: string) {
  switch (type) {
    case 'string':
      return 'text'
    default:
      return type
  }
}
