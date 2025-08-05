import { FC } from 'react'

import { NoData, StackedList } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { PullRequestListProps } from '@/views'
import { noop } from 'lodash-es'

import { PullRequestItemDescription } from './pull-request-item-description'
import { PullRequestItemTitle } from './pull-request-item-title'
import { PullRequestListHeader } from './pull-request-list-header'

export const PullRequestList: FC<PullRequestListProps> = ({
  pullRequests = [],
  openPRs,
  closedPRs,
  handleOpenClick,
  handleCloseClick,
  spaceId,
  repo,
  headerFilter,
  setHeaderFilter,
  onLabelClick,
  toPullRequest,
  onClickPullRequest,
  scope,
  showScope = false
}) => {
  const { identifier: repoId } = repo || {}
  const { Link } = useRouterContext()
  const { t } = useTranslation()

  const onOpenClick = () => {
    setHeaderFilter(['open'])
    handleOpenClick?.()
  }
  const onCloseClick = () => {
    setHeaderFilter(['closed', 'merged'])
    handleCloseClick?.()
  }

  if (!pullRequests.length && headerFilter.includes('open') && openPRs === 0 && !!closedPRs) {
    return (
      <StackedList.Root className="grid grow grid-rows-[auto,1fr]">
        <StackedList.Item disableHover>
          <PullRequestListHeader
            headerFilter={headerFilter}
            onOpenClick={onOpenClick}
            onCloseClick={onCloseClick}
            openPRs={openPRs}
            closedPRs={closedPRs}
          />
        </StackedList.Item>
        <NoData
          imageName="no-data-folder"
          title="No open pull requests yet"
          description={[
            t(
              'views:noData.noOpenPullRequests',
              `There are no open pull requests in this ${repoId ? 'repo' : 'project'} yet.`
            ),
            t('views:noData.createNewPullRequest', 'Create a new pull request.')
          ]}
          primaryButton={
            /** Hide the "Create pull request" button when viewing project-level pull requests (i.e., when repoId is not provided) */
            repoId
              ? {
                  label: 'Create pull request',
                  to: `${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/`
                }
              : undefined
          }
        />
      </StackedList.Root>
    )
  }

  if (!pullRequests.length && headerFilter.includes('closed') && closedPRs === 0 && openPRs && openPRs > 0) {
    return (
      <StackedList.Root className="grid grow grid-rows-[auto,1fr]">
        <StackedList.Item disableHover>
          <PullRequestListHeader
            headerFilter={headerFilter}
            onOpenClick={onOpenClick}
            onCloseClick={onCloseClick}
            openPRs={openPRs}
            closedPRs={closedPRs}
          />
        </StackedList.Item>

        <NoData
          imageName="no-data-folder"
          title="No closed pull requests yet"
          description={[
            t('views:noData.noClosedPullRequests', 'There are no closed pull requests in this project yet.'),
            t('views:noData.createNewPullRequest', 'Create a new pull request.')
          ]}
          primaryButton={
            repoId
              ? {
                  label: 'Create pull request',
                  to: `${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/`
                }
              : undefined
          }
        />
      </StackedList.Root>
    )
  }

  if (!pullRequests?.length) return <></>

  return (
    <StackedList.Root>
      <StackedList.Item disableHover>
        <PullRequestListHeader
          headerFilter={headerFilter}
          onOpenClick={onOpenClick}
          onCloseClick={onCloseClick}
          openPRs={openPRs}
          closedPRs={closedPRs}
        />
      </StackedList.Item>
      {pullRequests.map((pullRequest, pullRequest_idx) => (
        <StackedList.Item
          className="px-4 py-3"
          isLast={pullRequests.length - 1 === pullRequest_idx}
          key={`${pullRequest.number}-${pullRequest.repo?.path}`}
          asChild
        >
          <Link
            to={
              toPullRequest && pullRequest.number
                ? (toPullRequest({ prNumber: pullRequest.number, repoId: pullRequest.repo?.identifier }) ?? '')
                : ''
            }
            onClick={
              /**
               * Prioritize the `toPullRequest` prop if provided, otherwise use the on click handler.
               */
              toPullRequest
                ? noop
                : (e: React.MouseEvent) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onClickPullRequest?.({
                      prNumber: pullRequest.number,
                      repo: { name: pullRequest.repo?.identifier || '', path: pullRequest.repo?.path || '' }
                    })
                  }
            }
          >
            {!!pullRequest.number && (
              <StackedList.Field
                className="grid gap-1.5 !overflow-visible"
                title={
                  pullRequest.name && (
                    <PullRequestItemTitle
                      pullRequest={pullRequest}
                      onLabelClick={onLabelClick}
                      scope={scope}
                      showScope={showScope}
                    />
                  )
                }
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
          </Link>
        </StackedList.Item>
      ))}
    </StackedList.Root>
  )
}
