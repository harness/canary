import { InputConfigType } from '@views/unified-pipeline-studio/components/form-inputs/types'

import { IFormDefinition, IInputDefinition } from '@harnessio/forms'

export type IInputConfigWithConfigInterface = IInputDefinition & InputConfigType

export enum ConnectorRightDrawer {
  None = 'none',
  Collection = 'palette',
  Form = 'connectorForm'
}

export type HarnessConnectorDefinitionType = AnyConnectorDefinition<HARNESS_CONNECTOR_IDENTIFIER>

export const GITHUB_CONNECTOR_IDENTIFIER = 'Github'
export const TERRAFORM_CONNECTOR_IDENTIFIER = 'Terraform'
export const AWS_KMS_CONNECTOR_IDENTIFIER = 'AWS KMS'

export type ConnectorFormEntityType = {
  type: 'connector'
  data: {
    identifier: string
    name?: string
    payload?: ConnectorPayloadConfig
  }
}
export type HARNESS_CONNECTOR_IDENTIFIER =
  | typeof GITHUB_CONNECTOR_IDENTIFIER
  | typeof TERRAFORM_CONNECTOR_IDENTIFIER
  | typeof AWS_KMS_CONNECTOR_IDENTIFIER

export type AnyConnectorDefinition<T = string> = {
  identifier: T
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
