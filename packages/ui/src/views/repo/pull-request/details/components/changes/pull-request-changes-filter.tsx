import { useEffect, useMemo, useState } from 'react'

import { Button, CounterBadge, DropdownMenu, IconV2, Layout, SplitButton } from '@/components'
import { useTranslation } from '@/context'
import { TypesUser } from '@/types'
import { formatNumber } from '@/utils'
import { TypesCommit } from '@/views'
import { DiffModeEnum } from '@git-diff-view/react'

import {
  EnumPullReqReviewDecision,
  PullReqReviewDecision,
  TypesPullReq,
  TypesPullReqStats
} from '../../../pull-request.types'
import { ReviewerListPullReqOkResponse } from '../../pull-request-details-types'
import {
  approvalItems,
  determineOverallDecision,
  getApprovalItems,
  getApprovalStateTheme,
  processReviewDecision
} from '../../pull-request-utils'
import * as FileViewGauge from './file-viewed-gauge'

export interface CommitFilterItemProps {
  name: string
  count: number
  value: string
}

export interface PullRequestChangesFilterProps {
  active?: string
  currentUser: TypesUser
  pullRequestMetadata?: TypesPullReq | undefined
  reviewers?: ReviewerListPullReqOkResponse
  submitReview?: (decision: PullReqReviewDecision) => void
  refetchReviewers?: () => void
  isApproving?: boolean
  diffMode: DiffModeEnum
  setDiffMode: (value: DiffModeEnum) => void
  pullReqCommits?: TypesCommit[]
  defaultCommitFilter: CommitFilterItemProps
  selectedCommits: CommitFilterItemProps[]
  setSelectedCommits: React.Dispatch<React.SetStateAction<CommitFilterItemProps[]>>
  viewedFiles: number
  commitSuggestionsBatchCount: number
  onCommitSuggestionsBatch: () => void
  diffData?: {
    filePath: string
    addedLines: number
    deletedLines: number
  }[]
  pullReqStats?: TypesPullReqStats
  setJumpToDiff: (fileName: string) => void
}

