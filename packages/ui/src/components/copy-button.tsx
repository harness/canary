import { FC, MouseEvent, useEffect, useState } from 'react'

import { Button, ButtonProps, Icon } from '@/components'
import copy from 'clipboard-copy'

export interface CopyButtonProps {
  name: string
  className?: string
  buttonVariant?: ButtonProps['variant']
  iconSize?: number
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
}

export const CopyButton: FC<CopyButtonProps> = ({
  name,
  className,
  buttonVariant = 'custom',
  iconSize = 16,
  onClick
}) => {
  const [copied, setCopied] = useState(false)

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    setCopied(true)
  }

  useEffect(() => {
    let timeoutId: number

    if (copied) {
      copy(name)
      timeoutId = window.setTimeout(() => setCopied(false), 1000)
    }

    return () => {
      clearTimeout(timeoutId)
    }
  }, [copied, name])

  const changeIcon = copied ? 'tick' : 'clone'

  return (
    <Button className={className} variant={buttonVariant} size="icon" aria-label="Copy" onClick={handleClick}>
      <Icon className="text-icons-3" name={changeIcon} size={iconSize} />
    </Button>
  )
}
