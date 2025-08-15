import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Checkbox, ControlGroup, Layout, Message, MessageTheme, Skeleton, Text } from '@/components'
import { useTranslation } from '@/context'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { ErrorTypes } from '../types'

const formSchema = z.object({
  gitLfsEnabled: z.boolean()
})

export type RepoSettingsFeaturesFormFields = z.infer<typeof formSchema>

interface RepoSettingsFeaturesFormProps {
  gitLfsEnabled: boolean
  apiError: { type: ErrorTypes; message: string } | null
  handleUpdateFeaturesSettings: (data: RepoSettingsFeaturesFormFields) => void
  isUpdatingFeaturesSettings: boolean
  isLoadingFeaturesSettings: boolean
}

export const RepoSettingsFeaturesForm: FC<RepoSettingsFeaturesFormProps> = ({
  gitLfsEnabled,
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
      gitLfsEnabled
    }
  })

  const onCheckboxChange = (checked: boolean) => {
    setValue('gitLfsEnabled', checked)
    handleSubmit(data => {
      handleUpdateFeaturesSettings(data)
    })()
  }

  useEffect(() => {
    setValue('gitLfsEnabled', gitLfsEnabled)
  }, [gitLfsEnabled, setValue])

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
            onCheckedChange={onCheckboxChange}
            disabled={isDisabled}
            title={tooltipMessage}
            label={t('views:repos.gitLfs', 'Git LFS')}
            caption={t('views:repos.gitLfsDescription', 'Enable Git Large File Storage (LFS) for this repository.')}
          />
          {errors.gitLfsEnabled && (
            <Message theme={MessageTheme.ERROR}>{errors.gitLfsEnabled.message?.toString()}</Message>
          )}
        </ControlGroup>
      )}

      {!!apiError && (apiError.type === ErrorTypes.FETCH_GENERAL || apiError.type === ErrorTypes.UPDATE_GENERAL) && (
        <Text color="danger">{apiError.message}</Text>
      )}
    </Layout.Vertical>
  )
}
