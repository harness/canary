import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import {
  Checkbox,
  ControlGroup,
  Fieldset,
  Layout,
  Message,
  MessageTheme,
  Skeleton,
  Spacer,
  Text
} from '@/components'
import { useTranslation } from '@/context'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { ErrorTypes } from '../types'

const formSchema = z.object({
  secretScanning: z.boolean(),
  verifyCommitterIdentity: z.boolean(),
  vulnerabilityScanning: z.boolean()
})

export type RepoSettingsSecurityFormFields = z.infer<typeof formSchema>

interface RepoSettingsSecurityFormProps {
  securityScanning: boolean
  verifyCommitterIdentity: boolean
  vulnerabilityScanning: boolean
  apiError: { type: ErrorTypes; message: string } | null
  handleUpdateSecuritySettings: (data: RepoSettingsSecurityFormFields) => void
  isUpdatingSecuritySettings: boolean
  isLoadingSecuritySettings: boolean
  showVulnerabilityScanning?: boolean
}

export const RepoSettingsSecurityForm: FC<RepoSettingsSecurityFormProps> = ({
  securityScanning,
  verifyCommitterIdentity,
  vulnerabilityScanning,
  handleUpdateSecuritySettings,
  apiError,
  isLoadingSecuritySettings,
  showVulnerabilityScanning = false
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
      verifyCommitterIdentity: verifyCommitterIdentity,
      vulnerabilityScanning: vulnerabilityScanning
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

  const onVulnerabilityScanningCheckboxChange = (checked: boolean) => {
    setValue('vulnerabilityScanning', checked)
    handleSubmit(data => {
      handleUpdateSecuritySettings(data)
    })()
  }

  useEffect(() => {
    setValue('secretScanning', securityScanning)
    setValue('verifyCommitterIdentity', verifyCommitterIdentity)
    setValue('vulnerabilityScanning', vulnerabilityScanning)
  }, [securityScanning, verifyCommitterIdentity, vulnerabilityScanning, setValue])

  const isDisabled = apiError && (apiError.type === 'fetchSecurity' || apiError.type === 'updateSecurity')
  const tooltipMessage = isDisabled
    ? t('views:repos.settingsToolTip', 'Cannot change settings while loading or updating.')
    : ''

  return (
    <Fieldset className="gap-y-6">
      <Layout.Vertical gap="xl">
        <Text variant="heading-subsection">{t('views:repos.security', 'Security')}</Text>
        {isLoadingSecuritySettings ? (
          <Skeleton.Form linesCount={2} />
        ) : (
          <ControlGroup>
            <Layout.Vertical gap="sm">
              <Checkbox
                checked={watch('secretScanning')}
                id="secret-scanning"
                onCheckedChange={onSecurityScanningCheckboxChange}
                disabled={isDisabled ?? false}
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

              {showVulnerabilityScanning ? (
                <>
                  <Checkbox
                    checked={watch('vulnerabilityScanning')}
                    id="vulnerability-scanning"
                    onCheckedChange={onVulnerabilityScanningCheckboxChange}
                    disabled={isDisabled ?? false}
                    title={tooltipMessage}
                    label={t('views:repos.vulnerabilityScanning', 'Vulnerability scanning')}
                    caption={t(
                      'views:repos.vulnerabilityScanningDescription',
                      'Scan incoming commits for known vulnerabilities.'
                    )}
                  />
                  {errors.vulnerabilityScanning && (
                    <Message theme={MessageTheme.ERROR}>{errors.vulnerabilityScanning.message?.toString()}</Message>
                  )}
                </>
              ) : null}

              <Checkbox
                checked={watch('verifyCommitterIdentity')}
                id="verify-committer-identity"
                onCheckedChange={onVerifyCommitterIdentityCheckboxChange}
                disabled={isDisabled ?? false}
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
            </Layout.Vertical>
          </ControlGroup>
        )}
      </Layout.Vertical>

      {!!apiError && (apiError.type === ErrorTypes.FETCH_SECURITY || apiError.type === ErrorTypes.UPDATE_SECURITY) && (
        <>
          <Spacer size={2} />
          <Text color="danger">{apiError.message}</Text>
        </>
      )}
    </Fieldset>
  )
}
