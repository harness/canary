import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Checkbox, ControlGroup, Layout, Message, MessageTheme, Skeleton, Text } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

import { ErrorTypes } from '../types'

const formSchema = z.object({
  gitLfsEnabled: z.boolean(),
  autoMergeEnabled: z.boolean()
})

export type RepoSettingsFeaturesFormFields = z.infer<typeof formSchema>

interface RepoSettingsFeaturesFormProps {
  gitLfsEnabled: boolean
  autoMergeEnabled: boolean
  apiError: { type: ErrorTypes; message: string } | null
  handleUpdateFeaturesSettings: (data: RepoSettingsFeaturesFormFields) => void
  isUpdatingFeaturesSettings: boolean
  isLoadingFeaturesSettings: boolean
}

export const RepoSettingsFeaturesForm: FC<RepoSettingsFeaturesFormProps> = ({
  gitLfsEnabled,
  autoMergeEnabled,
  handleUpdateFeaturesSettings,
  apiError,
  isUpdatingFeaturesSettings,
  isLoadingFeaturesSettings
}) => {
  const { t } = useTranslation()
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<RepoSettingsFeaturesFormFields>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      gitLfsEnabled,
      autoMergeEnabled
    }
  })

  const onFieldChange = (field: keyof RepoSettingsFeaturesFormFields, checked: boolean) => {
    setValue(field, checked)
    handleSubmit(data => {
      handleUpdateFeaturesSettings(data)
    })()
  }

  useEffect(() => {
    setValue('gitLfsEnabled', gitLfsEnabled)
  }, [gitLfsEnabled, setValue])

  useEffect(() => {
    setValue('autoMergeEnabled', autoMergeEnabled)
  }, [autoMergeEnabled, setValue])

  const isDisabled =
    (apiError && (apiError.type === 'fetchGeneral' || apiError.type === 'updateGeneral')) || isUpdatingFeaturesSettings

  const tooltipMessage = isDisabled
    ? t('views:repos.settingsToolTip', 'Cannot change settings while loading or updating.')
    : ''

  return (
    <Layout.Vertical gap="xl">
      <Text variant="heading-subsection" as="h3">
        {t('views:repos.features', 'Features')}
      </Text>

      {isLoadingFeaturesSettings ? (
        <Skeleton.Form />
      ) : (
        <ControlGroup>
          <Checkbox
            checked={watch('gitLfsEnabled')}
            id="git-lfs-enabled"
            onCheckedChange={checked => onFieldChange('gitLfsEnabled', !!checked)}
            disabled={isDisabled}
            title={tooltipMessage}
            label={t('views:repos.gitLfs', 'Git LFS')}
            caption={t('views:repos.gitLfsDescription', 'Enable Git Large File Storage (LFS) for this repository.')}
          />
          {errors.gitLfsEnabled && (
            <Message theme={MessageTheme.ERROR}>{errors.gitLfsEnabled.message?.toString()}</Message>
          )}
          <Checkbox
            checked={watch('autoMergeEnabled')}
            id="auto-merge-enabled"
            onCheckedChange={checked => onFieldChange('autoMergeEnabled', !!checked)}
            disabled={isDisabled}
            title={tooltipMessage}
            label={t('views:repos.autoMerge', 'Allow auto-merge')}
            caption={t(
              'views:repos.autoMergeDescription',
              'Automatically merge pull requests when all checks pass and approvals are met.'
            )}
          />
          {errors.autoMergeEnabled && (
            <Message theme={MessageTheme.ERROR}>{errors.autoMergeEnabled.message?.toString()}</Message>
          )}
        </ControlGroup>
      )}

      {!!apiError && (apiError.type === ErrorTypes.FETCH_GENERAL || apiError.type === ErrorTypes.UPDATE_GENERAL) && (
        <Text color="danger">{apiError.message}</Text>
      )}
    </Layout.Vertical>
  )
}
