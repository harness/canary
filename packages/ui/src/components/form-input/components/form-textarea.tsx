import { forwardRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { Textarea, TextareaProps } from '@components/form-primitives'

interface FormTextareaPropsType extends TextareaProps {
  name: string
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaPropsType>((props, ref) => {
  const formContext = useFormContext()

  if (!formContext) {
    throw new Error(
      'FormTextarea must be used within a FormProvider context through FormWrapper. Use the standalone Textarea component if form integration is not required.'
    )
  }

  return (
    <Controller
      name={props.name}
      control={formContext.control}
      render={({ field, fieldState }) => (
        <Textarea {...props} {...field} error={fieldState.error?.message || props.error} ref={ref} />
      )}
    />
  )
})

FormTextarea.displayName = 'FormInput.Textarea'

export { FormTextarea, type FormTextareaPropsType }
