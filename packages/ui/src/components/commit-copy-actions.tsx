import { KeyboardEvent } from 'react'

import { ButtonGroup, ButtonGroupButtonProps, ButtonProps, Link, Text, useCopyButton } from '@/components'

interface CommitCopyActionsProps {
  sha: string
  toCommitDetails?: ({ sha }: { sha: string }) => string
  size?: ButtonProps['size']
}

export const CommitCopyActions = ({ sha, toCommitDetails, size = 'xs' }: CommitCopyActionsProps) => {
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
            <Link to={toCommitDetails?.({ sha: sha || '' }) || ''} variant="secondary" className="hover:no-underline">
              <Text className="font-mono" color="inherit">
                {sha.substring(0, 6)}
              </Text>
            </Link>
          ),
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
