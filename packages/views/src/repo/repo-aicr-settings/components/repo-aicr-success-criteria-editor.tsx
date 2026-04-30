import { FC } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { Button, ButtonLayout, FormInput, FormWrapper, Layout } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

import { AicrCriterionEditorFields, aicrCriterionEditorSchema } from '../repo-aicr-settings.schema'

export interface RepoAicrSuccessCriteriaEditorProps {
  isSubmitting?: boolean
  onSubmit: (fields: AicrCriterionEditorFields) => void
}

export const RepoAicrSuccessCriteriaEditor: FC<RepoAicrSuccessCriteriaEditorProps> = ({ isSubmitting, onSubmit }) => {
  const { t } = useTranslation()

  const formMethods = useForm<AicrCriterionEditorFields>({
    resolver: zodResolver(aicrCriterionEditorSchema),
    mode: 'onChange',
    defaultValues: { display: '', prompt: '' }
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid }
  } = formMethods

  const handleAdd = handleSubmit(values => {
    onSubmit(values)
    reset({ display: '', prompt: '' })
  })

  return (
    <FormWrapper {...formMethods} onSubmit={handleAdd}>
      <Layout.Vertical gap="sm" className="rounded-cn-md border border-cn-2 p-cn-md">
        <FormInput.Text
          id="aicr-criterion-display"
          {...register('display')}
          label={t('views:aicrSettings.successCriteria.addNewCheck', 'Add a new check')}
          placeholder={t('views:aicrSettings.successCriteria.namePlaceholder', 'Must use our design system')}
        />
        <FormInput.Text
          id="aicr-criterion-prompt"
          {...register('prompt')}
          optional
          placeholder={t('views:aicrSettings.successCriteria.descriptionPlaceholder', 'Check description (optional)')}
        />
        <ButtonLayout horizontalAlign="end">
          <Button type="submit" variant="secondary" disabled={!isValid || isSubmitting}>
            {t('views:aicrSettings.successCriteria.addCheck', 'Add check')}
          </Button>
        </ButtonLayout>
      </Layout.Vertical>
    </FormWrapper>
  )
}
