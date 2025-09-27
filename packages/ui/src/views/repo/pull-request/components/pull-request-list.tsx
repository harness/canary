import { FC, useMemo } from 'react'

import { IconV2, NoData, Skeleton, StackedList } from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@/utils'
import { EnumPullReqState, PullRequest, PullRequestListProps } from '@/views'

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
  repoId?: string
  spaceId?: string
  state: PR_STATE
}

const EmptyStateView: FC<EmptyStateProps> = ({ repoId, spaceId, state }) => {
  const { t } = useTranslation()

  const { title, description } = useMemo(() => {
    switch (state) {
      case PR_STATE.OPEN:
        return {
          title: t('views:noData.title.noOpenPullRequests', 'No open pull requests yet'),
          description: [
            t(
              'views:noData.noOpenPullRequests',
              `There are no open pull requests in this ${repoId ? 'repo' : 'project'} yet.`
            )
          ]
        }
      case PR_STATE.CLOSED:
        return {
          title: t('views:noData.title.noClosedPullRequests', 'No closed pull requests yet'),
          description: [
            t('views:noData.noClosedPullRequests', 'There are no closed pull requests in this project yet.')
          ]
        }
      case PR_STATE.MERGED:
        return {
          title: t('views:noData.title.noMergedPullRequests', 'No merged pull requests yet'),
          description: [
            t('views:noData.noMergedPullRequests', 'There are no merged pull requests in this project yet.')
          ]
        }
      default:
        return {
          title: '',
          description: ['']
        }
    }
  }, [state, repoId])

  return (
    <NoData
      imageName="no-data-pr"
      title={title}
      description={description}
      primaryButton={
        repoId && state === PR_STATE.OPEN
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
  )
}

export const PullRequestList: FC<PullRequestListProps> = ({
  pullRequests = [],
  openPRs,
  mergedPRs,
  closedPRs,
  spaceId,
  repo,
  headerFilter,
  setHeaderFilter,
  onLabelClick,
  toPullRequest,
  onClickPullRequest,
  scope,
  dirtyNoDataContent: DirtyNoDataContent,
  showScope = false,
  toBranch,
  isLoading
}) => {
  const { identifier: repoId } = repo || {}

  const onHeaderFilterClick = (data: EnumPullReqState) => {
    setHeaderFilter([data])
  }

  const state: (typeof PR_STATE)[keyof typeof PR_STATE] | undefined = useMemo(() => {
    if (headerFilter.includes('open') && !openPRs) {
      return PR_STATE.OPEN
    } else if (headerFilter.includes('closed') && !closedPRs) {
      return PR_STATE.CLOSED
    } else if (headerFilter.includes('merged') && !mergedPRs) {
      return PR_STATE.MERGED
    }

    return undefined
  }, [headerFilter, openPRs, closedPRs, mergedPRs])

  /**
   * Prioritize the `toPullRequest` prop if provided, otherwise use the on click handler.
   */
  const prLinkClickHandler = (pullRequest: PullRequest) => {
    if (toPullRequest) return

    onClickPullRequest?.({
      prNumber: pullRequest.number,
      repo: { name: pullRequest.repo?.identifier || '', path: pullRequest.repo?.path || '' }
    })
  }

  const isEmptyState = !pullRequests.length && !!state

  return (
    <StackedList.Root className={cn({ 'flex grow flex-col': isEmptyState, 'cn-skeleton-list': isLoading })}>
      <StackedList.Header className={cn({ 'grow-0': isEmptyState })}>
        <StackedList.Field
          title={
            <PullRequestListHeader
              isLoading={isLoading}
              onChange={onHeaderFilterClick}
              headerFilter={headerFilter}
              openPRs={openPRs}
              mergedPRs={mergedPRs}
              closedPRs={closedPRs}
            />
          }
        />
      </StackedList.Header>

      {isLoading && <Skeleton.List onlyItems />}

      {isEmptyState &&
        !isLoading &&
        (DirtyNoDataContent ? DirtyNoDataContent : <EmptyStateView repoId={repoId} spaceId={spaceId} state={state} />)}

      {!isLoading &&
        pullRequests.map(pullRequest => (
          <StackedList.Item
            key={`${pullRequest.number}-${pullRequest.repo?.path}`}
            paddingY="sm"
            {...(toPullRequest && pullRequest.number
              ? {
                  to: toPullRequest({ prNumber: pullRequest.number, repoId: pullRequest.repo?.identifier })
                }
              : {})}
            {...(onClickPullRequest
              ? {
                  onClick: () => prLinkClickHandler(pullRequest)
                }
              : {})}
          >
            {!!pullRequest.number && (
              <StackedList.Field
                className="gap-cn-2xs"
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
                      state={pullRequest.state || ('opened' as EnumPullReqState)}
                      targetBranch={pullRequest.targetBranch || ''}
                      toBranch={toBranch}
                      repoId={pullRequest.repo?.identifier || ''}
                    />
                  )
                }
              />
            )}
          </StackedList.Item>
        ))}
    </StackedList.Root>
  )
}
