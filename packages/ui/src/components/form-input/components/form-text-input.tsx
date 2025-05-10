import { forwardRef, useCallback, useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { TextInput, type TextInputProps } from '@components/inputs'

const FormTextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  // Only access hook if it's available in the component tree
  const formContext = useFormContext()

  // Generate a unique ID if one isn't provided
  const generateUniqueId = useCallback(() => `text-input-${Math.random().toString(36).substring(2, 9)}`, [])
  const inputId = props.id || generateUniqueId()

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

        return <TextInput {...props} {...field} error={errorMessage} id={inputId} />
      }}
    />
  ) : (
    <TextInput {...props} ref={ref} id={inputId} />
  )
})

FormTextInput.displayName = 'TextInput - Form'

export { FormTextInput }
