import { IInputDefinition, InputProps } from '@harnessio/forms'
import { AccordionRootProps } from '@harnessio/ui/components'

import { AllInputsDefinition } from '../../types/input-types'

export type AccordionFormInputType = 'accordion'

export type AccordionFormInputValueType = unknown

export interface AccordionFormInputConfig {
  /** defines default behavior for accordion items if error is present in any child input */
  showWarning?: 'never' | 'always' | 'closed'
  indicatorPosition?: AccordionRootProps['indicatorPosition']
}

export type AccordionFormInputDefinition = Omit<
  IInputDefinition<AccordionFormInputConfig, AccordionFormInputValueType, AccordionFormInputType>,
  'inputs'
> & {
  inputs?: AllInputsDefinition[]
}

export type AccordionFormInputProp = InputProps<AccordionFormInputValueType, AccordionFormInputConfig>
