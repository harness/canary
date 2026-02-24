import { IInputDefinition, InputProps } from '@harnessio/forms'
import { AccordionRootProps } from '@harnessio/ui/components'

import { AllInputsDefinition } from '../../types/input-types'
import { CommonFormInputConfig, ViewFormInputConfig } from '../../types/types'

export type ExpandedType = 'yes' | 'no' | 'auto'

export type GroupFormInputVariant = 'file-tree' | 'card'

export type GroupFormInputType = 'group'

export type GroupFormInputValueType = unknown

export interface GroupFormInputConfig extends ViewFormInputConfig, CommonFormInputConfig {
  /** Controls expanded/collapsed state. Defaults to 'auto'. */
  expanded?: ExpandedType
  indicatorPosition?: AccordionRootProps['indicatorPosition']
  /** defines behavior if error is present in any child input */
  showWarning?: 'never' | 'always' | 'closed'
  variant?: GroupFormInputVariant
}

export type GroupFormInputDefinition = Omit<
  IInputDefinition<GroupFormInputConfig, GroupFormInputValueType, GroupFormInputType>,
  'inputs'
> & {
  inputs?: AllInputsDefinition[]
}

export type GroupFormInputProps = InputProps<GroupFormInputValueType, GroupFormInputConfig>
