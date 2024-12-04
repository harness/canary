import { IFormDefinition } from '@harnessio/forms'

import { InputConfigType } from '../form-inputs/types'
import { runStepFormDefinition } from './run-step'

export const BACKGROUND_STEP_DESCRIPTION = 'Background step definition.'

export const backgroundStepFormDefinition: IFormDefinition<InputConfigType> = runStepFormDefinition
