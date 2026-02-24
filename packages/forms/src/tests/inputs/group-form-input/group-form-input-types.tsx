import { InputProps } from '../../../core'
import { IInputDefinition } from '../../../types'

export type GroupFormInputType = 'group'

export type GroupFormInputValueType = Record<string, any>

export type GroupFormInputConfig = unknown

export type GroupFormInputDefinition = IInputDefinition<
  GroupFormInputConfig,
  GroupFormInputValueType,
  GroupFormInputType
>

export type GroupFormInputProps = InputProps<GroupFormInputValueType, GroupFormInputConfig>
