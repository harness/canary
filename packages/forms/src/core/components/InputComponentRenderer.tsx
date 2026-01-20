import { useMemo } from 'react'
import { get, useFormContext } from 'react-hook-form'

import { cloneDeep, set } from 'lodash-es'

import { IInputDefinition } from '../../types'
import { useRootFormContext } from '../hooks/useRootFormikContext'
//import { useRootFormikContext } from '../context/RootFormikContext'
import type { InputProps } from './InputComponent'
import { InputErrorBoundary } from './InputErrorBoundary'

const InputComponentWrapper = ({
  children,
  withoutWrapper = false
}: {
  withoutWrapper?: boolean
  children: JSX.Element | null
}) => {
  if (withoutWrapper || !children) return children

  return <div>{children}</div>
}

export interface InputComponentRendererProps<TConfig, TValue> extends Omit<InputProps<TValue, TConfig>, 'input'> {
  children?: React.ReactNode
  withoutWrapper?: boolean
  input: IInputDefinition<TConfig, TValue>
}

export function InputComponentRenderer<TValue, TConfig = unknown>({
  path,
  factory,
  onUpdate,
  onChange,
  initialValues,
  input,
  withoutWrapper = false
}: InputComponentRendererProps<TConfig, TValue>): JSX.Element | null {
  const { formState, watch } = useFormContext()
  const { fixedValues = {} /*getValuesWithDependencies*/ } = {} as any // useRootFormikContext()
  const { metadata, readonly: globalReadOnly } = useRootFormContext()

  const inputComponent = factory?.getComponent<TValue>(input.inputType as string)

  const values = watch()
  const valuesWithDependenciesAndStepPaths = cloneDeep(values) //getValuesWithDependencies(values, input as IInputDefinition)

  if (fixedValues) {
    Object.keys(fixedValues).forEach(path => {
      const fixedValue = fixedValues[path]
      set(valuesWithDependenciesAndStepPaths, path, fixedValue)
    })
  }

  // compute isVisible
  const isVisible = !input.isVisible || input.isVisible(valuesWithDependenciesAndStepPaths, metadata)

  let readonly: boolean | undefined
  let disabled: boolean | undefined

  if (isVisible) {
    // compute readonly prop
    readonly = globalReadOnly || input.readonly

    // compute disabled prop
    disabled =
      typeof input.disabled === 'function'
        ? input.disabled(valuesWithDependenciesAndStepPaths, metadata)
        : input.disabled
  }

  // compute warning prop
  const warningSchema = input.warning?.schema
  const warning = useMemo(() => {
    if (!isVisible || typeof warningSchema === 'undefined') return undefined

    const value = get(values, input.path)

    const schema =
      typeof warningSchema === 'function' ? warningSchema(valuesWithDependenciesAndStepPaths) : warningSchema

    const { success, error } = schema.safeParse(value)
    const errorMessage = error?.errors?.[0]?.message

    return !success && errorMessage ? errorMessage : undefined
  }, [input.path, values, warningSchema, isVisible])

  const commonProps = useMemo(
    () => ({
      path,
      key: path,
      initialValues,
      onUpdate,
      onChange,
      factory,
      readonly,
      input,
      disabled,
      warning
    }),
    [factory, initialValues, input, onChange, onUpdate, path, readonly, formState.errors, disabled, warning]
  )

  const component = useMemo(() => {
    if (isVisible) {
      return (
        <>
          {input.before ? input.before : null}
          <InputErrorBoundary path={path} inputType={input.inputType}>
            {inputComponent?.renderComponent(commonProps)}
          </InputErrorBoundary>
          {input.after ? input.after : null}
        </>
      )
    }
    return null
  }, [isVisible, input.before, input.inputType, input.after, path, inputComponent, commonProps, formState.errors])

  if (!inputComponent) {
    return (
      <InputComponentWrapper withoutWrapper={withoutWrapper}>
        <p>Input component not found (internal type: {input.inputType as string})</p>
      </InputComponentWrapper>
    )
  }

  return <InputComponentWrapper withoutWrapper={withoutWrapper}>{component}</InputComponentWrapper>
}
