import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Alert, Button, FormInput, FormWrapper, Link, Spacer, Text } from '@/components'
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
  const formMethods = useForm({
    resolver: zodResolver(signUpSchema)
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger
  } = formMethods

  const onSubmit = (data: SignUpData) => {
    handleSignUp(data)
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
      className="flex-col bg-cn-background-1 pt-20 sm:pt-[186px]"
      highlightTheme={hasError ? 'error' : 'green'}
      verticalCenter
    >
      <div className="relative z-10 mb-8 max-w-full text-cn-foreground-1 w-80">
        <div className="flex flex-col items-center">
          <AnimatedHarnessLogo theme={hasError ? 'error' : 'green'} />
          <Text className="mt-3 leading-snug" weight="medium" size={5} align="center" as="h1">
            Sign up to Harness
          </Text>
          <Text className="mt-0.5 leading-snug" size={2} color="foreground-4" align="center" as="p">
            Let’s start your journey with us today.
          </Text>
        </div>
        <div className="mt-10 pt-0">
          <FormWrapper {...formMethods} onSubmit={handleSubmit(onSubmit)}>
            <FormInput.Text
              id="userId"
              type="text"
              {...register('userId', { onChange: handleInputChange })}
              placeholder="User ID"
              label="User ID"
              autoFocus
            />
            <FormInput.Text
              id="email"
              type="email"
              {...register('email', { onChange: handleInputChange })}
              placeholder="Your email"
              label="Email"
            />
            <FormInput.Text
              id="password"
              type="password"
              placeholder="Password (6+ characters)"
              label="Password"
              {...register('password', { onChange: handleInputChange })}
            />
            <FormInput.Text
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              label="Confirm password"
              {...register('confirmPassword', { onChange: handleInputChange })}
            />
            {serverError && (
              <Alert.Container variant="destructive">
                <Alert.Title>{serverError}</Alert.Title>
              </Alert.Container>
            )}
            <Button className="mt-10 w-full" rounded type="submit" loading={isLoading}>
              {isLoading ? 'Signing up...' : 'Sign up'}
            </Button>
          </FormWrapper>
          <Spacer size={4} />
          <Text className="block" size={2} color="foreground-5" weight="normal" align="center" as="p">
            Already have an account? <Link to="/signin">Sign in</Link>
          </Text>
        </div>
      </div>
      <Agreements />
    </Floating1ColumnLayout>
  )
}
