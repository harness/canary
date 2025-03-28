import {
  arrayToObjectOutputTransformer,
  IFormDefinition,
  objectToArrayInputTransformer,
  shorthandObjectInputTransformer,
  shorthandObjectOutputTransformer,
  unsetEmptyArrayOutputTransformer,
  unsetEmptyStringOutputTransformer
} from '@harnessio/forms'

import { InputConfigType } from '../form-inputs/types'
import { getContainerPartial } from './partials/container-partial'
import { IInputConfigWithConfig, RUN_TEST_STEP_IDENTIFIER } from './types'

export const RUN_TEST_STEP_DESCRIPTION = 'Run test step description.'

const inputs: IInputConfigWithConfig[] = [
  {
    inputType: 'select',
    path: `${RUN_TEST_STEP_IDENTIFIER}.shell`,
    label: 'Shell',
    inputConfig: {
      options: [
        { label: 'Sh', value: 'sh' },
        { label: 'Bash', value: 'bash' },
        { label: 'Powershell', value: 'powershell' },
        { label: 'Pwsh', value: 'pwsh' },
        { label: 'Python', value: 'python' }
      ]
    }
  },
  {
    inputType: 'textarea',
    path: `${RUN_TEST_STEP_IDENTIFIER}.script`,
    label: 'Script',
    required: true,
    inputTransform: shorthandObjectInputTransformer('run'),
    outputTransform: shorthandObjectOutputTransformer('run')
  },

  {
    inputType: 'array',
    path: `${RUN_TEST_STEP_IDENTIFIER}.match`,
    label: 'Match',
    inputConfig: {
      input: {
        inputType: 'text',
        path: ''
      }
    },
    outputTransform: unsetEmptyArrayOutputTransformer()
  },

  getContainerPartial(RUN_TEST_STEP_IDENTIFIER),

  {
    inputType: 'list',
    path: `${RUN_TEST_STEP_IDENTIFIER}.env`,
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
    inputType: 'boolean',
    path: `${RUN_TEST_STEP_IDENTIFIER}.splitting.disabled`,
    label: 'Text splitting disabled'
  },

  {
    inputType: 'number',
    path: `${RUN_TEST_STEP_IDENTIFIER}.splitting.concurrency`,
    label: 'Text splitting concurrency'
  },

  {
    inputType: 'boolean',
    path: `${RUN_TEST_STEP_IDENTIFIER}.intelligence.disabled`,
    label: 'Text intelligence disabled'
  },
  {
    inputType: 'list',
    path: `${RUN_TEST_STEP_IDENTIFIER}.report`,
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
          label: 'Path'
        }
      ]
    },
    outputTransform: unsetEmptyArrayOutputTransformer()
  }
]

export const runTestStepFormDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
