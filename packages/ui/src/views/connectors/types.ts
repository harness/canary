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
  tags?: Record<string, string>
}

export type AnyConnectorDefinition<T = ConnectorConfigType> = {
  type: T
  name: string
  category: string
  formDefinition: IFormDefinition<InputConfigType>
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
  | 'Terraform'
  | 'AwsKms'

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
  all: 'All connectors',
  AppDynamics: 'AppDynamics',
  Artifactory: 'Artifactory',
  Aws: 'AWS',
  AwsKms: 'AWS KMS',
  AwsSecretManager: 'AWS Secret Manager',
  Azure: 'Azure',
  AzureArtifacts: 'Azure Artifacts',
  AzureKeyVault: 'Azure Key Vault',
  AzureRepo: 'Azure Repo',
  Bamboo: 'Bamboo',
  Bitbucket: 'Bitbucket',
  CEAws: 'AWS Cloud Cost',
  CEAzure: 'Azure Cloud Cost',
  CEK8sCluster: 'Kubernetes Cloud Cost',
  Codecommit: 'AWS CodeCommit',
  Confluence: 'Confluence',
  CustomHealth: 'Custom Health',
  CustomSecretManager: 'Custom Secret Manager',
  Datadog: 'Datadog',
  DockerRegistry: 'Docker Registry',
  Dynatrace: 'Dynatrace',
  ElasticSearch: 'Elasticsearch',
  ErrorTracking: 'Error Tracking',
  Gcp: 'Google Cloud',
  GcpCloudCost: 'GCP Cloud Cost',
  GcpKms: 'GCP KMS',
  GcpSecretManager: 'GCP Secret Manager',
  Git: 'Git',
  Github: 'GitHub',
  Gitlab: 'GitLab',
  Harness: 'Harness',
  HttpHelmRepo: 'HTTP Helm Repository',
  JDBC: 'JDBC',
  Jenkins: 'Jenkins',
  Jira: 'Jira',
  K8sCluster: 'Kubernetes',
  Local: 'Local',
  MsTeams: 'Microsoft Teams',
  NewRelic: 'New Relic',
  Nexus: 'Nexus',
  OciHelmRepo: 'OCI Helm Repository',
  PagerDuty: 'PagerDuty',
  Pdc: 'PDC',
  Prometheus: 'Prometheus',
  Rancher: 'Rancher',
  ServiceNow: 'ServiceNow',
  SignalFX: 'SignalFX',
  Slack: 'Slack',
  Splunk: 'Splunk',
  Spot: 'Spot',
  SumoLogic: 'Sumo Logic',
  Tas: 'Tanzu Application Service',
  TerraformCloud: 'Terraform Cloud',
  Vault: 'HashiCorp Vault',
  Zoom: 'Zoom'
}
