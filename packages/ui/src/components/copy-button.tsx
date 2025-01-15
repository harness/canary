import { FC, MouseEvent, useEffect, useState } from 'react'

import { Button, ButtonProps, Icon } from '@/components'
import { cva } from 'class-variance-authority'
import copy from 'clipboard-copy'

export interface CopyButtonProps {
  name: string
  className?: string
  buttonVariant?: ButtonProps['variant']
  color?: 'icons-1' | 'icons-3' | 'success'
  iconSize?: number
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
}

const copyIconVariants = cva('transition-colors duration-200', {
  variants: {
    color: {
      'icons-1': 'text-icons-1 hover:text-icons-2',
      'icons-3': 'text-icons-3 hover:text-icons-2',
      success: 'text-icons-success'
    }
  }
})

export const CopyButton: FC<CopyButtonProps> = ({
  name,
  className,
  buttonVariant = 'custom',
  iconSize = 16,
  onClick,
  color = 'icons-3'
}) => {
  const [copied, setCopied] = useState(false)

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setCopied(true)
    onClick?.(e)
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

  const iconCopyStyle = copied ? 'success' : color
  const changeIcon = copied ? 'tick' : 'clone'

  return (
    <Button className={className} variant={buttonVariant} size="icon" aria-label="Copy" onClick={handleClick}>
      <Icon className={copyIconVariants({ color: iconCopyStyle })} name={changeIcon} size={iconSize} />
    </Button>
  )
}
