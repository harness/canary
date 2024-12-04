import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button, ButtonGroup } from '@harnessio/canary'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Icon,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Spacer,
  Text
} from '@harnessio/ui/components'
import { Floating1ColumnLayout } from '@harnessio/ui/views'

interface PageProps {
  handleResend?: () => void
  isLoading?: boolean
  handleFormSubmit?: (data: OtpPageDataProps) => void
}

export interface OtpPageDataProps {
  email?: string
}

const otpPasswordSchema = z.object({
  otp: z.string().email({ message: 'Code required' })
})

export function OTPPage({ handleResend, isLoading, handleFormSubmit }: PageProps) {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(otpPasswordSchema)
  })

  const onSubmit = (data: OtpPageDataProps) => {
    handleFormSubmit?.(data)
  }

  return (
    <Floating1ColumnLayout maxWidth="md" verticalCenter>
      <Card variant="plain" width="full">
        <CardHeader>
          <CardTitle className="flex flex-col place-items-center">
            <Icon name="gitness-logo" size={104} />
            <Text size={6} weight="medium" color="primary">
              Verify your email
            </Text>
            <Spacer size={2} />
            <Text size={2} color="tertiaryBackground" align="center">
              Please enter the verfication code we sent to jane@smith.com
            </Text>
          </CardTitle>
        </CardHeader>
        <Spacer size={1} />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputOTP maxLength={4}>
              <InputOTPGroup id="otp" className="mx-auto flex" {...register('otp')}>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
            <Spacer size={8} />
            <ButtonGroup.Root className="flex justify-center">
              <Button variant="default" borderRadius="full" type="submit" loading={isLoading} className="w-44">
                {isLoading ? 'Verfiying...' : 'Verify'}
              </Button>
            </ButtonGroup.Root>
          </form>
          <Spacer size={4} />
          <Text size={1} color="tertiaryBackground" weight="normal" align="center" className="block">
            Didn&apos;t receive the code?{' '}
            <a href="/" className="text-primary" onClick={handleResend}>
              Resend
            </a>
          </Text>
        </CardContent>
      </Card>
    </Floating1ColumnLayout>
  )
}
