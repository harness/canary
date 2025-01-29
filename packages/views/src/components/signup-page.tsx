import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Dock } from '@harnessio/canary'
import { Button, Card, Icon, Input, Label, Spacer, Text } from '@harnessio/ui/components'
import { Floating1ColumnLayout } from '@harnessio/ui/views'

interface PageProps {
  isLoading?: boolean
  handleSignUp: (data: SignUpDataProps) => void
  error?: string
}

export interface SignUpDataProps {
  userId?: string
  email?: string
  password?: string
  confirmPassword?: string
}

const signUpSchema = z.object({
  userId: z.string().nonempty({ message: 'User ID cannot be blank' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string()
})

export function SignUpPage({ isLoading, handleSignUp, error }: PageProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(signUpSchema)
  })

  // Watch password and confirmPassword fields
  const password = watch('password', '')
  const confirmPassword = watch('confirmPassword', '')

  const onSubmit = (data: SignUpDataProps) => {
    if (data.password !== data.confirmPassword) {
      return
    }
    handleSignUp(data)
    reset()
  }

  return (
    <Floating1ColumnLayout maxWidth="md" verticalCenter>
      <Card.Root variant="plain" width="full">
        <Card.Header>
          <Card.Title className="flex flex-col place-items-center">
            <Icon name="gitness-logo" size={104} />
            <Text size={6} weight="medium" color="primary">
              Sign up to Playground
            </Text>
            <Spacer size={2} />

            <Text size={2} color="tertiaryBackground">
              Let&apos;s start your journey with us today.
            </Text>
          </Card.Title>
        </Card.Header>
        <Spacer size={1} />
        <Card.Content>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Label htmlFor="userId">User ID</Label>
            <Spacer size={1} />
            <Input id="userId" type="text" {...register('userId')} placeholder="Enter your user ID" autoFocus />
            {errors.userId && (
              <>
                <Spacer size={2} />
                <Text size={1} className="text-destructive">
                  {errors.userId.message?.toString()}
                </Text>
              </>
            )}
            <Spacer size={4} />
            <Label htmlFor="email">Email</Label>
            <Spacer size={1} />
            <Input id="email" type="email" {...register('email')} placeholder="email@work.com" />
            {errors.email && (
              <>
                <Spacer size={2} />
                <Text size={1} className="text-destructive">
                  {errors.email.message?.toString()}
                </Text>
              </>
            )}
            <Spacer size={4} />
            <Label htmlFor="password">Password</Label>
            <Spacer size={1} />
            <Input
              id="password"
              type="password"
              {...register('password')}
              placeholder="Enter the password for your account"
            />
            {errors.password && (
              <>
                <Spacer size={2} />
                <Text size={1} className="text-destructive">
                  {errors.password.message?.toString()}
                </Text>
              </>
            )}
            <Spacer size={4} />
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Spacer size={1} />
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              placeholder="Re-enter your password"
            />
            {errors.confirmPassword && (
              <>
                <Spacer size={2} />
                <Text size={1} className="text-destructive">
                  {errors.confirmPassword.message?.toString()}
                </Text>
              </>
            )}
            {password !== confirmPassword && (
              <Text size={1} className="text-destructive">
                Passwords do not match
              </Text>
            )}
            <Spacer size={8} />
            {error && (
              <>
                <Text size={1} className="text-destructive">
                  {error}
                </Text>
                <Spacer size={4} />
              </>
            )}

            <Button variant="default" borderRadius="full" type="submit" className="w-full">
              {isLoading ? 'Signing up...' : 'Sign up'}
            </Button>
          </form>
          <Spacer size={4} />
          <Text size={1} color="tertiaryBackground" weight="normal" align="center" className="block">
            Already have an account?{' '}
            <Link to="/signin" className="text-primary">
              Sign in
            </Link>
          </Text>
        </Card.Content>
      </Card.Root>
      <Dock.Root>
        <Text size={1} color="tertiaryBackground">
          By joining, you agree to{' '}
          <a href="/" className="text-primary">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/" className="text-primary">
            Privacy Policy
          </a>
        </Text>
      </Dock.Root>
    </Floating1ColumnLayout>
  )
}
