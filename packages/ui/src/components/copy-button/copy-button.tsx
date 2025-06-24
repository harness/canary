import { FC } from 'react'

import { Button, useCopyButton, UseCopyButtonProps, type ButtonVariants } from '@/components'

export interface CopyButtonProps extends Omit<UseCopyButtonProps, 'copyData'> {
  name: string
  className?: string
  buttonVariant?: ButtonVariants
}

export const CopyButton: FC<CopyButtonProps> = ({
  name,
  className,
  buttonVariant = 'outline',
  iconSize = 'sm',
  onClick,
  color
}) => {
  const { copyButtonProps, CopyIcon } = useCopyButton({ onClick, copyData: name, iconSize, color })

  return (
    <Button className={className} type="button" variant={buttonVariant} theme="default" size="sm" {...copyButtonProps}>
      {CopyIcon}
    </Button>
  )
}
