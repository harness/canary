import { InputType } from '@views/unified-pipeline-studio/components/form-inputs/types'

import { IInputConfigWithConfigInterface } from '../types'

export const getResourcesContainer = (): IInputConfigWithConfigInterface => ({
  inputType: InputType.group,
  path: `resources`,
  label: 'Resources',
  inputs: [
    {
      inputType: InputType.text,
      path: `resources.organization`,
      label: 'Organization'
    },
    {
      inputType: InputType.text,
      path: `resources.repository`,
      label: 'Repository'
    },
    {
      inputType: InputType.text,
      path: `resources.testRepo`,
      label: 'Test Repository'
    }
  ]
})

export const getCloningContainer = (): IInputConfigWithConfigInterface => ({
  inputType: InputType.group,
  path: `cloning`,
  label: 'Cloning',
  inputs: [
    {
      inputType: InputType.text,
      path: `cloning.sshKey`,
      label: 'SSH Key'
    }
  ]
})

export const getConnectionContainer = (): IInputConfigWithConfigInterface => ({
  inputType: InputType.group,
  path: `connection`,
  label: 'Connection',
  inputs: [
    {
      inputType: InputType.select,
      path: `connection.delegate`,
      label: 'Delegate',
      inputConfig: {
        options: [
          { label: 'off', value: 'off' },
          { label: 'on', value: 'on' }
        ]
      }
    },
    {
      inputType: InputType.select,
      path: `connection.tunnel`,
      label: 'Secure Tunnel',
      inputConfig: {
        options: [
          { label: 'off', value: 'off' },
          { label: 'on', value: 'on' }
        ]
      }
    }
  ]
})

export const getMetadataContainer = (): IInputConfigWithConfigInterface => ({
  inputType: InputType.group,
  path: `metadata`,
  label: 'Metadata',
  inputs: [
    {
      inputType: InputType.text,
      path: `metadata.description`,
      label: 'Description'
    },
    {
      inputType: InputType.text,
      path: `metadata.tags`,
      label: 'Tags'
    }
  ]
})
