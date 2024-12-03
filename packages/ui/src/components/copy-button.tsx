import { useEffect, useState } from 'react'

import { Button, Icon } from '@/components'
import copy from 'clipboard-copy'

export interface CopyButtonProps {
  name: string
  className?: string
}

export const CopyButton = ({ name, className }: CopyButtonProps) => {
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
    <Button className={className} variant="custom" size="icon" aria-label="Copy" onClick={() => setCopied(true)}>
      <Icon name={changeIcon} size={16} className={iconCopyStyle} />
    </Button>
  )
}
