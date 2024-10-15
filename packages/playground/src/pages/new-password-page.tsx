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

export interface NewPasswordDataProps {
  password?: string
  confirmPassword?: string
}

const newPasswordSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string()
})

export function NewPasswordPage({ isLoading }: PageProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(newPasswordSchema)
  })

  const onSubmit = () => noop

  const password = watch('password', '')
  const confirmPassword = watch('confirmPassword', '')

  return (
    <Floating1ColumnLayout maxWidth="md" verticalCenter>
      <Card variant="plain" width="full">
        <CardHeader>
          <CardTitle className="flex flex-col place-items-center">
            <Icon name="gitness-logo" size={104} />
            <Text size={6} weight="medium" color="primary">
              Create new password
            </Text>
            <Spacer size={2} />
            <Text size={2} color="tertiaryBackground" align="center">
              Your new password must be different from your previously used password.
            </Text>
          </CardTitle>
        </CardHeader>
        <Spacer size={1} />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Label htmlFor="password" variant="sm">
              New password
            </Label>
            <Spacer size={1} />
            <Input id="password" type="password" {...register('password')} placeholder="Password (6+ characters)" />
            {errors.password && (
              <>
                <Spacer size={2} />
                <Text size={1} className="text-destructive">
                  {errors.password.message?.toString()}
                </Text>
              </>
            )}
            <Spacer size={4} />
            <Label htmlFor="confirmPassword" variant="sm">
              Confirm Password
            </Label>
            <Spacer size={1} />
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              placeholder="Confirm password"
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
            <Button variant="default" borderRadius="full" type="submit" loading={isLoading} className="w-full">
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </form>
          <Spacer size={4} />
          <Text size={1} color="tertiaryBackground" weight="normal" align="center" className="block">
            Already have an account?{' '}
            <Link className="text-primary" to="/signin">
              Sign in
            </Link>
          </Text>
        </CardContent>
      </Card>
    </Floating1ColumnLayout>
  )
}
