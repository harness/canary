import { IInputDefinition, unsetEmptyStringOutputTransformer } from '@harnessio/forms'

import { TextFormInputConfig } from '../components/form-inputs'

export function addNameInput(
  inputs: IInputDefinition[],
  path: string,
  nameFieldConfig?: Partial<IInputDefinition<TextFormInputConfig['inputConfig']>>
): IInputDefinition[] {
  return [
    {
      path,
      label: 'Name',
      inputType: 'text',
      outputTransform: unsetEmptyStringOutputTransformer(),
      ...nameFieldConfig
    },
    ...inputs
  ]
}
