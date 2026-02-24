import * as React from 'react'

import { RootForm, useZodValidationResolver } from '../../core'
import { RenderForm } from '../../form'
import type { IFormDefinition } from '../../types'
import inputComponentFactory from '../factory/factory'

export interface TestFormComponentProps {
  formDefinition: IFormDefinition
  onSubmit: (data: any) => void
  onValuesChange?: (data: any) => void
  onValidationChange?: (props: { isValid: boolean; isSubmitted: boolean }) => void
  mode?: 'onSubmit' | 'onChange' | 'onBlur'
  defaultValues?: any
  validationConfig?: any
}

/**
 * Test Wrapper component to use the useZodValidationResolver hook within React context
 * This component is specifically designed for testing purposes to avoid "Invalid hook call" errors
 */
export const TestFormComponent: React.FC<TestFormComponentProps> = ({
  formDefinition,
  onSubmit,
  onValuesChange,
  onValidationChange,
  mode = 'onSubmit',
  defaultValues,
  validationConfig
}) => {
  const resolver = useZodValidationResolver(formDefinition, validationConfig)

  return (
    <RootForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onValuesChange={onValuesChange}
      onValidationChange={onValidationChange}
      resolver={resolver}
      mode={mode}
    >
      {formProps => (
        <>
          <RenderForm inputs={formDefinition} factory={inputComponentFactory} />
          <button onClick={formProps.submitForm} data-testid="submit-button">
            Submit
          </button>
        </>
      )}
    </RootForm>
  )
}
