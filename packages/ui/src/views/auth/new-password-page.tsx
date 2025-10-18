import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Alert, Button, FormInput, FormWrapper, Text } from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Floating1ColumnLayout } from '..'
import { Agreements } from './components/agreements'
import { AnimatedHarnessLogo } from './components/animated-harness-logo'

interface NewPasswordPageProps {
  isLoading?: boolean
  handleFormSubmit?: (data: NewPasswordData) => void
  error?: string
}

export interface NewPasswordData {
  password?: string
  confirmPassword?: string
}

const newPasswordSchema = z
  .object({
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })

export function NewPasswordPage({ isLoading, handleFormSubmit, error }: NewPasswordPageProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const formMethods = useForm({
    resolver: zodResolver(newPasswordSchema)
  })

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    trigger,
    formState: { errors }
  } = formMethods

  const onFormSubmit = (data: NewPasswordData) => {
    handleFormSubmit?.(data)
  }

  const handleInputChange = async () => {
    if (serverError) {
      setServerError(null)
      clearErrors(['confirmPassword'])
      await trigger()
    }
  }

  useEffect(() => {
    if (error) {
      setServerError(error)
      setError('password', {
        type: 'manual',
        message: ' '
      })
      setError('confirmPassword', {
        type: 'manual',
        message: error
      })
    } else {
      setServerError(null)
      clearErrors(['password', 'confirmPassword'])
    }
  }, [error, setError, clearErrors])

  const hasError = Object.keys(errors).length > 0 || !!serverError

  return (
    <Floating1ColumnLayout
      className="flex-col bg-cn-1 pt-cn-4xl sm:pt-[186px]"
      highlightTheme={hasError ? 'error' : 'blue'}
      verticalCenter
    >
      <div className="relative z-10 mb-cn-2xl w-80 max-w-full text-cn-1">
        <div className="flex flex-col items-center">
          <AnimatedHarnessLogo theme={hasError ? 'error' : 'blue'} />
          <Text className="mt-cn-sm" variant="heading-section" align="center" as="h1">
            Create new password
          </Text>
          <Text className="mt-cn-4xs" align="center">
            Your new password must be different from your previously used password.
          </Text>
        </div>
        {serverError && (
          <Alert.Root theme="danger">
            <Alert.Title>{serverError}</Alert.Title>
          </Alert.Root>
        )}
        <div className="mt-cn-3xl pt-0">
          <FormWrapper {...formMethods} onSubmit={handleSubmit(onFormSubmit)}>
            <FormInput.Text
              id="password"
              type="password"
              label="New password"
              {...register('password', { onChange: handleInputChange })}
              placeholder="Password (6+ characters)"
            />
            <FormInput.Text
              id="confirmPassword"
              type="password"
              label="Confirm password"
              {...register('confirmPassword', { onChange: handleInputChange })}
              placeholder="Confirm password"
            />
            <Button className="mt-cn-3xl w-full" rounded type="submit" loading={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </FormWrapper>
        </div>
      </div>
      <Agreements />
    </Floating1ColumnLayout>
  )
}
