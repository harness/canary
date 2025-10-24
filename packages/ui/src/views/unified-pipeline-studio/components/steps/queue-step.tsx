import { IFormDefinition, unsetEmptyStringOutputTransformer } from '@harnessio/forms'

import { InputDefinition } from '../form-inputs/factory/factory'
import { QUEUE_STEP_IDENTIFIER } from './types'

export const QUEUE_STEP_DESCRIPTION = 'Queue step description.'

const inputs: InputDefinition[] = [
  {
    inputType: 'text',
    path: `${QUEUE_STEP_IDENTIFIER}.key`,
    label: 'Key',
    required: true,
    outputTransform: unsetEmptyStringOutputTransformer()
  },
  {
    inputType: 'select',
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

export const queueStepFormDefinition: IFormDefinition<InputDefinition> = {
  inputs
}
