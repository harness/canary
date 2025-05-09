import {
  arrayToObjectOutputTransformer,
  IFormDefinition,
  objectToArrayInputTransformer,
  unsetEmptyStringOutputTransformer
} from '@harnessio/forms'

import { InputConfigType } from '../../form-inputs'
import { IInputConfigWithConfig } from '../../steps/types'

const inputs: IInputConfigWithConfig[] = [
  {
    inputType: 'group',
    path: '',
    label: 'General',
    // TODO: description is not implemented - mock required.
    description: 'Configure the basic settings for your stage. Read documentation to learn more.',
    inputConfig: { autoExpandGroups: true },
    inputs: [
      {
        inputType: 'text',
        path: 'name',
        label: 'Name',
        required: true,
        outputTransform: unsetEmptyStringOutputTransformer()
      }
    ]
  },
  {
    inputType: 'group',
    path: '',
    label: 'Optional configuration',
    inputConfig: { autoExpandGroups: true },
    inputs: [
      {
        inputType: 'text',
        path: 'timeout',
        label: 'Timeout duration',
        default: '10m',
        required: true,
        outputTransform: unsetEmptyStringOutputTransformer()
      },
      {
        inputType: 'list',
        path: `variables`,
        label: 'Stage Variables',
        inputConfig: {
          layout: 'grid',
          inputs: [
            {
              inputType: 'text',
              relativePath: 'key',
              placeholder: 'Variable name',
              required: true,
              outputTransform: unsetEmptyStringOutputTransformer()
            },
            {
              inputType: 'text',
              relativePath: 'value',
              placeholder: 'Variable value',
              outputTransform: unsetEmptyStringOutputTransformer()
            }
          ]
        },
        inputTransform: objectToArrayInputTransformer(),
        outputTransform: arrayToObjectOutputTransformer({ unsetIfEmpty: true })
      }
    ]
  }
]

// NOTE: basic implementation of stage form for open source
export const basicStageFormDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
