import { IInputDefinition, unsetEmptyStringOutputTransformer } from '@harnessio/forms'

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
