import { FC } from 'react'

import { Button, ButtonSizes, useCopyButton, UseCopyButtonProps, type ButtonVariants } from '@/components'

export interface CopyButtonProps extends Omit<UseCopyButtonProps, 'copyData'> {
  name: string
  className?: string
  buttonVariant?: ButtonVariants
  size?: ButtonSizes
}

export const CopyButton: FC<CopyButtonProps> = ({
  name,
  className,
  buttonVariant = 'outline',
  iconSize = 'sm',
  size = 'sm',
  onClick,
  color
}) => {
  const { copyButtonProps, CopyIcon } = useCopyButton({ onClick, copyData: name, iconSize, color })

  return (
    <Button className={className} type="button" variant={buttonVariant} size={size} {...copyButtonProps}>
      {CopyIcon}
    </Button>
  )
}
