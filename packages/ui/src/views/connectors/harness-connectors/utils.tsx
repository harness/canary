import {
  AWS_KMS_CONNECTOR_IDENTIFIER,
  GITHUB_CONNECTOR_IDENTIFIER,
  HarnessConnectorDefinitionType,
  TERRAFORM_CONNECTOR_IDENTIFIER
} from '../types'
import { AWS_KMS_CONNECTOR_CATEGORY, awsKmsConnectorFormDefinition } from './aws-kms-connector'
import { GITHUB_CONNECTOR_CATEOGRY, githubConnectorFormDefinition } from './github-connector'
import { TERRAFORM_CONNECTOR_CATEGORY, terraformConnectorFormDefinition } from './terraform-connector'

export const harnessConnectors: HarnessConnectorDefinitionType[] = [
  {
    identifier: GITHUB_CONNECTOR_IDENTIFIER,
    name: GITHUB_CONNECTOR_IDENTIFIER,
    category: GITHUB_CONNECTOR_CATEOGRY,
    formDefinition: githubConnectorFormDefinition
  },
  {
    identifier: TERRAFORM_CONNECTOR_IDENTIFIER,
    name: TERRAFORM_CONNECTOR_IDENTIFIER,
    category: TERRAFORM_CONNECTOR_CATEGORY,
    formDefinition: terraformConnectorFormDefinition
  },
  {
    identifier: AWS_KMS_CONNECTOR_IDENTIFIER,
    name: AWS_KMS_CONNECTOR_IDENTIFIER,
    category: AWS_KMS_CONNECTOR_CATEGORY,
    formDefinition: awsKmsConnectorFormDefinition
  }
]
export function getHarnessConnectorDefinition(identifier: string): HarnessConnectorDefinitionType | undefined {
  return harnessConnectors.find(harnessConnector => harnessConnector.identifier === identifier)
}

export const getExecuteOnDelegateValue = () => {
  return true
}
