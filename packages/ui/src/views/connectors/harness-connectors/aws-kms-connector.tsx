import { InputConfigType, InputType } from '@views/unified-pipeline-studio/components/form-inputs/types'

import { IFormDefinition } from '@harnessio/forms'

import { ConnectorPayloadConfig, ConnectorSpec } from '../ConnectorPayloadBuilder'
import {
  AWS_KMS_CONNECTOR_IDENTIFIER,
  createConnectorPayloadConverter,
  CredTypeValues,
  DelegateTypes,
  IInputConfigWithConfigInterface
} from '../types'

export const AWS_KMS_CONNECTOR_DESCRIPTION = 'AWS KMS Connector'

const inputs: IInputConfigWithConfigInterface[] = [
  {
    inputType: InputType.select,
    path: `credential`,
    label: 'Credential Type',
    inputConfig: {
      options: [
        { label: 'AWS access key', value: CredTypeValues.ManualConfig },
        { label: 'Assume Role on Delegate (IAM)', value: CredTypeValues.AssumeIAMRole },
        { label: 'Assume Role on Delegate (STS)', value: CredTypeValues.AssumeRoleSTS },
        { label: 'OIDC', value: DelegateTypes.DELEGATE_OIDC }
      ]
    }
  },
  {
    inputType: InputType.text,
    path: `spec.spec.accessKey`,
    label: 'AWS - Access Key',
    isVisible: values => values?.credential === CredTypeValues.ManualConfig
  },
  {
    inputType: InputType.text,
    path: `spec.spec.secretKey`,
    label: 'AWS - Secret Key',
    isVisible: values => values?.credential === CredTypeValues.ManualConfig
  },
  {
    inputType: InputType.text,
    path: `spec.spec.roleArn`,
    label: 'Role ARN',
    isVisible: values => values?.credential === CredTypeValues.ManualConfig
  },
  {
    inputType: InputType.text,
    path: `spec.spec.externalName`,
    label: 'External Id',
    isVisible: values => values?.credential === CredTypeValues.ManualConfig
  },
  {
    inputType: InputType.text,
    path: `spec.spec.assumeStsRoleDuration`,
    label: 'Assumed Role duration',
    isVisible: values => values?.credential === CredTypeValues.ManualConfig
  },
  {
    inputType: InputType.text,
    path: `awsArn`,
    label: 'AWS ARN'
  },
  {
    inputType: InputType.text,
    path: `region`,
    label: 'Region'
  },
  {
    inputType: InputType.text,
    path: `iamRole`,
    label: 'IAM Role',
    isVisible: values => values?.credential === DelegateTypes.DELEGATE_OIDC
  },
  {
    inputType: InputType.boolean,
    path: `default`,
    label: 'Use as Default'
  }
]

// Convert AWS KMS payload back to form data
interface AwsKmsConnectorSpec extends ConnectorSpec {
  name: string
  credential: string
  awsArn: string
  region: string
  default?: boolean
  executeOnDelegate?: boolean
  iamRole?: string
  accessKey?: string
  secretKey?: string
  delegateSelectors?: string[]
  roleArn?: string
  externalName?: string
  assumeStsRoleDuration?: string
}

const convertAwsKmsPayloadToFormData = (payload: ConnectorPayloadConfig<ConnectorSpec>): Record<string, any> => {
  // Extract fields from spec
  const spec = payload.spec as AwsKmsConnectorSpec

  // Basic form data
  const formData: Record<string, any> = {
    name: payload.name,
    description: payload.description,
    projectIdentifier: payload.projectIdentifier,
    orgIdentifier: payload.orgIdentifier,
    identifier: payload.identifier,
    tags: payload.tags,
    credential: spec.credential,
    awsArn: spec.awsArn,
    region: spec.region,
    default: spec.default
  }

  // Add OIDC-specific fields
  if (spec.credential === DelegateTypes.DELEGATE_OIDC && spec.iamRole) {
    formData.iamRole = spec.iamRole
  }

  // Add credential-specific fields
  switch (spec.credential) {
    case CredTypeValues.ManualConfig:
      formData.accessKey = spec.accessKey
      formData.secretKey = spec.secretKey
      break
    case CredTypeValues.AssumeIAMRole:
      formData.delegateSelectors = spec.delegateSelectors
      break
    case CredTypeValues.AssumeRoleSTS:
      formData.delegateSelectors = spec.delegateSelectors
      formData.roleArn = spec.roleArn
      formData.externalName = spec.externalName
      formData.assumeStsRoleDuration = spec.assumeStsRoleDuration
      break
  }

  return formData
}

export const awsKmsConnectorFormDefinition: IFormDefinition<InputConfigType> = {
  inputs
}

// Create and export the AWS KMS connector payload converter
export const awsKmsConnectorPayloadConverter = createConnectorPayloadConverter(
  AWS_KMS_CONNECTOR_IDENTIFIER,
  convertAwsKmsPayloadToFormData,
  awsKmsConnectorFormDefinition
)
