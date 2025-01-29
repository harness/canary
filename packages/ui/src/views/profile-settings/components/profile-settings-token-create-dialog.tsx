import { FC, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import {
  Button,
  CopyButton,
  Dialog,
  Fieldset,
  FormWrapper,
  Input,
  Select,
  SelectContent,
  SelectItem
} from '@/components'
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
    resolver: zodResolver(tokenCreateFormSchema),
    mode: 'onChange',
    defaultValues: createdTokenData || {
      identifier: '',
      lifetime: '',
      token: ''
    }
  })

  const expirationValue = watch('lifetime')
  const identifier = watch('identifier')

  useEffect(() => {
    !open && reset()
  }, [open, reset])

  useEffect(() => {
    if (createdTokenData) {
      setValue('identifier', createdTokenData.identifier)
      setValue('lifetime', createdTokenData.lifetime)
      setValue('token', createdTokenData.token)
    }
  }, [createdTokenData, setValue])

  const handleSelectChange = (fieldName: keyof TokenFormType, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }

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
        <FormWrapper onSubmit={handleSubmit(handleFormSubmit)}>
          <Fieldset>
            <Input
              id="identifier"
              value={identifier}
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
                  'Your token has been generated. Please make sure to copy and store your token somewhere safe, you won’t beable to see it again.'
                )}
              </span>
            </>
          ) : (
            <>
              <Fieldset className="gap-y-0">
                <Select
                  value={expirationValue}
                  onValueChange={value => handleSelectChange('lifetime', value)}
                  label={t('views:profileSettings.expiration', 'Expiration')}
                  placeholder={t('views:profileSettings.select', 'Select')}
                  error={errors.lifetime?.message?.toString()}
                >
                  <SelectContent>
                    {expirationOptions.map(expirationOption => {
                      return (
                        <SelectItem key={expirationOption.value} value={expirationOption.value}>
                          <span className="text-foreground-1">{expirationOption.label}</span>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                {isValid && (
                  <span className="mt-1.5 text-14 text-foreground-3">
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
                {error?.type === ApiErrorType.TokenCreate && (
                  <span className="mt-1.5 text-14 text-destructive">{error.message}</span>
                )}
              </Fieldset>
            </>
          )}
          <Dialog.Footer className="-mx-5 -mb-5">
            <Button type="button" variant="outline" onClick={onClose}>
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
