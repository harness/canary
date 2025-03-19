import {
  AWS_KMS_CONNECTOR_IDENTIFIER,
  Connectors,
  GITHUB_CONNECTOR_IDENTIFIER,
  HarnessConnectorDefinitionType,
  TERRAFORM_CONNECTOR_IDENTIFIER
} from '../types'
import { AWS_KMS_CONNECTOR_CATEGORY, awsKmsConnectorFormDefinition } from './aws-kms-connector'
import { GITHUB_CONNECTOR_CATEOGRY, githubConnectorFormDefinition } from './github-connector'
import { TERRAFORM_CONNECTOR_CATEGORY, terraformConnectorFormDefinition } from './terraform-connector'

export const harnessConnectors: HarnessConnectorDefinitionType[] = [
  {
    type: Connectors.GITHUB,
    name: GITHUB_CONNECTOR_IDENTIFIER,
    category: GITHUB_CONNECTOR_CATEOGRY,
    formDefinition: githubConnectorFormDefinition
  },
  {
    type: Connectors.TERRAFORM_CLOUD,
    name: TERRAFORM_CONNECTOR_IDENTIFIER,
    category: TERRAFORM_CONNECTOR_CATEGORY,
    formDefinition: terraformConnectorFormDefinition
  },
  {
    type: Connectors.AWS_KMS,
    name: AWS_KMS_CONNECTOR_IDENTIFIER,
    category: AWS_KMS_CONNECTOR_CATEGORY,
    formDefinition: awsKmsConnectorFormDefinition
  }
]
export function getHarnessConnectorDefinition(type: string): HarnessConnectorDefinitionType | undefined {
  return harnessConnectors.find(harnessConnector => harnessConnector.type === type)
}

export const getExecuteOnDelegateValue = () => {
  return true
}
