import { AnyFormValue, IInputDefinition, InputProps } from '@harnessio/forms'

import { AllInputsDefinition } from '../../types/input-types'
import { CommonFormInputConfig, RuntimeInputConfig, ViewFormInputConfig } from '../../types/types'

// eslint-disable-next-line
export type UIInputWithConfigsForList = Omit<ListInputDefinition, 'path'> & {
  relativePath: string
}

export type ListInputDefinition = Omit<AllInputsDefinition, 'path'> & {
  relativePath: string
}

export type ListFormInputType = 'list'

export type ListFormInputValueType = AnyFormValue[]

export interface ListFormInputConfig extends RuntimeInputConfig, CommonFormInputConfig {
  // inputs: UIInputWithConfigsForList[]
  inputs: ListInputDefinition[]
  layout?: 'grid' | 'default'
  addBtnLabel?: string
  fieldsCountLimit?: number
  hideAdd?: boolean
  hideDelete?: boolean
  addOneOnInit?: boolean
  gridTemplateColumns?: string
  viewConfig?: ViewFormInputConfig['viewConfig'] & {
    pageSize?: number
  }

  /**
   *  @deprecated
   */
  overrideInputProps?: (value: AnyFormValue[]) => IInputDefinition
  /**
   *  @deprecated
   */
  overrideLabel?: (value: AnyFormValue[]) => string
}

export type ListFormInputDefinition = IInputDefinition<ListFormInputConfig, ListFormInputValueType, ListFormInputType>

export type ListFormInputProps = InputProps<ListFormInputValueType, ListFormInputConfig>
