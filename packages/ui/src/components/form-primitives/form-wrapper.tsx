import { createContext, FormHTMLAttributes, ReactNode } from 'react'
import { FieldValues, FormProvider, UseFormReturn } from 'react-hook-form'

import { InputOrientationProp } from '@/components'
import { cn } from '@utils/cn'

interface FormWrapperProps<T extends FieldValues>
  extends FormHTMLAttributes<HTMLFormElement>,
    UseFormReturn<T>,
    InputOrientationProp {
  className?: string
  formRef?: React.Ref<HTMLFormElement>
  children?: ReactNode
}

export const FormWrapperContext = createContext<InputOrientationProp>({
  orientation: 'vertical'
})

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
  onSubmit,
  orientation = 'vertical',
  ...props
}: FormWrapperProps<T>) {
  return (
    <FormProvider {...props} formState={formState} control={control}>
      <FormWrapperContext.Provider value={{ orientation }}>
        <form className={cn('cn-form', className)} ref={formRef} onSubmit={onSubmit} noValidate>
          {children}
        </form>
      </FormWrapperContext.Provider>
    </FormProvider>
  )
}

FormWrapper.displayName = 'FormWrapper'
