import { Button, Icon } from '@harnessio/canary'
import React, { useState, useEffect } from 'react'
import copy from 'clipboard-copy'

export const CopyButton = ({ name }: { name: string }) => {
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
    <Button variant="ghost" size="xs" type="button" onClick={() => setCopied(true)}>
      <Icon name={changeIcon} size={16} className={iconCopyStyle} />
    </Button>
  )
}
