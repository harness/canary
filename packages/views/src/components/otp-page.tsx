import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button, ButtonGroup } from '@harnessio/canary'
import { Card, Icon, InputOTP, Spacer, Text } from '@harnessio/ui/components'
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
      <Card.Root variant="plain" width="full">
        <Card.Header>
          <Card.Title className="flex flex-col place-items-center">
            <Icon name="gitness-logo" size={104} />
            <Text size={6} weight="medium" color="primary">
              Verify your email
            </Text>
            <Spacer size={2} />
            <Text size={2} color="tertiaryBackground" align="center">
              Please enter the verfication code we sent to jane@smith.com
            </Text>
          </Card.Title>
        </Card.Header>
        <Spacer size={1} />
        <Card.Content>
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputOTP.Root maxLength={4}>
              <InputOTP.Group id="otp" className="mx-auto flex" {...register('otp')}>
                <InputOTP.Slot index={0} />
                <InputOTP.Slot index={1} />
                <InputOTP.Slot index={2} />
                <InputOTP.Slot index={3} />
              </InputOTP.Group>
            </InputOTP.Root>
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
        </Card.Content>
      </Card.Root>
    </Floating1ColumnLayout>
  )
}
