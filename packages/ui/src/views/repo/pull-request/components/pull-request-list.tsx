import { FC, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { StackedList } from '@/components'

import { PULL_REQUEST_LIST_HEADER_FILTER_STATES, PullRequestType } from '../pull-request.types'
import { PullRequestItemDescription } from './pull-request-item-description'
import { PullRequestItemTitle } from './pull-request-item-title'
import { PullRequestListHeader } from './pull-request-list-header'

export interface PullRequestListProps {
  pullRequests?: PullRequestType[]
  handleResetFilters?: () => void
  hasActiveFilters?: boolean
  query?: string
  handleResetQuery: () => void
  openPRs?: number
  handleOpenClick?: () => void
  closedPRs?: number
  handleCloseClick?: () => void
}

export const PullRequestList: FC<PullRequestListProps> = ({
  pullRequests,
  openPRs,
  closedPRs,
  handleOpenClick,
  handleCloseClick
}) => {
  const [headerFilter, setHeaderFilter] = useState<PULL_REQUEST_LIST_HEADER_FILTER_STATES>(
    PULL_REQUEST_LIST_HEADER_FILTER_STATES.OPEN
  )
  const filteredData = useMemo<PullRequestType[]>(() => {
    if (!pullRequests) return []

    return pullRequests.filter(pr => {
      if (headerFilter === PULL_REQUEST_LIST_HEADER_FILTER_STATES.OPEN) return pr.state === 'open'
      if (headerFilter === PULL_REQUEST_LIST_HEADER_FILTER_STATES.CLOSED)
        return pr.state !== 'open' || pr.merged !== null
      return true
    })
  }, [headerFilter, pullRequests])

  const onOpenClick = () => {
    setHeaderFilter(PULL_REQUEST_LIST_HEADER_FILTER_STATES.OPEN)
    handleOpenClick?.()
  }
  const onCloseClick = () => {
    setHeaderFilter(PULL_REQUEST_LIST_HEADER_FILTER_STATES.CLOSED)
    handleCloseClick?.()
  }

  if (!filteredData?.length) return null

  return (
    <StackedList.Root>
      <StackedList.Item disableHover>
        <StackedList.Field
          title={
            <PullRequestListHeader
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
          <StackedList.Item className="px-4 py-3" isLast={filteredData.length - 1 === pullRequest_idx}>
            {pullRequest.number && (
              <>
                <StackedList.Field
                  className="gap-1.5"
                  title={
                    pullRequest.name && (
                      <PullRequestItemTitle
                        isDraft={pullRequest.is_draft}
                        state={pullRequest.state}
                        success={!!pullRequest.merged}
                        title={pullRequest.name}
                        labels={pullRequest.labels || []}
                        comments={5}
                        merged={pullRequest.merged}
                      />
                    )
                  }
                  description={
                    pullRequest.author && (
                      <PullRequestItemDescription
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
