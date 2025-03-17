import { InputConfigType, InputType } from '@views/unified-pipeline-studio/components/form-inputs/types'

import { IFormDefinition } from '@harnessio/forms'

import { IInputConfigWithConfigInterface } from '../types'

export const TERRAFORM_CONNECTOR_CATEGORY = 'Infrastructure'

const inputs: IInputConfigWithConfigInterface[] = [
  {
    inputType: InputType.text,
    path: `endpoint`,
    label: 'Endpoint'
  },
  {
    inputType: InputType.text,
    path: `token`,
    label: 'Token'
  }
]

export const terraformConnectorFormDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
