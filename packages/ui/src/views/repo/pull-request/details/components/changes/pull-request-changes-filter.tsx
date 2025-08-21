import { useEffect, useMemo, useState } from 'react'

import { Button, CounterBadge, DropdownMenu, IconV2, Layout, SplitButton } from '@/components'
import { useTranslation } from '@/context'
import { TypesUser } from '@/types'
import { ChangedFilesShortInfo, DiffModeOptions, TypesCommit } from '@/views'
import { DiffModeEnum } from '@git-diff-view/react'
import { cn } from '@utils/index'

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
  getApprovalStateVariant,
  processReviewDecision
} from '../../pull-request-utils'
import { ChainedCommitsDropdown } from './chained-commits-dropdown'
import * as FileViewGauge from './file-viewed-gauge'

export interface CommitFilterItemProps {
  name: string
  count: number
  value: string
  datetime?: string
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
  pullReqStats?: TypesPullReqStats
  showExplorer: boolean
  setShowExplorer: (value: boolean) => void
  diffData?: {
    filePath: string
    addedLines: number
    deletedLines: number
  }[]
  setJumpToDiff: (fileName: string) => void
}

export const PullRequestChangesFilter: React.FC<PullRequestChangesFilterProps> = ({
  currentUser,
  pullRequestMetadata,
  reviewers,
  submitReview,
  refetchReviewers,
  isApproving,
  diffMode,
  setDiffMode,
  pullReqCommits,
  defaultCommitFilter,
  selectedCommits,
  setSelectedCommits,
  viewedFiles,
  commitSuggestionsBatchCount,
  onCommitSuggestionsBatch,
  pullReqStats,
  showExplorer,
  setShowExplorer,
  diffData,
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
          value: commitInfo.sha || '',
          datetime: commitInfo.committer?.when || ''
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

  const itemsToRender = getApprovalItems(approveState, approvalItems)
  const handleDiffModeChange = (value: string) => {
    setDiffMode(value === 'Split' ? DiffModeEnum.Split : DiffModeEnum.Unified)
  }

  return (
    <Layout.Horizontal
      align="center"
      justify="between"
      className="layer-high sticky top-[55px] gap-x-5 bg-cn-background-1 py-2"
    >
      <Layout.Horizontal className="grow gap-x-5">
        <Button
          size="md"
          title={showExplorer ? 'Collapse Sidebar' : 'Expand Sidebar'}
          variant="transparent"
          onClick={() => setShowExplorer(!showExplorer)}
        >
          <IconV2 name={showExplorer ? 'collapse-sidebar' : 'expand-sidebar'} size="md" />
        </Button>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="group flex items-center gap-x-1.5">
            <Button size="sm" variant="transparent">
              {selectedCommits[0].value === 'ALL' ? (
                <>
                  <span>{defaultCommitFilter.name}</span>
                  <CounterBadge>{defaultCommitFilter.count}</CounterBadge>
                </>
              ) : (
                <>
                  <span>Commits</span>
                  <CounterBadge>{selectedCommits?.length}</CounterBadge>
                </>
              )}
              <IconV2 name="nav-solid-arrow-down" size="2xs" />
            </Button>
          </DropdownMenu.Trigger>
          <ChainedCommitsDropdown
            commitFilterOptions={commitFilterOptions}
            defaultCommitFilter={defaultCommitFilter}
            selectedCommits={selectedCommits}
            setSelectedCommits={setSelectedCommits}
          />
        </DropdownMenu.Root>

        <DropdownMenu.Root>
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
        </DropdownMenu.Root>

        <div className="mt-2.5">
          <ChangedFilesShortInfo diffData={diffData} diffStats={pullReqStats} goToDiff={setJumpToDiff} />
        </div>
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
              variant={getApprovalStateVariant(approveState)}
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
