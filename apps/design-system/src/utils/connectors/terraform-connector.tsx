import { IFormDefinition } from '@harnessio/forms'
import { IInputConfigWithConfigInterface, InputConfigType } from '@harnessio/ui/views'

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
