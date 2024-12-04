import { ComponentPropsWithoutRef, ElementRef, forwardRef, useContext } from 'react'

import { DashIcon } from '@radix-ui/react-icons'
import { cn } from '@utils/cn'
import { OTPInput, OTPInputContext } from 'input-otp'

const InputOTP = forwardRef<ElementRef<typeof OTPInput>, ComponentPropsWithoutRef<typeof OTPInput>>(
  ({ className, containerClassName, ...props }, ref) => (
    <OTPInput
      ref={ref}
      containerClassName={cn('flex items-center gap-3 has-[:disabled]:opacity-50', containerClassName)}
      className={cn('disabled:cursor-not-allowed', className)}
      {...props}
    />
  )
)
InputOTP.displayName = 'InputOTP'

const InputOTPGroup = forwardRef<ElementRef<'div'>, ComponentPropsWithoutRef<'div'>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center', className)} {...props} />
))
InputOTPGroup.displayName = 'InputOTPGroup'

interface InputOTPSlotProps extends ComponentPropsWithoutRef<'div'> {
  index: number
}

const InputOTPSlot = forwardRef<HTMLDivElement, InputOTPSlotProps>(({ index, className, ...props }, ref) => {
  const inputOTPContext = useContext(OTPInputContext)

  if (!inputOTPContext?.slots?.[index]) {
    console.error(`No slot data available for index ${index}`)
    return null
  }

  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex items-center justify-center h-[52px] w-11 rounded border border-borders-1 p-2 text-2xl transition-all',
        isActive && 'border-borders-3 z-10',
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink h-4 w-px bg-background-5 duration-1000" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = 'InputOTPSlot'

const InputOTPSeparator = forwardRef<ElementRef<'div'>, ComponentPropsWithoutRef<'div'>>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <DashIcon />
  </div>
))
InputOTPSeparator.displayName = 'InputOTPSeparator'

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
