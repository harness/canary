import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button, Card, Icon, Input, Label, Spacer, Text } from '@harnessio/ui/components'
import { Floating1ColumnLayout } from '@harnessio/ui/views'

interface PageProps {
  handleSignIn: (data: DataProps) => void
  isLoading?: boolean
}

export interface DataProps {
  email?: string
  password?: string
}

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' })
})

export function SignInPage({ handleSignIn, isLoading }: PageProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(signInSchema)
  })

  const onSubmit = (data: DataProps) => {
    handleSignIn(data)
  }

  return (
    <Floating1ColumnLayout maxWidth="md" verticalCenter className="flex-col">
      <Card.Root variant="plain" width="full">
        <Card.Header>
          <Card.Title className="flex flex-col place-items-center">
            <Icon name="gitness-logo" size={104} />
            <Text size={6} weight="medium" color="primary">
              Sign in to Playground
            </Text>
            <Spacer size={2} />
            <Text size={2} color="tertiaryBackground">
              Welcome back! Please enter your details.
            </Text>
          </Card.Title>
        </Card.Header>
        <Spacer size={1} />
        <Card.Content>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Label htmlFor="email">Email</Label>
            <Spacer size={1} />
            <Input id="email" type="email" {...register('email')} placeholder="email@work.com" autoFocus />
            {errors.email && (
              <>
                <Spacer size={2} />
                <Text size={1} className="text-destructive">
                  {errors.email.message?.toString()}
                </Text>
              </>
            )}
            <Spacer size={4} />
            <div className="flex justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
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
            <Spacer size={8} />
            <Button variant="default" borderRadius="full" type="submit" loading={isLoading} className="w-full">
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          <Spacer size={4} />
          <Text size={1} color="tertiaryBackground" weight="normal" align="center" className="block">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-primary">
              Sign up
            </Link>
          </Text>
        </Card.Content>
      </Card.Root>

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
    </Floating1ColumnLayout>
  )
}
