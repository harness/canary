export type InputValueType = 'fixed' | 'runtime' | 'expression'

export type OptionalVisibilityType = 'visible' | 'hidden' | 'use-required' | 'auto'

export interface RuntimeInputConfig {
  allowedValueTypes?: InputValueType[]
}

export interface CommonFormInputConfig {
  tooltip?: string
  info?: string
  /** Controls optional label visibility. Defaults to 'auto'.  */
  optionalVisibility?: OptionalVisibilityType
}

export interface ViewFormInputConfig {
  viewConfig?: {
    label?: string
  }
}
