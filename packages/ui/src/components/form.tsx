import * as React from 'react'
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn
} from 'react-hook-form'

import { Slot } from '@radix-ui/react-slot'
import { cn } from '@utils/cn'

import { Text } from './text'

interface ZodFormProps<T extends FieldValues> {
  form: UseFormReturn<T>
  onSubmit: SubmitHandler<T>
}

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue)

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useMemo(() => Math.random().toString(36).substr(2, 9), [])

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn('w-full space-y-cn-xs', className)} {...props} />
      </FormItemContext.Provider>
    )
  }
)
FormItem.displayName = 'FormItem'

// const FormLabel = React.forwardRef<
//   React.ElementRef<typeof LabelPrimitive.Root>,
//   React.ComponentPropsWithoutRef<typeof Label>
// >(({ className, ...props }, ref) => {
//   const { error, formItemId } = useFormField()

//   return <Label ref={ref} className={cn(error && 'text-cn-danger', className)} htmlFor={formItemId} {...props} />
// })
// FormLabel.displayName = Label.displayName

const FormControl = React.forwardRef<React.ElementRef<typeof Slot>, React.ComponentPropsWithoutRef<typeof Slot>>(
  ({ ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

    return (
      <Slot
        ref={ref}
        id={formItemId}
        aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
        aria-invalid={!!error}
        {...props}
      />
    )
  }
)
FormControl.displayName = 'FormControl'

const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField()

    return <Text ref={ref} id={formDescriptionId} className={className} {...props} color="foreground-3" />
  }
)
FormDescription.displayName = 'FormDescription'

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField()
    const body = error ? String(error?.message) : children

    if (!body) {
      return null
    }

    return (
      <Text ref={ref} id={formMessageId} className={className} {...props} color="danger" variant="body-strong">
        {body}
      </Text>
    )
  }
)
FormMessage.displayName = 'FormMessage'

/**
 * Form returns a form component that integrates Zod validation with React Hook Form.
 */
function Form<T extends FieldValues>(props: ZodFormProps<T> & Omit<React.ComponentProps<'form'>, 'onSubmit'>) {
  const { form, onSubmit, children, ...rest } = props

  return (
    <FormProvider {...form}>
      <form {...rest} onSubmit={form.handleSubmit(onSubmit)}>
        {children}
      </form>
    </FormProvider>
  )
}
Form.displayName = 'Form'

export { useFormField, Form, FormItem, FormControl, FormDescription, FormMessage, FormField, useForm }
