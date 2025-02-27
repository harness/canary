import { useEffect, useState } from 'react'

import { Icon, ShaBadge } from '@/components'
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
      <ShaBadge.Content className="p-0" asChild>
        <button
          className="size-full px-2.5 text-13 text-foreground-3"
          onClick={() => handleNavigation()}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') handleNavigation()
          }}
        >
          {sha.substring(0, 7)}
        </button>
      </ShaBadge.Content>
      <ShaBadge.Icon
        handleClick={() => {
          setCopied(true)
        }}
      >
        <Icon size={16} name={copied ? 'tick' : 'clone'} className="text-icons-3" />
      </ShaBadge.Icon>
    </ShaBadge.Root>
  )
}
