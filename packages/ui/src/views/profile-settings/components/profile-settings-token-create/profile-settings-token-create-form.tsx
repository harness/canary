import { SubmitHandler, useForm } from 'react-hook-form'

import {
  Button,
  ButtonGroup,
  ControlGroup,
  FormWrapper,
  Input,
  Select,
  SelectContent,
  SelectItem,
  Spacer,
  Text
} from '@/components'
import { TokenFormType } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { TranslationStore } from '@views/repo'
import { z } from 'zod'

export const tokenCreateFormSchema = z.object({
  identifier: z.string().min(1, { message: 'Please provide a name' }),
  lifetime: z.string().min(1, { message: 'Please select an expiration' })
})

const expirationOptions = [
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
  { value: '60', label: '60 days' },
  { value: '90', label: '90 days' },
  { value: 'never', label: 'Never' }
]

interface ProfileSettingsTokenCreateFormProps {
  error: { type: string; message: string } | null
  isLoading: boolean
  handleCreateToken: (data: TokenFormType) => void
  onClose: () => void
  useTranslationStore: () => TranslationStore
}

export function ProfileSettingsTokenCreateForm({
  error,
  isLoading,
  handleCreateToken,
  onClose,
  useTranslationStore
}: ProfileSettingsTokenCreateFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<TokenFormType>({
    resolver: zodResolver(tokenCreateFormSchema),
    mode: 'onChange',
    defaultValues: {
      identifier: '',
      lifetime: ''
    }
  })

  const { t } = useTranslationStore()

  const expirationValue = watch('lifetime')
  const identifier = watch('identifier')

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
    <FormWrapper onSubmit={handleSubmit(handleFormSubmit)}>
      <ControlGroup>
        <Input
          id="identifier"
          value={identifier}
          {...register('identifier')}
          placeholder={t('views:profileSettings.enterTokenPlaceholder', 'Enter token name')}
          label={t('views:profileSettings.name', 'Name')}
          error={errors.identifier?.message?.toString()}
          autoFocus
        />
      </ControlGroup>

      <ControlGroup>
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
                  {expirationOption.label}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
        {isValid && (
          <span className="mt-1.5">
            {watch('lifetime') === 'never' ? (
              <Text color="tertiaryBackground">
                {t('views:profileSettings.tokenExpiryNone', 'Token will never expire')}
              </Text>
            ) : (
              <Text color="tertiaryBackground">
                {t('views:profileSettings.tokenExpiryDate', ' Token will expire on')}{' '}
                {calculateExpirationDate(watch('lifetime'))}
              </Text>
            )}
          </span>
        )}
        {error && error.type === 'tokenCreate' && (
          <>
            <Text size={1} className="text-destructive">
              {error.message}
            </Text>
            <Spacer size={4} />
          </>
        )}
      </ControlGroup>
      <ControlGroup type="button">
        <ButtonGroup className="justify-end">
          <>
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              {t('views:profileSettings.cancel', 'Cancel')}
            </Button>
            <Button type="submit" size="sm" disabled={!isValid || isLoading}>
              {!isLoading
                ? t('views:profileSettings.generateTokenButton', 'Generate Token')
                : t('views:profileSettings.generatingTokenButton', 'Generating Token...')}
            </Button>
          </>
        </ButtonGroup>
      </ControlGroup>
    </FormWrapper>
  )
}
