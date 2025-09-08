import { KeyboardEvent } from 'react'

import { ButtonGroup, ButtonGroupButtonProps, ButtonProps, Link, Text, useCopyButton } from '@/components'

interface CommitCopyActionsProps {
  sha: string
  toCommitDetails?: ({ sha }: { sha: string }) => string
  pullRequestId?: number
  toPullRequestChange?: ({ pullRequestId, commitSHA }: { pullRequestId: number; commitSHA: string }) => string
  size?: ButtonProps['size']
}

export const CommitCopyActions = ({
  sha,
  toCommitDetails,
  pullRequestId,
  toPullRequestChange,
  size = 'xs'
}: CommitCopyActionsProps) => {
  const { copyButtonProps, CopyIcon } = useCopyButton({ copyData: sha, iconSize: '2xs', color: 'surfaceGray' })

  const handleNavigation = (ev: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent) => {
    ev.stopPropagation()
    toCommitDetails?.({ sha: sha || '' })
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') handleNavigation(e)
  }

  return (
    <ButtonGroup
      size={size}
      buttonsProps={[
        {
          children: (
            <Link
              to={
                toCommitDetails?.({ sha: sha || '' }) ||
                toPullRequestChange?.({ pullRequestId: pullRequestId || 0, commitSHA: sha || '' }) ||
                ''
              }
              variant="secondary"
              noHoverUnderline
            >
              <Text className="font-body-code" color="inherit">
                {sha.substring(0, 6)}
              </Text>
            </Link>
          ),
          tabIndex: -1,
          onKeyDown: handleKeyDown,
          className: 'font-body-code'
        },
        {
          ...(copyButtonProps as ButtonGroupButtonProps),
          children: CopyIcon
        }
      ]}
    />
  )
}
