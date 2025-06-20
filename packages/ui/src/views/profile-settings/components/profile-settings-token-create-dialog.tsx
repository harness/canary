import { FC, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Alert, Button, ButtonLayout, CopyButton, Dialog, Fieldset, FormInput, FormWrapper } from '@/components'
import { useTranslation } from '@/context'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { ApiErrorType, IProfileSettingsStore, TokenFormType } from '../types'

interface ProfileSettingsTokenCreateDialogProps {
  open: boolean
  onClose: () => void
  handleCreateToken: (data: TokenFormType) => void
  error: { type: string; message: string } | null
  isLoading: boolean
  useProfileSettingsStore: () => IProfileSettingsStore
}

export const tokenCreateFormSchema = z.object({
  identifier: z.string().min(1, { message: 'Please provide a name' }),
  lifetime: z.string().min(1, { message: 'Please select an expiration' }),
  token: z.string()
})

const expirationOptions = [
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
  { value: '60', label: '60 days' },
  { value: '90', label: '90 days' },
  { value: 'never', label: 'Never' }
]

export const ProfileSettingsTokenCreateDialog: FC<ProfileSettingsTokenCreateDialogProps> = ({
  open,
  onClose,
  handleCreateToken,
  error,
  isLoading,
  useProfileSettingsStore
}) => {
  const { createdTokenData } = useProfileSettingsStore()
  const { t } = useTranslation()
  const formMethods = useForm<TokenFormType>({
    resolver: zodResolver(tokenCreateFormSchema),
    mode: 'onChange',
    defaultValues: {
      identifier: '',
      lifetime: '',
      token: ''
    }
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid }
  } = formMethods

  const identifier = watch('identifier')

  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset, setValue])

  useEffect(() => {
    if (createdTokenData) {
      setValue('identifier', createdTokenData.identifier)
      setValue('lifetime', createdTokenData.lifetime)
      setValue('token', createdTokenData.token)
    }
  }, [createdTokenData, setValue])

  const handleFormSubmit: SubmitHandler<TokenFormType> = data => {
    handleCreateToken(data)
  }

  const calculateExpirationDate = (lifetime: string): string => {
    if (lifetime === 'never') return ''

    const days = parseInt(lifetime, 10)
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + days)

    return expirationDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content aria-describedby={undefined}>
        <Dialog.Header>
          <Dialog.Title>{t('views:profileSettings.createToken', 'Create a token')}</Dialog.Title>
        </Dialog.Header>
        <FormWrapper {...formMethods} onSubmit={handleSubmit(handleFormSubmit)} className="block">
          <Dialog.Body>
            <div className="mb-7 space-y-7">
              <Fieldset>
                <FormInput.Text
                  id="identifier"
                  value={identifier}
                  {...register('identifier')}
                  placeholder={t('views:profileSettings.enterTokenPlaceholder', 'Enter token name')}
                  label={t('views:profileSettings.name', 'Name')}
                  error={errors.identifier?.message?.toString()}
                  suffix={createdTokenData && <CopyButton iconSize="xs" name={createdTokenData.identifier || ''} />}
                  readOnly={!!createdTokenData}
                  autoFocus
                />
              </Fieldset>
              {createdTokenData ? (
                <>
                  <Fieldset>
                    <FormInput.Text
                      id="lifetime"
                      {...register('lifetime')}
                      defaultValue={createdTokenData?.lifetime}
                      label={t('views:profileSettings.expiration', 'Expiration')}
                      readOnly
                    />
                  </Fieldset>
                  <Fieldset>
                    <FormInput.Text
                      className="truncate"
                      id="token"
                      {...register('token')}
                      defaultValue={createdTokenData?.token}
                      readOnly
                      label={t('views:profileSettings.token', 'Token')}
                      suffix={
                        <CopyButton buttonVariant="transparent" iconSize="xs" name={createdTokenData?.token || ''} />
                      }
                    />
                  </Fieldset>
                  <span className="text-2 text-cn-foreground-1">
                    {t(
                      'views:profileSettings.tokenSuccessDescription',
                      'Your token has been generated. Please make sure to copy and store your token somewhere safe, you won’t beable to see it again.'
                    )}
                  </span>
                </>
              ) : (
                <Fieldset className="gap-y-0">
                  <FormInput.Select
                    options={expirationOptions}
                    {...register('lifetime')}
                    label={t('views:profileSettings.expiration', 'Expiration')}
                    placeholder={t('views:profileSettings.select', 'Select')}
                  />

                  {isValid && (
                    <span className="mt-1.5 text-2 text-cn-foreground-3">
                      {watch('lifetime') === 'never' ? (
                        <span>{t('views:profileSettings.tokenExpiryNone', 'Token will never expire')}</span>
                      ) : (
                        <span>
                          {t('views:profileSettings.tokenExpiryDate', 'Token will expire on')}{' '}
                          {calculateExpirationDate(watch('lifetime'))}
                        </span>
                      )}
                    </span>
                  )}
                </Fieldset>
              )}
              {error?.type === ApiErrorType.TokenCreate && (
                <Alert.Root theme="danger">
                  <Alert.Title>{error.message}</Alert.Title>
                </Alert.Root>
              )}
            </div>
          </Dialog.Body>
          <Dialog.Footer>
            <ButtonLayout>
              <Dialog.Close onClick={onClose}>
                {createdTokenData
                  ? t('views:profileSettings.gotItButton', 'Got it')
                  : t('views:profileSettings.cancel', 'Cancel')}
              </Dialog.Close>
              {!createdTokenData && (
                <Button type="submit" disabled={isLoading}>
                  {!isLoading
                    ? t('views:profileSettings.generateTokenButton', 'Generate token')
                    : t('views:profileSettings.generatingTokenButton', 'Generating token...')}
                </Button>
              )}
            </ButtonLayout>
          </Dialog.Footer>
        </FormWrapper>
      </Dialog.Content>
    </Dialog.Root>
  )
}
