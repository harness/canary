import { useEffect, useState } from 'react'

import { Icon, ShaBadge } from '@/components'
import { useRouterContext } from '@/context'
import copy from 'clipboard-copy'

export const CommitCopyActions = ({
  sha,
  toCommitDetails,
  className
}: {
  sha: string
  toCommitDetails?: ({ sha }: { sha: string }) => string
  className?: string
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
    <ShaBadge.Root className={className}>
      <ShaBadge.Content className="p-0" asChild>
        <button
          className="text-2 text-cn-foreground-3 size-full w-[67px] px-2"
          onClick={() => handleNavigation()}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') handleNavigation()
          }}
        >
          {sha.substring(0, 6)}
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
