import { FormHTMLAttributes, ReactNode } from 'react'
import { FieldValues, FormProvider, UseFormReturn } from 'react-hook-form'

import { cn } from '@utils/cn'

interface FormWrapperProps<T extends FieldValues> extends FormHTMLAttributes<HTMLFormElement>, UseFormReturn<T> {
  className?: string
  formRef?: React.Ref<HTMLFormElement>
  children?: ReactNode
}

/**
 * A wrapper component that provides consistent spacing and layout for HTML form elements.
 * Extends the native HTML form element with consistent styling.
 *
 * TODO: Design system: Update this example with proper form inputs
 *
 * @example
 * <FormWrapper className="my-custom-class" onSubmit={handleSubmit}>
 *   <FormInput.Text id="name" {...register('name')} />
 *   <FormInput.Text id="email" type="email" {...register('email')} />
 * </FormWrapper>
 */
export function FormWrapper<T extends FieldValues>({
  className,
  children,
  formRef,
  formState,
  control,
  ...props
}: FormWrapperProps<T>) {
  return (
    <FormProvider {...props} formState={formState} control={control}>
      <form className={cn('flex flex-col gap-y-7', className)} ref={formRef} {...props}>
        {children}
      </form>
    </FormProvider>
  )
}

FormWrapper.displayName = 'FormWrapper'
