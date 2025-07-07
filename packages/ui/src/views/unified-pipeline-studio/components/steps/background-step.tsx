import { IFormDefinition } from '@harnessio/forms'

import { InputConfigType } from '../form-inputs/types'
import { getRunStepFormDefinition } from './run-step-common'
import { BACKGROUND_STEP_IDENTIFIER } from './types'

const BACKGROUND_STEP_DESCRIPTION = 'Background step definition.'

const backgroundStepFormDefinition: IFormDefinition<InputConfigType> =
  getRunStepFormDefinition(BACKGROUND_STEP_IDENTIFIER)

export { BACKGROUND_STEP_IDENTIFIER, BACKGROUND_STEP_DESCRIPTION, backgroundStepFormDefinition }
