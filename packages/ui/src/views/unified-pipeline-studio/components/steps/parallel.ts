import { IFormDefinition } from '@harnessio/forms'

import { InputConfigType } from '../form-inputs/types'
import { IInputConfigWithConfig } from './types'

export const PARALLEL_DESCRIPTION = 'Parallel group description.'

const inputs: IInputConfigWithConfig[] = []

export const parallelFormDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
