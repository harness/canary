import { IFormDefinition, unsetEmptyStringOutputTransformer } from '@harnessio/forms'

import { InputDefinition } from '../form-inputs/factory/factory'
import { BARRIER_STEP_IDENTIFIER } from './types'

export const BARRIER_STEP_DESCRIPTION = 'Barrier step description.'

const inputs: InputDefinition[] = [
  {
    inputType: 'text',
    path: `${BARRIER_STEP_IDENTIFIER}.name`,
    label: 'Barrier name',
    outputTransform: unsetEmptyStringOutputTransformer()
  }
]

export const barrierStepFormDefinition: IFormDefinition<InputDefinition> = {
  inputs
}
