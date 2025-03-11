import { IFormDefinition, unsetEmptyStringOutputTransformer } from '@harnessio/forms'

import { InputConfigType, InputType } from '../form-inputs/types'
import { BARRIER_STEP_IDENTIFIER, IInputConfigWithConfig } from './types'

export const BARRIER_STEP_DESCRIPTION = 'Barrier step description.'

const inputs: IInputConfigWithConfig[] = [
  {
    inputType: InputType.text,
    path: `${BARRIER_STEP_IDENTIFIER}.name`,
    label: 'Barrier name',
    outputTransform: unsetEmptyStringOutputTransformer()
  }
]

export const barrierStepFormDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
