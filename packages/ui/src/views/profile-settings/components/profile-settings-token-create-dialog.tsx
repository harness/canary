import { FC, useEffect, useMemo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Alert, Button, CopyButton, Dialog, Fieldset, FormWrapper, Input, Select } from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { TranslationStore } from '@views/repo'
import { z } from 'zod'

import { ApiErrorType, IProfileSettingsStore, TokenFormType } from '../types'

interface ProfileSettingsTokenCreateDialogProps {
  open: boolean
  onClose: () => void
  handleCreateToken: (data: TokenFormType) => void
  error: { type: string; message: string } | null
  isLoading: boolean
  useTranslationStore: () => TranslationStore
  useProfileSettingsStore: () => IProfileSettingsStore
}

export const makeTokenCreateFormSchema = (t: TranslationStore['t']) =>
  z.object({
    identifier: z
      .string()
      .trim()
      .nonempty(t('views:profileSettings.createTokenDialog.validation.nameMin', 'Please provide token name'))
      .max(
        100,
        t('views:profileSettings.createTokenDialog.validation.nameMax', 'Name must be no longer than 100 characters')
      )
      .regex(
        /^[a-zA-Z0-9._-\s]+$/,
        t(
          'views:profileSettings.createTokenDialog.validation.nameRegex',
          'Name must contain only letters, numbers, and the characters: - _ .'
        )
      )
      .refine(
        data => !data.includes(' '),
        t('views:profileSettings.createTokenDialog.validation.noSpaces', 'Name cannot contain spaces')
      ),
    lifetime: z
      .string()
      .nonempty(t('views:profileSettings.createTokenDialog.validation.expiration', 'Please select the expiration')),
    token: z.string()
  })

const getExpirationOptions = (t: TranslationStore['t']) => [
  { value: '7', label: t('views:profileSettings.createTokenDialog.expirationOptions.7_days', '7 days') },
  { value: '30', label: t('views:profileSettings.createTokenDialog.expirationOptions.30_days', '30 days') },
  { value: '60', label: t('views:profileSettings.createTokenDialog.expirationOptions.60_days', '60 days') },
  { value: '90', label: t('views:profileSettings.createTokenDialog.expirationOptions.90_days', '90 days') },
  { value: 'never', label: t('views:profileSettings.createTokenDialog.expirationOptions.never', 'Never') }
]

const defaultValues = { identifier: '', lifetime: '', token: '' }

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

export const ProfileSettingsTokenCreateDialog: FC<ProfileSettingsTokenCreateDialogProps> = ({
  open,
  onClose,
  handleCreateToken,
  error,
  isLoading,
  useTranslationStore,
  useProfileSettingsStore
}) => {
  const { createdTokenData } = useProfileSettingsStore()
  const { t } = useTranslationStore()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<TokenFormType>({
    resolver: zodResolver(makeTokenCreateFormSchema(t)),
    mode: 'onChange',
    defaultValues
  })

  const expirationOptions = useMemo(() => getExpirationOptions(t), [t])
  const expirationValue = watch('lifetime')

  useEffect(() => {
    if (!createdTokenData) return

    reset(createdTokenData)
  }, [createdTokenData, reset])

  const handleSelectLifetime = (value: string) => setValue('lifetime', value, { shouldValidate: true })

  const handleFormSubmit: SubmitHandler<TokenFormType> = data => {
    handleCreateToken(data)
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => reset(defaultValues), 300)
  }

  const handleOpenChange = (isOpen: boolean) => !isOpen && handleClose()

  const getSelectCaption = () => {
    if (!isValid) return

    return expirationValue === 'never'
      ? t('views:profileSettings.createTokenDialog.tokenExpiryNone', 'Token will never expire')
      : `${t('views:profileSettings.createTokenDialog.tokenExpiryDate', 'Token will expire on')} ${calculateExpirationDate(expirationValue)}`
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Content aria-describedby={undefined}>
        <Dialog.Header>
          <Dialog.Title>{t('views:profileSettings.createTokenDialog.title', 'Create a token')}</Dialog.Title>
        </Dialog.Header>
        <FormWrapper onSubmit={handleSubmit(handleFormSubmit)}>
          <Fieldset legend="Token details">
            <Input
              id="identifier"
              size="md"
              {...register('identifier')}
              placeholder={t('views:profileSettings.createTokenDialog.namePlaceholder', 'Enter token name')}
              label={t('views:profileSettings.createTokenDialog.nameLabel', 'Name')}
              error={errors.identifier?.message?.toString()}
              rightElement={
                createdTokenData && (
                  <CopyButton className="bg-background-1 absolute right-2.5" name={createdTokenData.identifier || ''} />
                )
              }
              readOnly={!!createdTokenData}
              autoFocus
            />
            {createdTokenData ? (
              <>
                <Input
                  id="lifetime"
                  value={createdTokenData?.lifetime}
                  size="md"
                  label={t('views:profileSettings.createTokenDialog.expiration', 'Expiration')}
                  readOnly
                />
                <Input
                  className="truncate"
                  id="token"
                  value={createdTokenData?.token}
                  size="md"
                  readOnly
                  label={t('views:profileSettings.createTokenDialog.tokenFieldLabel', 'Token')}
                  rightElement={
                    <CopyButton className="bg-background-1 absolute right-2.5" name={createdTokenData?.token || ''} />
                  }
                />
                <span className="text-14 text-foreground-1">
                  {t(
                    'views:profileSettings.createTokenDialog.successDescription',
                    'Your token has been generated. Please make sure to copy and store your token somewhere safe, you won’t be able to see it again.'
                  )}
                </span>
              </>
            ) : (
              <Select.Root
                value={expirationValue}
                onValueChange={handleSelectLifetime}
                label={t('views:profileSettings.createTokenDialog.expirationLabel', 'Expiration')}
                placeholder={t('views:profileSettings.createTokenDialog.expirationPlaceholder', 'Select')}
                error={errors.lifetime?.message?.toString()}
                caption={getSelectCaption()}
              >
                <Select.Content>
                  {expirationOptions.map(expirationOption => (
                    <Select.Item
                      key={expirationOption.value}
                      className="text-foreground-1"
                      value={expirationOption.value}
                    >
                      {expirationOption.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            )}
          </Fieldset>

          {error?.type === ApiErrorType.TokenCreate && (
            <Alert.Container variant="destructive">
              <Alert.Title>{error.message}</Alert.Title>
            </Alert.Container>
          )}

          <Dialog.Footer className="-mx-5 -mb-5">
            <Button type="button" variant="outline" onClick={handleClose}>
              {createdTokenData
                ? t('views:profileSettings.createTokenDialog.gotItButton', 'Got it')
                : t('views:profileSettings.createTokenDialog.cancelButton', 'Cancel')}
            </Button>
            {!createdTokenData && (
              <Button type="submit" disabled={!isValid || isLoading}>
                {!isLoading
                  ? t('views:profileSettings.createTokenDialog.generateButton', 'Generate token')
                  : t('views:profileSettings.createTokenDialog.generatingButton', 'Generating token...')}
              </Button>
            )}
          </Dialog.Footer>
        </FormWrapper>
      </Dialog.Content>
    </Dialog.Root>
  )
}
