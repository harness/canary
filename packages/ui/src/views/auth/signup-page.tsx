import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button, Card, Fieldset, FormWrapper, Input, Message, MessageTheme, StyledLink } from '@/components'
import { Floating1ColumnLayout, TranslationStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { makeValidationUtils } from '@utils/validation'
import { z } from 'zod'

import { Agreements } from './components/agreements'
import { AnimatedHarnessLogo } from './components/animated-harness-logo'

interface SignUpPageProps {
  isLoading?: boolean
  handleSignUp: (data: SignUpData) => void
  useTranslationStore: () => TranslationStore
  error?: string
}

const makeSignUpSchema = (t: TranslationStore['t']) => {
  const { required, maxLength, minLength, specialSymbols, noSpaces, invalid } = makeValidationUtils(t)

  return z
    .object({
      userId: z
        .string()
        .trim()
        .nonempty(required(t('views:signUp.userIDPlaceholder')))
        .max(...maxLength(100, t('views:signUp.userIDPlaceholder')))
        .regex(...specialSymbols(t('views:signUp.userIDPlaceholder')))
        .refine(...noSpaces(t('views:signUp.userIDPlaceholder'))),
      email: z
        .string()
        .email(invalid(t('views:signUp.emailLabel', 'Email')))
        .max(...maxLength(250, t('views:signUp.emailLabel', 'Email'))),
      password: z
        .string()
        .min(...minLength(6, t('views:signUp.passwordLabel', 'Password')))
        .max(...maxLength(128, t('views:signUp.passwordLabel', 'Password'))),
      confirmPassword: z.string().min(...minLength(6, t('views:signUp.passwordLabel', 'Password')))
    })
    .refine(data => data.password === data.confirmPassword, {
      message: t('views:signUp.validation.passwordsCheck', "Passwords don't match"),
      path: ['confirmPassword']
    })
}

export type SignUpData = z.infer<ReturnType<typeof makeSignUpSchema>>

export function SignUpPage({ isLoading, handleSignUp, useTranslationStore, error }: SignUpPageProps) {
  const [serverError, setServerError] = useState<string | null>(null)

  const { t } = useTranslationStore()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpData>({
    mode: 'onChange',
    resolver: zodResolver(makeSignUpSchema(t))
  })

  const handleInputChange = async () => {
    if (!serverError) return
    setServerError(null)
  }

  useEffect(() => {
    if (!error) return
    setServerError(error)
  }, [error])

  const hasError = Object.keys(errors).length > 0 || !!serverError

  return (
    <Floating1ColumnLayout
      className="bg-background-7 flex-col pt-20 sm:pt-[186px]"
      highlightTheme={hasError ? 'error' : 'green'}
      verticalCenter
    >
      <Card.Root className="relative z-10 mb-8 max-w-full" variant="plain" width="xl">
        <Card.Header className="items-center">
          <AnimatedHarnessLogo theme={hasError ? 'error' : 'green'} />

          <Card.Title className="mt-3 text-center" as="h1">
            {t('views:signUp.pageTitle', 'Sign up to Harness')}
          </Card.Title>

          <p className="text-foreground-4 mt-0.5 text-center text-sm leading-snug">
            {t('views:signUp.pageDescription', 'Let’s start your journey with us today.')}
          </p>
        </Card.Header>

        <Card.Content className="mt-10">
          <FormWrapper onSubmit={handleSubmit(handleSignUp)}>
            <Fieldset legend="User details">
              <Input
                id="userId"
                type="text"
                {...register('userId', { onChange: handleInputChange })}
                placeholder={t('views:signUp.userIDPlaceholder', 'User ID')}
                label={t('views:signUp.userIDLabel', 'User ID')}
                size="md"
                autoFocus
                error={errors.userId?.message?.toString()}
              />
              <Input
                id="email"
                type="email"
                {...register('email', { onChange: handleInputChange })}
                placeholder={t('views:signUp.emailPlaceholder', 'Your email')}
                label={t('views:signUp.emailLabel', 'Email')}
                size="md"
                error={errors.email?.message?.toString()}
              />
              <Input
                id="password"
                type="password"
                placeholder={t('views:signUp.passwordPlaceholder', 'Password (6+ characters)')}
                label={t('views:signUp.passwordLabel', 'Password')}
                size="md"
                {...register('password', { onChange: handleInputChange })}
                error={errors.password?.message?.toString()}
              />
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t('views:signUp.confirmPasswordPlaceholder', 'Confirm password')}
                label={t('views:signUp.confirmPasswordLabel', 'Confirm password')}
                size="md"
                {...register('confirmPassword', { onChange: handleInputChange })}
                error={errors.confirmPassword?.message?.toString()}
              />
            </Fieldset>

            {error && (
              <Message className="mt-1" theme={MessageTheme.ERROR}>
                {error}
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
                ? t('views:signUp.buttonText.signingUp', 'Signing up...')
                : t('views:signUp.buttonText.signUp', 'Sign up')}
            </Button>
          </FormWrapper>

          <p className="foreground-5 text-foreground-5 mt-4 text-center text-sm">
            {t('views:signUp.signInLink.question', 'Already have an account?')}{' '}
            <StyledLink to="/signin" variant="accent">
              {t('views:signUp.signInLink.linkText', 'Sign in')}
            </StyledLink>
          </p>
        </Card.Content>
      </Card.Root>
      <Agreements />
    </Floating1ColumnLayout>
  )
}
