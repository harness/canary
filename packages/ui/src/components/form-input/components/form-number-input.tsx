import { forwardRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { NumberInput, type NumberInputProps } from '@components/inputs'

interface FormNumberInputPropsType extends NumberInputProps {
  name: string
}

const FormNumberInput = forwardRef<HTMLInputElement, FormNumberInputPropsType>((props, ref) => {
  const formContext = useFormContext()

  // Only access the component if it is inside FormProvider component tree
  if (!formContext) {
    throw new Error(
      'FormNumberInput must be used within a FormProvider context through FormWrapper. Use the standalone NumberInput component if form integration is not required.'
    )
  }

  return (
    <Controller
      name={props.name}
      control={formContext.control}
      render={({ field, fieldState }) => {
        // form error takes precedence over props.error
        const errorMessage = fieldState.error?.message || props.error

        return <NumberInput {...props} {...field} error={errorMessage} ref={ref} />
      }}
    />
  )
})

FormNumberInput.displayName = 'FormInput.Number'

export { FormNumberInput, type FormNumberInputPropsType }
