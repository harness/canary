import { IFormDefinition } from '@harnessio/forms'

import { InputConfigType } from '../../form-inputs/types'

export type HarnessStepGroup = {
  identifier: string
  description: string
  formDefinition: IFormDefinition<InputConfigType>
}
