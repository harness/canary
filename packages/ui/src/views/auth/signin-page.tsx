import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { Button, Card, Fieldset, FormWrapper, Input, Message, MessageTheme, StyledLink } from '@/components'
import { Floating1ColumnLayout, TranslationStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Agreements } from './components/agreements'
import { AnimatedHarnessLogo } from './components/animated-harness-logo'

interface SignInPageProps {
  handleSignIn: (data: SignInData) => void
  useTranslationStore: () => TranslationStore
  isLoading?: boolean
  error?: string
}

const makeSignInSchema = (t: TranslationStore['t']) =>
  z.object({
    email: z.string().trim().nonempty(t('views:signIn.validation.emailNoEmpty', 'Field can’t be blank')),
    password: z.string().nonempty(t('views:signIn.validation.passwordNoEmpty', 'Password can’t be blank'))
  })

export type SignInData = z.infer<ReturnType<typeof makeSignInSchema>>

export function SignInPage({ handleSignIn, useTranslationStore, isLoading, error }: SignInPageProps) {
  const { t } = useTranslationStore()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInData>({
    resolver: zodResolver(makeSignInSchema(t))
  })

  const errorMessage = useMemo(() => (error?.includes('Not Found') ? 'Please check your details' : error), [error])

  const hasError = Object.keys(errors).length > 0 || !!error

  return (
    <Floating1ColumnLayout
      className="bg-background-7 flex-col pt-20 sm:pt-[186px]"
      highlightTheme={hasError ? 'error' : 'blue'}
      verticalCenter
    >
      <Card.Root className="relative z-10 mb-8 max-w-full" variant="plain" width="xl">
        <Card.Header className="items-center">
          <AnimatedHarnessLogo theme={hasError ? 'error' : 'blue'} />

          <Card.Title className="mt-3 text-center" as="h1">
            {t('views:signIn.pageTitle', 'Sign in to Harness')}
          </Card.Title>

          <p className="text-foreground-4 mt-0.5 text-center text-sm leading-snug">
            {t('views:signIn.pageDescription', 'Welcome back! Please enter your details.')}
          </p>
        </Card.Header>

        <Card.Content className="mt-10">
          <FormWrapper onSubmit={handleSubmit(handleSignIn)}>
            <Fieldset legend="User details">
              <Input
                id="email"
                label={t('views:signIn.emailTitle', 'Username/Email')}
                placeholder={t('views:signIn.emailDescription', 'Your email')}
                size="md"
                {...register('email')}
                error={errors.email?.message?.toString()}
                autoFocus
              />
              <Input
                id="password"
                type="password"
                {...register('password')}
                label={t('views:signIn.passwordTitle', 'Password')}
                placeholder={t('views:signIn.passwordDescription', 'Password')}
                size="md"
                error={errors.password?.message?.toString()}
              />
            </Fieldset>

            {error && (
              <Message className="mt-1" theme={MessageTheme.ERROR}>
                {errorMessage}
              </Message>
            )}

            <Button
              className="mt-3 w-full"
              variant="default"
              borderRadius="full"
              type="submit"
              size="md"
              loading={isLoading}
              disabled={hasError}
            >
              {isLoading
                ? t('views:signIn.buttonText.signingIn', 'Signing in...')
                : t('views:signIn.buttonText.signIn', 'Sign in')}
            </Button>
          </FormWrapper>

          <p className="foreground-5 text-foreground-5 mt-4 text-center text-sm">
            {t('views:signIn.signUpLink.question', 'Don’t have an account?')}{' '}
            <StyledLink to="/signup" variant="accent">
              {t('views:signIn.signUpLink.linkText', 'Sign up')}
            </StyledLink>
          </p>
        </Card.Content>
      </Card.Root>
      <Agreements />
    </Floating1ColumnLayout>
  )
}
