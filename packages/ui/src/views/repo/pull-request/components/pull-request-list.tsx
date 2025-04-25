import { FC, useMemo, useState } from 'react'

import { NoData, StackedList } from '@/components'
import { useRouterContext } from '@/context'
import { PULL_REQUEST_LIST_HEADER_FILTER_STATES, PullRequestType, TranslationStore } from '@/views'

import { PullRequestItemDescription } from './pull-request-item-description'
import { PullRequestItemTitle } from './pull-request-item-title'
import { PullRequestListHeader } from './pull-request-list-header'

export interface PullRequestListProps {
  pullRequests?: PullRequestType[]
  handleResetFilters?: () => void
  hasActiveFilters?: boolean
  query?: string
  openPRs?: number
  handleOpenClick?: () => void
  closedPRs?: number
  handleCloseClick?: () => void
  repoId?: string
  spaceId?: string
  useTranslationStore: () => TranslationStore
}

export const PullRequestList: FC<PullRequestListProps> = ({
  pullRequests,
  openPRs,
  closedPRs,
  handleOpenClick,
  handleCloseClick,
  spaceId,
  repoId,
  useTranslationStore
}) => {
  const { Link } = useRouterContext()
  const { t } = useTranslationStore()

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

  if (
    !filteredData.length &&
    headerFilter === PULL_REQUEST_LIST_HEADER_FILTER_STATES.OPEN &&
    openPRs === 0 &&
    !!closedPRs
  ) {
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
        <div className="flex min-h-[50vh] items-center justify-center">
          <NoData
            iconName="no-data-folder"
            title="No open pull requests yet"
            description={[
              t('views:noData.noOpenPullRequests', 'There are no open pull requests in this project yet.'),
              t('views:noData.createNewPullRequest', 'Create a new pull request.')
            ]}
            primaryButton={{
              label: 'Create pull request',
              to: `${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/`
            }}
          />
        </div>
      </StackedList.Root>
    )
  }

  if (
    !filteredData.length &&
    headerFilter === PULL_REQUEST_LIST_HEADER_FILTER_STATES.CLOSED &&
    closedPRs === 0 &&
    openPRs &&
    openPRs > 0
  ) {
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

        <div className="flex min-h-[50vh] items-center justify-center">
          <NoData
            iconName="no-data-folder"
            title="No closed pull requests yet"
            description={[
              t('views:noData.noClosedPullRequests', 'There are no closed pull requests in this project yet.'),
              t('views:noData.createNewPullRequest', 'Create a new pull request.')
            ]}
            primaryButton={{
              label: 'Create pull request',
              to: `${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/`
            }}
          />
        </div>
      </StackedList.Root>
    )
  }

  if (!filteredData?.length) return <></>

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
            {!!pullRequest.number && (
              <StackedList.Field
                className="max-w-full gap-1.5"
                title={pullRequest.name && <PullRequestItemTitle pullRequest={pullRequest} />}
                description={
                  pullRequest.author &&
                  typeof pullRequest.author === 'string' && (
                    <PullRequestItemDescription
                      number={pullRequest.number}
                      author={pullRequest.author}
                      reviewRequired={pullRequest.reviewRequired}
                      tasks={pullRequest.tasks}
                      sourceBranch={pullRequest.sourceBranch || ''}
                      timestamp={pullRequest.timestamp}
                      targetBranch={pullRequest.targetBranch || ''}
                    />
                  )
                }
              />
            )}
          </StackedList.Item>
        </Link>
      ))}
    </StackedList.Root>
  )
}
