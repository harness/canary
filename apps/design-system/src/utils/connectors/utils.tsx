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
    formDefinition: githubConnectorFormDefinition,
    icon: 'github'
  },
  {
    type: 'Terraform',
    name: TERRAFORM_CONNECTOR_IDENTIFIER,
    category: TERRAFORM_CONNECTOR_CATEGORY,
    formDefinition: terraformConnectorFormDefinition,
    icon: 'terraform'
  },
  {
    type: 'AwsKms',
    name: AWS_KMS_CONNECTOR_IDENTIFIER,
    category: AWS_KMS_CONNECTOR_CATEGORY,
    formDefinition: awsKmsConnectorFormDefinition,
    icon: 'awskms'
  }
]
export interface ConnectorDefinitionOptions {
  autoExpandGroups?: boolean
}

export function getHarnessConnectorDefinition(type: string, options?: ConnectorDefinitionOptions): any | undefined {
  const connector = harnessConnectors.find(harnessConnector => harnessConnector.type === type)
  return {
    ...connector,
    formDefinition: {
      ...connector?.formDefinition,
      inputs: connector?.formDefinition?.inputs?.map(input => {
        if (!input) return input

        if (input.inputType === 'group') {
          return {
            ...input,
            inputConfig: {
              ...(input.inputConfig || {}),
              autoExpandGroups: options?.autoExpandGroups
            }
          }
        }
        return input
      })
    }
  }
}

export const getExecuteOnDelegateValue = () => {
  return true
}
