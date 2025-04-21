import { AnySecretDefinition } from '@harnessio/ui/views'

import { harnessSecretManagerFormDefinition } from './harness-secret-manager-secret'

export const harnessSecrets: AnySecretDefinition[] = [
  {
    type: 'harness-secret-manager',
    name: 'harness-secret-manager',
    formDefinition: harnessSecretManagerFormDefinition,
    icon: 'github'
  }
]
export interface ConnectorDefinitionOptions {
  autoExpandGroups?: boolean
}

export function getHarnessSecretDefinition(type: string, options?: ConnectorDefinitionOptions): any | undefined {
  const secret = harnessSecrets.find(harnessSecret => harnessSecret.type === type)
  return {
    ...secret,
    formDefinition: {
      ...secret?.formDefinition,
      inputs: secret?.formDefinition?.inputs?.map(input => {
        if (!input) return input

        if (input.inputType === 'group') {
          return {
            ...input,
            inputConfig: {
              ...(input.inputConfig || {}),
              autoExpandGroups: options?.autoExpandGroups
            }
          }
        }
        return input
      })
    }
  }
}
