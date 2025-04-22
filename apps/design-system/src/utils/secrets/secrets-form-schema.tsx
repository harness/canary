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
    label: 'Tags',
    inputConfig: {
      tooltip: 'Separate labels with commas or press Enter. Use key:value for objects.'
    }
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
    label: 'Name'
  },
  {
    inputType: 'text',
    label: 'ID',
    path: `secret.identifier`,
    inputConfig: {
      tooltip: 'When you create an entity, Harness assigns a unique ID. You can change it until the entity is saved.'
    }
  },
  {
    inputType: 'text',
    path: `secret.spec.value`,
    label: 'Enter the Secret Text'
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
