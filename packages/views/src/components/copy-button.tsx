import { useEffect, useState } from 'react'

import copy from 'clipboard-copy'

import { Button, Icon } from '@harnessio/canary'

export const CopyButton = ({ name, className }: { name: string; className?: string }) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let timeoutId: number
    if (copied) {
      copy(name)
      timeoutId = window.setTimeout(() => {
        setCopied(false)
      }, 1000)
    }
    return () => {
      clearTimeout(timeoutId)
    }
  }, [copied, name])

  const iconCopyStyle = copied ? 'text-success' : 'text-tertiary-background'
  const changeIcon = copied ? 'tick' : 'clone'

  return (
    <Button variant="ghost" size="xs" type="button" onClick={() => setCopied(true)} className={className}>
      <Icon name={changeIcon} size={16} className={iconCopyStyle} />
    </Button>
  )
}
