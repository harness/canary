import { forwardRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { TextInput, type TextInputProps } from '@components/inputs'

interface FormTextInputPropsType extends TextInputProps {
  name: string
}

const FormTextInput = forwardRef<HTMLInputElement, FormTextInputPropsType>((props, ref) => {
  const formContext = useFormContext()

  // Only access the component if it is inside FormProvider component tree
  if (!formContext) {
    throw new Error(
      'FormTextInput must be used within a FormProvider context through FormWrapper. Use the standalone TextInput component if form integration is not required.'
    )
  }

  return (
    <Controller
      name={props.name}
      control={formContext.control}
      render={({ field, fieldState }) => (
        <TextInput {...props} {...field} error={fieldState.error?.message || props.error} ref={ref} />
      )}
    />
  )
})

FormTextInput.displayName = 'FormInput.Text'

export { FormTextInput, type FormTextInputPropsType }
