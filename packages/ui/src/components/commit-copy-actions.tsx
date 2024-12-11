import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Icon, ShaBadge, Text } from '@/components'
import copy from 'clipboard-copy'

export const CommitCopyActions = ({ sha }: { sha: string }) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let timeoutId: number
    if (copied) {
      copy(sha)
      timeoutId = window.setTimeout(() => setCopied(false), 2500)
    }
    return () => {
      clearTimeout(timeoutId)
    }
  }, [copied, sha])

  return (
    <ShaBadge.Root>
      <ShaBadge.Content>
        <Link to="#">
          <Text size={2} className="font-mono text-foreground-3">
            {sha.substring(0, 7)}
          </Text>
        </Link>
      </ShaBadge.Content>
      <ShaBadge.Icon handleClick={() => setCopied(true)}>
        <Icon size={16} name={copied ? 'tick' : 'clone'} className="text-icons-3" />
      </ShaBadge.Icon>
    </ShaBadge.Root>
  )
}
