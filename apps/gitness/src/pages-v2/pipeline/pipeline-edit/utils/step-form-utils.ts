import { IInputDefinition, unsetEmptyArrayOutputTransformer, unsetEmptyStringOutputTransformer } from '@harnessio/forms'
import { InputType, UIInputWithConfigsForArray } from '@harnessio/views'

import { StepInputDefinitionType } from '../types/api-types'
import { generateFriendlyName } from './common-utils'

// TODO
enum ApiInputType {
  STRING = 'string',
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  ARRAY = 'array',
  OBJECT = 'object'
}

// TODO
interface ApiInput {
  type: ApiInputType
  description?: string
  default?: string
  options?: { isExtended?: boolean }
  required?: boolean
}

// TODO
export interface ApiInputs {
  [key: string]: ApiInput
}

function apiInputType2FormInputType(type: string) {
  if (type === 'string') return 'text'

  return type
}

function getDefaultOutputTransformer(inputType: string): IInputDefinition<unknown>['outputTransform'] {
  switch (inputType) {
    case 'text':
      return unsetEmptyStringOutputTransformer()
    case 'array':
    case 'list':
      return unsetEmptyArrayOutputTransformer()
    default:
      return undefined
  }
}

export function apiInput2IInputDefinition(
  inputName: string,
  input: StepInputDefinitionType,
  prefix?: string
): IInputDefinition {
  let arrayInput: UIInputWithConfigsForArray | undefined
  if (input.type === 'array') {
    arrayInput = {
      inputType: InputType.text
    }
  }

  const inputType = apiInputType2FormInputType(input.type)

  return {
    label: generateFriendlyName(inputName),
    path: prefix ? `${prefix}.${inputName}` : inputName,
    description: input.description,
    inputType,
    outputTransform: getDefaultOutputTransformer(inputType),
    //required: input.required,
    ...(arrayInput ? { inputConfig: { input: arrayInput } } : {})
  }
}

export function addNameInput(inputs: IInputDefinition[], path: string): IInputDefinition[] {
  return [
    {
      path,
      label: 'Name',
      description: 'Name of the step',
      inputType: 'text',
      outputTransform: unsetEmptyStringOutputTransformer()
    },
    ...inputs
  ]
}
