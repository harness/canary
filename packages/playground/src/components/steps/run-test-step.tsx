import {
  arrayToObjectOutputTransformer,
  IFormDefinition,
  objectToArrayInputTransformer,
  shorthandObjectInputTransformer,
  shorthandObjectOutputTransformer,
  unsetEmptyArrayOutputTransformer,
  unsetEmptyStringOutputTransformer
} from '@harnessio/forms'

import { InputConfigType, InputType } from '../form-inputs/types'
import { getContainerPartial } from './partials/container-partial'
import { RUN_TEST_STEP_IDENTIFIER, type IInputConfigWithConfig } from './types'

export const RUN_TEST_STEP_DESCRIPTION = 'Run test step description.'

const inputs: IInputConfigWithConfig[] = [
  {
    inputType: InputType.select,
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
    inputType: InputType.textarea,
    path: `${RUN_TEST_STEP_IDENTIFIER}.script`,
    label: 'Script',
    required: true,
    inputTransform: shorthandObjectInputTransformer('run'),
    outputTransform: shorthandObjectOutputTransformer('run')
  },

  {
    inputType: InputType.array,
    path: `${RUN_TEST_STEP_IDENTIFIER}.match`,
    label: 'Match',
    inputConfig: {
      input: {
        inputType: InputType.text,
        path: ''
      }
    },
    outputTransform: unsetEmptyArrayOutputTransformer()
  },

  getContainerPartial(RUN_TEST_STEP_IDENTIFIER),

  {
    inputType: InputType.list,
    path: `${RUN_TEST_STEP_IDENTIFIER}.env`,
    label: 'Environment',
    inputConfig: {
      layout: 'grid',
      inputs: [
        {
          inputType: InputType.text,
          relativePath: 'key',
          label: 'Key',
          outputTransform: unsetEmptyStringOutputTransformer()
        },
        {
          inputType: InputType.text,
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
    inputType: InputType.boolean,
    path: `${RUN_TEST_STEP_IDENTIFIER}.splitting.disabled`,
    label: 'Text splitting disabled'
  },

  {
    inputType: InputType.number,
    path: `${RUN_TEST_STEP_IDENTIFIER}.splitting.concurrency`,
    label: 'Text splitting concurrency'
  },

  {
    inputType: InputType.boolean,
    path: `${RUN_TEST_STEP_IDENTIFIER}.intelligence.disabled`,
    label: 'Text intelligence disabled'
  },
  {
    inputType: InputType.list,
    path: `${RUN_TEST_STEP_IDENTIFIER}.report`,
    label: 'Report',
    description: 'Report uploads reports at the provided paths',
    inputConfig: {
      layout: 'grid',
      inputs: [
        {
          inputType: InputType.select,
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
          inputType: InputType.text,
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
