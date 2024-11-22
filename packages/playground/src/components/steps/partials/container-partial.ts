import {
  arrayToObjectOutputTransformer,
  objectToArrayInputTransformer,
  shorthandArrayInputTransformer,
  shorthandArrayOutputTransformer,
  unsetEmptyArrayOutputTransformer,
  unsetEmptyObjectOutputTransformer,
  unsetEmptyStringOutputTransformer
} from '@harnessio/forms'

import { InputType } from '../../form-inputs/types'
import type { IInputConfigWithConfig } from '../types'

export const getContainerPartial = (stepIdentifier: 'run' | 'run-test'): IInputConfigWithConfig => ({
  inputType: InputType.group,
  path: `${stepIdentifier}.container`,
  label: 'Container',
  inputs: [
    {
      inputType: InputType.text,
      path: `${stepIdentifier}.container.image`,
      label: 'Image',
      outputTransform: unsetEmptyStringOutputTransformer()
    },
    {
      inputType: InputType.text,
      path: `${stepIdentifier}.container.connector`,
      label: 'Connector',
      outputTransform: unsetEmptyStringOutputTransformer()
    },
    {
      inputType: InputType.group,
      path: `${stepIdentifier}.container.credentials`,
      label: 'Credentials',
      inputs: [
        {
          inputType: InputType.text,
          path: `${stepIdentifier}.container.credentials.username`,
          label: 'Username',
          outputTransform: unsetEmptyStringOutputTransformer()
        },
        {
          inputType: InputType.text,
          path: `${stepIdentifier}.container.credentials.password`,
          label: 'Password',
          outputTransform: unsetEmptyStringOutputTransformer()
        }
      ],
      outputTransform: unsetEmptyObjectOutputTransformer()
    },
    {
      inputType: InputType.select,
      path: `${stepIdentifier}.container.pull`,
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
      path: `${stepIdentifier}.container.entrypoint`,
      label: 'Entrypoint',
      inputConfig: {
        input: {
          inputType: InputType.text,
          path: ''
        }
      },
      inputTransform: shorthandArrayInputTransformer(`${stepIdentifier}.container.entrypoint`),
      outputTransform: shorthandArrayOutputTransformer(`${stepIdentifier}.container.entrypoint`, { unsetIfEmpty: true })
    },
    {
      inputType: InputType.array,
      path: `${stepIdentifier}.container.args`,
      label: 'Args',
      inputConfig: {
        input: {
          inputType: InputType.text,
          path: ''
        }
      },
      inputTransform: shorthandArrayInputTransformer(`${stepIdentifier}.container.args`),
      outputTransform: shorthandArrayOutputTransformer(`${stepIdentifier}.container.args`, { unsetIfEmpty: true })
    },
    {
      inputType: InputType.array,
      path: `${stepIdentifier}.container.dns`,
      label: 'DNS',
      inputConfig: {
        input: {
          inputType: InputType.text,
          path: ''
        }
      },
      inputTransform: shorthandArrayInputTransformer(`${stepIdentifier}.container.dns`),
      outputTransform: shorthandArrayOutputTransformer(`${stepIdentifier}.container.dns`, { unsetIfEmpty: true })
    },
    {
      inputType: InputType.list,
      path: `${stepIdentifier}.container.env`,
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
      path: `${stepIdentifier}.container.extra-hosts`,
      label: 'Extra hosts',
      inputConfig: {
        input: {
          inputType: InputType.text,
          path: ''
        }
      },
      inputTransform: shorthandArrayInputTransformer(`${stepIdentifier}.container.extra-hosts`),
      outputTransform: shorthandArrayOutputTransformer(`${stepIdentifier}.container.extra-hosts`, {
        unsetIfEmpty: true
      })
    },
    {
      inputType: InputType.text,
      path: `${stepIdentifier}.container.network`,
      label: 'Network',
      outputTransform: unsetEmptyStringOutputTransformer()
    },
    {
      inputType: InputType.text,
      path: `${stepIdentifier}.container.network-mode`,
      label: 'Network mode',
      outputTransform: unsetEmptyStringOutputTransformer()
    },
    {
      inputType: InputType.boolean,
      path: `${stepIdentifier}.container.privileged`,
      label: 'Privileged'
    },
    {
      inputType: InputType.text,
      path: `${stepIdentifier}.container.workdir`,
      label: 'Workdir',
      outputTransform: unsetEmptyStringOutputTransformer()
    },
    {
      inputType: InputType.array,
      path: `${stepIdentifier}.container.ports`,
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
      path: `${stepIdentifier}.container.volumes`,
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
      path: `${stepIdentifier}.container.user`,
      label: 'User',
      outputTransform: unsetEmptyStringOutputTransformer()
    },
    {
      inputType: InputType.text,
      path: `${stepIdentifier}.container.group`,
      label: 'Group',
      outputTransform: unsetEmptyStringOutputTransformer()
    },
    {
      inputType: InputType.text,
      path: `${stepIdentifier}.container.cpu`,
      label: 'Cpu',
      outputTransform: unsetEmptyStringOutputTransformer()
    },
    {
      inputType: InputType.text,
      path: `${stepIdentifier}.container.memory`,
      label: 'Memory',
      outputTransform: unsetEmptyStringOutputTransformer()
    },
    {
      inputType: InputType.text,
      path: `${stepIdentifier}.container.shm-size`,
      label: 'Shm size',
      outputTransform: unsetEmptyStringOutputTransformer()
    }
  ],
  outputTransform: unsetEmptyObjectOutputTransformer()
})
