import { useCallback, useState } from 'react'

import { Button, Icon, Separator, StatusBadge, Tag } from '@/components'
import { useRouterContext } from '@/context'
import { TranslationStore } from '@/views'
import { cn } from '@utils/cn'
import { timeAgo } from '@utils/utils'

import { IconType } from '../pull-request.types'
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
  useTranslationStore: () => TranslationStore
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
  useTranslationStore
}) => {
  const { Link } = useRouterContext()
  const [isEditing, setIsEditing] = useState(false)

  // Format the parsed date as relative time from now
  const formattedTime = timeAgo(created || 0)

  const stateObject = getPrState(is_draft, merged, state)

  const handleSubmit = useCallback(
    async (newTitle: string, newDescription: string) => {
      await updateTitle(newTitle, newDescription)
    },
    [updateTitle]
  )

  return (
    <>
      <div className={cn('flex w-full flex-col gap-y-4', className)}>
        <div className="flex w-full max-w-full items-center gap-x-3 text-6">
          <div className="flex items-center gap-x-2.5 leading-snug">
            <h1 className="flex max-w-[95%] items-center truncate font-medium text-cn-foreground-1">{title}</h1>
            <span className="font-normal text-cn-foreground-2">#{number}</span>
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
            <Icon name="edit-pen" size={16} className="text-icons-1 group-hover:text-icons-3" />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-4 bg-cn-background-0" />
          <Button variant="link" onClick={() => setIsEditing(true)}>
            Add a description
          </Button>
        </div>

        <div className="flex items-center gap-x-3">
          <StatusBadge variant="outline" theme={stateObject.theme}>
            <Icon name={stateObject.icon as IconType} size={13} />
            {stateObject.text}
          </StatusBadge>

          <div className="inline-flex flex-wrap items-center gap-1 text-cn-foreground-2">
            <span className="font-medium text-cn-foreground-1">{author?.display_name || author?.email || ''}</span>
            <span>{merged ? 'merged' : ' wants to merge'}</span>
            <span className="font-medium text-cn-foreground-1">
              {stats?.commits} {stats?.commits === 1 ? 'commit' : 'commits'}
            </span>
            <span>into</span>
            <Link to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/code/${target_branch}`}>
              <Tag variant="secondary" icon="branch-2" size="sm" value={target_branch || ''} showIcon />
            </Link>
            <span>from</span>
            <Link to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/code/${source_branch}`}>
              <Tag variant="secondary" icon="branch-2" size="sm" value={source_branch || ''} showIcon />
            </Link>
            <span className="mx-1.5 h-4 w-px bg-cn-background-3" />
            <span className="text-cn-foreground-2">{formattedTime}</span>
          </div>
        </div>
      </div>

      <PullRequestHeaderEditDialog
        open={isEditing}
        onClose={() => setIsEditing(false)}
        onSubmit={handleSubmit}
        initialTitle={title || ''}
        initialDescription={description || ''}
        useTranslationStore={useTranslationStore}
      />
    </>
  )
}
