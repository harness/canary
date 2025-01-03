import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { Badge, Icon } from '@components/index'
import { timeAgo } from '@utils/utils'

import { IconType } from '../pull-request.types'
import { getPrState } from '../utils'

type ThemeType = 'default' | 'destructive' | 'warning' | 'success' | 'emphasis' | 'muted' | null | undefined
interface PullRequestTitleProps {
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
  }
}

export const PullRequestHeader: React.FC<PullRequestTitleProps> = ({
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
    repoId
  }
}) => {
  const [original] = useMemo(() => [title], [title])

  // Format the parsed date as relative time from now
  const formattedTime = timeAgo(created || 0)

  const stateObject = getPrState(is_draft, merged, state)
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center">
        <h1 className="text-foreground-1 font-medium text-24 flex gap-x-2.5">
          {original}
          <span className="font-normal text-foreground-4">#{number}</span>
        </h1>
      </div>

      <div className="flex items-center gap-x-3">
        <Badge className="gap-x-1 font-normal" disableHover borderRadius="full" theme={stateObject.theme as ThemeType}>
          <Icon name={stateObject.icon as IconType} size={13} />
          {stateObject.text}
        </Badge>

        <div className="inline-flex flex-wrap items-center gap-1 text-foreground-4">
          <span className="text-foreground-1">{author?.display_name || author?.email || ''}</span>
          <span>{merged ? 'merged' : ' wants to merge'}</span>
          <span className="text-foreground-1">
            {stats?.commits} {stats?.commits === 1 ? 'commit' : 'commits'}
          </span>
          <span>into</span>
          <Badge variant="tertiary" size="md" borderRadius="base">
            <Link className="flex items-center gap-x-1" to={`/${spaceId}/repos/${repoId}/code/${target_branch}`}>
              <Icon name="branch" size={12} className="text-icons-9" />
              {target_branch}
            </Link>
          </Badge>
          <span>from</span>
          <Badge variant="tertiary" size="md" borderRadius="base">
            <Link className="flex items-center gap-x-1" to={`/${spaceId}/repos/${repoId}/code/${source_branch}`}>
              <Icon name="branch" size={12} className="text-icons-9" />
              {source_branch}
            </Link>
          </Badge>
          <span className="w-px h-4 mx-1.5 bg-borders-2" />
          <span className="text-foreground-4">{formattedTime}</span>
        </div>
      </div>
    </div>
  )
}
