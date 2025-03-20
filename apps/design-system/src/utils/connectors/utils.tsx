import { AnyConnectorDefinition } from '@harnessio/ui/views'

import { AWS_KMS_CONNECTOR_CATEGORY, awsKmsConnectorFormDefinition } from './aws-kms-connector'
import { GITHUB_CONNECTOR_CATEOGRY, githubConnectorFormDefinition } from './github-connector'
import { TERRAFORM_CONNECTOR_CATEGORY, terraformConnectorFormDefinition } from './terraform-connector'

export const GITHUB_CONNECTOR_IDENTIFIER = 'Github'
export const TERRAFORM_CONNECTOR_IDENTIFIER = 'Terraform'
export const AWS_KMS_CONNECTOR_IDENTIFIER = 'AWS KMS'

export const harnessConnectors: AnyConnectorDefinition[] = [
  {
    type: 'Github',
    name: GITHUB_CONNECTOR_IDENTIFIER,
    category: GITHUB_CONNECTOR_CATEOGRY,
    formDefinition: githubConnectorFormDefinition
  },
  {
    type: 'Terraform',
    name: TERRAFORM_CONNECTOR_IDENTIFIER,
    category: TERRAFORM_CONNECTOR_CATEGORY,
    formDefinition: terraformConnectorFormDefinition
  },
  {
    type: 'AwsKms',
    name: AWS_KMS_CONNECTOR_IDENTIFIER,
    category: AWS_KMS_CONNECTOR_CATEGORY,
    formDefinition: awsKmsConnectorFormDefinition
  }
]
export function getHarnessConnectorDefinition(type: string): AnyConnectorDefinition | undefined {
  return harnessConnectors.find(harnessConnector => harnessConnector.type === type)
}

export const getExecuteOnDelegateValue = () => {
  return true
}
