import { InputConfigType } from '@views/unified-pipeline-studio/components/form-inputs/types'

import { IFormDefinition } from '@harnessio/forms'

import { IInputConfigWithConfigInterface } from '../../../../../packages/ui/src/views/connectors/types'

export const TERRAFORM_CONNECTOR_CATEGORY = 'Infrastructure'

const inputs: IInputConfigWithConfigInterface[] = [
  {
    inputType: 'text',
    path: `endpoint`,
    label: 'Endpoint'
  },
  {
    inputType: 'text',
    path: `token`,
    label: 'Token'
  }
]

export const terraformConnectorFormDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
