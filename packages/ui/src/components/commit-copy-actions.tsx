import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Icon, ShaBadge, Text } from '@/components'
import { cn } from '@utils/cn'
import copy from 'clipboard-copy'

//TODO: it need to pass url to copy function in the future, it is used in branch-list & pull-request-commit list
// not have commit detail page yet
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
  }, [copied])

  return (
    <ShaBadge.Root>
      <ShaBadge.Content>
        <Link to="#">
          <Text size={1} className="text-tertiary-background">
            {sha.substring(0, 7)}
          </Text>
        </Link>
      </ShaBadge.Content>
      <ShaBadge.Icon handleClick={() => setCopied(true)}>
        <Icon size={12} name={copied ? 'tick' : 'clone'} className={cn({ 'text-success': copied })} />
      </ShaBadge.Icon>
    </ShaBadge.Root>
  )
}
