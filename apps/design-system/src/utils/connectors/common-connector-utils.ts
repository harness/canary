import { IInputConfigWithConfigInterface } from '@harnessio/ui/views'

export const getResourcesContainer = (): IInputConfigWithConfigInterface => ({
  inputType: 'group',
  path: `resources`,
  label: 'Resources',
  inputs: [
    {
      inputType: 'text',
      path: `resources.organization`,
      label: 'Organization',
      inputConfig: {
        tooltip: 'Limits access to resources in the named organization.'
      }
    },
    {
      inputType: 'text',
      path: `resources.repository`,
      label: 'Repository',
      inputConfig: {
        tooltip: 'Limits access to the named repository.'
      }
    },
    {
      inputType: 'text',
      path: `resources.testRepo`,
      label: 'Test Repository',
      inputConfig: {
        tooltip: 'Check access to this repository when testing the health of this connector.'
      }
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
      label: 'SSH Key',
      inputConfig: {
        tooltip:
          'Repositories are cloned using tokens by default. You can optionall provide an ssh key to override this behavior and clone using git+ssh. '
      }
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
        ],
        tooltip:
          'Route traffic through the Delegate for behind-the-firewall access. You must install the Delegate to use this feature.'
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
        ],
        tooltip:
          'Route traffic through the Harness Secure Tunnel™ for behind-the-firewall access. You must install the Secure Connect client to use this feature'
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
