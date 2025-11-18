import { IFormDefinition } from '@harnessio/forms'

import { InputDefinition } from '../../form-inputs/factory/factory'

export type HarnessStepGroup = {
  identifier: string
  description: string
  formDefinition: IFormDefinition<InputDefinition>
}
