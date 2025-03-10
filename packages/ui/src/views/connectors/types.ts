import { BaseEntityProps } from '@views/platform/types'
import { InputConfigType } from '@views/unified-pipeline-studio/components/form-inputs/types'

import { IFormDefinition, IInputDefinition } from '@harnessio/forms'

import { ConnectorPayloadConfig } from './ConnectorPayloadBuilder'

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

export const GITHUB_CONNECTOR_IDENTIFIER = 'Github Connector'
export const TERRAFORM_CONNECTOR_IDENTIFIER = 'Terraform Connector'
export const AWS_KMS_CONNECTOR_IDENTIFIER = 'AWS KMS Connector'

export type HARNESS_CONNECTOR_IDENTIFIER =
  | typeof GITHUB_CONNECTOR_IDENTIFIER
  | typeof TERRAFORM_CONNECTOR_IDENTIFIER
  | typeof AWS_KMS_CONNECTOR_IDENTIFIER

// Interface for connector payload converters
export interface ConnectorPayloadConverter {
  identifier: HARNESS_CONNECTOR_IDENTIFIER
  convertToFormData: (payload: ConnectorPayloadConfig) => Record<string, any>
  formDefinition: IFormDefinition<InputConfigType>
}

// Factory function to create a connector payload converter
export const createConnectorPayloadConverter = (
  identifier: HARNESS_CONNECTOR_IDENTIFIER,
  convertToFormData: (payload: ConnectorPayloadConfig) => Record<string, any>,
  formDefinition: IFormDefinition<InputConfigType>
): ConnectorPayloadConverter => ({
  identifier,
  convertToFormData,
  formDefinition
})

export type AnyConnectorDefinition<T = string> = {
  identifier: T
  description: string
  formDefinition: IFormDefinition<InputConfigType>
}

export type HarnessConnectorDefinitionType = AnyConnectorDefinition<HARNESS_CONNECTOR_IDENTIFIER>

export enum ConnectorRightDrawer {
  None = 'none',
  Collection = 'palette',
  Form = 'connectorForm'
}

export type ConnectorFormEntityType = {
  type: 'connector'
  data: {
    identifier: string
    description?: string
    payload?: ConnectorPayloadConfig
  }
}

export enum ConnectorPayloadTypes {
  Github = 'github',
  Terraform = 'terraform',
  AWS_KMS = 'awsKms'
}

export enum CredTypeValues {
  ManualConfig = 'ManualConfig',
  AssumeIAMRole = 'AssumeIAMRole',
  AssumeRoleSTS = 'AssumeRoleSTS'
}

export enum DelegateTypes {
  DELEGATE_OIDC = 'DelegateOidc'
}

export interface FormData {
  [key: string]: any
}
export const GitConnectionType = {
  HTTP: 'Http',
  SSH: 'Ssh'
}

export const GitUrlType = {
  ACCOUNT: 'Account',
  PROJECT: 'Project', // Used in Azure Repos
  REPO: 'Repo'
}
export const GitAPIAuthTypes = {
  GITHUB_APP: 'GithubApp',
  TOKEN: 'Token',
  OAUTH: 'OAuth'
}
export enum GitAuthTypes {
  USER_PASSWORD = 'UsernamePassword',
  USER_TOKEN = 'UsernameToken',
  KERBEROS = 'Kerberos',
  OAUTH = 'OAuth',
  GITHUB_APP = 'GithubApp',
  ANONYMOUS = 'Anonymous'
}
export enum ValueType {
  TEXT = 'TEXT',
  ENCRYPTED = 'ENCRYPTED'
}
