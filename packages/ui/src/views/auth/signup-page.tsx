import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { Button, Card, Input, Spacer, Text } from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Floating1ColumnLayout } from '..'
import { Agreements } from './components/agreements'
import { AnimatedHarnessLogo } from './components/animated-harness-logo'

interface SignUpPageProps {
  isLoading?: boolean
  handleSignUp: (data: SignUpData) => void
  error?: string
}

export interface SignUpData {
  userId?: string
  email?: string
  password?: string
  confirmPassword?: string
}

const signUpSchema = z
  .object({
    userId: z.string().min(1, { message: 'User ID cannot be blank' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })

export function SignUpPage({ isLoading, handleSignUp, error }: SignUpPageProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    trigger
  } = useForm({
    resolver: zodResolver(signUpSchema)
  })

  const onSubmit = (data: SignUpData) => {
    handleSignUp(data)
    reset()
  }

  const handleInputChange = async () => {
    if (serverError) {
      setServerError(null)
      await trigger()
    }
  }

  useEffect(() => {
    if (error) {
      setServerError(error)
    }
  }, [error])

  const hasError = Object.keys(errors).length > 0 || !!serverError

  return (
    <Floating1ColumnLayout
      className="flex-col bg-background-7 pt-20 sm:pt-[186px]"
      highlightTheme={hasError ? 'error' : 'green'}
      verticalCenter
    >
      <Card.Root className="relative z-10 mb-8 max-w-full" variant="plain" width="xl">
        <Card.Header className="items-center">
          <AnimatedHarnessLogo theme={hasError ? 'error' : 'green'} />
          <Card.Title className="mt-3 text-center" as="h1">
            Sign up to Harness
          </Card.Title>
          <Text className="mt-0.5 leading-snug" size={2} color="foreground-4" align="center" as="p">
            Let’s start your journey with us today.
          </Text>
        </Card.Header>
        <Card.Content className="mt-10">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="userId"
              type="text"
              {...register('userId', { onChange: handleInputChange })}
              placeholder="User ID"
              label="User ID"
              size="md"
              autoFocus
              error={errors.userId?.message?.toString()}
            />
            <Input
              wrapperClassName="mt-7"
              id="email"
              type="email"
              {...register('email', { onChange: handleInputChange })}
              placeholder="Your email"
              label="Email"
              size="md"
              error={errors.email?.message?.toString()}
            />
            <Input
              wrapperClassName="mt-7"
              id="password"
              type="password"
              placeholder="Password (6+ characters)"
              label="Password"
              size="md"
              {...register('password', { onChange: handleInputChange })}
              error={errors.password?.message?.toString()}
            />
            <Input
              wrapperClassName="mt-7"
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              label="Confirm password"
              size="md"
              {...register('confirmPassword', { onChange: handleInputChange })}
              error={errors.confirmPassword?.message?.toString()}
            />
            {serverError && (
              <>
                <Text className="mt-1 leading-none tracking-tight text-foreground-danger" size={0}>
                  {serverError}
                </Text>
              </>
            )}
            <Button
              className="mt-10 w-full"
              variant="default"
              borderRadius="full"
              type="submit"
              size="md"
              loading={isLoading}
              disabled={hasError}
            >
              {isLoading ? 'Signing up...' : 'Sign up'}
            </Button>
          </form>
          <Spacer size={4} />
          <Text className="block" size={2} color="foreground-5" weight="normal" align="center" as="p">
            Already have an account?{' '}
            <Link
              className="text-foreground-accent underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200 hover:decoration-foreground-accent"
              to="/signin"
            >
              Sign in
            </Link>
          </Text>
        </Card.Content>
      </Card.Root>
      <Agreements />
    </Floating1ColumnLayout>
  )
}
