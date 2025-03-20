import { FieldValues, IFormDefinition, IInputDefinition } from '@harnessio/forms'

import { BaseEntityProps } from '../../views/platform/types'
import { InputConfigType } from '../../views/unified-pipeline-studio/components/form-inputs/types'

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

export type ConnectorFormEntityType = {
  type: 'connector'
  data: {
    type: string
    name?: string
    payload?: ConnectorPayloadConfig
  }
}

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

export enum ConnectorSelectionType {
  NEW = 'new',
  EXISTING = 'existing'
}
