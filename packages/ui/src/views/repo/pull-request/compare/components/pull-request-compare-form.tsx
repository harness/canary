import { forwardRef } from 'react'
import { SubmitHandler, UseFormReturn } from 'react-hook-form'

import { FormInput, FormWrapper } from '@/components'
import { useTranslation } from '@/context'
import { HandleUploadType, PullRequestCommentBox } from '@/views'
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
  handleUpload?: HandleUploadType
  description?: string
  setDescription: (description: string) => void
  formMethods: UseFormReturn<FormFields>
}

const PullRequestCompareForm = forwardRef<HTMLFormElement, PullRequestFormProps>(
  ({ apiError, onFormSubmit, handleUpload, description, setDescription, formMethods }, ref) => {
    const { t } = useTranslation()
    const onSubmit: SubmitHandler<FormFields> = data => {
      onFormSubmit(data)
    }

    const { register, handleSubmit } = formMethods

    return (
      <FormWrapper {...formMethods} formRef={ref} onSubmit={handleSubmit(onSubmit)}>
        <FormInput.Text
          id="title"
          {...register('title')}
          autoFocus
          placeholder={t('views:pullRequests.compareChangesFormTitlePlaceholder', 'Enter pull request title')}
          label={t('views:pullRequests.compareChangesFormTitleLabel', 'Title')}
        />

        <PullRequestCommentBox
          isEditMode
          handleUpload={handleUpload}
          comment={description ?? ''}
          setComment={setDescription}
        ></PullRequestCommentBox>

        {apiError && apiError !== "head branch doesn't contain any new commits." && (
          <span className="text-1 text-cn-foreground-danger">{apiError?.toString()}</span>
        )}
      </FormWrapper>
    )
  }
)

PullRequestCompareForm.displayName = 'PullRequestCompareForm'

export default PullRequestCompareForm
