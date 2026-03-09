import { useCallback, useState } from 'react'

import {
  Avatar,
  BranchTag,
  Button,
  Dialog,
  IconV2,
  Layout,
  Separator,
  StatusBadge,
  Text,
  TimeAgoCard
} from '@harnessio/ui/components'
import { TypesRepositoryCore } from '@views'
import { cn } from '@harnessio/ui/utils'
import { BranchSelectorContainerProps } from '@views/repo'

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
    source_repo_id?: number | null
    target_repo_id?: number | null
    source_repo?: TypesRepositoryCore
  }
  updateTitle: (title: string) => void
  updateTargetBranch: (branchName: string) => void
  branchSelectorRenderer: React.ComponentType<BranchSelectorContainerProps>
  toUpstreamRepo?: (path: string, subPath?: string) => string
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
    source_repo_id,
    target_repo_id,
    source_repo
  },
  updateTitle,
  updateTargetBranch,
  branchSelectorRenderer,
  toUpstreamRepo
}) => {
  const stateObject = getPrState(is_draft, merged, state)

  const handleSubmit = useCallback(
    async (newTitle: string, newBranch: string) => {
      await updateTitle(newTitle)
      await updateTargetBranch(newBranch)
    },
    [updateTitle, updateTargetBranch]
  )

  const [isEditing, setIsEditing] = useState(false)
  const isForkPR = source_repo_id !== target_repo_id

  return (
    <>
      <Layout.Vertical gap="md" className={cn(className)}>
        <Text as="h1" variant="heading-section" className="gap- break-all">
          {title}
          <Text as="span" variant="heading-section" color="foreground-3" className="ml-cn-xs inline-block">
            #{number}
          </Text>
          <Dialog.Trigger>
            <Button
              className="group ml-cn-xs inline-flex"
              variant="ghost"
              iconOnly
              aria-label="Edit"
              onClick={() => {
                setIsEditing(true)
              }}
              tooltipProps={{
                content: 'Edit'
              }}
            >
              <IconV2 name="edit-pencil" />
            </Button>
          </Dialog.Trigger>
        </Text>

        <Layout.Horizontal gap="sm" align="center">
          <Layout.Horizontal align="center" gap="xs" wrap="wrap">
            <Layout.Horizontal gap="2xs" align="center" wrap="wrap">
              <StatusBadge icon={stateObject.icon} variant="primary" theme={stateObject.theme} className="mr-cn-3xs">
                {stateObject.text}
              </StatusBadge>
              <Avatar name={author?.display_name || author?.email || ''} rounded size="sm" />
              <Text variant="body-single-line-strong" color="foreground-1">
                {author?.display_name || author?.email || ''}
              </Text>
              <Text variant="body-single-line-normal">
                {merged ? 'merged' : ' wants to merge'}{' '}
                <Text color="foreground-1" as="span">
                  {stats?.commits}
                </Text>{' '}
                {stats?.commits === 1 ? 'commit' : 'commits'} into
              </Text>
              <BranchTag branchName={target_branch || ''} spaceId={spaceId || ''} repoId={repoId || ''} />
              <Text variant="body-single-line-normal">from</Text>
              <BranchTag
                branchName={source_branch || ''}
                spaceId={spaceId || ''}
                repoId={repoId || ''}
                forkData={
                  isForkPR && source_repo
                    ? {
                        branchName: source_branch || '',
                        path: source_repo.path || '',
                        repoId: source_repo.identifier || ''
                      }
                    : undefined
                }
                toUpstreamRepo={toUpstreamRepo}
              />
              <Separator orientation="vertical" className="mx-cn-4xs h-4" />
              <TimeAgoCard timestamp={merged || created} />
            </Layout.Horizontal>
          </Layout.Horizontal>
        </Layout.Horizontal>
      </Layout.Vertical>

      <PullRequestHeaderEditDialog
        open={isEditing}
        onClose={() => setIsEditing(false)}
        onSubmit={handleSubmit}
        initialTitle={title || ''}
        branchSelectorRenderer={branchSelectorRenderer}
        sourceBranch={source_branch}
        targetBranch={target_branch}
      />
    </>
  )
}
