import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { cloneDeep, set } from 'lodash-es'

//import { useRootFormikContext } from '../context/RootFormikContext'
import type { InputProps } from './InputComponent'

export interface InputComponentRendererProps<T = unknown> extends InputProps<T> {
  children?: React.ReactNode
}

export function InputComponentRenderer<T = unknown>({
  path,
  factory,
  onUpdate,
  onChange,
  readonly,
  initialValues,
  input
}: InputComponentRendererProps<T>): JSX.Element | null {
  const { getValues, formState } = useFormContext()
  const { metadata = {}, fixedValues = {} /*getValuesWithDependencies*/ } = {} as any // useRootFormikContext()

  const inputComponent = factory?.getComponent<T>(input.inputType as string)

  const commonProps = useMemo(
    () => ({
      path,
      initialValues,
      onUpdate,
      onChange,
      factory,
      readonly,
      input
    }),
    [factory, initialValues, input, onChange, onUpdate, path, readonly, formState.errors]
  )

  const valuesWithDependenciesAndStepPaths = cloneDeep(getValues()) //getValuesWithDependencies(values, input as IInputDefinition)

  if (fixedValues) {
    Object.keys(fixedValues).forEach(path => {
      const fixedValue = fixedValues[path]
      set(valuesWithDependenciesAndStepPaths, path, fixedValue)
    })
  }

  const isVisible = !input.isVisible || input?.isVisible(valuesWithDependenciesAndStepPaths, metadata)

  const component = useMemo(() => {
    if (isVisible) {
      return (
        <>
          {input.before ? input.before : null}
          {inputComponent?.renderComponent(commonProps)}
          {input.after ? input.after : null}
        </>
      )
    }
    return null
  }, [commonProps, input.after, input.before, inputComponent, isVisible, formState.errors])

  if (!inputComponent) {
    return <p>Input component not found (internal type: {input.inputType as string})</p>
  }

  if (isVisible) {
    return component
  }

  return null
}
