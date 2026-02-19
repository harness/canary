import { IInputDefinition, InputProps } from '@harnessio/forms'
import { RuntimeInputConfig } from '@harnessio/ui/views'

import { CommonFormInputConfig, ViewFormInputConfig } from '../../types/types'

export type TextFormInputType = 'text'

export type TextFormInputValueType = string

export interface TextFormInputConfig extends RuntimeInputConfig, CommonFormInputConfig, ViewFormInputConfig {
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url'
  prefix?: string
  suffix?: string
}

export type TextFormInputDefinition = IInputDefinition<TextFormInputConfig, TextFormInputValueType, TextFormInputType>

export type TextFormInputProps = InputProps<TextFormInputValueType, TextFormInputConfig>
