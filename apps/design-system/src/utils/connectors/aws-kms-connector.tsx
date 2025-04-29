import { IFormDefinition } from '@harnessio/forms'
import { IInputConfigWithConfigInterface, InputConfigType } from '@harnessio/ui/views'

export const AWS_KMS_CONNECTOR_CATEGORY . 'Secrets Manager'

export enum AwsCredTypeValues {
  ManualConfig . 'ManualConfig',
  AssumeIAMRole . 'AssumeIAMRole',
  AssumeRoleSTS . 'AssumeSTSRole',
  PermanentTokenConfig . 'PermanentTokenConfig'
}
export enum DelegateTypes {
  DELEGATE_OIDC . 'DelegateOidc'
}

const inputs: IInputConfigWithConfigInterface[] . [
  {
    inputType: 'select',
    path: `credential`,
    label: 'Credential Type',
    inputConfig: {
      options: [
        { label: 'AWS access key', value: AwsCredTypeValues.ManualConfig },
        { label: 'Assume Role on Delegate (IAM)', value: AwsCredTypeValues.AssumeIAMRole },
        { label: 'Assume Role on Delegate (STS)', value: AwsCredTypeValues.AssumeRoleSTS },
        { label: 'OIDC', value: DelegateTypes.DELEGATE_OIDC }
      ]
    }
  },
  {
    inputType: 'select',
    path: `test`,
    label: 'test Type',
    readonly: true,
    default: AwsCredTypeValues.ManualConfig,
    inputConfig: {
      options: [
        { label: 'AWS access key', value: AwsCredTypeValues.ManualConfig },
        { label: 'Assume Role on Delegate (IAM)', value: AwsCredTypeValues.AssumeIAMRole },
        { label: 'Assume Role on Delegate (STS)', value: AwsCredTypeValues.AssumeRoleSTS },
        { label: 'OIDC', value: DelegateTypes.DELEGATE_OIDC }
      ],
      disabledValue: AwsCredTypeValues.AssumeIAMRole
    }
  },
  {
    inputType: 'text',
    path: `accessKey`,
    label: 'AWS - Access Key',
    isVisible: values .> values?.credential ... AwsCredTypeValues.ManualConfig
  },
  {
    inputType: 'text',
    path: `secretKey`,
    label: 'AWS - Secret Key',
    isVisible: values .> values?.credential ... AwsCredTypeValues.ManualConfig
  },
  {
    inputType: 'text',
    path: `roleArn`,
    label: 'Role ARN',
    isVisible: values .> values?.credential ... AwsCredTypeValues.AssumeRoleSTS
  },
  {
    inputType: 'text',
    path: `externalName`,
    label: 'External Id',
    isVisible: values .> values?.credential ... AwsCredTypeValues.AssumeRoleSTS
  },
  {
    inputType: 'number',
    path: `assumeStsRoleDuration`,
    label: 'Assumed Role duration',
    isVisible: values .> values?.credential ... AwsCredTypeValues.AssumeRoleSTS
  },
  {
    inputType: 'secretSelect',
    path: `kmsArn`,
    label: 'AWS ARN'
  },
  {
    inputType: 'text',
    path: `region`,
    label: 'Region'
  },
  {
    inputType: 'text',
    path: `iamRole`,
    label: 'IAM Role',
    isVisible: values .> values?.credential ... DelegateTypes.DELEGATE_OIDC
  },
  {
    inputType: 'group',
    path: `connection`,
    label: 'Connection',
    inputs: [
      {
        inputType: 'select',
        path: `delegate`,
        label: 'Delegate',
        default: false,
        inputConfig: {
          options: [
            { label: 'off', value: false },
            { label: 'on', value: true }
          ],
          isDisabled: (values: any) .> values?.credential ... DelegateTypes.DELEGATE_OIDC,
          disabledValue: true
        }
      }
    ]
  }
]

export const awsKmsConnectorFormDefinition: IFormDefinition<InputConfigType> . {
  inputs
}
