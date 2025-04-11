import { LogoNameMap } from '@components/logo'

import { FieldValues, IFormDefinition, IInputDefinition } from '@harnessio/forms'

import { BaseEntityProps } from '../../views/platform/types'
import { InputConfigType } from '../../views/unified-pipeline-studio/components/form-inputs/types'

export type IInputConfigWithConfigInterface = IInputDefinition & InputConfigType

export interface onSubmitConnectorProps {
  values: FieldValues
  connector: ConnectorEntity
  intent: EntityIntent
}

export type ConnectorEntity<T = any> = {
  type: string
  name?: string
  spec: T
  description?: string
  tags?: string[]
}

export type AnyConnectorDefinition<T = string> = {
  type: T
  name: string
  category: string
  formDefinition: IFormDefinition<InputConfigType>
  icon: keyof typeof LogoNameMap
}

// Base interfaces
export interface ConnectorSpec {
  auth?: AuthenticationSpec
  delegateSelectors?: string[]
  ignoreTestConnection?: boolean
}

export interface AuthenticationSpec {
  type: string
}

// Base connector configuration
export interface ConnectorPayloadConfig<T extends ConnectorSpec = ConnectorSpec> {
  name: string
  description?: string
  projectIdentifier?: string
  orgIdentifier?: string
  identifier: string
  tags?: string[]
  type: string
  spec: T
}
export interface ConnectorConfigDTO {
  [key: string]: any
}

export interface ConnectorFields {
  name: string
  identifier: string
  description?: string
  accountIdentifier?: string
  orgIdentifier?: string
  projectIdentifier?: string
  tags?: {
    [key: string]: string
  }
  spec: ConnectorConfigDTO
  type: ConnectorConfigType
}

export type ConnectorConfigType =
  | 'K8sCluster'
  | 'Git'
  | 'Splunk'
  | 'AppDynamics'
  | 'Prometheus'
  | 'Dynatrace'
  | 'Vault'
  | 'AzureKeyVault'
  | 'DockerRegistry'
  | 'Local'
  | 'AwsKms'
  | 'GcpKms'
  | 'AwsSecretManager'
  | 'Gcp'
  | 'Aws'
  | 'Azure'
  | 'Artifactory'
  | 'Jira'
  | 'Nexus'
  | 'Github'
  | 'Gitlab'
  | 'Bitbucket'
  | 'Codecommit'
  | 'CEAws'
  | 'CEAzure'
  | 'GcpCloudCost'
  | 'CEK8sCluster'
  | 'HttpHelmRepo'
  | 'NewRelic'
  | 'Datadog'
  | 'SumoLogic'
  | 'PagerDuty'
  | 'CustomHealth'
  | 'ServiceNow'
  | 'ErrorTracking'
  | 'Pdc'
  | 'AzureRepo'
  | 'Jenkins'
  | 'OciHelmRepo'
  | 'CustomSecretManager'
  | 'ElasticSearch'
  | 'GcpSecretManager'
  | 'AzureArtifacts'
  | 'Tas'
  | 'Spot'
  | 'Bamboo'
  | 'TerraformCloud'
  | 'SignalFX'
  | 'Harness'
  | 'Rancher'
  | 'JDBC'
  | 'Zoom'
  | 'MsTeams'
  | 'Slack'
  | 'Confluence'

export interface ConnectorItem extends BaseEntityProps {
  connector?: ConnectorFields
  createdAt?: number
  lastModifiedAt?: number
}

export enum ConnectorSelectionType {
  NEW = 'new',
  EXISTING = 'existing'
}

export enum EntityIntent {
  CREATE = 'create',
  EDIT = 'edit'
}

export const connectorRefFilters = {
  success: 'Success',
  all: 'All connectors'
}