export const PullRequestChangesFilter: React.FC<PullRequestChangesFilterProps> = ({
  currentUser,
  pullRequestMetadata,
  reviewers,
  submitReview,
  refetchReviewers,
  isApproving,
  // diffMode,
  // setDiffMode,
  pullReqCommits,
  defaultCommitFilter,
  selectedCommits,
  setSelectedCommits,
  viewedFiles,
  commitSuggestionsBatchCount,
  onCommitSuggestionsBatch,
  diffData,
  pullReqStats,
  setJumpToDiff
}) => {
  const { t } = useTranslation()
  const [commitFilterOptions, setCommitFilterOptions] = useState([defaultCommitFilter])
  const shouldHideReviewButton = useMemo(
    () => pullRequestMetadata?.state === 'merged' || pullRequestMetadata?.state === 'closed',
    [pullRequestMetadata?.state]
  )
  const [commitSha, setCommitSha] = useState('')
  const [_loading, setLoading] = useState(true)

  const overallState = useMemo(() => determineOverallDecision(reviewers, currentUser), [reviewers, currentUser])
  const [approveState, setApproveState] = useState(overallState)
  const isActiveUserPROwner = useMemo(
    () =>
      !!currentUser?.uid && !!pullRequestMetadata?.author?.uid && currentUser?.uid === pullRequestMetadata?.author?.uid,
    [currentUser, pullRequestMetadata]
  )

  // Populate commit options when `pullReqCommits` is available
  useEffect(() => {
    if (pullReqCommits?.length) {
      const commitsList = [defaultCommitFilter]
      pullReqCommits.forEach(commitInfo => {
        commitsList.push({
          name: commitInfo.message || '',
          count: 0,
          value: commitInfo.sha || ''
        })
      })
      setCommitFilterOptions(commitsList)
    }
  }, [pullReqCommits, defaultCommitFilter])

  useEffect(() => {
    if (refetchReviewers) {
      refetchReviewers()
    }
  }, [refetchReviewers])
  useEffect(() => {
    if (reviewers) {
      const currentUserData = reviewers.filter(val => val?.reviewer?.uid === currentUser?.uid)
      if (currentUserData[0] && currentUserData[0].sha) {
        setCommitSha(currentUserData[0].sha)
      }
      setApproveState(determineOverallDecision(reviewers, currentUser))
      setLoading(false)
    }
  }, [reviewers, currentUser])

  const getApprovalState = (state: string) => {
    const checkOutdated = processReviewDecision(
      approveState as EnumPullReqReviewDecision,
      commitSha,
      pullRequestMetadata?.source_sha
    )
    if (
      (state === PullReqReviewDecision.approved && checkOutdated === PullReqReviewDecision.outdated) ||
      (state === PullReqReviewDecision.changeReq && checkOutdated === PullReqReviewDecision.outdated)
    ) {
      return t('views:pullRequests.approve')
    } else if (state === PullReqReviewDecision.approved) {
      return t('views:pullRequests.approved')
    } else if (state === PullReqReviewDecision.changeReq) {
      return t('views:pullRequests.changereq')
    } else {
      return t('views:pullRequests.approve').toLowerCase()
    }
  }

  /** Click handler to manage multi-selection of commits */
  const handleCommitCheck = (item: CommitFilterItemProps, checked: boolean): void => {
    // If user clicked on 'All Commits', reset selection to just the default commit filter
    if (item.value === defaultCommitFilter.value) {
      setSelectedCommits([defaultCommitFilter])
      return
    }

    setSelectedCommits((prev: CommitFilterItemProps[]) => {
      // Remove the 'All' option if it exists in the selection
      const withoutDefault = prev.filter(sel => sel.value !== defaultCommitFilter.value)

      if (checked) {
        // Add the item to selection
        return [...withoutDefault, item]
      } else {
        // Remove the item from selection, but ensure at least one item remains selected
        const filtered = withoutDefault.filter(sel => sel.value !== item.value)
        return filtered.length > 0 ? filtered : withoutDefault
      }
    })
  }

  function renderCommitDropdownItems(items: CommitFilterItemProps[]): JSX.Element[] {
    return items.map((item, idx) => {
      const isSelected = selectedCommits.some(sel => sel.value === item.value)

      return (
        <DropdownMenu.CheckboxItem
          title={item.name}
          checked={isSelected}
          key={idx}
          onCheckedChange={checked => handleCommitCheck(item, checked)}
          className="flex cursor-pointer items-center"
        />
      )
    })
  }

  const commitDropdownItems = renderCommitDropdownItems(commitFilterOptions)
  const itemsToRender = getApprovalItems(approveState, approvalItems)
  // const handleDiffModeChange = (value: string) => {
  //   setDiffMode(value === 'Split' ? DiffModeEnum.Split : DiffModeEnum.Unified)
  // }

  return (
    <Layout.Horizontal align="center" justify="between" className="gap-x-5">
      <Layout.Horizontal className="grow gap-x-5">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="group flex items-center gap-x-1.5">
            <Button size="sm" variant="transparent">
              {selectedCommits[0].value === 'ALL' ? (
                <>
                  <span>{defaultCommitFilter.name}</span>
                  <span className="text-cn-foreground-3">({defaultCommitFilter.count})</span>
                </>
              ) : (
                <>
                  <span>Commits</span>
                  <span className="text-cn-foreground-3">({selectedCommits?.length})</span>
                </>
              )}
              <IconV2 name="nav-solid-arrow-down" size="2xs" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="w-96" align="start">
            {commitDropdownItems}
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        {/* <DropdownMenu.Root>
          <DropdownMenu.Trigger className="group flex items-center gap-x-1.5 text-2">
            <Button size="sm" variant="transparent">
              {diffMode === DiffModeEnum.Split ? t('views:pullRequests.split') : t('views:pullRequests.unified')}
              <IconV2 name="nav-solid-arrow-down" size="2xs" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="start">
            {DiffModeOptions.map(item => (
              <DropdownMenu.Item
                title={item.name}
                className={cn({
                  'bg-cn-background-hover':
                    diffMode === (item.value === 'Split' ? DiffModeEnum.Split : DiffModeEnum.Unified)
                })}
                key={item.value}
                onClick={() => handleDiffModeChange(item.value)}
              />
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root> */}

        <DropdownMenu.Root>
          <Layout.Horizontal align="center">
            <p className="text-2 leading-tight text-cn-foreground-2">
              {t('views:commits.commitDetailsDiffShowing', 'Showing')}{' '}
              <DropdownMenu.Trigger className="group">
                <span className="group-hover:decoration-foreground-accent text-cn-foreground-accent underline decoration-transparent underline-offset-4 transition-colors duration-200">
                  {formatNumber(pullReqStats?.files_changed || 0)}{' '}
                  {t('views:commits.commitDetailsDiffChangedFiles', 'changed files')}
                </span>
              </DropdownMenu.Trigger>{' '}
              {t('views:commits.commitDetailsDiffWith', 'with')} {formatNumber(pullReqStats?.additions || 0)}{' '}
              {t('views:commits.commitDetailsDiffAdditionsAnd', 'additions and')}{' '}
              {formatNumber(pullReqStats?.deletions || 0)} {t('views:commits.commitDetailsDiffDeletions', 'deletions')}
            </p>
          </Layout.Horizontal>
          <DropdownMenu.Content className="max-w-[396px]" align="start">
            {diffData?.map(diff => (
              <DropdownMenu.Item
                key={diff.filePath}
                onClick={() => {
                  setJumpToDiff(diff.filePath)
                }}
                title={
                  <Layout.Horizontal align="center" className="min-w-0 gap-x-3">
                    <Layout.Horizontal align="center" justify="start" className="min-w-0 flex-1 gap-x-1.5">
                      <IconV2 name="page" className="shrink-0 text-icons-1" />
                      <span className="overflow-hidden truncate text-2 text-cn-foreground-1 [direction:rtl]">
                        {diff.filePath}
                      </span>
                    </Layout.Horizontal>
                  </Layout.Horizontal>
                }
                label={
                  <Layout.Horizontal className="shrink-0 text-2" gap="none">
                    {diff.addedLines != null && diff.addedLines > 0 && (
                      <span className="text-cn-foreground-success">+{diff.addedLines}</span>
                    )}
                    {diff.addedLines != null &&
                      diff.addedLines > 0 &&
                      diff.deletedLines != null &&
                      diff.deletedLines > 0 && <span className="mx-1.5 h-3 w-px bg-cn-background-3" />}
                    {diff.deletedLines != null && diff.deletedLines > 0 && (
                      <span className="text-cn-foreground-danger">-{diff.deletedLines}</span>
                    )}
                  </Layout.Horizontal>
                }
              />
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Layout.Horizontal>

      <Layout.Horizontal className="gap-x-7">
        {selectedCommits[0].value === 'ALL' && (
          <FileViewGauge.Root>
            <div className="py-1">
              <FileViewGauge.Content className="text-cn-foreground-3">
                {viewedFiles}/{pullReqStats?.files_changed} file{pullReqStats?.files_changed === 1 ? '' : 's'} viewed
              </FileViewGauge.Content>
              <FileViewGauge.Bar total={pullReqStats?.files_changed || 0} filled={viewedFiles} />
            </div>
          </FileViewGauge.Root>
        )}

        <Layout.Horizontal align="center" className="gap-x-2.5">
          {commitSuggestionsBatchCount > 0 ? (
            <Button variant="outline" onClick={() => onCommitSuggestionsBatch()}>
              Commit suggestion
              <CounterBadge theme="info">{commitSuggestionsBatchCount}</CounterBadge>
            </Button>
          ) : (
            <></>
          )}
          {!shouldHideReviewButton && currentUser && (
            <SplitButton
              theme={getApprovalStateTheme(approveState)}
              disabled={isActiveUserPROwner}
              loading={isApproving}
              variant="outline"
              handleOptionChange={selectedMethod => {
                submitReview?.(selectedMethod as PullReqReviewDecision)
              }}
              options={
                itemsToRender?.map(item => ({
                  value: item?.method,
                  label: item?.title
                })) || []
              }
              handleButtonClick={() => {
                if (
                  approveState === PullReqReviewDecision.approve ||
                  processReviewDecision(
                    approveState as EnumPullReqReviewDecision,
                    commitSha,
                    pullRequestMetadata?.source_sha
                  ) === PullReqReviewDecision.outdated
                ) {
                  submitReview?.('approved' as PullReqReviewDecision)
                }
              }}
            >
              {approveState === PullReqReviewDecision.approve ? approvalItems[0].title : getApprovalState(approveState)}
            </SplitButton>
          )}
        </Layout.Horizontal>
      </Layout.Horizontal>
    </Layout.Horizontal>
  )
}
PullRequestChangesFilter.displayName = 'PullRequestChangesFilter'
