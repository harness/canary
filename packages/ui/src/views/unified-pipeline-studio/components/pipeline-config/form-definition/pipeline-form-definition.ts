import { IFormDefinition, unsetEmptyStringOutputTransformer } from '@harnessio/forms'

import { InputConfigType } from '../../form-inputs'
import { IInputConfigWithConfig } from '../../steps/types'

const inputs: IInputConfigWithConfig[] = [
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
export const basicPipelineFormDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
