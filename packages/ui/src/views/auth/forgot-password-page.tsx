import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Alert, Button, Card, Input, Link, Spacer, Text } from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Floating1ColumnLayout } from '..'
import { Agreements } from './components/agreements'
import { AnimatedHarnessLogo } from './components/animated-harness-logo'

interface ForgotPasswordPageProps {
  isLoading?: boolean
  onSubmit?: (emailData: ForgotPasswordData) => void
  error?: string
}

export interface ForgotPasswordData {
  email?: string
}

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' })
})

export function ForgotPasswordPage({ isLoading, onSubmit, error }: ForgotPasswordPageProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    trigger,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  })

  const handleOnSubmit: SubmitHandler<ForgotPasswordData> = data => {
    // Handle the submission of the forgot password form
    if (onSubmit) {
      onSubmit(data)
    }
  }

  const handleInputChange = async () => {
    if (serverError) {
      setServerError(null)
      clearErrors(['email'])
      await trigger()
    }
  }

  useEffect(() => {
    if (error) {
      setServerError(error)
      setError('email', {
        type: 'manual',
        message: error
      })
    } else {
      setServerError(null)
      clearErrors(['email'])
    }
  }, [error, setError, clearErrors])

  const hasError = Object.keys(errors).length > 0 || !!serverError

  return (
    <Floating1ColumnLayout
      className="flex-col bg-cn-background-1 pt-20 sm:pt-[186px]"
      highlightTheme={hasError ? 'error' : 'blue'}
      verticalCenter
    >
      <Card.Root className="relative z-10 mb-8 max-w-full" variant="plain" width="xl">
        <Card.Header className="items-center">
          <AnimatedHarnessLogo theme={hasError ? 'error' : 'blue'} />
          <Card.Title className="mt-3 text-center" as="h1">
            Forgot password?
          </Card.Title>
          <Text className="mt-0.5 leading-snug" size={2} color="foreground-4" align="center" as="p">
            Enter your email to receive the verification code.
          </Text>
        </Card.Header>
        {serverError && (
          <Alert.Container variant="destructive">
            <Alert.Title>{serverError}</Alert.Title>
          </Alert.Container>
        )}
        <Card.Content className="mt-10">
          <form onSubmit={handleSubmit(handleOnSubmit)}>
            <Input
              id="email"
              type="email"
              placeholder="Your email"
              label="Email"
              size="md"
              {...register('email', { onChange: handleInputChange })}
              error={errors.email?.message?.toString()}
              autoFocus
            />
            <Button className="mt-10 w-full" variant="outline" rounded type="submit" loading={isLoading}>
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </form>
          <Spacer size={4} />
          <Text className="block" size={2} color="foreground-5" weight="normal" align="center" as="p">
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </Text>
        </Card.Content>
      </Card.Root>
      <Agreements />
    </Floating1ColumnLayout>
  )
}
