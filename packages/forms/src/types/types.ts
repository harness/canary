import type { Schema } from 'zod'

/** @deprecated use AnyFormValue */
export type AnyFormikValue = any

export type AnyFormValue = any

export interface IFormDefinition<
  TInput extends IInputDefinition<any, any, any> = IInputDefinition,
  TMetadata = unknown
> {
  /**
   * Hero is a very top element displayed above inputs
   * @deprecated do not use it
   */
  hero?: JSX.Element
  metadata?: TMetadata
  inputs: TInput[]
}

export type IInputTransformerFunc = (value: any, values: any) => { value: any; path?: string } | undefined
export type IOutputTransformerFunc = (
  value: any,
  values: any
) =>
  | {
      /* override value */
      value: any
      /* apply value to path */
      path?: string
      /* unset current path - this works together with path */
      unset?: boolean
    }
  | undefined

export interface IInputDefinition<TConfig = unknown, TValue = unknown, TInputType extends string = string> {
  /**
   * Input type
   */
  inputType: TInputType
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
  default?: TValue
  /**
   * Input configuration.
   *
   * Note: Each input defines own configuration
   */
  inputConfig?: TConfig
  /**
   * Conditionally render input.
   *
   * Note: If function return false, input will not render and validation will be omitted
   */
  isVisible?: (values: AnyFormValue, metadata: any) => boolean
  /**
   * Nested inputs
   *
   * Note: Use only for inputs like groups
   */
  inputs?: IInputDefinition[]
  /**
   * Validation for input
   *
   * Note: Validation of complex inputs has to respect its model structure
   */
  validation?: {
    schema?: Schema<unknown> | ((values: any) => Schema<unknown>)
  }
  /**
   * Conditionally disable input.
   */
  disabled?: boolean | ((values: AnyFormValue, metadata: any) => boolean)
  /**
   * Warning validation schema
   */
  warning?: {
    schema?: Schema<unknown> | ((values: any) => Schema<unknown>)
  }

  before?: JSX.Element | string
  after?: JSX.Element | string
  description?: string

  inputTransform?: IInputTransformerFunc | IInputTransformerFunc[] | undefined
  outputTransform?: IOutputTransformerFunc | IOutputTransformerFunc[] | undefined

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
