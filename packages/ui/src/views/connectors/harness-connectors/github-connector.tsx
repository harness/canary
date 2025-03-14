import { InputConfigType, InputType, RadialOption } from '@views/unified-pipeline-studio/components/form-inputs/types'

// import * as zod from 'zod'

import { IFormDefinition } from '@harnessio/forms'

import { IInputConfigWithConfigInterface } from '../types'
import {
  getCloningContainer,
  getConnectionContainer,
  getMetadataContainer,
  getResourcesContainer
} from './common-connector-utils'

export const GITHUB_CONNECTOR_DESCRIPTION = 'Github Connector'

const inputs: IInputConfigWithConfigInterface[] = [
  {
    inputType: InputType.radio,
    path: 'githubType',
    label: 'GitHub Type',

    inputConfig: {
      inputType: InputType.radio,
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
    inputType: InputType.select,
    path: `auth`,
    label: 'Authentication',
    inputConfig: {
      options: [
        { label: 'Oauth', value: 'Oauth' },
        { label: 'GitHub Application', value: 'GithubApp' },
        { label: 'Personal Token', value: 'UsernameToken' }
      ]
    }
  },
  {
    inputType: InputType.text,
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
