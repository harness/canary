import { FC, MouseEvent, useEffect, useState } from 'react'

import { Button, Icon, type ButtonVariants } from '@/components'
import { cva, type VariantProps } from 'class-variance-authority'
import copy from 'clipboard-copy'

export interface CopyButtonProps extends VariantProps<typeof copyIconVariants> {
  name: string
  className?: string
  buttonVariant?: ButtonVariants
  iconSize?: number
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
}

const copyIconVariants = cva('transition-colors duration-200', {
  variants: {
    color: {
      gray: 'text-icons-1 hover:text-icons-2',
      white: 'text-icons-3 hover:text-icons-2',
      success: 'text-icons-success'
    }
  },
  defaultVariants: {
    color: 'white'
  }
})

export const CopyButton: FC<CopyButtonProps> = ({
  name,
  className,
  buttonVariant = 'surface',
  iconSize = 16,
  onClick,
  color
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
    <Button
      className={className}
      type="button"
      variant={buttonVariant}
      theme="muted"
      size="sm"
      iconOnly
      aria-label="Copy"
      onClick={handleClick}
    >
      <Icon className={copyIconVariants({ color: iconCopyStyle })} name={changeIcon} size={iconSize} />
    </Button>
  )
}
