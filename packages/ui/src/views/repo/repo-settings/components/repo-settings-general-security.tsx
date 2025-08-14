import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Checkbox, ControlGroup, Layout, Message, MessageTheme, Skeleton, Text } from '@/components'
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

  const isDisabled = !!(apiError && (apiError.type === 'fetchSecurity' || apiError.type === 'updateSecurity'))
  const tooltipMessage = isDisabled
    ? t('views:repos.settingsToolTip', 'Cannot change settings while loading or updating.')
    : ''

  return (
    <Layout.Vertical gap="xl">
      <Text variant="heading-subsection" as="h3">
        {t('views:repos.security', 'Security')}
      </Text>

      {isLoadingSecuritySettings ? (
        <Skeleton.Form linesCount={2} />
      ) : (
        <Layout.Vertical gap="sm">
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
              error={!!errors.secretScanning}
            />
            {errors.secretScanning && (
              <Message theme={MessageTheme.ERROR}>{errors.secretScanning.message?.toString()}</Message>
            )}
          </ControlGroup>

          {showVulnerabilityScanning && (
            <ControlGroup>
              <Checkbox
                checked={watch('vulnerabilityScanning')}
                id="vulnerability-scanning"
                onCheckedChange={onVulnerabilityScanningCheckboxChange}
                disabled={isDisabled}
                title={tooltipMessage}
                label={t('views:repos.vulnerabilityScanning', 'Vulnerability scanning')}
                caption={t(
                  'views:repos.vulnerabilityScanningDescription',
                  'Scan incoming commits for known vulnerabilities.'
                )}
                error={!!errors.vulnerabilityScanning}
              />
              {errors.vulnerabilityScanning && (
                <Message theme={MessageTheme.ERROR}>{errors.vulnerabilityScanning.message?.toString()}</Message>
              )}
            </ControlGroup>
          )}

          <ControlGroup>
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
              error={!!errors.verifyCommitterIdentity}
            />
            {errors.verifyCommitterIdentity && (
              <Message theme={MessageTheme.ERROR}>{errors.verifyCommitterIdentity.message?.toString()}</Message>
            )}
          </ControlGroup>
        </Layout.Vertical>
      )}

      {(apiError?.type === ErrorTypes.FETCH_SECURITY || apiError?.type === ErrorTypes.UPDATE_SECURITY) && (
        <Text color="danger">{apiError.message}</Text>
      )}
    </Layout.Vertical>
  )
}
