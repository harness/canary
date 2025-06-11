export interface PipelineInput {
  /**
   * Type defines the input type.
   */
  type: string

  /**
   * Description defines the input description.
   */
  description?: string

  /**
   * @go-type: interface{}
   */
  default?: any

  /**
   * Required indicates the input is required.
   */
  required?: boolean

  /**
   * Items defines an array type.
   */
  items?: any[]

  /**
   * Enum defines a list of accepted input values.
   */
  enum?: any[]

  /**
   * Pattern defines a regular expression input constraint.
   */
  pattern?: string

  /**
   * Options defines a list of accepted input values.
   * This is an alias for enum.
   * @github
   */
  options?: any[]

  /**
   * Mask indicates the input should be masked.
   * @deprecated
   */
  mask?: boolean
}

export interface PipelineInputDefinition extends PipelineInput {
  ui?: InputUIConfig
}

export interface InputUIConfig {
  widget?: string
  autofocus?: boolean
  placeholder?: string
  tooltip?: string
  visible?: string
}
