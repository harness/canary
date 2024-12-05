import { forwardRef } from 'react'
import { FieldErrors, SubmitHandler, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'

import { Fieldset, Input, MessageTheme, Textarea } from '@/components'
import { Text } from '@components/text'
import { z } from 'zod'

// Define the form schema
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
        <Fieldset>
          <Input
            id="title"
            {...register('title')}
            placeholder="Enter pull request title"
            label="Title"
            error={
              errors.title && {
                theme: MessageTheme.ERROR,
                message: errors.title.message?.toString()
              }
            }
            autoFocus
          />
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Add Pull Request description here."
            label="Description"
            error={errors.description && { theme: MessageTheme.ERROR, message: errors.description.message?.toString() }}
          />
        </Fieldset>

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
