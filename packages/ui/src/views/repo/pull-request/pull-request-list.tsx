import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import * as StackedList from '../../../components/stacked-list'
import { PullRequestListDescription } from './pull-request-list-description'
import { PullRequestListHeaderTitle } from './pull-request-list-header-title'
import { PullRequestListTitle } from './pull-request-list-title'
import { PullRequestType } from './types'

export interface PullRequestListPageProps {
  pullRequests?: PullRequestType[]
  // LinkComponent: React.ComponentType<{ to: string; children: React.ReactNode }>
  handleResetFilters?: () => void
  hasActiveFilters?: boolean
  query?: string
  handleResetQuery: () => void
  closedPRs?: number
  openPRs?: number
}

export function PullRequestList({ pullRequests, openPRs, closedPRs }: PullRequestListPageProps) {
  const [headerFilter, setHeaderFilter] = useState('open')
  const filteredData = useMemo<PullRequestType[]>(() => {
    if (!pullRequests) return []

    return pullRequests.filter(pr => {
      if (headerFilter === 'open') return pr.state === 'open'
      if (headerFilter === 'closed') return pr.state !== 'open' || pr.merged !== null
      return true
    })
  }, [headerFilter, pullRequests])

  const onOpenClick = () => {
    setHeaderFilter('open')
  }
  const onCloseClick = () => {
    setHeaderFilter('closed')
  }

  if (!filteredData?.length) return null

  return (
    <StackedList.Root>
      <StackedList.Item isHeader disableHover>
        <StackedList.Field
          title={
            <PullRequestListHeaderTitle
              headerFilter={headerFilter}
              onOpenClick={onOpenClick}
              onCloseClick={onCloseClick}
              openPRs={openPRs}
              closedPRs={closedPRs}
            />
          }
        />
      </StackedList.Item>
      {filteredData.map((pullRequest, pullRequest_idx) => (
        <Link key={pullRequest.sha} to={pullRequest.number?.toString() || ''}>
          <StackedList.Item isLast={filteredData.length - 1 === pullRequest_idx}>
            {pullRequest.number && (
              <>
                <StackedList.Field
                  title={
                    pullRequest.name && (
                      <PullRequestListTitle
                        isDraft={pullRequest.is_draft}
                        state={pullRequest.state}
                        success={!!pullRequest.merged}
                        title={pullRequest.name}
                        labels={pullRequest.labels || []}
                        comments={pullRequest.comments}
                        merged={pullRequest.merged}
                      />
                    )
                  }
                  description={
                    pullRequest.author && (
                      <PullRequestListDescription
                        number={pullRequest.number}
                        author={pullRequest.author}
                        reviewRequired={pullRequest.reviewRequired}
                        tasks={pullRequest.tasks}
                        sourceBranch={pullRequest.source_branch || ''}
                        timestamp={pullRequest.timestamp}
                      />
                    )
                  }
                />
              </>
            )}
          </StackedList.Item>
        </Link>
      ))}
    </StackedList.Root>
  )
}
