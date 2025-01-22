import { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Fragment } from 'react/jsx-runtime'

import { Button, Card, InputOTP, InputOTPGroup, InputOTPSlot, Spacer, Text } from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Floating1ColumnLayout } from '..'
import { Agreements } from './components/agreements'
import { AnimatedHarnessLogo } from './components/animated-harness-logo'

const OTP_LENGTH = 4

interface OTPPageProps {
  handleResend?: () => void
  isLoading?: boolean
  handleFormSubmit?: (data: OtpPageData) => void
  error?: string
  email?: string
}

export interface OtpPageData {
  email?: string
  otp: string
}

const otpPasswordSchema = z.object({
  otp: z
    .string()
    .length(OTP_LENGTH, { message: `Code must be ${OTP_LENGTH} digits` })
    .regex(/^\d+$/, { message: 'Code must contain only numbers' })
})

// TODO: remove default email when we have a way to get it from the url or context
export function OTPPage({
  handleResend,
  isLoading,
  handleFormSubmit,
  error,
  email = 'stevenm@gmail.com'
}: OTPPageProps) {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch
  } = useForm<OtpPageData>({
    mode: 'onSubmit',
    resolver: zodResolver(otpPasswordSchema),
    defaultValues: {
      otp: ''
    }
  })
  const otpValue = watch('otp')

  const onSubmit = useCallback(
    (data: OtpPageData) => {
      setServerError(null)
      handleFormSubmit?.({ ...data, email })
      reset()
    },
    [email, handleFormSubmit, reset]
  )

  useEffect(() => {
    setServerError(null)
    if (otpValue.length === OTP_LENGTH) {
      handleSubmit(onSubmit)()
    }
  }, [otpValue, handleSubmit, onSubmit])

  useEffect(() => {
    if (error) {
      setServerError(error)
    }
  }, [error])

  const hasError = Object.keys(errors).length > 0 || !!serverError

  return (
    <Floating1ColumnLayout
      className="flex-col bg-background-7 pt-20 sm:pt-[186px]"
      highlightTheme={hasError ? 'error' : 'blue'}
      verticalCenter
    >
      <Card.Root className="relative z-10 mb-8 max-w-full" variant="plain" width="xl">
        <Card.Header className="items-center">
          <AnimatedHarnessLogo theme={hasError ? 'error' : 'blue'} />
          <Card.Title className="mt-3 text-center" as="h1">
            Verify your email
          </Card.Title>
          <Text className="mt-0.5 leading-snug" size={2} color="foreground-4" align="center" as="p">
            Please enter the verification code we’ve sent to your email{' '}
            <span className="text-foreground-1">{email}</span>
          </Text>
        </Card.Header>
        <Card.Content className="mt-10">
          <form className="flex flex-col items-center" onSubmit={handleSubmit(onSubmit)}>
            <div className="relative">
              <Controller
                name="otp"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <InputOTP value={value} onChange={onChange} maxLength={OTP_LENGTH}>
                    <InputOTPGroup className="gap-x-3">
                      {Array.from({ length: OTP_LENGTH }).map((_, idx) => (
                        <Fragment key={idx}>
                          <InputOTPSlot index={idx} />
                        </Fragment>
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />
              {(errors.otp || serverError) && (
                <Text
                  className="absolute top-full w-full translate-y-2 leading-none tracking-tight text-foreground-danger"
                  align="center"
                  size={1}
                  as="p"
                >
                  {errors.otp?.message || serverError}
                </Text>
              )}
            </div>
            <Button
              className="mt-10 w-full max-w-[212px]"
              variant="default"
              borderRadius="full"
              type="submit"
              size="md"
              loading={isLoading}
              disabled={hasError}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </form>
          <Spacer size={4} />
          <Text className="block" size={2} color="foreground-5" weight="normal" align="center" as="p">
            Didn&apos;t receive the code?{' '}
            <Button className="h-5 p-0 leading-none" variant="link" onClick={handleResend}>
              Resend
            </Button>
          </Text>
        </Card.Content>
      </Card.Root>
      <Agreements />
    </Floating1ColumnLayout>
  )
}
