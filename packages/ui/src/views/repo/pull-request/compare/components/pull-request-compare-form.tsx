import { forwardRef } from 'react'
import { SubmitHandler, UseFormReturn } from 'react-hook-form'

import { Alert, FormInput, FormWrapper } from '@/components'
import { useTranslation } from '@/context'
import { HandleUploadType, PrincipalPropsType, PullRequestCommentBox } from '@/views'
import { noop } from 'lodash-es'
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
  desc?: string
  setDesc: (desc: string) => void
  formMethods: UseFormReturn<FormFields>
  principalProps: PrincipalPropsType
}

const PullRequestCompareForm = forwardRef<HTMLFormElement, PullRequestFormProps>(
  ({ apiError, onFormSubmit, handleUpload, desc, setDesc, formMethods, principalProps }, ref) => {
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
          preserveCommentOnSave
          onSaveComment={newComment => {
            onFormSubmit({ title: formMethods.getValues('title'), description: newComment })
          }}
          textareaPlaceholder={t(
            'views:pullRequests.compareChangesFormDescriptionPlaceholder',
            'Enter pull request description'
          )}
          comment={desc!}
          buttonTitle="Create pull request"
          setComment={setDesc}
          principalProps={principalProps}
          handleUpload={handleUpload}
          principalsMentionMap={{}}
          setPrincipalsMentionMap={noop}
        />

        {apiError && apiError !== "head branch doesn't contain any new commits." && (
          <Alert.Root theme="danger">
            <Alert.Title>Pull Request Error</Alert.Title>
            <Alert.Description>{apiError?.toString()}</Alert.Description>
          </Alert.Root>
        )}
      </FormWrapper>
    )
  }
)

PullRequestCompareForm.displayName = 'PullRequestCompareForm'

export default PullRequestCompareForm
