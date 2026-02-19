import { IInputDefinition, InputProps } from '@harnessio/forms'
import { RuntimeInputConfig } from '@harnessio/ui/views'

import { CommonFormInputConfig } from '../../types/types'

export type NumberFormInputType = 'number'

export type NumberFormInputValueType = number

export type NumberFormInputConfig = RuntimeInputConfig & CommonFormInputConfig

export type NumberFormInputDefinition = IInputDefinition<NumberFormInputConfig, NumberFormInputValueType, 'number'>

export type NumberFormInputProps = InputProps<NumberFormInputValueType, NumberFormInputConfig>
