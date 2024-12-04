import { SubmitHandler, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
  Button,
  ButtonGroup,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spacer,
  Text
} from '@harnessio/canary'
import { FormFieldSet } from '@harnessio/views'

const formSchema = z.object({
  identifier: z.string().min(1, { message: 'Please provide a name' }),
  lifetime: z.string().min(1, { message: 'Please select an expiration' })
})

export type TokenFormType = z.infer<typeof formSchema>

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
    resolver: zodResolver(formSchema),
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
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* NAME */}
        <FormFieldSet.Root>
          <FormFieldSet.ControlGroup>
            <FormFieldSet.Label htmlFor="identifier" required>
              Name
            </FormFieldSet.Label>
            <Input
              id="identifier"
              value={identifier}
              {...register('identifier')}
              placeholder="Enter token name"
              autoFocus
            />
            {errors.identifier && (
              <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
                {errors.identifier.message?.toString()}
              </FormFieldSet.Message>
            )}
          </FormFieldSet.ControlGroup>
        </FormFieldSet.Root>

        <FormFieldSet.Root>
          <FormFieldSet.ControlGroup>
            <FormFieldSet.Label htmlFor="lifetime" required>
              Expiration
            </FormFieldSet.Label>
            <Select value={expirationValue} onValueChange={value => handleSelectChange('lifetime', value)}>
              <SelectTrigger id="lifetime">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
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
            {errors.lifetime && (
              <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
                {errors.lifetime.message?.toString()}
              </FormFieldSet.Message>
            )}
          </FormFieldSet.ControlGroup>
        </FormFieldSet.Root>

        {/* Expiration Info */}
        {isValid && (
          <FormFieldSet.Root>
            <FormFieldSet.ControlGroup>
              {watch('lifetime') === 'never' ? (
                <Text color="tertiaryBackground">Token will never expire</Text>
              ) : (
                <Text color="tertiaryBackground">
                  Token will expire on {calculateExpirationDate(watch('lifetime'))}
                </Text>
              )}
            </FormFieldSet.ControlGroup>
          </FormFieldSet.Root>
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
        <FormFieldSet.Root>
          <FormFieldSet.ControlGroup>
            <ButtonGroup.Root className="justify-end">
              <>
                <Button type="button" variant="outline" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={!isValid || isLoading}>
                  {!isLoading ? 'Generate Token' : 'Generating Token...'}
                </Button>
              </>
            </ButtonGroup.Root>
          </FormFieldSet.ControlGroup>
        </FormFieldSet.Root>
      </form>
    </>
  )
}
