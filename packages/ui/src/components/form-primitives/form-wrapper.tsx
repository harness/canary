import { PropsWithChildren } from 'react'

import { cn } from '@utils/cn'

/**
 * A wrapper component that provides consistent spacing and layout for form elements
 *
 * @example
 * ```tsx
 * <FormWrapper className="my-custom-class">
 *   <Input type="text" />
 *   <Textarea type="email" />
 * </FormWrapper>
 * ```
 */
export function FormWrapper({ className, children }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn('flex flex-col gap-y-7', className)}>{children}</div>
}
