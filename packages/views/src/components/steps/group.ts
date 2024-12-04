import { IFormDefinition } from '@harnessio/forms'

import { InputConfigType } from '../form-inputs/types'
import { IInputConfigWithConfig } from './types'

export const GROUP_DESCRIPTION = 'Group description.'

const inputs: IInputConfigWithConfig[] = []

export const groupFormDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
