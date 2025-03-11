import { ConnectorSpec, getConnectorBuilder } from './ConnectorPayloadBuilder'

// AWS specific credential types
export interface AwsManualConfigSpec {
  accessKey?: string
  accessKeyRef?: string
  secretKeyRef: string
  region?: string
}

export interface AwsCredential {
  type: 'InheritFromDelegate' | 'ManualConfig' | 'Irsa' | 'OidcAuthentication'
  spec?: AwsManualConfigSpec
}

export interface AwsConnectorSpec extends ConnectorSpec {
  credential: AwsCredential
  delegateSelectors?: string[]
  executeOnDelegate?: boolean
  proxy?: boolean
}

// Get the builder with schema-based validation
export const awsConnectorBuilder = getConnectorBuilder<AwsConnectorSpec>('Aws')
