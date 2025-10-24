import { FC } from 'react'

import { IconV2, NoData, StackedList } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { PRState, PullRequestListProps } from '@/views'
import { noop } from 'lodash-es'

import { PullRequestItemDescription } from './pull-request-item-description'
import { PullRequestItemTitle } from './pull-request-item-title'
import { PullRequestListHeader } from './pull-request-list-header'

// Define constants for state values to avoid string literals
enum PR_STATE {
  OPEN = 'open',
  CLOSED = 'closed',
  MERGED = 'merged'
}

type EmptyStateProps = {
  headerFilter: Array<PRState>
  onOpenClick: () => void
  onMergedClick: () => void
  onCloseClick: () => void
  openPRs?: number
  mergedPRs?: number
  closedPRs?: number
  repoId?: string
  spaceId?: string
  state: PR_STATE
}

const EmptyStateView: FC<EmptyStateProps> = ({
  headerFilter,
  onOpenClick,
  onMergedClick,
  onCloseClick,
  openPRs,
  mergedPRs,
  closedPRs,
  repoId,
  spaceId,
  state
}) => {
  const { t } = useTranslation()

  const getTitleAndDescription = () => {
    switch (state) {
      case PR_STATE.OPEN:
        return {
          title: t('views:noData.title.noOpenPullRequests', 'No open pull requests yet'),
          description: [
            t(
              'views:noData.noOpenPullRequests',
              `There are no open pull requests in this ${repoId ? 'repo' : 'project'} yet.`
            ),
            t('views:repos.createPullReq', 'Create Pull Request.')
          ]
        }
      case PR_STATE.CLOSED:
        return {
          title: t('views:noData.title.noClosedPullRequests', 'No closed pull requests yet'),
          description: [
            t('views:noData.noClosedPullRequests', 'There are no closed pull requests in this project yet.'),
            t('views:repos.createPullReq', 'Create Pull Request.')
          ]
        }
      case PR_STATE.MERGED:
        return {
          title: t('views:noData.title.noMergedPullRequests', 'No merged pull requests yet'),
          description: [
            t('views:noData.noMergedPullRequests', 'There are no merged pull requests in this project yet.'),
            t('views:repos.createPullReq', 'Create Pull Request.')
          ]
        }
      default:
        return {
          title: '',
          description: ['']
        }
    }
  }

  const { title, description } = getTitleAndDescription()

  return (
    <StackedList.Root className="grid grow grid-rows-[auto,1fr]">
      <StackedList.Item disableHover>
        <StackedList.Field
          title={
            <PullRequestListHeader
              headerFilter={headerFilter}
              onOpenClick={onOpenClick}
              onMergedClick={onMergedClick}
              onCloseClick={onCloseClick}
              openPRs={openPRs}
              mergedPRs={mergedPRs}
              closedPRs={closedPRs}
            />
          }
        />
      </StackedList.Item>
      <NoData
        imageName="no-data-pr"
        title={title}
        description={description}
        primaryButton={
          repoId
            ? {
                label: (
                  <>
                    <IconV2 name="plus" />
                    {t('views:noData.button.createPullRequest', 'Create Pull Request')}
                  </>
                ),
                to: `${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/`
              }
            : undefined
        }
      />
    </StackedList.Root>
  )
}

export const PullRequestList: FC<PullRequestListProps> = ({
  pullRequests = [],
  openPRs,
  mergedPRs,
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

  const onOpenClick = () => {
    setHeaderFilter(['open'])
    handleOpenClick?.()
  }
  const onCloseClick = () => {
    setHeaderFilter(['closed'])
    handleCloseClick?.()
  }

  const onMergedClick = () => {
    setHeaderFilter(['merged'])
  }

  let state: (typeof PR_STATE)[keyof typeof PR_STATE] | undefined

  if (headerFilter.includes('open') && !openPRs) {
    state = PR_STATE.OPEN
  } else if (headerFilter.includes('closed') && !closedPRs) {
    state = PR_STATE.CLOSED
  } else if (headerFilter.includes('merged') && !mergedPRs) {
    state = PR_STATE.MERGED
  }

  if (!pullRequests.length && state) {
    return (
      <EmptyStateView
        headerFilter={headerFilter}
        onOpenClick={onOpenClick}
        onMergedClick={onMergedClick}
        onCloseClick={onCloseClick}
        openPRs={openPRs}
        mergedPRs={mergedPRs}
        closedPRs={closedPRs}
        repoId={repoId}
        spaceId={spaceId}
        state={state}
      />
    )
  }

  if (!pullRequests?.length) return <></>

  return (
    <StackedList.Root>
      <StackedList.Item isHeader className="py-cn-sm gap-cn-lg" disableHover>
        <StackedList.Field
          title={
            <PullRequestListHeader
              headerFilter={headerFilter}
              onOpenClick={onOpenClick}
              onMergedClick={onMergedClick}
              onCloseClick={onCloseClick}
              openPRs={openPRs}
              mergedPRs={mergedPRs}
              closedPRs={closedPRs}
            />
          }
        />
      </StackedList.Item>
      {pullRequests.map((pullRequest, pullRequest_idx) => (
        <Link
          key={`${pullRequest.number}-${pullRequest.repo?.path}`}
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
          <StackedList.Item className="px-4 py-3" isLast={pullRequests.length - 1 === pullRequest_idx}>
            {!!pullRequest.number && (
              <StackedList.Field
                className="grid gap-cn-2xs justify-normal"
                disableTruncate
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
          </StackedList.Item>
        </Link>
      ))}
    </StackedList.Root>
  )
}
