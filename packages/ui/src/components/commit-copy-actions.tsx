import { KeyboardEvent } from 'react'

import { ButtonGroup, ButtonGroupButtonProps, useCopyButton } from '@/components'
import { useRouterContext } from '@/context'

export const CommitCopyActions = ({
  sha,
  toCommitDetails
}: {
  sha: string
  toCommitDetails?: ({ sha }: { sha: string }) => string
}) => {
  const { copyButtonProps, CopyIcon } = useCopyButton({ copyData: sha })
  const { navigate } = useRouterContext()

  const handleNavigation = () => {
    navigate(toCommitDetails?.({ sha: sha || '' }) || '')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') handleNavigation()
  }

  return (
    <ButtonGroup
      size="sm"
      buttonsProps={[
        {
          children: sha.substring(0, 6),
          onClick: handleNavigation,
          onKeyDown: handleKeyDown,
          className: 'font-mono'
        },
        {
          ...(copyButtonProps as ButtonGroupButtonProps),
          children: CopyIcon
        }
      ]}
    />
  )
}
