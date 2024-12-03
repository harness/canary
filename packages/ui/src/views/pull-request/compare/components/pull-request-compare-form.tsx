import { forwardRef } from 'react'
import { FieldErrors, SubmitHandler, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'

import { MessageTheme } from '@components/form-field-set'
import * as FormFieldSet from '@components/form-field-set'
import { Text } from '@components/text'
import { z } from 'zod'

import { Input, Textarea } from '@harnessio/ui/components'

// Define the form schema
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchemaCompare = z.object({
  title: z.string().min(1, { message: 'Please provide a pull request title' }),
  description: z.string().optional()
})

export type FormFields = z.infer<typeof formSchemaCompare> // Automatically generate a type from the schema

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
            <FormFieldSet.Label htmlFor="description">Description</FormFieldSet.Label>
            <Textarea id="description" {...register('description')} placeholder="Add Pull Request description here." />
            {errors.description && (
              <FormFieldSet.Message theme={MessageTheme.ERROR}>
                {errors.description.message?.toString()}
              </FormFieldSet.Message>
            )}
          </FormFieldSet.ControlGroup>
        </FormFieldSet.Root>

        {apiError && apiError !== "head branch doesn't contain any new commits." && (
          <Text size={1} className="text-destructive">
            {apiError?.toString()}
          </Text>
        )}
      </form>
    )
  }
)

PullRequestCompareForm.displayName = 'PullRequestCompareForm'

export default PullRequestCompareForm
