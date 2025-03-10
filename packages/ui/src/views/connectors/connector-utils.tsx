import { AWS_KMS_CONNECTOR_DESCRIPTION, awsKmsConnectorFormDefinition } from './harness-connectors/aws-kms-connector'
import { GITHUB_CONNECTOR_DESCRIPTION, githubConnectorFormDefinition } from './harness-connectors/github-connector'
import {
  TERRAFORM_CONNECTOR_DESCRIPTION,
  terraformConnectorFormDefinition
} from './harness-connectors/terraform-connector'
import {
  AWS_KMS_CONNECTOR_IDENTIFIER,
  GITHUB_CONNECTOR_IDENTIFIER,
  HarnessConnectorDefinitionType,
  TERRAFORM_CONNECTOR_IDENTIFIER
} from './types'

export const harnessConnectors: HarnessConnectorDefinitionType[] = [
  {
    identifier: GITHUB_CONNECTOR_IDENTIFIER,
    description: GITHUB_CONNECTOR_DESCRIPTION,
    formDefinition: githubConnectorFormDefinition
  },
  {
    identifier: TERRAFORM_CONNECTOR_IDENTIFIER,
    description: TERRAFORM_CONNECTOR_DESCRIPTION,
    formDefinition: terraformConnectorFormDefinition
  },
  {
    identifier: AWS_KMS_CONNECTOR_IDENTIFIER,
    description: AWS_KMS_CONNECTOR_DESCRIPTION,
    formDefinition: awsKmsConnectorFormDefinition
  }
]
export function getHarnessConnectorDefinition(identifier: string): HarnessConnectorDefinitionType | undefined {
  return harnessConnectors.find(harnessConnector => harnessConnector.identifier === identifier)
}

export const getExecuteOnDelegateValue = ({ formData }: { formData?: FormData } = {}) => {
  console.log(formData)
  return true
}
