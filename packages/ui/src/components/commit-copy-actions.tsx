import { ButtonGroup, ButtonGroupButtonProps, ButtonProps, Text, useCopyButton } from '@/components'
import { useRouterContext } from '@/context'

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
  const { copyButtonProps, CopyIcon } = useCopyButton({ copyData: sha, iconSize: '2xs', color: 'inherit' })

  const { navigate } = useRouterContext()

  const handleNavigation = (ev: React.MouseEvent<HTMLButtonElement>) => {
    const finalNavigationString =
      toCommitDetails?.({ sha: sha || '' }) ||
      toPullRequestChange?.({ pullRequestId: pullRequestId || 0, commitSHA: sha || '' }) ||
      ''
    ev.stopPropagation()
    navigate(finalNavigationString)
  }

  return (
    <ButtonGroup
      size={size}
      buttonsProps={[
        {
          children: (
            <Text className="font-body-code" color="inherit">
              {sha.substring(0, 6)}
            </Text>
          ),

          onClick: handleNavigation,
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
