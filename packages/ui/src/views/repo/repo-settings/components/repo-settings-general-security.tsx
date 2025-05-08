import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import {
  Checkbox,
  ControlGroup,
  Fieldset,
  Message,
  MessageTheme,
  Option,
  SkeletonForm,
  Spacer,
  Text
} from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { TranslationStore } from '@views/repo/repo-list/types'
import { z } from 'zod'

import { ErrorTypes } from '../types'

const formSchema = z.object({
  secretScanning: z.boolean()
})

export type RepoSettingsSecurityFormFields = z.infer<typeof formSchema>

interface RepoSettingsSecurityFormProps {
  securityScanning: boolean
  apiError: { type: ErrorTypes; message: string } | null
  handleUpdateSecuritySettings: (data: RepoSettingsSecurityFormFields) => void
  isUpdatingSecuritySettings: boolean
  isLoadingSecuritySettings: boolean
  useTranslationStore: () => TranslationStore
}

export const RepoSettingsSecurityForm: FC<RepoSettingsSecurityFormProps> = ({
  securityScanning,
  handleUpdateSecuritySettings,
  apiError,
  isUpdatingSecuritySettings,
  isLoadingSecuritySettings,
  useTranslationStore
}) => {
  const { t } = useTranslationStore()
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<RepoSettingsSecurityFormFields>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      secretScanning: securityScanning
    }
  })

  const onCheckboxChange = (checked: boolean) => {
    setValue('secretScanning', checked)
    handleSubmit(data => {
      handleUpdateSecuritySettings(data)
    })()
  }

  useEffect(() => {
    setValue('secretScanning', securityScanning)
  }, [securityScanning, setValue])

  const isDisabled =
    (apiError && (apiError.type === 'fetchSecurity' || apiError.type === 'updateSecurity')) ||
    isUpdatingSecuritySettings

  const tooltipMessage = isDisabled
    ? t('views:repos.settingsToolTip', 'Cannot change settings while loading or updating.')
    : ''

  return (
    <Fieldset className="gap-y-6">
      <Text size={13} weight="medium">
        {t('views:repos.security', 'Security')}
      </Text>
      {isLoadingSecuritySettings ? (
        <SkeletonForm linesCount={2} />
      ) : (
        <ControlGroup>
          <Checkbox
            checked={watch('secretScanning')}
            id="secret-scanning"
            onCheckedChange={onCheckboxChange}
            disabled={isDisabled}
            title={tooltipMessage}
            label={t('views:repos.secretScanning', 'Secret scanning')}
            caption={t(
              'views:repos.secretScanningDescription',
              'Block commits containing secrets like passwords, API keys and tokens.'
            )}
          />
          {errors.secretScanning && (
            <Message theme={MessageTheme.ERROR}>{errors.secretScanning.message?.toString()}</Message>
          )}
        </ControlGroup>
      )}

      {!!apiError && (apiError.type === ErrorTypes.FETCH_SECURITY || apiError.type === ErrorTypes.UPDATE_SECURITY) && (
        <>
          <Spacer size={2} />
          <Text size={1} className="text-cn-foreground-danger">
            {apiError.message}
          </Text>
        </>
      )}
    </Fieldset>
  )
}
