import { IFormDefinition, unsetEmptyStringOutputTransformer } from '@harnessio/forms'

import { InputConfigType, InputType } from '../form-inputs/types'
import { IInputConfigWithConfig, QUEUE_STEP_IDENTIFIER } from './types'

export const QUEUE_STEP_DESCRIPTION = 'Queue step description.'

const inputs: IInputConfigWithConfig[] = [
  {
    inputType: InputType.text,
    path: `${QUEUE_STEP_IDENTIFIER}.key`,
    label: 'Key',
    required: true,
    outputTransform: unsetEmptyStringOutputTransformer()
  },
  {
    inputType: InputType.select,
    path: `${QUEUE_STEP_IDENTIFIER}.scope`,
    label: 'Shell',
    inputConfig: {
      options: [
        { label: 'Pipeline', value: 'pipeline' },
        { label: 'Stage', value: 'stage' }
      ]
    }
  }
]

export const queueStepFormDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
