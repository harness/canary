import { InputConfigType, InputType } from '@views/unified-pipeline-studio/components/form-inputs/types'

import { IFormDefinition } from '@harnessio/forms'

import { IInputConfigWithConfig } from '../types'

export const AWS_KMS_CONNECTOR_DESCRIPTION = 'AWS KMS Connector'

const inputs: IInputConfigWithConfig[] = [
  {
    inputType: InputType.select,
    path: `credential`,
    label: 'Credential Type',
    inputConfig: {
      options: [
        { label: 'AWS access key', value: 'accessKey' },
        { label: 'Assume Role on Delegate (IAM)', value: 'delegateIAM' },
        { label: 'Assume Role on Delegate (STS)', value: 'delegateSTS' },
        { label: 'OIDC', value: 'oidc' }
      ]
    }
  },
  {
    inputType: InputType.text,
    path: `arn`,
    label: 'ARN'
  },
  {
    inputType: InputType.text,
    path: `region`,
    label: 'Region'
  },
  {
    inputType: InputType.text,
    path: `iamRole`,
    label: 'IAM Role'
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
