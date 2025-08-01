import { KeyboardEvent } from 'react'

import { ButtonGroup, ButtonGroupButtonProps, Text, useCopyButton } from '@/components'
import { useRouterContext } from '@/context'

export const CommitCopyActions = ({
  sha,
  toCommitDetails
}: {
  sha: string
  toCommitDetails?: ({ sha }: { sha: string }) => string
}) => {
  const { copyButtonProps, CopyIcon } = useCopyButton({ copyData: sha, iconSize: '2xs' })
  const { navigate } = useRouterContext()

  const handleNavigation = () => {
    navigate(toCommitDetails?.({ sha: sha || '' }) || '')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') handleNavigation()
  }

  return (
    <ButtonGroup
      size="xs"
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
