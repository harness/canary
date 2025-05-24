import { ElementRef, forwardRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { Checkbox, type CheckboxProps } from '@/components'

interface FormCheckboxPropsType extends Omit<CheckboxProps, 'name'> {
  name: string
}

const FormCheckbox = forwardRef<ElementRef<typeof Checkbox>, FormCheckboxPropsType>(({ ...props }, ref) => {
  const formContext = useFormContext()

  // Only access the component if it is inside FormProvider component tree
  if (!formContext) {
    throw new Error(
      'FormCheckbox must be used within a FormProvider context through FormWrapper. Use the standalone Checkbox component if form integration is not required.'
    )
  }

  return (
    <Controller
      name={props.name}
      control={formContext.control}
      render={({ field }) => (
        <Checkbox
          {...props}
          {...field}
          ref={ref}
          checked={field.value}
          onCheckedChange={field.onChange}
          // Add it once error support is added
          // error={fieldState.error?.message || props.error}
          disabled={field.disabled || props.disabled}
          className={props.className}
        />
      )}
    />
  )
})

FormCheckbox.displayName = 'FormInput.Checkbox'

export { FormCheckbox, type FormCheckboxPropsType }
