import { IFormDefinition } from '@harnessio/forms'
import { InputDefinition } from '@harnessio/ui/views'

const metadataInputs: InputDefinition[] = [
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

const inputs: InputDefinition[] = [
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
    inputType: 'cards',
    path: `secret.spec.valueType`,
    inputConfig: {
      options: [
        { label: 'Inline Secret Value', value: 'inline', description: '', id: 'inline', title: 'Inline Secret Value' },
        { label: 'Reference Secret', value: 'reference', description: '', id: 'reference', title: 'Reference Secret' }
      ]
    },
    default: 'inline'
  },
  {
    inputType: 'group',
    path: `secret.metadata`,
    label: 'Metadata',
    inputs: metadataInputs,
    inputConfig: {
      autoExpandGroups: true
    }
  },
  {
    inputType: 'calendar',
    path: `secret.spec.expiryDate`,
    label: 'Expiry Date'
  }
]

export const secretsFormDefinition: IFormDefinition<InputDefinition> = {
  inputs
}
