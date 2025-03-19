import { BaseEntityProps } from '@views/platform/types'
import { InputConfigType } from '@views/unified-pipeline-studio/components/form-inputs/types'

import { FieldValues, IFormDefinition, IInputDefinition } from '@harnessio/forms'

export interface ConnectorFields {
  name: string
  identifier: string
  description: string
  accountIdentifier: string
  orgIdentifier: string
  projectIdentifier: string
  tags: Record<string, string>
  type: string
}

export interface ConnectorItem extends BaseEntityProps {
  connector: ConnectorFields
  createdAt: number
  lastModifiedAt: number
}

export enum ConnectorType {
  NEW = 'new',
  EXISTING = 'existing'
}

export type IInputConfigWithConfig = IInputDefinition & InputConfigType
export type IInputConfigWithConfigInterface = IInputDefinition & InputConfigType

export enum ConnectorRightDrawer {
  None = 'none',
  Collection = 'palette',
  Form = 'connectorForm'
}
export interface onSubmitProps {
  values: FieldValues
  formEntity: ConnectorFormEntityType
}

export type HarnessConnectorDefinitionType = AnyConnectorDefinition<HARNESS_CONNECTOR_IDENTIFIER>

export const GITHUB_CONNECTOR_IDENTIFIER = 'Github'
export const TERRAFORM_CONNECTOR_IDENTIFIER = 'Terraform'
export const AWS_KMS_CONNECTOR_IDENTIFIER = 'AWS KMS'

export type ConnectorFormEntityType = {
  type: 'connector'
  data: {
    type: string
    name?: string
    payload?: ConnectorPayloadConfig
  }
}
export type HARNESS_CONNECTOR_IDENTIFIER =
  | typeof Connectors.GITHUB
  | typeof Connectors.TERRAFORM_CLOUD
  | typeof Connectors.AWS_KMS
  | typeof Connectors.DOCKER

export type AnyConnectorDefinition<T = string> = {
  type: T
  name: string
  category: string
  formDefinition: IFormDefinition<InputConfigType>
}

export enum CredTypeValues {
  ManualConfig = 'ManualConfig',
  AssumeIAMRole = 'AssumeIAMRole',
  AssumeRoleSTS = 'AssumeSTSRole',
  PermanentTokenConfig = 'PermanentTokenConfig'
}
export enum DelegateTypes {
  DELEGATE_OIDC = 'DelegateOidc'
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
export interface ConnectorInfoDTO {
  accountIdentifier?: string
  description?: string
  identifier: string
  name: string
  orgIdentifier?: string
  parentUniqueId?: string
  projectIdentifier?: string
  spec: ConnectorConfigDTO
  tags?: {
    [key: string]: string
  }
  type:
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
  uniqueId?: string
}
export interface ConnectorType {
  [key: string]: ConnectorInfoDTO['type']
}
export const Connectors: ConnectorType = {
  KUBERNETES_CLUSTER: 'K8sCluster',
  CUSTOM: 'CustomHealth',
  GIT: 'Git',
  GITHUB: 'Github',
  GITLAB: 'Gitlab',
  BITBUCKET: 'Bitbucket',
  AZURE_REPO: 'AzureRepo',
  AZURE_ARTIFACTS: 'AzureArtifacts',
  VAULT: 'Vault',
  APP_DYNAMICS: 'AppDynamics',
  SPLUNK: 'Splunk',
  DOCKER: 'DockerRegistry',
  GCP: 'Gcp',
  GCP_KMS: 'GcpKms',
  LOCAL: 'Local',
  AWS: 'Aws',
  PDC: 'Pdc',
  AWS_CODECOMMIT: 'Codecommit',
  NEXUS: 'Nexus',
  ARTIFACTORY: 'Artifactory',
  CEAWS: 'CEAws',
  HttpHelmRepo: 'HttpHelmRepo',
  OciHelmRepo: 'OciHelmRepo',
  Jira: 'Jira',
  NEW_RELIC: 'NewRelic',
  AWS_KMS: 'AwsKms',
  PROMETHEUS: 'Prometheus',
  CE_AZURE: 'CEAzure',
  CE_KUBERNETES: 'CEK8sCluster',
  DATADOG: 'Datadog',
  AZURE_KEY_VAULT: 'AzureKeyVault',
  DYNATRACE: 'Dynatrace',
  SUMOLOGIC: 'SumoLogic',
  CE_GCP: 'GcpCloudCost',
  AWS_SECRET_MANAGER: 'AwsSecretManager',
  PAGER_DUTY: 'PagerDuty',
  SERVICE_NOW: 'ServiceNow',
  CUSTOM_HEALTH: 'CustomHealth',
  ERROR_TRACKING: 'ErrorTracking',
  AZURE: 'Azure',
  AWSSECRETMANAGER: 'AwsSecretManager',
  JENKINS: 'Jenkins',
  CUSTOM_SECRET_MANAGER: 'CustomSecretManager',
  ELK: 'ElasticSearch',
  GcpSecretManager: 'GcpSecretManager',
  SPOT: 'Spot',
  TAS: 'Tas',
  TERRAFORM_CLOUD: 'TerraformCloud',
  Bamboo: 'Bamboo',
  SignalFX: 'SignalFX',
  Harness: 'Harness',
  Rancher: 'Rancher',
  JDBC: 'JDBC',
  Zoom: 'Zoom',
  MicrosoftTeams: 'MsTeams',
  Slack: 'Slack',
  Confluence: 'Confluence'
}
