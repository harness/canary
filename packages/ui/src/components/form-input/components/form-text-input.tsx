import { forwardRef, useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { TextInput, type TextInputProps } from '@components/inputs'
import { useMergeRefs } from '@utils/mergeUtils'

interface FormTextInputPropsType extends TextInputProps {
  name: string
}

const FormTextInput = forwardRef<HTMLInputElement, FormTextInputPropsType>((props, ref) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const formContext = useFormContext()
  const mergedRef = useMergeRefs<HTMLInputElement>([inputRef, ref])

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
        // form error takes precedence over props.error
        const error = fieldState.error?.message ?? props.error

        return <TextInput {...{ ...props, ...field, error }} ref={mergedRef} theme={error ? 'danger' : 'default'} />
      }}
    />
  )
})

FormTextInput.displayName = 'FormInput.Text'

export { FormTextInput, type FormTextInputPropsType }
