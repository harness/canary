import { IFormDefinition, unsetEmptyStringOutputTransformer } from '@harnessio/forms'

import { InputDefinition } from '../../form-inputs/factory/factory'

const inputs: InputDefinition[] = [
  {
    inputType: 'text',
    path: 'name',
    label: 'Name',
    outputTransform: unsetEmptyStringOutputTransformer()
  },
  {
    inputType: 'textarea',
    path: 'description',
    label: 'Description',
    outputTransform: unsetEmptyStringOutputTransformer()
  }
]

// NOTE: basic implementation of pipeline form for open source
export const basicPipelineFormDefinition: IFormDefinition<InputDefinition> = {
  inputs
}
