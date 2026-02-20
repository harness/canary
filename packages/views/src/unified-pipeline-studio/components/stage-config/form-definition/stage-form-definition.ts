import {
  arrayToObjectOutputTransformer,
  IFormDefinition,
  objectToArrayInputTransformer,
  unsetEmptyStringOutputTransformer
} from '@harnessio/forms'

import { InputDefinition } from '../../form-inputs/factory/factory'

const inputs: InputDefinition[] = [
  {
    inputType: 'accordion',
    path: '',
    inputConfig: { autoExpandGroups: true },
    inputs: [
      {
        inputType: 'group',
        path: '',
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
  }
]

// NOTE: basic implementation of stage form for open source
export const basicStageFormDefinition: IFormDefinition<InputDefinition> = {
  inputs
}
