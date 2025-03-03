import { InputConfigType, InputType } from '@views/unified-pipeline-studio/components/form-inputs/types'

import { IFormDefinition } from '@harnessio/forms'

import { IInputConfigWithConfig } from '../types'
import { getCloningContainer, getConnectionContainer, getMetadataContainer, getResourcesContainer } from './common-connector-utils'

export const GITHUB_CONNECTOR_DESCRIPTION = 'Github Connector'

const inputs: IInputConfigWithConfig[] = [
  {
    inputType: InputType.select,
    path: `auth`,
    label: 'Authentication',
    inputConfig: {
      options: [
        { label: 'oauth', value: 'Oauth' },
        { label: 'GHapp', value: 'Github Application' },
        { label: 'token', value: 'PersonalToken' }
      ]
    }
  },
  {
    inputType: InputType.text,
    path: `pat`,
    label: 'Personal Token',
    isVisible: values => {
      return values?.auth === 'PersonalToken'
    }
  },
  getResourcesContainer(),
  getCloningContainer(),
  getConnectionContainer(),
  getMetadataContainer()
]

export const githubConnectorFormDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
