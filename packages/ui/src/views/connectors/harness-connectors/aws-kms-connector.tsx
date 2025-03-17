import { InputConfigType, InputType } from '@views/unified-pipeline-studio/components/form-inputs/types'

import { IFormDefinition } from '@harnessio/forms'

import { CredTypeValues, DelegateTypes, IInputConfigWithConfigInterface } from '../types'

export const AWS_KMS_CONNECTOR_CATEGORY = 'Secrets Manager'

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
    path: `accessKey`,
    label: 'AWS - Access Key',
    isVisible: values => values?.credential === CredTypeValues.ManualConfig
  },
  {
    inputType: InputType.text,
    path: `secretKey`,
    label: 'AWS - Secret Key',
    isVisible: values => values?.credential === CredTypeValues.ManualConfig
  },
  {
    inputType: InputType.text,
    path: `roleArn`,
    label: 'Role ARN',
    isVisible: values => values?.credential === CredTypeValues.AssumeRoleSTS
  },
  {
    inputType: InputType.text,
    path: `externalName`,
    label: 'External Id',
    isVisible: values => values?.credential === CredTypeValues.AssumeRoleSTS
  },
  {
    inputType: InputType.number,
    path: `assumeStsRoleDuration`,
    label: 'Assumed Role duration',
    isVisible: values => values?.credential === CredTypeValues.AssumeRoleSTS
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

export const awsKmsConnectorFormDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
