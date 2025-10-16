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

  /**
   * Label defines the input label.
   */
  label?: string

  oneof?: any[]
}

export interface PipelineInputDefinition extends PipelineInput {
  ui?: InputUIConfig
}

export interface InputUIConfig {
  /**
   * CEL expression to add dynamic behaviour.
   * This input will be displayed only when this condition is true.
   * All inputs in this template are available to reference here.
   */
  visible?: string

  /**
   * Component defines the form element that should be used to
   * override the default renderer for the input.
   */
  component?: string

  /**
   * Autofocus configures the form element autofocus attribute.
   */
  autofocus?: boolean

  /**
   * Placeholder configures the form element placeholder attribute.
   */
  placeholder?: string

  /**
   * Tooltip configures the form element alt attribute.
   */
  tooltip?: string

  /**
   * Types of values allowed for this input.
   * Fixed: User must enter value when configuring the pipeline
   * Runtime: User must enter value when running the pipeline
   * Expression: Value will be derived by evaluating this CEL / JEXL expression
   */
  allowedValueTypes?: Array<'fixed' | 'runtime' | 'expression'>

  /**
   * CEL expression that evaluates to warning message or null
   */
  warning?: string
}
