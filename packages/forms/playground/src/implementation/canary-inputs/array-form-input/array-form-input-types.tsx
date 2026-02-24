import { AnyFormValue, IInputDefinition, InputProps } from '@harnessio/forms'
import { RuntimeInputConfig } from '@harnessio/ui/views'

import { CommonFormInputConfig } from '../../types/types'

export type ArrayFormInputType = 'array'

export type ArrayFormInputValueType = AnyFormValue[]

export interface ArrayFormInputConfig extends RuntimeInputConfig, CommonFormInputConfig {
  input: IInputDefinition
}

export type ArrayFormInputDefinition = IInputDefinition<
  ArrayFormInputConfig,
  ArrayFormInputValueType,
  ArrayFormInputType
>

export type ArrayFormInputProps = InputProps<ArrayFormInputValueType, ArrayFormInputConfig>
