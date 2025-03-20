import { IInputConfigWithConfigInterface } from '@harnessio/ui/views'

export const getResourcesContainer = (): IInputConfigWithConfigInterface => ({
  inputType: 'group',
  path: `resources`,
  label: 'Resources',
  inputs: [
    {
      inputType: 'text',
      path: `resources.organization`,
      label: 'Organization'
    },
    {
      inputType: 'text',
      path: `resources.repository`,
      label: 'Repository'
    },
    {
      inputType: 'text',
      path: `resources.testRepo`,
      label: 'Test Repository'
    }
  ]
})

export const getCloningContainer = (): IInputConfigWithConfigInterface => ({
  inputType: 'group',
  path: `cloning`,
  label: 'Cloning',
  inputs: [
    {
      inputType: 'text',
      path: `cloning.sshKey`,
      label: 'SSH Key'
    }
  ]
})

export const getConnectionContainer = (): IInputConfigWithConfigInterface => ({
  inputType: 'group',
  path: `connection`,
  label: 'Connection',
  inputs: [
    {
      inputType: 'select',
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
      inputType: 'select',
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
  inputType: 'group',
  path: `metadata`,
  label: 'Metadata',
  inputs: [
    {
      inputType: 'text',
      path: `metadata.description`,
      label: 'Description'
    },
    {
      inputType: 'text',
      path: `metadata.tags`,
      label: 'Tags'
    }
  ]
})
