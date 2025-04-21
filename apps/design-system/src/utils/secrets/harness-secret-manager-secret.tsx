import { IFormDefinition } from '@harnessio/forms'
import { IInputConfigWithConfigInterface, InputConfigType } from '@harnessio/ui/views'

// export const GITHUB_CONNECTOR_CATEOGRY = 'Code Repository'

const inputs: IInputConfigWithConfigInterface[] = [
  {
    inputType: 'text',
    path: `name`,
    label: 'Secret Name'
  },
  {
    inputType: 'text',
    path: `value`,
    label: 'Secret Value'
  },
  {
    inputType: 'text',
    path: `description`,
    label: 'Description'
  },
  {
    inputType: 'text',
    path: `tags`,
    label: 'Tags'
  }
]

export const harnessSecretManagerFormDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
