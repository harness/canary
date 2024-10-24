import React, { forwardRef } from 'react'
import { SubmitHandler, FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import { z } from 'zod'
import { Input, Textarea, Text } from '@harnessio/canary'
import { MessageTheme } from '../form-field-set'
import { FormFieldSet } from '../..'
// Define the form schema
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
  title: z.string().min(1, { message: 'Please provide a pull request title' }),
  description: z.string().min(1, { message: 'Please provide a description' })
})

export type FormFields = z.infer<typeof formSchema> // Automatically generate a type from the schema

interface PullRequestFormProps {
  apiError: string | null
  isLoading: boolean
  onFormDraftSubmit: (data: FormFields) => void
  onFormSubmit: (data: FormFields) => void
  isValid: boolean
  errors: FieldErrors<FormFields>
  handleSubmit: UseFormHandleSubmit<FormFields>
  register: UseFormRegister<FormFields>
}

const PullRequestCompareForm = forwardRef<HTMLFormElement, PullRequestFormProps>(
  ({ apiError, register, handleSubmit, errors, onFormSubmit }, ref) => {
    const onSubmit: SubmitHandler<FormFields> = data => {
      onFormSubmit(data)
    }
    return (
      <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
        <FormFieldSet.Root>
          <FormFieldSet.ControlGroup>
            <FormFieldSet.Label htmlFor="title" required>
              Title
            </FormFieldSet.Label>
            <Input id="title" {...register('title')} placeholder="Enter pull request title" autoFocus />
            {errors.title && (
              <FormFieldSet.Message theme={MessageTheme.ERROR}>{errors.title.message?.toString()}</FormFieldSet.Message>
            )}
          </FormFieldSet.ControlGroup>
          <FormFieldSet.ControlGroup>
            <FormFieldSet.Label htmlFor="description" required>
              Description
            </FormFieldSet.Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter a description of this repository..."
            />
            {errors.description && (
              <FormFieldSet.Message theme={MessageTheme.ERROR}>
                {errors.description.message?.toString()}
              </FormFieldSet.Message>
            )}
          </FormFieldSet.ControlGroup>
        </FormFieldSet.Root>

        {apiError && (
          <Text size={1} className="text-destructive">
            {apiError?.toString()}
          </Text>
        )}
      </form>
    )
  }
)

export default PullRequestCompareForm
