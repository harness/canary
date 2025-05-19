import { IInputDefinition, unsetEmptyStringOutputTransformer } from '@harnessio/forms'

export function addNameInput(inputs: IInputDefinition[], path: string): IInputDefinition[] {
  return [
    {
      path,
      label: 'Name',
      inputType: 'text',
      outputTransform: unsetEmptyStringOutputTransformer()
    },
    ...inputs
  ]
}
