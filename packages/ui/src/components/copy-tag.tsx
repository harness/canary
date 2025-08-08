import { useCallback, useEffect, useState } from 'react'

import copy from 'clipboard-copy'

import { Tag, TagProps } from './tag'

type CopyTagProps = TagProps & {
  actionIcon?: never
  onActionClick?: never
}

export function CopyTag(props: CopyTagProps) {
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

  return <Tag {...props} actionIcon={copied ? 'check' : 'copy'} onActionClick={handleCopy} />
}
