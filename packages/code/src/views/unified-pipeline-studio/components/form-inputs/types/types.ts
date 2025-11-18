export type InputValueType = 'fixed' | 'runtime' | 'expression'

export interface RuntimeInputConfig {
  allowedValueTypes?: InputValueType[]
}
