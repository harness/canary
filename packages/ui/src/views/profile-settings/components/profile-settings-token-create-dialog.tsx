import { FC, useEffect, useMemo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Button, Caption, CopyButton, Dialog, Fieldset, FormWrapper, Input, Select, toast } from '@/components'
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
      .min(1, { message: t('views:profileSettings.tokenValidation.nameMin', 'Please provide token name') })
      .max(100, {
        message: t('views:profileSettings.tokenValidation.nameMax', 'Name must be no longer than 100 characters')
      })
      .regex(/^[a-zA-Z0-9._-\s]+$/, {
        message: t(
          'views:profileSettings.tokenValidation.nameRegex',
          'Name must contain only letters, numbers, and the characters: - _ .'
        )
      })
      .refine(data => !data.includes(' '), {
        message: t('views:profileSettings.tokenValidation.noSpaces', 'Name cannot contain spaces')
      }),
    lifetime: z
      .string()
      .min(1, { message: t('views:profileSettings.tokenValidation.expiration', 'Please select the expiration') }),
    token: z.string()
  })

const getExpirationOptions = (t: TranslationStore['t']) => [
  { value: '7', label: t('views:profileSettings.expirationOptions.7_days', '7 days') },
  { value: '30', label: t('views:profileSettings.expirationOptions.30_days', '30 days') },
  { value: '60', label: t('views:profileSettings.expirationOptions.60_days', '60 days') },
  { value: '90', label: t('views:profileSettings.expirationOptions.90_days', '90 days') },
  { value: 'never', label: t('views:profileSettings.expirationOptions.never', 'Never') }
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

  /**
   * Show an unexpected server error message
   * Ensure that validation errors are handled by the react-hook-form
   */
  useEffect(() => {
    if (!error || error?.type !== ApiErrorType.TokenCreate) return

    toast({ title: error.message, variant: 'destructive' })
  }, [error])

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Content aria-describedby={undefined}>
        <Dialog.Header>
          <Dialog.Title>{t('views:profileSettings.createToken', 'Create a token')}</Dialog.Title>
        </Dialog.Header>
        <FormWrapper onSubmit={handleSubmit(handleFormSubmit)}>
          <Fieldset>
            <Input
              id="identifier"
              size="md"
              {...register('identifier')}
              placeholder={t('views:profileSettings.enterTokenPlaceholder', 'Enter token name')}
              label={t('views:profileSettings.name', 'Name')}
              error={errors.identifier?.message?.toString()}
              rightElement={
                createdTokenData && (
                  <CopyButton className="absolute right-2.5 bg-background-1" name={createdTokenData.identifier || ''} />
                )
              }
              readOnly={!!createdTokenData}
              autoFocus
            />
          </Fieldset>
          {createdTokenData ? (
            <>
              <Fieldset>
                <Input
                  id="lifetime"
                  value={createdTokenData?.lifetime}
                  size="md"
                  label={t('views:profileSettings.expiration', 'Expiration')}
                  readOnly
                />
              </Fieldset>
              <Fieldset>
                <Input
                  className="truncate"
                  id="token"
                  value={createdTokenData?.token}
                  size="md"
                  readOnly
                  label={t('views:profileSettings.token', 'Token')}
                  rightElement={
                    <CopyButton className="absolute right-2.5 bg-background-1" name={createdTokenData?.token || ''} />
                  }
                />
              </Fieldset>
              <span className="text-14 text-foreground-1">
                {t(
                  'views:profileSettings.tokenSuccessDescription',
                  'Your token has been generated. Please make sure to copy and store your token somewhere safe, you won’t be able to see it again.'
                )}
              </span>
            </>
          ) : (
            <Fieldset className="gap-y-0">
              <Select.Root
                value={expirationValue}
                onValueChange={handleSelectLifetime}
                label={t('views:profileSettings.expiration', 'Expiration')}
                placeholder={t('views:profileSettings.select', 'Select')}
                error={errors.lifetime?.message?.toString()}
              >
                <Select.Content>
                  {expirationOptions.map(expirationOption => (
                    <Select.Item key={expirationOption.value} value={expirationOption.value}>
                      <span className="text-foreground-1">{expirationOption.label}</span>
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              {isValid && (
                <Caption>
                  {expirationValue === 'never'
                    ? t('views:profileSettings.tokenExpiryNone', 'Token will never expire')
                    : `${t('views:profileSettings.tokenExpiryDate', 'Token will expire on')} ${calculateExpirationDate(expirationValue)}`}
                </Caption>
              )}
            </Fieldset>
          )}

          <Dialog.Footer className="-mx-5 -mb-5">
            <Button type="button" variant="outline" onClick={handleClose}>
              {createdTokenData
                ? t('views:profileSettings.gotItButton', 'Got it')
                : t('views:profileSettings.cancel', 'Cancel')}
            </Button>
            {!createdTokenData && (
              <Button type="submit" disabled={!isValid || isLoading}>
                {!isLoading
                  ? t('views:profileSettings.generateTokenButton', 'Generate token')
                  : t('views:profileSettings.generatingTokenButton', 'Generating token...')}
              </Button>
            )}
          </Dialog.Footer>
        </FormWrapper>
      </Dialog.Content>
    </Dialog.Root>
  )
}
