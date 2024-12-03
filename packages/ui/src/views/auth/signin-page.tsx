import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { Button, Card, CardContent, CardHeader, CardTitle, Input, Spacer, Text } from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Floating1ColumnLayout } from '..'
import { Agreements } from './components/agreements'
import { AnimatedHarnessLogo } from './components/animated-harness-logo'

interface SignInPageProps {
  handleSignIn: (data: SignInData) => void
  isLoading?: boolean
  error?: string
}

export interface SignInData {
  email?: string
  password?: string
}

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'The field can’t be blank' })
})

export function SignInPage({ handleSignIn, isLoading, error }: SignInPageProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    trigger
  } = useForm({
    resolver: zodResolver(signInSchema)
  })

  const onSubmit = (data: SignInData) => {
    handleSignIn(data)
  }

  const handleInputChange = async () => {
    if (serverError) {
      setServerError(null)
      clearErrors(['password'])
      await trigger()
    }
  }

  useEffect(() => {
    if (error) {
      setServerError(error)
      setError('email', {
        type: 'manual',
        message: ' '
      })
      setError('password', {
        type: 'manual',
        message: error
      })
    } else {
      setServerError(null)
      clearErrors(['email', 'password'])
    }
  }, [error, setError, clearErrors])

  const hasError = Object.keys(errors).length > 0 || !!serverError

  return (
    <Floating1ColumnLayout
      className="flex-col bg-background-7 pt-20 sm:pt-[186px]"
      highlightTheme={hasError ? 'error' : 'blue'}
      verticalCenter
    >
      <Card className="relative z-10 mb-8 max-w-full" variant="plain" width="xl">
        <CardHeader className="items-center">
          <AnimatedHarnessLogo theme={hasError ? 'error' : 'blue'} />
          <CardTitle className="mt-3 text-center" as="h1">
            Sign in to Harness
          </CardTitle>
          <Text className="mt-0.5 leading-snug" size={2} color="foreground-4" align="center" as="p">
            Welcome back! Please enter your details.
          </Text>
        </CardHeader>
        <CardContent className="mt-10">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="Your email"
              size="md"
              {...register('email', { onChange: handleInputChange })}
              error={errors.email?.message?.toString()}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
            <Input
              wrapperClassName="mt-7"
              id="password"
              type="password"
              {...register('password', { onChange: handleInputChange })}
              label="Password"
              placeholder="Password"
              size="md"
              error={errors.password?.message?.toString()}
            />
            <Button
              className="mt-10 w-full"
              variant="default"
              borderRadius="full"
              type="submit"
              size="md"
              loading={isLoading}
              disabled={hasError}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          <Spacer size={4} />
          <Text className="block" size={2} color="foreground-5" weight="normal" align="center" as="p">
            Don’t have an account?{' '}
            <Link
              className="text-foreground-accent underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200 hover:decoration-foreground-accent"
              to="/signup"
            >
              Sign up
            </Link>
          </Text>
        </CardContent>
      </Card>
      <Agreements />
    </Floating1ColumnLayout>
  )
}
