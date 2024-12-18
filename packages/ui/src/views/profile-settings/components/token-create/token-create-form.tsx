import { SubmitHandler, useForm } from 'react-hook-form'

import {
  Button,
  ButtonGroup,
  ControlGroup,
  Fieldset,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spacer,
  Text
} from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormWrapper } from 'dist/components'
import { z } from 'zod'

import { TokenFormType } from '../../types'

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

interface TokenCreateFormProps {
  error: { type: string; message: string } | null
  isLoading: boolean
  handleCreateToken: (data: TokenFormType) => void
  onClose: () => void
}

export function TokenCreateForm({ error, isLoading, handleCreateToken, onClose }: TokenCreateFormProps) {
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
    <>
      <FormWrapper onSubmit={handleSubmit(handleFormSubmit)}>
        {/* NAME */}
        <Fieldset>
          <ControlGroup>
            <Input
              id="identifier"
              value={identifier}
              {...register('identifier')}
              placeholder="Enter token name"
              label="Name"
              error={errors.identifier?.message?.toString()}
              autoFocus
            />
          </ControlGroup>
        </Fieldset>

        <Fieldset>
          <ControlGroup>
            <Select
              value={expirationValue}
              onValueChange={value => handleSelectChange('lifetime', value)}
              label="Expiration"
              placeholder="Select"
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
          </ControlGroup>
        </Fieldset>

        {/* Expiration Info */}
        {isValid && (
          <Fieldset>
            <ControlGroup>
              {watch('lifetime') === 'never' ? (
                <Text color="tertiaryBackground">Token will never expire</Text>
              ) : (
                <Text color="tertiaryBackground">
                  Token will expire on {calculateExpirationDate(watch('lifetime'))}
                </Text>
              )}
            </ControlGroup>
          </Fieldset>
        )}

        <>
          {error && error.type === 'tokenCreate' && (
            <>
              <Text size={1} className="text-destructive">
                {error.message}
              </Text>
              <Spacer size={4} />
            </>
          )}
        </>

        {/* SUBMIT BUTTONS */}
        <Fieldset>
          <ControlGroup>
            <ButtonGroup className="justify-end">
              <>
                <Button type="button" variant="outline" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={!isValid || isLoading}>
                  {!isLoading ? 'Generate Token' : 'Generating Token...'}
                </Button>
              </>
            </ButtonGroup>
          </ControlGroup>
        </Fieldset>
      </FormWrapper>
    </>
  )
}
