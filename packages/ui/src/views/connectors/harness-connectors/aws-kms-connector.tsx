import { InputConfigType, InputType } from '@views/unified-pipeline-studio/components/form-inputs/types'

import { IFormDefinition } from '@harnessio/forms'

import { ConnectorPayloadConfig, ConnectorSpec } from '../ConnectorPayloadBuilder'
import {
  AWS_KMS_CONNECTOR_IDENTIFIER,
  createConnectorPayloadConverter,
  CredTypeValues,
  DelegateTypes,
  IInputConfigWithConfig
} from '../types'

export const AWS_KMS_CONNECTOR_DESCRIPTION = 'AWS KMS Connector'

const inputs: IInputConfigWithConfig[] = [
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
  credential: {
    type: string
    spec?: {
      accessKey?: string
      secretKey?: string
      delegateSelectors?: string[]
      roleArn?: string
      externalName?: string
      assumeStsRoleDuration?: string
      iamRoleArn?: string
    }
  }
  kmsArn: string
  region: string
  default?: boolean
  executeOnDelegate?: boolean
}

const convertAwsKmsPayloadToFormData = (payload: ConnectorPayloadConfig<ConnectorSpec>): Record<string, any> => {
  // Type assertion since we know this is an AWS KMS connector payload
  const typedPayload = payload as ConnectorPayloadConfig<AwsKmsConnectorSpec>
  const { spec } = typedPayload
  const { credential, kmsArn, region, default: isDefault, delegateSelectors } = spec as AwsKmsConnectorSpec

  const formData: Record<string, any> = {
    name: typedPayload.name,
    description: typedPayload.description,
    projectIdentifier: typedPayload.projectIdentifier,
    orgIdentifier: typedPayload.orgIdentifier,
    identifier: typedPayload.identifier,
    tags: typedPayload.tags,
    connectivityMode: { _formData: { executeOnDelegate: spec.executeOnDelegate } },
    delegateSelectors,
    credential: credential?.type,
    awsArn: kmsArn,
    region,
    default: isDefault
  }

  // Handle credential specific fields
  if (credential?.spec) {
    switch (credential.type) {
      case CredTypeValues.ManualConfig:
        formData.accessKey = credential.spec.accessKey
        formData.secretKey = credential.spec.secretKey
        break
      case CredTypeValues.AssumeIAMRole:
        formData.delegateSelectors = credential.spec.delegateSelectors
        break
      case CredTypeValues.AssumeRoleSTS:
        formData.delegateSelectors = credential.spec.delegateSelectors
        formData.roleArn = credential.spec.roleArn
        formData.externalName = credential.spec.externalName
        formData.assumeStsRoleDuration = credential.spec.assumeStsRoleDuration
        break
      case DelegateTypes.DELEGATE_OIDC:
        formData.iamRole = credential.spec.iamRoleArn
        break
    }
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
