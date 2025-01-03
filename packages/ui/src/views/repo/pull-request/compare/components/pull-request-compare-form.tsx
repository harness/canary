import { forwardRef } from 'react'
import { FieldErrors, SubmitHandler, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'

import { Fieldset, Input, Textarea } from '@/components'
import { TranslationStore } from '@/views'
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
  useTranslationStore: () => TranslationStore
}

const PullRequestCompareForm = forwardRef<HTMLFormElement, PullRequestFormProps>(
  ({ apiError, register, handleSubmit, errors, onFormSubmit, useTranslationStore }, ref) => {
    const { t } = useTranslationStore()

    const onSubmit: SubmitHandler<FormFields> = data => {
      onFormSubmit(data)
    }

    return (
      <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
        <Fieldset className="gap-y-3">
          <span className="text-18 text-foreground-1 font-medium leading-none">
            {t('views:pullRequests.compareChangesFormTitle', 'Add a title')}
          </span>
          <Input
            id="title"
            {...register('title')}
            placeholder={t('views:pullRequests.compareChangesFormTitlePlaceholder', 'Enter pull request title')}
            error={errors.title?.message?.toString()}
            autoFocus
            size="md"
          />
          <span className="text-18 text-foreground-1 mt-4 font-medium leading-none">
            {t('views:pullRequests.compareChangesFormDescription', 'Add a description')}
          </span>
          <Textarea
            id="description"
            {...register('description')}
            placeholder={t(
              'views:pullRequests.compareChangesFormDescriptionPlaceholder',
              'Add Pull Request description here.'
            )}
            error={errors.description?.message?.toString()}
          />
        </Fieldset>

        {apiError && apiError !== "head branch doesn't contain any new commits." && (
          <span className="text-12 text-destructive">{apiError?.toString()}</span>
        )}
      </form>
    )
  }
)

PullRequestCompareForm.displayName = 'PullRequestCompareForm'

export default PullRequestCompareForm
