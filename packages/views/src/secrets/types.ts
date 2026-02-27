import { EntityIntent } from '@harnessio/ui/types'

import { FieldValues } from '@harnessio/forms'

// Re-export from UI for backward compatibility
export { EntityIntent, SecretCreationType, SecretType, secretsFilterTypes } from '@harnessio/ui/types'
export type { SecretData, SecretItem, SecretListItem, SecretDataType } from '@harnessio/ui/types'

export interface onSubmitSecretProps {
  values: FieldValues
  intent: EntityIntent
}
