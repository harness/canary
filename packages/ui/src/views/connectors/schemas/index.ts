import { ConnectorSpec, registerConnectorSchema } from '../ConnectorPayloadBuilder'
import { AWS_KMS_CONNECTOR_IDENTIFIER, GitAPIAuthTypes, GitAuthTypes, GitConnectionType } from '../types'
// Initialize schemas immediately
import './registerSchemas'

// Export all types and schemas
export * from './registerSchemas'

// Type definitions for connectors
export interface GithubAuthSpec {
  type: GitAuthTypes | 'SSH'
  username?: string
  tokenRef?: string
  passwordRef?: string
  refreshTokenRef?: string
  installationId?: string
  installationIdRef?: string
  applicationId?: string
  applicationIdRef?: string
  privateKeyRef?: string
  sshKeyRef?: string
}

export interface GithubApiSpec {
  clientId?: string
  clientSecret?: string
  tokenRef?: string
  installationId?: string
  applicationId?: string
  privateKeyRef?: string
}

export interface GithubConnectorSpec extends ConnectorSpec {
  type: string
  url: string
  validationRepo?: string
  authentication: {
    type: typeof GitConnectionType
    spec: GithubAuthSpec
  }
  apiAccess?: {
    type: typeof GitAPIAuthTypes
    spec: GithubApiSpec
  }
  proxy?: boolean
  executeOnDelegate: boolean
}

export interface AwsKmsSpec {
  credential: {
    type: 'ManualConfig' | 'AssumeIAMRole' | 'AssumeRoleSTS' | 'DELEGATE_OIDC'
    spec?: {
      accessKey?: string
      secretKey?: string
      delegateSelectors?: string[]
      roleArn?: string
      externalName?: string
      assumeStsRoleDuration?: number
      iamRoleArn?: string
    }
  }
  kmsArn: string
  region: string
  default?: boolean
  executeOnDelegate?: boolean
  delegateSelectors?: string[]
}

// Schema definitions

// GitHub Connector Schema
export const githubSchema = {
  type: 'object',
  properties: {
    type: { type: 'string' },
    url: { type: 'string' },
    validationRepo: { type: 'string' },
    authentication: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: Object.values(GitConnectionType) },
        spec: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: [...Object.values(GitAuthTypes), 'SSH'] },
            username: { type: 'string' },
            tokenRef: { type: 'string' },
            passwordRef: { type: 'string' },
            refreshTokenRef: { type: 'string' },
            installationId: { type: 'string' },
            installationIdRef: { type: 'string' },
            applicationId: { type: 'string' },
            applicationIdRef: { type: 'string' },
            privateKeyRef: { type: 'string' },
            sshKeyRef: { type: 'string' }
          }
        }
      },
      required: ['type', 'spec']
    },
    apiAccess: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: Object.values(GitAPIAuthTypes) },
        spec: {
          type: 'object',
          properties: {
            clientId: { type: 'string' },
            clientSecret: { type: 'string' },
            tokenRef: { type: 'string' },
            installationId: { type: 'string' },
            applicationId: { type: 'string' },
            privateKeyRef: { type: 'string' }
          }
        }
      },
      required: ['type', 'spec']
    },
    proxy: { type: 'boolean' },
    executeOnDelegate: { type: 'boolean' },
    delegateSelectors: {
      type: 'array',
      items: { type: 'string' }
    }
  },
  required: ['type', 'url', 'authentication']
}

// AWS KMS Connector Schema
export const awsKmsSchema = {
  type: 'object',
  properties: {
    credential: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['ManualConfig', 'AssumeIAMRole', 'AssumeRoleSTS', 'DELEGATE_OIDC']
        },
        spec: {
          type: 'object',
          properties: {
            accessKey: { type: 'string' },
            secretKey: { type: 'string' },
            delegateSelectors: {
              type: 'array',
              items: { type: 'string' }
            },
            roleArn: { type: 'string' },
            externalName: { type: 'string' },
            assumeStsRoleDuration: { type: 'number' },
            iamRoleArn: { type: 'string' }
          }
        }
      },
      required: ['type']
    },
    kmsArn: { type: 'string' },
    region: { type: 'string' },
    default: { type: 'boolean' },
    executeOnDelegate: { type: 'boolean' },
    delegateSelectors: {
      type: 'array',
      items: { type: 'string' }
    }
  },
  required: ['credential', 'kmsArn', 'region']
}

// Docker Registry Connector Schema
export const dockerRegistrySchema = {
  type: 'object',
  properties: {
    dockerRegistryUrl: { type: 'string' },
    providerType: {
      type: 'string',
      enum: ['DockerHub', 'Harbor', 'Quay', 'Other']
    },
    auth: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['UsernamePassword', 'Anonymous']
        },
        spec: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            usernameRef: { type: 'string' },
            passwordRef: { type: 'string' }
          }
        }
      }
    },
    delegateSelectors: {
      type: 'array',
      items: { type: 'string' }
    },
    executeOnDelegate: { type: 'boolean' },
    proxy: { type: 'boolean' }
  },
  required: ['dockerRegistryUrl', 'providerType']
}

// Register all schemas
export const registerAllSchemas = () => {
  // Register AWS KMS schema
  registerConnectorSchema(AWS_KMS_CONNECTOR_IDENTIFIER, awsKmsSchema)
  // Register other schemas
  registerConnectorSchema('Github', githubSchema)
  registerConnectorSchema('DockerRegistry', dockerRegistrySchema)
}

// Initialize schemas immediately
registerAllSchemas()

export default registerAllSchemas
