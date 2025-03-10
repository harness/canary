import { InputConfigType, InputType } from '@views/unified-pipeline-studio/components/form-inputs/types'

import { IFormDefinition } from '@harnessio/forms'

import { ConnectorPayloadConfig } from '../ConnectorPayloadBuilder'
import { AWS_KMS_CONNECTOR_IDENTIFIER, CredTypeValues, DelegateTypes, IInputConfigWithConfig, createConnectorPayloadConverter } from '../types'

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
const convertAwsKmsPayloadToFormData = (payload: ConnectorPayloadConfig): Record<string, any> => {
  const { spec } = payload
  const { credential, kmsArn, region, default: isDefault, delegateSelectors } = spec

  const formData: Record<string, any> = {
    name: payload.name,
    description: payload.description,
    projectIdentifier: payload.projectIdentifier,
    orgIdentifier: payload.orgIdentifier,
    identifier: payload.identifier,
    tags: payload.tags,
    connectivityMode: { _formData: { executeOnDelegate: spec.executeOnDelegate } },
    delegateSelectors,
    credType: credential?.type,
    awsArn: { referenceString: kmsArn },
    region,
    default: isDefault
  }

  // Handle credential specific fields
  if (credential?.spec) {
    switch (credential.type) {
      case CredTypeValues.ManualConfig:
        formData.accessKey = { referenceString: credential.spec.accessKey }
        formData.secretKey = { referenceString: credential.spec.secretKey }
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
        formData.iamRoleArn = credential.spec.iamRoleArn
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
