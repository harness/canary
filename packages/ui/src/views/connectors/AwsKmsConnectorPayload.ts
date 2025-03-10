import { getExecuteOnDelegateValue } from './connector-utils'
import { createConnectorPayloadBuilder } from './ConnectorPayloadBuilder'
import { ConnectorPayloadTypes, CredTypeValues, DelegateTypes, FormData } from './types'

const buildAwsKmsSpec = (formData: FormData): Record<string, any> => {
  let credentialSpec = {}

  switch (formData?.credType) {
    case CredTypeValues.ManualConfig:
      credentialSpec = {
        accessKey: formData?.accessKey?.referenceString,
        secretKey: formData?.secretKey?.referenceString
      }
      break
    case CredTypeValues.AssumeIAMRole:
      credentialSpec = {
        delegateSelectors: formData.delegateSelectors
      }
      break
    case CredTypeValues.AssumeRoleSTS:
      credentialSpec = {
        delegateSelectors: formData.delegateSelectors,
        roleArn: formData.roleArn?.trim(),
        externalName: formData.externalName?.trim() || undefined,
        assumeStsRoleDuration: formData.assumeStsRoleDuration
          ? typeof formData.assumeStsRoleDuration === 'string'
            ? parseInt(formData.assumeStsRoleDuration.trim())
            : formData.assumeStsRoleDuration
          : undefined
      }
      break
    case DelegateTypes.DELEGATE_OIDC:
      credentialSpec = {
        iamRoleArn: formData.iamRoleArn?.trim()
      }
      break
  }

  const spec: Record<string, any> = {
    executeOnDelegate: getExecuteOnDelegateValue(formData.connectivityMode),
    ...(formData?.delegateSelectors ? { delegateSelectors: formData.delegateSelectors } : {}),
    credential: {
      type: formData?.credType,
      spec: credentialSpec
    },
    kmsArn: formData?.awsArn?.referenceString,
    region: formData?.region,
    default: formData.default
  }

  return spec
}

export const awsKmsConnectorPayloadBuilder = createConnectorPayloadBuilder(
  ConnectorPayloadTypes.AWS_KMS,
  buildAwsKmsSpec
)
