import { useCallback, useEffect, useState } from 'react'

import copy from 'clipboard-copy'

import { Tag, TagProps } from './tag'

type CopyTagProps = TagProps & {
  actionIcon?: never
  onActionClick?: never
  hideCopyButton?: boolean
}

export function CopyTag({ hideCopyButton, ...props }: CopyTagProps) {
  const { value } = props

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let timeoutId: number

    if (copied) {
      timeoutId = window.setTimeout(() => setCopied(false), 1000)
    }

    return () => {
      clearTimeout(timeoutId)
    }
  }, [copied])

  const handleCopy = useCallback(() => {
    copy(value).then(() => {
      setCopied(true)
    })
  }, [value])

  return (
    <Tag {...props} actionIcon={!hideCopyButton ? (copied ? 'check' : 'copy') : undefined} onActionClick={handleCopy} />
  )
}
