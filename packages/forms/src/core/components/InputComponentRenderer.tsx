import { memo, useMemo } from 'react'
import { get, useFormContext } from 'react-hook-form'

import { set } from 'lodash-es'

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

export const InputComponentRenderer = memo(function InputComponentRenderer<TValue, TConfig = unknown>({
  path,
  factory,
  onUpdate,
  onChange,
  initialValues,
  input,
  withoutWrapper = false
}: InputComponentRendererProps<TConfig, TValue>): JSX.Element | null {
  const formContext = useFormContext()
  const { formState } = formContext
  const { fixedValues = {} } = {} as any
  const { metadata, readonly: globalReadOnly, inputErrorHandler } = useRootFormContext()

  const inputComponent = factory?.getComponent<TValue>(input.inputType as string)

  // Only watch all values when absolutely necessary for dynamic behavior
  const needsAllValues = !!(
    input.isVisible ||
    typeof input.disabled === 'function' ||
    typeof input.validation?.schema === 'function' ||
    typeof input.warning?.schema === 'function'
  )
  const needsFieldValue = !!(input.warning?.schema || input.validation?.schema)
  const allValues = needsAllValues ? formContext.watch() : {}
  const fieldValue = needsFieldValue
    ? needsAllValues
      ? get(allValues, input.path)
      : formContext.watch(input.path)
    : undefined

  // Memoize values with dependencies to avoid unnecessary recalculations
  const valuesWithDependenciesAndStepPaths = useMemo(() => {
    if (!needsAllValues) return {}

    let values = allValues
    if (fixedValues) {
      Object.keys(fixedValues).forEach(fixedPath => {
        const fixedValue = fixedValues[fixedPath]
        values = set(values, fixedPath, fixedValue)
      })
    }
    return values
  }, [needsAllValues, allValues, fixedValues])

  // compute isVisible
  const isVisible = !input.isVisible || input.isVisible(valuesWithDependenciesAndStepPaths, metadata)

  // compute readonly prop
  const readonly = globalReadOnly || input.readonly

  // compute disabled prop
  const disabled =
    typeof input.disabled === 'function' ? input.disabled(valuesWithDependenciesAndStepPaths, metadata) : input.disabled

  // compute warning prop
  const warningSchema = input.warning?.schema
  const warning = useMemo(() => {
    if (!isVisible || typeof warningSchema === 'undefined') return undefined

    const schema =
      typeof warningSchema === 'function' ? warningSchema(valuesWithDependenciesAndStepPaths) : warningSchema

    const { success, error } = schema.safeParse(fieldValue)
    const errorMessage = error?.errors?.[0]?.message

    return !success && errorMessage ? errorMessage : undefined
  }, [input.path, fieldValue, warningSchema, isVisible])

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
          <InputErrorBoundary path={path} inputType={input.inputType} inputErrorHandler={inputErrorHandler}>
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
})
