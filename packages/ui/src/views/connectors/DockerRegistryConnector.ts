import { ConnectorPayloadBuilder, ConnectorSpec, getConnectorBuilder } from './ConnectorPayloadBuilder'

// Docker Registry specific types
export interface DockerAuthSpec {
  type: 'UsernamePassword' | 'Anonymous'
  username?: string
  usernameRef?: string
  passwordRef?: string
}

export interface DockerRegistrySpec extends ConnectorSpec {
  dockerRegistryUrl: string
  providerType: 'DockerHub' | 'Harbor' | 'Quay' | 'Other'
  auth?: {
    type: 'UsernamePassword' | 'Anonymous'
    spec?: DockerAuthSpec
  }
  delegateSelectors?: string[]
  executeOnDelegate?: boolean
  proxy?: boolean
}

// Get the builder with schema-based validation
export const dockerRegistryConnectorBuilder: ConnectorPayloadBuilder<DockerRegistrySpec> =
  getConnectorBuilder<DockerRegistrySpec>('DockerRegistry')
