import { forwardRef } from 'react'

import { Button, ButtonSizes, useCopyButton, UseCopyButtonProps, type ButtonVariants } from '@/components'

export interface CopyButtonProps extends Omit<UseCopyButtonProps, 'copyData'> {
  name: string
  className?: string
  buttonVariant?: ButtonVariants
  size?: ButtonSizes
}

export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ name, className, buttonVariant = 'outline', iconSize = 'sm', size = 'sm', onClick, color }, ref) => {
    const { copyButtonProps, CopyIcon } = useCopyButton({ onClick, copyData: name, iconSize, color })

    return (
      <Button ref={ref} className={className} type="button" variant={buttonVariant} size={size} {...copyButtonProps}>
        {CopyIcon}
      </Button>
    )
  }
)
CopyButton.displayName = 'CopyButton'
