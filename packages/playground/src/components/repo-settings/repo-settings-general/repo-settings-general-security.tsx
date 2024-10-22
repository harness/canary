import React, { useEffect } from 'react'
import { Text, Checkbox, Spacer } from '@harnessio/canary'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormFieldSet, SkeletonList } from '../../../index'
import { ErrorTypes } from './types'
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
}

export const RepoSettingsSecurityForm: React.FC<RepoSettingsSecurityFormProps> = ({
  securityScanning,
  handleUpdateSecuritySettings,
  apiError,
  isUpdatingSecuritySettings,
  isLoadingSecuritySettings
}) => {
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
  }, [securityScanning])

  if (isLoadingSecuritySettings) {
    return <SkeletonList />
  }

  const isDisabled =
    (apiError && (apiError.type === 'fetchSecurity' || apiError.type === 'updateSecurity')) ||
    isUpdatingSecuritySettings

  const tooltipMessage = isDisabled ? 'Cannot change settings while loading or updating.' : ''

  return (
    <>
      <Text size={4} weight="medium">
        Security
      </Text>
      <FormFieldSet.Root className="mb-0">
        <FormFieldSet.ControlGroup>
          <FormFieldSet.Option
            className="mt-0"
            control={
              <Checkbox
                checked={watch('secretScanning')}
                id="secret-scanning"
                onCheckedChange={onCheckboxChange}
                disabled={isDisabled}
                title={tooltipMessage}
              />
            }
            id="secret-scanning"
            label="Secret scanning"
            description="Block commits containing secrets like passwords, API keys and tokens."
          />
          {errors.secretScanning && (
            <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
              {errors.secretScanning.message?.toString()}
            </FormFieldSet.Message>
          )}
        </FormFieldSet.ControlGroup>

        {apiError && (apiError.type === 'fetchSecurity' || apiError.type === 'updateSecurity') && (
          <>
            <Spacer size={2} />
            <Text size={1} className="text-destructive">
              {apiError.message}
            </Text>
          </>
        )}
      </FormFieldSet.Root>
    </>
  )
}
