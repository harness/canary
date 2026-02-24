import { IInputDefinition, InputProps } from '@harnessio/forms'

import { CommonFormInputConfig, RuntimeInputConfig, ViewFormInputConfig } from '../../types/types'

export type BooleanFormInputType = 'boolean'

export type BooleanFormInputValueType = boolean

export type BooleanFormInputConfig = RuntimeInputConfig & CommonFormInputConfig & ViewFormInputConfig

export type BooleanFormInputDefinition = IInputDefinition<
  BooleanFormInputConfig,
  BooleanFormInputValueType,
  BooleanFormInputType
>

export type BooleanFormInputProps = InputProps<BooleanFormInputValueType, BooleanFormInputConfig>
