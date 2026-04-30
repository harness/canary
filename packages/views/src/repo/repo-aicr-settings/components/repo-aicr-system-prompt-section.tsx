import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { Button, FormInput, FormWrapper, Layout, Skeleton, Text } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

import { DEFAULT_AICR_SYSTEM_PROMPT } from '../repo-aicr-settings.constants'
import { AicrSystemPromptFields, aicrSystemPromptSchema } from '../repo-aicr-settings.schema'
import { AicrApiError, AicrErrorType } from '../repo-aicr-settings.types'

export interface RepoAicrSystemPromptSectionProps {
  value: string
  defaultPrompt?: string
  isLoading: boolean
  isUpdating: boolean
  apiError: AicrApiError | null
  onSubmit: (prompt: string) => void
}

export const RepoAicrSystemPromptSection: FC<RepoAicrSystemPromptSectionProps> = ({
  value,
  defaultPrompt = DEFAULT_AICR_SYSTEM_PROMPT,
  isLoading,
  isUpdating,
  apiError,
  onSubmit
}) => {
  const { t } = useTranslation()

  const formMethods = useForm<AicrSystemPromptFields>({
    resolver: zodResolver(aicrSystemPromptSchema),
    mode: 'onChange',
    defaultValues: { systemPrompt: value }
  })

  const { register, handleSubmit, reset } = formMethods

  useEffect(() => {
    if (!isUpdating) {
      reset({ systemPrompt: value })
    }
  }, [value, isUpdating, reset])

  const handleReset = () => {
    reset({ systemPrompt: defaultPrompt }, { keepDirty: true })
  }

  const handleSave = handleSubmit(values => onSubmit(values.systemPrompt))

  return (
    <Layout.Vertical gap="md">
      <Layout.Vertical gap="2xs">
        <Text variant="heading-subsection" as="h3">
          {t('views:aicrSettings.systemPrompt.title', 'System Prompt')}
        </Text>
        <Text variant="body-normal" color="foreground-3">
          {t(
            'views:aicrSettings.systemPrompt.description',
            "Customize the system prompt sent to the code review agent. This controls the agent's behavior and focus areas."
          )}
        </Text>
      </Layout.Vertical>

      {isLoading ? (
        <Skeleton.Form linesCount={4} />
      ) : (
        <FormWrapper {...formMethods} onSubmit={handleSave}>
          <FormInput.Textarea
            id="aicr-system-prompt"
            {...register('systemPrompt')}
            resizable
            rows={8}
            disabled={isUpdating}
          />
          <Layout.Flex justify="end">
            <Button type="button" variant="link" size="sm" onClick={handleReset} disabled={isUpdating}>
              {t('views:aicrSettings.systemPrompt.resetToDefault', 'Reset to default')}
            </Button>
          </Layout.Flex>
        </FormWrapper>
      )}

      {apiError?.type === AicrErrorType.UPDATE_SYSTEM_PROMPT && <Text color="danger">{apiError.message}</Text>}
    </Layout.Vertical>
  )
}
