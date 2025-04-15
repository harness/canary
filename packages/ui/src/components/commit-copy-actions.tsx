import { useEffect, useState } from 'react'

import { Button, Icon, ShaBadge } from '@/components'
import { useRouterContext } from '@/context'
import copy from 'clipboard-copy'

export const CommitCopyActions = ({
  sha,
  toCommitDetails
}: {
  sha: string
  toCommitDetails?: ({ sha }: { sha: string }) => string
}) => {
  const [copied, setCopied] = useState(false)
  const { navigate } = useRouterContext()

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

  const handleNavigation = () => {
    navigate(toCommitDetails?.({ sha: sha || '' }) || '')
  }

  return (
    <ShaBadge.Root>
      <ShaBadge.Content className="border-r" asChild>
        <Button
          size="sm"
          onClick={() => handleNavigation()}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') handleNavigation()
          }}
          variant="ghost"
        >
          {sha.substring(0, 6)}
        </Button>
      </ShaBadge.Content>
      <ShaBadge.Icon
        handleClick={() => {
          setCopied(true)
        }}
      >
        <Icon size={16} name={copied ? 'tick' : 'clone'} />
      </ShaBadge.Icon>
    </ShaBadge.Root>
  )
}
