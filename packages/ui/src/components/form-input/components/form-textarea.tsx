import { forwardRef, useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { Textarea, TextareaProps } from '@components/form-primitives'
import { useMergeRefs } from '@utils/mergeUtils'

interface FormTextareaPropsType extends TextareaProps {
  name: string
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaPropsType>((props, ref) => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  const formContext = useFormContext()
  const mergedRef = useMergeRefs<HTMLTextAreaElement>([inputRef, ref])

  if (!formContext) {
    throw new Error(
      'FormTextarea must be used within a FormProvider context through FormWrapper. Use the standalone Textarea component if form integration is not required.'
    )
  }

  return (
    <Controller
      name={props.name}
      control={formContext.control}
      render={({ field, fieldState }) => {
        const error = fieldState.error?.message ?? props.error
        return <Textarea {...{ ...props, ...field, error }} ref={mergedRef} theme={error ? 'danger' : 'default'} />
      }}
    />
  )
})

FormTextarea.displayName = 'FormInput.Text'

export { FormTextarea, type FormTextareaPropsType }
