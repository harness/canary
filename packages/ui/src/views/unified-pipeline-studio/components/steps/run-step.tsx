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
import { IInputConfigWithConfig, RUN_STEP_IDENTIFIER } from './types'

const RUN_STEP_DESCRIPTION =
  'Execute scripts in the shell session. The scripts can be executed on the pod/instance running a Harness Delegate or on a remote host in the infrastructure.'

const inputs: IInputConfigWithConfig[] = [
  {
    inputType: 'select',
    path: `${RUN_STEP_IDENTIFIER}.shell`,
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
    path: `${RUN_STEP_IDENTIFIER}.script`,
    label: 'Script',
    required: true,
    inputTransform: shorthandObjectInputTransformer('run'),
    outputTransform: shorthandObjectOutputTransformer('run'),
    inputConfig: {
      allowedValueTypes: ['fixed', 'runtime', 'expression']
    }
  },
  getContainerPartial(RUN_STEP_IDENTIFIER),
  {
    inputType: 'list',
    path: `${RUN_STEP_IDENTIFIER}.env`,
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
    path: `${RUN_STEP_IDENTIFIER}.report`,
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

const runStepFormDefinition: IFormDefinition<InputConfigType> = {
  inputs
}

export { RUN_STEP_IDENTIFIER, RUN_STEP_DESCRIPTION, runStepFormDefinition }
