import { useCallback, useState } from 'react'

import { Button, IconV2, StatusBadge, Tag, TimeAgoCard } from '@/components'
import { useRouterContext } from '@/context'
import { cn } from '@utils/cn'
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
  const { Link } = useRouterContext()

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
      <div className={cn('flex w-full flex-col gap-y-4', className)}>
        <div className="text-6 flex w-full max-w-full items-center gap-x-3">
          <div className="flex items-center gap-x-2.5 leading-snug">
            <h1 className="text-cn-foreground-1 flex max-w-[95%] items-center truncate font-medium">{title}</h1>
            <span className="text-cn-foreground-2 font-normal">#{number}</span>
          </div>

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
        </div>

        <div className="flex items-center gap-x-3">
          <StatusBadge icon={stateObject.icon} variant="outline" theme={stateObject.theme}>
            {stateObject.text}
          </StatusBadge>

          <div className="text-cn-foreground-2 inline-flex flex-wrap items-center gap-1">
            <span className="text-cn-foreground-1 font-medium">{author?.display_name || author?.email || ''}</span>
            <span>{merged ? 'merged' : ' wants to merge'}</span>
            <span className="text-cn-foreground-1 font-medium">
              {stats?.commits} {stats?.commits === 1 ? 'commit' : 'commits'}
            </span>
            <span>into</span>
            <Link to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/code/${target_branch}`}>
              <Tag
                variant="secondary"
                theme="blue"
                icon="git-branch"
                value={target_branch || ''}
                showIcon
                enableHover
              />
            </Link>
            <span>from</span>
            <Link to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/code/${source_branch}`}>
              <Tag
                variant="secondary"
                theme="blue"
                icon="git-branch"
                value={source_branch || ''}
                showIcon
                enableHover
              />
            </Link>
            <span className="bg-cn-border-3 mx-1.5 h-4 w-px" />
            <TimeAgoCard timestamp={created} />
          </div>
        </div>
      </div>

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
