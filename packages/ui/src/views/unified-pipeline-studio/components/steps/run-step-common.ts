import {
  arrayToObjectOutputTransformer,
  IFormDefinition,
  objectToArrayInputTransformer,
  shorthandObjectInputTransformer,
  shorthandObjectOutputTransformer,
  unsetEmptyArrayOutputTransformer,
  unsetEmptyStringOutputTransformer
} from '@harnessio/forms'

import { InputDefinition } from '../form-inputs/factory/factory'
import { getContainerPartial } from './partials/container-partial'
import { BACKGROUND_STEP_IDENTIFIER, RUN_STEP_IDENTIFIER, RUN_TEST_STEP_IDENTIFIER } from './types'

export type RUN_STEP_FAMILY =
  | typeof RUN_STEP_IDENTIFIER
  | typeof RUN_TEST_STEP_IDENTIFIER
  | typeof BACKGROUND_STEP_IDENTIFIER

const getInputs = (propertyName: RUN_STEP_FAMILY): InputDefinition[] => [
  {
    inputType: 'select',
    path: `${propertyName}.shell`,
    label: 'Shell',
    inputConfig: {
      options: [
        { label: 'Sh', value: 'sh' },
        { label: 'Bash', value: 'bash' },
        { label: 'Powershell', value: 'powershell' },
        { label: 'Pwsh', value: 'pwsh' },
        { label: 'Python', value: 'python' }
      ],
      allowedValueTypes: ['fixed', 'runtime', 'expression']
    }
  },
  {
    inputType: 'textarea',
    path: `${propertyName}.script`,
    label: 'Script',
    required: true,
    inputTransform: shorthandObjectInputTransformer('run'),
    outputTransform: shorthandObjectOutputTransformer('run'),
    inputConfig: {
      allowedValueTypes: ['fixed', 'runtime', 'expression']
    }
  },
  getContainerPartial(propertyName),
  {
    inputType: 'list',
    path: `${propertyName}.env`,
    label: 'Environment',
    inputConfig: {
      layout: 'grid',
      inputs: [
        {
          inputType: 'text',
          relativePath: 'key',
          label: 'Key',
          outputTransform: unsetEmptyStringOutputTransformer()
        },
        {
          inputType: 'text',
          relativePath: 'value',
          label: 'Value',
          outputTransform: unsetEmptyStringOutputTransformer()
        }
      ]
    },
    inputTransform: objectToArrayInputTransformer(),
    outputTransform: arrayToObjectOutputTransformer({ unsetIfEmpty: true })
  },
  {
    inputType: 'list',
    path: `${propertyName}.report`,
    label: 'Report',
    description: 'Report uploads reports at the provided paths',
    inputConfig: {
      layout: 'grid',
      inputs: [
        {
          inputType: 'select',
          relativePath: 'type',
          label: 'Type',
          inputConfig: {
            options: [
              { label: 'junit', value: 'junit' },
              { label: 'xunit', value: 'xunit' },
              { label: 'nunit', value: 'nunit' }
            ]
          }
        },
        {
          inputType: 'text',
          relativePath: 'path',
          label: 'Path',
          inputConfig: {
            allowedValueTypes: ['fixed', 'runtime', 'expression']
          }
        }
      ],
      allowedValueTypes: ['fixed', 'runtime', 'expression']
    },
    outputTransform: unsetEmptyArrayOutputTransformer()
  }
]

export const getRunStepFormDefinition = (propertyName: RUN_STEP_FAMILY): IFormDefinition<InputDefinition> => {
  return { inputs: getInputs(propertyName) }
}
