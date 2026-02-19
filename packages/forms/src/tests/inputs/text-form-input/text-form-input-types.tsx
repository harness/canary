import { InputProps } from '../../../core'
import { IInputDefinition } from '../../../types'

export type TextFormInputType = 'text'

export type TextFormInputValueType = string

export type TextFormInputConfig = unknown

export type TextFormInputDefinition = IInputDefinition<TextFormInputConfig, TextFormInputValueType, TextFormInputType>

export type TextFormInputProps = InputProps<TextFormInputValueType, TextFormInputConfig>
