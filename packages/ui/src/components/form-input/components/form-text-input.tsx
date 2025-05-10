import { forwardRef, useCallback, useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { TextInput, type TextInputProps } from '@components/inputs'

const FormTextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  // Only access hook if it's available in the component tree
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

  if (!formContext) {
    throw new Error(
      'FormTextInput must be used within a FormProvider context through FormWrapper. Use the standalone TextInput component if form integration is not required.'
    )
  }

  return props.name ? (
    <Controller
      name={props.name}
      control={formContext.control}
      render={({ field, fieldState }) => {
        // Use proper React Hook Form reference handling
        field.ref = setRefs

        // Determine if there's an error from the form state
        const errorMessage = fieldState.error?.message || props.error

        return <TextInput {...props} {...field} error={errorMessage} />
      }}
    />
  ) : (
    <TextInput {...props} ref={ref} />
  )
})

FormTextInput.displayName = 'TextInput - Form'

export { FormTextInput }
