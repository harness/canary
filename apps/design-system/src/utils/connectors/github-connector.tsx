import { InputConfigType, RadialOption } from '@views/unified-pipeline-studio/components/form-inputs/types'

// import * as zod from 'zod'

import { IFormDefinition } from '@harnessio/forms'

import { IInputConfigWithConfigInterface } from '../../../../../packages/ui/src/views/connectors/types'
import {
  getCloningContainer,
  getConnectionContainer,
  getMetadataContainer,
  getResourcesContainer
} from './common-connector-utils'

export const GITHUB_CONNECTOR_CATEOGRY = 'Code Repository'

const inputs: IInputConfigWithConfigInterface[] = [
  {
    inputType: 'radio',
    path: 'githubType',
    label: 'GitHub Type',
    inputConfig: {
      inputType: 'radio',
      options: [
        { label: 'Cloud', value: 'Cloud', description: 'Connect to Github Cloud', id: 'cloud', title: 'Cloud' },
        {
          label: 'Enterprise',
          value: 'Enterprise',
          description: 'Connect to Github Enterprise',
          id: 'enterprise',
          title: 'Enterprise'
        }
      ] as RadialOption[]
    },
    default: 'Cloud'
    // required: true,
    // validation: {
    //   schema: zod.string().min(1, 'Required input')
    // }
  },
  {
    inputType: 'select',
    path: `auth`,
    label: 'Authentication',
    default: 'Oauth',
    inputConfig: {
      options: [
        { label: 'Oauth', value: 'Oauth' },
        { label: 'GitHub Application', value: 'GithubApp' },
        { label: 'Personal Token', value: 'UsernameToken' }
      ]
    }
  },
  {
    inputType: 'text',
    path: `pat`,
    label: 'Personal Token',
    isVisible: values => {
      return values?.auth === 'UsernameToken'
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
