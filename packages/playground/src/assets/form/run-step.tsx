import {
  IFormDefinition,
  IInputDefinition,
  arrayToObjectOutputTransformer,
  objectToArrayInputTransformer,
  shorthandArrayInputTransformer,
  shorthandArrayOutputTransformer,
  shorthandObjectInputTransformer,
  shorthandObjectOutputTransformer,
  unsetEmptyArrayOutputTransformer,
  unsetEmptyObjectOutputTransformer,
  unsetEmptyStringOutputTransformer
} from '@harnessio/forms'
import { InputConfigType, InputType } from '../../components/form-inputs/types'

type IInputConfigWithConfig = IInputDefinition & InputConfigType

const inputs: IInputConfigWithConfig[] = [
  {
    inputType: InputType.text,
    path: 'name',
    label: 'Name',
    outputTransform: unsetEmptyStringOutputTransformer()
  },
  {
    inputType: InputType.select,
    path: 'run.shell',
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
    path: 'run.script',
    label: 'Script',
    required: true,
    inputTransform: shorthandObjectInputTransformer('run'),
    outputTransform: shorthandObjectOutputTransformer('run')
  },
  {
    inputType: InputType.group,
    path: 'run.container',
    label: 'Container',
    inputs: [
      {
        inputType: InputType.text,
        path: 'run.container.image',
        label: 'Image',
        outputTransform: unsetEmptyStringOutputTransformer()
      },
      {
        inputType: InputType.text,
        path: 'run.container.connector',
        label: 'Connector',
        outputTransform: unsetEmptyStringOutputTransformer()
      },
      {
        inputType: InputType.group,
        path: 'run.container.credentials',
        label: 'Credentials',
        inputs: [
          {
            inputType: InputType.text,
            path: 'run.container.credentials.username',
            label: 'Username',
            outputTransform: unsetEmptyStringOutputTransformer()
          },
          {
            inputType: InputType.text,
            path: 'run.container.credentials.password',
            label: 'Password',
            outputTransform: unsetEmptyStringOutputTransformer()
          }
        ],
        outputTransform: unsetEmptyObjectOutputTransformer()
      },
      {
        inputType: InputType.select,
        path: 'run.container.pull',
        label: 'Pull',
        inputConfig: {
          options: [
            { label: 'Always', value: 'always' },
            { label: 'Never', value: 'never' },
            { label: 'If not exists', value: 'if-not-exists' }
          ]
        }
      },
      {
        inputType: InputType.array,
        path: 'run.container.entrypoint',
        label: 'Entrypoint',
        inputConfig: {
          input: {
            inputType: InputType.text,
            path: ''
          }
        },
        inputTransform: shorthandArrayInputTransformer('run.container.entrypoint'),
        outputTransform: shorthandArrayOutputTransformer('run.container.entrypoint', { unsetIfEmpty: true })
      },
      {
        inputType: InputType.array,
        path: 'run.container.args',
        label: 'Args',
        inputConfig: {
          input: {
            inputType: InputType.text,
            path: ''
          }
        },
        inputTransform: shorthandArrayInputTransformer('run.container.args'),
        outputTransform: shorthandArrayOutputTransformer('run.container.args', { unsetIfEmpty: true })
      },
      {
        inputType: InputType.array,
        path: 'run.container.dns',
        label: 'DNS',
        inputConfig: {
          input: {
            inputType: InputType.text,
            path: ''
          }
        },
        inputTransform: shorthandArrayInputTransformer('run.container.dns'),
        outputTransform: shorthandArrayOutputTransformer('run.container.dns', { unsetIfEmpty: true })
      },
      {
        inputType: InputType.list,
        path: 'run.container.env',
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
        inputType: InputType.array,
        path: 'run.container.extra-hosts',
        label: 'Extra hosts',
        inputConfig: {
          input: {
            inputType: InputType.text,
            path: ''
          }
        },
        inputTransform: shorthandArrayInputTransformer('run.container.extra-hosts'),
        outputTransform: shorthandArrayOutputTransformer('run.container.extra-hosts', { unsetIfEmpty: true })
      },
      {
        inputType: InputType.text,
        path: 'run.container.network',
        label: 'Network',
        outputTransform: unsetEmptyStringOutputTransformer()
      },
      {
        inputType: InputType.text,
        path: 'run.container.network-mode',
        label: 'Network mode',
        outputTransform: unsetEmptyStringOutputTransformer()
      },
      {
        inputType: InputType.boolean,
        path: 'run.container.privileged',
        label: 'Privileged'
      },
      {
        inputType: InputType.text,
        path: 'run.container.workdir',
        label: 'Workdir',
        outputTransform: unsetEmptyStringOutputTransformer()
      },
      {
        inputType: InputType.array,
        path: 'run.container.ports',
        label: 'Ports',
        inputConfig: {
          input: {
            inputType: InputType.text,
            path: ''
          }
        },
        outputTransform: unsetEmptyArrayOutputTransformer()
      },
      {
        inputType: InputType.list,
        path: 'run.container.volumes',
        label: 'Volumes',
        inputConfig: {
          layout: 'grid',
          inputs: [
            {
              inputType: InputType.text,
              relativePath: 'source',
              label: 'Source',
              outputTransform: unsetEmptyStringOutputTransformer()
            },
            {
              inputType: InputType.text,
              relativePath: 'target',
              label: 'Target',
              outputTransform: unsetEmptyStringOutputTransformer()
            }
          ]
        },
        outputTransform: unsetEmptyArrayOutputTransformer()
      },
      {
        inputType: InputType.text,
        path: 'run.container.user',
        label: 'User',
        outputTransform: unsetEmptyStringOutputTransformer()
      },
      {
        inputType: InputType.text,
        path: 'run.container.group',
        label: 'Group',
        outputTransform: unsetEmptyStringOutputTransformer()
      },
      {
        inputType: InputType.text,
        path: 'run.container.cpu',
        label: 'Cpu',
        outputTransform: unsetEmptyStringOutputTransformer()
      },
      {
        inputType: InputType.text,
        path: 'run.container.memory',
        label: 'Memory',
        outputTransform: unsetEmptyStringOutputTransformer()
      },
      {
        inputType: InputType.text,
        path: 'run.container.shm-size',
        label: 'Shm size',
        outputTransform: unsetEmptyStringOutputTransformer()
      }
    ],
    outputTransform: unsetEmptyObjectOutputTransformer()
  },
  {
    inputType: InputType.list,
    path: 'run.env',
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
    inputType: InputType.list,
    path: 'run.report',
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

export const runStepFormDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
export const RUN_STEP_IDENTIFIER = 'run'
export const RUN_STEP_DESCRIPTION =
  'Execute scripts in the shell session. The scripts can be executed on the pod/instance running a Harness Delegate or on a remote host in the infrastructure.'
