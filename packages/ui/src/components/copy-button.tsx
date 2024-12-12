import { FC, useEffect, useState } from 'react'

import { Button, ButtonProps, Icon } from '@/components'
import copy from 'clipboard-copy'

export interface CopyButtonProps {
  name: string
  className?: string
  buttonVariant?: ButtonProps['variant']
  iconSize?: number
}

export const CopyButton: FC<CopyButtonProps> = ({ name, className, buttonVariant = 'custom', iconSize = 16 }) => {
  const [copied, setCopied] = useState(false)

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

  const iconCopyStyle = copied ? 'text-icons-success' : 'text-icons-3'
  const changeIcon = copied ? 'tick' : 'clone'

  return (
    <Button className={className} variant={buttonVariant} size="icon" aria-label="Copy" onClick={() => setCopied(true)}>
      <Icon name={changeIcon} size={iconSize} className={iconCopyStyle} />
    </Button>
  )
}
