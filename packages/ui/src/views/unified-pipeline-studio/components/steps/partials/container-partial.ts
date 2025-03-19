import {
  arrayToObjectOutputTransformer,
  objectToArrayInputTransformer,
  shorthandArrayInputTransformer,
  shorthandArrayOutputTransformer,
  unsetEmptyArrayOutputTransformer,
  unsetEmptyObjectOutputTransformer,
  unsetEmptyStringOutputTransformer
} from '@harnessio/forms'

import { IInputConfigWithConfig } from '../types'

export const getContainerPartial = (stepIdentifier: 'run' | 'run-test'): IInputConfigWithConfig => ({
  inputType: 'group',
  path: `${stepIdentifier}.container`,
  label: 'Container',
  inputs: [
    {
      inputType: 'text',
      path: `${stepIdentifier}.container.image`,
      label: 'Image',
      outputTransform: unsetEmptyStringOutputTransformer()
    },
    {
      inputType: 'text',
      path: `${stepIdentifier}.container.connector`,
      label: 'Connector',
      outputTransform: unsetEmptyStringOutputTransformer()
    },
    {
      inputType: 'group',
      path: `${stepIdentifier}.container.credentials`,
      label: 'Credentials',
      inputs: [
        {
          inputType: 'text',
          path: `${stepIdentifier}.container.credentials.username`,
          label: 'Username',
          outputTransform: unsetEmptyStringOutputTransformer()
        },
        {
          inputType: 'text',
          path: `${stepIdentifier}.container.credentials.password`,
          label: 'Password',
          outputTransform: unsetEmptyStringOutputTransformer()
        }
      ],
      outputTransform: unsetEmptyObjectOutputTransformer()
    },
    {
      inputType: 'select',
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
      inputType: 'array',
      path: `${stepIdentifier}.container.entrypoint`,
      label: 'Entrypoint',
      inputConfig: {
        input: {
          inputType: 'text',
          path: ''
        }
      },
      inputTransform: shorthandArrayInputTransformer(`${stepIdentifier}.container.entrypoint`),
      outputTransform: shorthandArrayOutputTransformer(`${stepIdentifier}.container.entrypoint`, { unsetIfEmpty: true })
    },
    {
      inputType: 'array',
      path: `${stepIdentifier}.container.args`,
      label: 'Args',
      inputConfig: {
        input: {
          inputType: 'text',
          path: ''
        }
      },
      inputTransform: shorthandArrayInputTransformer(`${stepIdentifier}.container.args`),
      outputTransform: shorthandArrayOutputTransformer(`${stepIdentifier}.container.args`, { unsetIfEmpty: true })
    },
    {
      inputType: 'array',
      path: `${stepIdentifier}.container.dns`,
      label: 'DNS',
      inputConfig: {
        input: {
          inputType: 'text',
          path: ''
        }
      },
      inputTransform: shorthandArrayInputTransformer(`${stepIdentifier}.container.dns`),
      outputTransform: shorthandArrayOutputTransformer(`${stepIdentifier}.container.dns`, { unsetIfEmpty: true })
    },
    {
      inputType: 'list',
      path: `${stepIdentifier}.container.env`,
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
      inputType: 'array',
      path: `${stepIdentifier}.container.extra-hosts`,
      label: 'Extra hosts',
      inputConfig: {
        input: {
          inputType: 'text',
          path: ''
        }
      },
      inputTransform: shorthandArrayInputTransformer(`${stepIdentifier}.container.extra-hosts`),
      outputTransform: shorthandArrayOutputTransformer(`${stepIdentifier}.container.extra-hosts`, {
        unsetIfEmpty: true
      })
    },
    {
      inputType: 'text',
      path: `${stepIdentifier}.container.network`,
      label: 'Network',
      outputTransform: unsetEmptyStringOutputTransformer()
    },
    {
      inputType: 'text',
      path: `${stepIdentifier}.container.network-mode`,
      label: 'Network mode',
      outputTransform: unsetEmptyStringOutputTransformer()
    },
    {
      inputType: 'boolean',
      path: `${stepIdentifier}.container.privileged`,
      label: 'Privileged'
    },
    {
      inputType: 'text',
      path: `${stepIdentifier}.container.workdir`,
      label: 'Workdir',
      outputTransform: unsetEmptyStringOutputTransformer()
    },
    {
      inputType: 'array',
      path: `${stepIdentifier}.container.ports`,
      label: 'Ports',
      inputConfig: {
        input: {
          inputType: 'text',
          path: ''
        }
      },
      outputTransform: unsetEmptyArrayOutputTransformer()
    },
    {
      inputType: 'list',
      path: `${stepIdentifier}.container.volumes`,
      label: 'Volumes',
      inputConfig: {
        layout: 'grid',
        inputs: [
          {
            inputType: 'text',
            relativePath: 'source',
            label: 'Source',
            outputTransform: unsetEmptyStringOutputTransformer()
          },
          {
            inputType: 'text',
            relativePath: 'target',
            label: 'Target',
            outputTransform: unsetEmptyStringOutputTransformer()
          }
        ]
      },
      outputTransform: unsetEmptyArrayOutputTransformer()
    },
    {
      inputType: 'text',
      path: `${stepIdentifier}.container.user`,
      label: 'User',
      outputTransform: unsetEmptyStringOutputTransformer()
    },
    {
      inputType: 'text',
      path: `${stepIdentifier}.container.group`,
      label: 'Group',
      outputTransform: unsetEmptyStringOutputTransformer()
    },
    {
      inputType: 'text',
      path: `${stepIdentifier}.container.cpu`,
      label: 'Cpu',
      outputTransform: unsetEmptyStringOutputTransformer()
    },
    {
      inputType: 'text',
      path: `${stepIdentifier}.container.memory`,
      label: 'Memory',
      outputTransform: unsetEmptyStringOutputTransformer()
    },
    {
      inputType: 'text',
      path: `${stepIdentifier}.container.shm-size`,
      label: 'Shm size',
      outputTransform: unsetEmptyStringOutputTransformer()
    }
  ],
  outputTransform: unsetEmptyObjectOutputTransformer()
})
