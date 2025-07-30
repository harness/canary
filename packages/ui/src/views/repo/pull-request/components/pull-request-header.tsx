import { useCallback, useState } from 'react'

import { Button, IconV2, Layout, StatusBadge, Text, TimeAgoCard } from '@/components'
import { cn } from '@utils/cn'
import { BranchSelectorContainerProps } from '@views/repo'

import PullRequestBranchBadge from '../details/components/conversation/pull-request-branch-badge'
import { getPrState } from '../utils'
import { PullRequestHeaderEditDialog } from './pull-request-header-edit-dialog'

interface PullRequestTitleProps {
  className?: string
  data: {
    title?: string
    number?: number
    merged?: number | null | undefined
    author?: { display_name?: string; email?: string }
    stats?: { commits?: number | null }
    target_branch?: string
    source_branch?: string
    created?: number
    is_draft?: boolean
    state?: string
    spaceId?: string
    repoId?: string
    description?: string
  }
  updateTitle: (title: string, description: string) => void
  updateTargetBranch: (branchName: string) => void
  branchSelectorRenderer: React.ComponentType<BranchSelectorContainerProps>
}

export const PullRequestHeader: React.FC<PullRequestTitleProps> = ({
  className,
  data: {
    title,
    number,
    merged,
    author,
    stats,
    target_branch,
    source_branch,
    created,
    is_draft,
    state,
    spaceId,
    repoId,
    description
  },
  updateTitle,
  updateTargetBranch,
  branchSelectorRenderer
}) => {
  const stateObject = getPrState(is_draft, merged, state)

  const handleSubmit = useCallback(
    async (newTitle: string, newDescription: string, newBranch: string) => {
      await updateTitle(newTitle, newDescription)
      await updateTargetBranch(newBranch)
    },
    [updateTitle, updateTargetBranch]
  )

  const [isEditing, setIsEditing] = useState(false)

  return (
    <>
      <Layout.Vertical gap="md" className={cn(className)}>
        <Layout.Horizontal gap="xs" align="center">
          <Layout.Horizontal gap="xs" align="center">
            <Text as="h1" className="max-w-[95%] truncate" variant="heading-section" color="foreground-1">
              {title}
            </Text>
            <Text as="h1" className="max-w-[95%] truncate" variant="heading-section" color="foreground-2">
              #{number}
            </Text>
          </Layout.Horizontal>

          <Button
            className="group"
            variant="outline"
            iconOnly
            aria-label="Edit"
            onClick={() => {
              setIsEditing(true)
            }}
          >
            <IconV2 name="edit-pencil" className="text-icons-1 group-hover:text-icons-3" />
          </Button>
        </Layout.Horizontal>

        <Layout.Horizontal gap="sm" align="center">
          <StatusBadge icon={stateObject.icon} variant="outline" theme={stateObject.theme}>
            {stateObject.text}
          </StatusBadge>

          <Layout.Horizontal gap="3xs" align="center" wrap="wrap">
            <Text variant="body-single-line-strong" color="foreground-1">
              {author?.display_name || author?.email || ''}
            </Text>
            <Text variant="body-single-line-normal" color="foreground-2">
              {merged ? 'merged' : ' wants to merge'} {stats?.commits} {stats?.commits === 1 ? 'commit' : 'commits'}{' '}
              into
            </Text>

            <PullRequestBranchBadge branchName={target_branch || ''} spaceId={spaceId || ''} repoId={repoId || ''} />
            <Text variant="body-single-line-normal" color="foreground-2">
              from
            </Text>
            <PullRequestBranchBadge branchName={source_branch || ''} spaceId={spaceId || ''} repoId={repoId || ''} />
            <span className="mx-1.5 h-4 w-px bg-cn-borders-3" />
            <TimeAgoCard timestamp={created} />
          </Layout.Horizontal>
        </Layout.Horizontal>
      </Layout.Vertical>

      <PullRequestHeaderEditDialog
        open={isEditing}
        onClose={() => setIsEditing(false)}
        onSubmit={handleSubmit}
        initialTitle={title || ''}
        initialDescription={description || ''}
        branchSelectorRenderer={branchSelectorRenderer}
        sourceBranch={source_branch}
        targetBranch={target_branch}
      />
    </>
  )
}
