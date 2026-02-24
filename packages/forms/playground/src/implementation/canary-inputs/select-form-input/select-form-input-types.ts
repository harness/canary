import { AnyFormValue, IInputDefinition, InputProps } from '@harnessio/forms'
import { RuntimeInputConfig } from '@harnessio/ui/views'

import { CommonFormInputConfig, ViewFormInputConfig } from '../../types/types'

export interface SelectOption<T = string | boolean | number> {
  label: string
  value: T
}

export type SelectFormInputType = 'select'

export type SelectFormInputValueType = string | boolean | number

export interface SelectFormInputConfig extends RuntimeInputConfig, CommonFormInputConfig, ViewFormInputConfig {
  options: SelectOption[] | ((values: AnyFormValue, metadata?: AnyFormValue) => SelectOption[])
  disabledValue?: string | boolean
}

export type SelectFormInputDefinition = IInputDefinition<
  SelectFormInputConfig,
  SelectFormInputValueType,
  SelectFormInputType
>

export type SelectFormInputProps = InputProps<SelectFormInputValueType, SelectFormInputConfig>
