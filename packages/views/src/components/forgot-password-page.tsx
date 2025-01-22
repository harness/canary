import { SubmitHandler, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button, Card, Icon, Input, Label, Spacer, Text } from '@harnessio/ui/components'
import { Floating1ColumnLayout } from '@harnessio/ui/views'

interface PageProps {
  isLoading?: boolean
  onSubmit?: (emailData: ForgotPasswordDataProps) => void
}

export interface ForgotPasswordDataProps {
  email?: string
}

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' })
})

export function ForgotPasswordPage({ isLoading, onSubmit }: PageProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  })

  const handleOnSubmit: SubmitHandler<ForgotPasswordDataProps> = data => {
    // Handle the submission of the forgot password form
    if (onSubmit) {
      onSubmit(data)
    }
  }

  return (
    <Floating1ColumnLayout maxWidth="md" verticalCenter>
      <Card.Root variant="plain" width="full">
        <Card.Header>
          <Card.Title className="flex flex-col place-items-center">
            <Icon name="gitness-logo" size={104} />
            <Text size={6} weight="medium" color="primary">
              Forgot password?
            </Text>
            <Spacer size={2} />
            <Text size={2} color="tertiaryBackground">
              Enter your email to receive the verification code.
            </Text>
          </Card.Title>
        </Card.Header>
        <Spacer size={1} />
        <Card.Content>
          <form onSubmit={handleSubmit(handleOnSubmit)}>
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
            <Spacer size={8} />
            <Button variant="default" borderRadius="full" type="submit" loading={isLoading} className="w-full">
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </form>
          <Spacer size={4} />
          <Text size={1} color="tertiaryBackground" weight="normal" align="center" className="block">
            Don&apos;t have an account?{' '}
            <Link className="text-primary" to="/signup">
              Sign up
            </Link>
          </Text>
        </Card.Content>
      </Card.Root>
    </Floating1ColumnLayout>
  )
}
