import { IFormDefinition } from '@harnessio/forms'

import { InputDefinition } from '../form-inputs/factory/factory'

export const PARALLEL_DESCRIPTION = 'Parallel group description.'

const inputs: InputDefinition[] = []

export const parallelFormDefinition: IFormDefinition<InputDefinition> = {
  inputs
}
