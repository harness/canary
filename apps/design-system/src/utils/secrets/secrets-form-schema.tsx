import { IFormDefinition } from '@harnessio/forms'
import { IInputConfigWithConfigInterface, InputConfigType } from '@harnessio/ui/views'

// export const GITHUB_CONNECTOR_CATEOGRY = 'Code Repository'

const metadataInputs: IInputConfigWithConfigInterface[] = [
  {
    inputType: 'text',
    path: `secret.description`,
    label: 'Description'
  },
  {
    inputType: 'text',
    path: `secret.tags`,
    label: 'Tags'
  }
]

const inputs: IInputConfigWithConfigInterface[] = [
  {
    inputType: 'text',
    label: 'Secret Manager',
    path: 'secret.spec.secretManagerIdentifier'
  },
  {
    inputType: 'text',
    path: `secret.name`,
    label: 'Secret Name'
  },
  {
    inputType: 'text',
    path: `secret.spec.value`,
    label: 'Secret Value'
  },
  {
    inputType: 'group',
    path: `secret.metadata`,
    label: 'Metadata',
    inputs: metadataInputs,
    inputConfig: {
      autoExpandGroups: true
    }
  }
]

export const secretsFormDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
