import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Icon, Text, Spacer } from '@harnessio/canary'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Floating1ColumnLayout } from '../layouts/Floating1ColumnLayout'
import { noop } from 'lodash-es'
import { Link } from 'react-router-dom'

interface PageProps {
  isLoading?: boolean
}

export interface ForgotPasswordDataProps {
  email?: string
}

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' })
})

export function ForgotPasswordPage({ isLoading }: PageProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  })

  const onSubmit = () => noop

  return (
    <Floating1ColumnLayout maxWidth="md" verticalCenter>
      <Card variant="plain" width="full">
        <CardHeader>
          <CardTitle className="flex flex-col place-items-center">
            <Icon name="gitness-logo" size={104} />
            <Text size={6} weight="medium" color="primary">
              Forgot password?
            </Text>
            <Spacer size={2} />
            <Text size={2} color="tertiaryBackground">
              Enter your email to receive the verification code.
            </Text>
          </CardTitle>
        </CardHeader>
        <Spacer size={1} />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Label htmlFor="email" variant="sm">
              Email
            </Label>
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
            Don't have an account?{' '}
            <Link className="text-primary" to="/signup">
              Sign up
            </Link>
          </Text>
        </CardContent>
      </Card>
    </Floating1ColumnLayout>
  )
}
