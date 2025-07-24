import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Checkbox, ControlGroup, Fieldset, Message, MessageTheme, SkeletonForm, Spacer, Text } from '@/components'
import { useTranslation } from '@/context'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { ErrorTypes } from '../types'

const formSchema = z.object({
  secretScanning: z.boolean(),
  verifyCommitterIdentity: z.boolean()
})

export type RepoSettingsSecurityFormFields = z.infer<typeof formSchema>

interface RepoSettingsSecurityFormProps {
  securityScanning: boolean
  verifyCommitterIdentity: boolean
  apiError: { type: ErrorTypes; message: string } | null
  handleUpdateSecuritySettings: (data: RepoSettingsSecurityFormFields) => void
  isUpdatingSecuritySettings: boolean
  isLoadingSecuritySettings: boolean
}

export const RepoSettingsSecurityForm: FC<RepoSettingsSecurityFormProps> = ({
  securityScanning,
  verifyCommitterIdentity,
  handleUpdateSecuritySettings,
  apiError,
  isUpdatingSecuritySettings,
  isLoadingSecuritySettings
}) => {
  const { t } = useTranslation()
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<RepoSettingsSecurityFormFields>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      secretScanning: securityScanning,
      verifyCommitterIdentity: verifyCommitterIdentity
    }
  })

  const onSecurityScanningCheckboxChange = (checked: boolean) => {
    setValue('secretScanning', checked)
    handleSubmit(data => {
      handleUpdateSecuritySettings(data)
    })()
  }

  const onVerifyCommitterIdentityCheckboxChange = (checked: boolean) => {
    setValue('verifyCommitterIdentity', checked)
    handleSubmit(data => {
      handleUpdateSecuritySettings(data)
    })()
  }

  useEffect(() => {
    setValue('secretScanning', securityScanning)
    setValue('verifyCommitterIdentity', verifyCommitterIdentity)
  }, [securityScanning, verifyCommitterIdentity, setValue])

  const isDisabled =
    (apiError && (apiError.type === 'fetchSecurity' || apiError.type === 'updateSecurity')) ||
    isUpdatingSecuritySettings

  const tooltipMessage = isDisabled
    ? t('views:repos.settingsToolTip', 'Cannot change settings while loading or updating.')
    : ''

  return (
    <Fieldset className="gap-y-6">
      <Text variant="heading-subsection">{t('views:repos.security', 'Security')}</Text>
      {isLoadingSecuritySettings ? (
        <SkeletonForm linesCount={2} />
      ) : (
        <ControlGroup>
          <Checkbox
            checked={watch('secretScanning')}
            id="secret-scanning"
            onCheckedChange={onSecurityScanningCheckboxChange}
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

          <Checkbox
            checked={watch('verifyCommitterIdentity')}
            id="verify-committer-identity"
            onCheckedChange={onVerifyCommitterIdentityCheckboxChange}
            disabled={isDisabled}
            title={tooltipMessage}
            label={t('views:repos.verifyCommitterIdentity', 'Verify committer identity')}
            caption={t(
              'views:repos.verifyCommitterIdentityDescription',
              'Block commits not committed by the user pushing the changes.'
            )}
          />
          {errors.verifyCommitterIdentity && (
            <Message theme={MessageTheme.ERROR}>{errors.verifyCommitterIdentity.message?.toString()}</Message>
          )}
        </ControlGroup>
      )}

      {!!apiError && (apiError.type === ErrorTypes.FETCH_SECURITY || apiError.type === ErrorTypes.UPDATE_SECURITY) && (
        <>
          <Spacer size={2} />
          <Text color="danger">{apiError.message}</Text>
        </>
      )}
    </Fieldset>
  )
}
