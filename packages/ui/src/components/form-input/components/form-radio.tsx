import { ElementRef, forwardRef, ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { Radio, RadioProps } from '@/components/radio'

interface FormRadioPropsType extends Omit<RadioProps, 'name'> {
  name: string
  children: ReactNode
}

const FormRadio = forwardRef<ElementRef<typeof Radio.Root>, FormRadioPropsType>(({ children, ...props }, ref) => {
  const formContext = useFormContext()

  // Only access the component if it is inside FormProvider component tree
  if (!formContext) {
    throw new Error(
      'FormRadio must be used within a FormProvider context through FormWrapper. Use the standalone Radio component if form integration is not required.'
    )
  }

  return (
    <Controller
      name={props.name}
      control={formContext.control}
      render={({ field, fieldState }) => (
        <Radio.Root
          {...props}
          {...field}
          ref={ref}
          value={field.value}
          onValueChange={field.onChange}
          error={fieldState.error?.message || props.error}
          disabled={field.disabled || props.disabled}
          className={props.className}
        >
          {children}
        </Radio.Root>
      )}
    />
  )
})

FormRadio.displayName = 'FormInput.Radio'

export { FormRadio, type FormRadioPropsType }
