import { AnySecretDefinition } from '@harnessio/ui/views'

import { secretsFormDefinition } from './secrets-form-schema'

export function getHarnessSecretDefinition(): AnySecretDefinition {
  return {
    formDefinition: {
      ...secretsFormDefinition,
      inputs: secretsFormDefinition?.inputs?.map(input => {
        if (!input) return input

        if (input.inputType === 'group') {
          return {
            ...input,
            inputConfig: {
              ...(input.inputConfig || {}),
              autoExpandGroups: true
            }
          }
        }
        return input
      })
    }
  }
}
