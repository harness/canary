import { SecretItem } from '@harnessio/ui/views'

export const accountSecrets: SecretItem[] = [
  {
    id: 'aws-access-key',
    name: 'aws-access-key',
    secret: {
      type: 'SecretText',
      name: 'aws-access-key',
      identifier: 'aws-access-key',
      orgIdentifier: 'default',
      tags: {},
      description: 'AWS access key for deployments',
      spec: {
        secretManagerIdentifier: 'harnessSecretManager',
        valueType: 'Inline',
        value: null,
        additionalMetadata: null
      }
    },
    createdAt: 1710968557986,
    updatedAt: 1710968557986,
    draft: false,
    governanceMetadata: null,
    scope: 'account'
  },
  {
    id: 'github-token',
    name: 'github-token',
    secret: {
      type: 'SecretText',
      name: 'github-token',
      identifier: 'github-token',
      orgIdentifier: 'default',
      tags: {},
      description: 'GitHub token for CI/CD',
      spec: {
        secretManagerIdentifier: 'harnessSecretManager',
        valueType: 'Inline',
        value: null,
        additionalMetadata: null
      }
    },
    createdAt: 1719353653579,
    updatedAt: 1719353653579,
    draft: false,
    governanceMetadata: null,
    scope: 'account'
  }
]

// Example data for Organization scope
export const organizationSecrets: SecretItem[] = [
  {
    id: 'hello',
    name: 'hello',
    secret: {
      type: 'SecretText',
      name: 'hello',
      identifier: 'hello',
      orgIdentifier: 'default',
      projectIdentifier: 'abhinavtest3',
      tags: {},
      description: '',
      spec: {
        secretManagerIdentifier: 'harnessSecretManager',
        valueType: 'Inline',
        value: null,
        additionalMetadata: null
      }
    },
    createdAt: 1741108966918,
    updatedAt: 1741108966918,
    draft: false,
    governanceMetadata: null,
    scope: 'organization'
  },
  {
    id: 'sanskar-test',
    name: 'sanskar-test',
    secret: {
      type: 'SecretText',
      name: 'sanskar-test',
      identifier: 'sanskar-test',
      orgIdentifier: 'default',
      projectIdentifier: 'abhinavtest3',
      tags: {
        tag1: '',
        tag2: '',
        tag3: ''
      },
      description: 'desc',
      spec: {
        secretManagerIdentifier: 'harnessSecretManager',
        valueType: 'Inline',
        value: null,
        additionalMetadata: null
      }
    },
    createdAt: 1740785306341,
    updatedAt: 1740785306341,
    draft: false,
    governanceMetadata: null,
    scope: 'organization'
  },
  {
    id: 'abhinavrastogi-harness',
    name: 'abhinavrastogi-harness',
    secret: {
      type: 'SecretText',
      name: 'abhinavrastogi-harness',
      identifier: 'abhinavrastogi-harness',
      orgIdentifier: 'default',
      projectIdentifier: 'abhinavtest3',
      tags: {},
      description: 'github pat',
      spec: {
        secretManagerIdentifier: 'harnessSecretManager',
        valueType: 'Inline',
        value: null,
        additionalMetadata: null
      }
    },
    createdAt: 1719353653579,
    updatedAt: 1719353653579,
    draft: false,
    governanceMetadata: null,
    scope: 'organization'
  },
  {
    id: 'abhinav-test',
    name: 'abhinav-test',
    secret: {
      type: 'SecretText',
      name: 'abhinav-test',
      identifier: 'abhinavtest',
      orgIdentifier: 'default',
      projectIdentifier: 'abhinavtest3',
      tags: {},
      description: '',
      spec: {
        secretManagerIdentifier: 'harnessSecretManager',
        valueType: 'Inline',
        value: null,
        additionalMetadata: null
      }
    },
    createdAt: 1700005592914,
    updatedAt: 1700005592914,
    draft: false,
    governanceMetadata: null,
    scope: 'organization'
  }
]
