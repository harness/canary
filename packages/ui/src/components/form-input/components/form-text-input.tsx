import { forwardRef, useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { TextInput, type TextInputProps } from '@components/inputs'

interface FormTextInputPropsType extends TextInputProps {
  name: string
}

const FormTextInput = forwardRef<HTMLInputElement, FormTextInputPropsType>((props, ref) => {
  const formContext = useFormContext()

  const inputRef = useRef<HTMLInputElement | null>(null)

  const setRefs = (element: HTMLInputElement | null) => {
    // Save to local ref
    inputRef.current = element

    // Forward to external ref
    if (typeof ref === 'function') {
      ref(element)
    } else if (ref) {
      ref.current = element
    }
  }

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
      render={({ field, fieldState }) => {
        // Use proper React Hook Form reference handling
        field.ref = setRefs

        // form error takes precedence over props.error
        const errorMessage = fieldState.error?.message || props.error

        return <TextInput {...props} {...field} error={errorMessage} />
      }}
    />
  )
})

FormTextInput.displayName = 'FormInput.Text'

export { FormTextInput, type FormTextInputPropsType }
