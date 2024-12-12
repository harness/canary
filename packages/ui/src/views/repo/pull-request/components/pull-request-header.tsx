import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { Badge, Button, Icon, Layout, Text } from '@components/index'
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
    <div className="flex flex-col gap-2 pb-8">
      <div className="flex items-center py-1">
        <Text size={5} weight={'medium'} className="text-primary">
          {original}
          &nbsp;&nbsp;
          <span className="font-normal text-tertiary-background">#{number}</span>
        </Text>
      </div>
      <div className="">
        <div className="flex space-x-2 text-tertiary-background">
          <div className="flex items-center gap-2.5 text-center align-middle">
            <Badge
              disableHover
              borderRadius="full"
              className={`select-none justify-center`}
              theme={stateObject.theme as ThemeType}
            >
              <Layout.Horizontal gap="space-x-1" className="flex items-center align-middle">
                <Icon name={stateObject.icon as IconType} size={13} />
                &nbsp;{stateObject.text}
              </Layout.Horizontal>
            </Badge>
            <div className="flex gap-2">
              <Text
                size={2}
                className="inline-flex flex-wrap items-center gap-1 text-tertiary-background"
                weight="normal"
              >
                <span className="text-primary">{author?.display_name || author?.email || ''}</span>
                <span>{merged ? 'merged' : ' wants to merge'}</span>
                <span className="text-primary">
                  {stats?.commits} {stats?.commits === 1 ? 'commit' : 'commits'}
                </span>
                <span>into</span>
                <Button variant="secondary" size="xs" asChild>
                  <Link to={`/${spaceId}/repos/${repoId}/code/${target_branch}`}>
                    <Icon name="branch" size={12} className="mr-1 text-tertiary-background" />
                    {target_branch}
                  </Link>
                </Button>
                <span>from</span>
                <Button asChild variant="secondary" size="xs">
                  <Link to={`/${spaceId}/repos/${repoId}/code/${source_branch}`}>
                    <Icon name="branch" size={12} className="mr-1 text-tertiary-background" />
                    {source_branch}
                  </Link>
                </Button>
                <span>&nbsp;|&nbsp;</span>
                <span className="time">{formattedTime}</span>
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
