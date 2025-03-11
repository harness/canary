import type { Schema } from 'zod'

export type AnyFormikValue = any

export interface IFormDefinition<M = unknown> {
  /* hero is a very top element. it is displayed above Name/Identifier inputs */
  hero?: JSX.Element
  metadata?: M
  inputs: IInputDefinition[]
}

export interface IInputDefinition<T = unknown> {
  /**
   * Input type
   */
  inputType: string
  /**
   * Path for  input
   */
  path: string
  /** if pathRegExp is defined it will be used to match.
   *
   * Note: use empty string for *path* as it mandatory. It will be replaced in runtime with real field path.
   */
  pathRegExp?: RegExp
  /**
   * Input label
   */
  label?: string
  /**
   * Placeholder text
   */
  placeholder?: string
  /**
   * Makes input required
   */
  required?: boolean
  /**
   * Makes input readonly
   */
  readonly?: boolean
  /**
   * Default value
   */
  default?: any
  /**
   * Input configuration.
   *
   * Note: Each input defines own configuration
   */
  inputConfig?: T
  /**
   * Conditionally render input.
   *
   * Note: If function return false, input will not render and validation will be omitted
   */
  isVisible?: (values: AnyFormikValue, metadata: any) => boolean
  /**
   * Nested inputs
   *
   * Note: Use only for inputs like groups
   */
  inputs?: IInputDefinition<unknown>[]
  /**
   * Runtime inputs
   *
   * Note: In input has child input that can be runtime inputs we can define input components.
   */
  runtimeInputs?: IInputDefinition<unknown>[]
  /**
   * Validation for input
   *
   * Note: Validation of complex inputs has to respect its formik structure
   */
  validation?: {
    schema?: Schema<unknown> | ((values: any) => Schema<unknown>)
  }
  before?: JSX.Element | string
  after?: JSX.Element | string
  description?: string

  inputTransform?: (value: any, values: any) => { value: any; path?: string } | undefined
  outputTransform?: (value: any, values: any) => { value: any; path?: string } | undefined

  autofocus?: boolean
}
// TODO:
// dependencies?: UIInputDependency[]
// metadata?: UIInputMetadata
// allMetadata?: UIInputMetadata[]
// hasMultiUsage?: boolean

export interface IGlobalValidationConfig<T extends string = string> {
  /** Required message for all inputs */
  requiredMessage?: string
  /** Required schema for all inputs */
  requiredSchema?: Schema<unknown>
  /** if defined it will have precedence over requiredMessage
   * @T input type
   */
  requiredMessagePerInput?: Record<T, string>
  /** if defined it will have precedence over requiredSchema
   * @T input type
   */
  requiredSchemaPerInput?: Record<T, Schema<unknown>>
  /**
   * Execute right after required validation and before input validation.
   *
   * if return continue=true, validation continues, otherwise it return valid state (if there is no error preset)
   */
  globalValidation?: <T, K>(value: T, input: IInputDefinition, metadata: K) => { continue?: boolean; error?: string }
}

export type IInputDefinitionForArrayInputs<T = unknown> = Omit<IInputDefinition<T>, 'path'> & {
  relativePath: string
}
