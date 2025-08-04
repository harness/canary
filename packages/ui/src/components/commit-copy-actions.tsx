import { KeyboardEvent } from 'react'

import { ButtonGroup, ButtonGroupButtonProps, ButtonProps, Text, useCopyButton } from '@/components'
import { useRouterContext } from '@/context'

interface CommitCopyActionsProps {
  sha: string
  toCommitDetails?: ({ sha }: { sha: string }) => string
  size?: ButtonProps['size']
}

export const CommitCopyActions = ({ sha, toCommitDetails, size = 'xs' }: CommitCopyActionsProps) => {
  const { copyButtonProps, CopyIcon } = useCopyButton({ copyData: sha, iconSize: '2xs' })
  const { navigate } = useRouterContext()

  const handleNavigation = (ev: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent) => {
    ev.stopPropagation()
    navigate(toCommitDetails?.({ sha: sha || '' }) || '')
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
            <Text variant="body-single-line-normal" color="inherit">
              {sha.substring(0, 6)}
            </Text>
          ),
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
