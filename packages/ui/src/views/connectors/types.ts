import { IFormDefinition, IInputDefinition } from '@harnessio/forms'
import { InputConfigType } from '@views/unified-pipeline-studio/components/form-inputs/types'

export type IInputConfigWithConfig = IInputDefinition & InputConfigType

export const GITHUB_CONNECTOR_IDENTIFIER = 'Github Connector'
export const TERRAFORM_CONNECTOR_IDENTIFIER = 'Terraform Connector'
export const AWS_KMS_CONNECTOR_IDENTIFIER = "AWS KMS Connector"

export type HARNESS_CONNECTOR_IDENTIFIER =
  | typeof GITHUB_CONNECTOR_IDENTIFIER
  | typeof TERRAFORM_CONNECTOR_IDENTIFIER
  | typeof AWS_KMS_CONNECTOR_IDENTIFIER

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
  }
}
