import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
  Button,
  ButtonGroup,
  Icon,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text
} from '@harnessio/canary'

import { FormFieldSet } from '../../index'

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

export function TokenCreateForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<TokenFormType>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      identifier: ''
    }
  })

  const expirationValue = watch('lifetime')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSelectChange = (fieldName: keyof TokenFormType, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }

  const handleFormSubmit: SubmitHandler<TokenFormType> = data => {
    setIsSubmitting(true)
    setTimeout(() => {
      console.log('Token created:', data)
      reset()
      setIsSubmitting(false)
      setIsSubmitted(true)
      setTimeout(() => setIsSubmitted(false), 2000)
    }, 2000)
  }

  const handleCancel = () => {}

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
            <Input id="identifier" {...register('identifier')} placeholder="Enter token name" autoFocus />
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

        {/* SUBMIT BUTTONS */}
        <FormFieldSet.Root>
          <FormFieldSet.ControlGroup>
            <ButtonGroup.Root className="justify-end">
              {!isSubmitted ? (
                <>
                  <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={!isValid || isSubmitting}>
                    {!isSubmitting ? 'Generate Token' : 'Generating Token...'}
                  </Button>
                </>
              ) : (
                <Button variant="ghost" type="button" size="sm" theme="success" className="pointer-events-none">
                  Token Generated&nbsp;&nbsp;
                  <Icon name="tick" size={14} />
                </Button>
              )}
            </ButtonGroup.Root>
          </FormFieldSet.ControlGroup>
        </FormFieldSet.Root>
      </form>
    </>
  )
}
