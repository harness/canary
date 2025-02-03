import { useEffect, useMemo, useState } from 'react'

import { Badge, Button, Checkbox, DropdownMenu, Icon, RadioGroup, Text } from '@/components'
import { TypesUser } from '@/types'
import { DiffModeOptions, TranslationStore, TypesCommit } from '@/views'
import { DiffModeEnum } from '@git-diff-view/react'
import { cn } from '@utils/cn'

import {
  EnumPullReqReviewDecision,
  PullReqReviewDecision,
  TypesPullReq,
  TypesPullReqStats
} from '../../../pull-request.types'
import { ApprovalItem, ButtonEnum, ReviewerListPullReqOkResponse } from '../../pull-request-details-types'
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
  loading?: boolean
  diffMode: DiffModeEnum
  setDiffMode: (value: DiffModeEnum) => void
  useTranslationStore: () => TranslationStore
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
  diffMode,
  setDiffMode,
  useTranslationStore,
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
  const { t } = useTranslationStore()
  const [commitFilterOptions, setCommitFilterOptions] = useState([defaultCommitFilter])
  const shouldHideReviewButton = useMemo(
    () => pullRequestMetadata?.state === 'merged' || pullRequestMetadata?.state === 'closed',
    [pullRequestMetadata?.state]
  )
  const [commitSha, setCommitSha] = useState('')
  const [loading, setLoading] = useState(true)

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

  /** Click handler to manage multi-selection with Shift + Click */
  const handleCommitCheck = (
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
    item: CommitFilterItemProps
  ): void => {
    // If user clicked on 'All Commits', reset selection to just the default commit filter
    if (item.value === defaultCommitFilter.value) {
      setSelectedCommits([defaultCommitFilter])
      return
    }

    // Otherwise, remove 'ALL' from the selection
    setSelectedCommits((prev: CommitFilterItemProps[]) =>
      prev.filter((sel: CommitFilterItemProps) => sel.value !== defaultCommitFilter.value)
    )

    // If SHIFT is pressed, toggle the clicked commit
    if (event.shiftKey) {
      setSelectedCommits((prev: CommitFilterItemProps[]) => {
        const isInSelection = prev.some((sel: CommitFilterItemProps) => sel.value === item.value)
        if (isInSelection) {
          return prev.filter((sel: CommitFilterItemProps) => sel.value !== item.value)
        } else {
          return [...prev, item]
        }
      })
    } else {
      setSelectedCommits([item])
    }
  }

  function renderCommitDropdownItems(items: CommitFilterItemProps[]): JSX.Element[] {
    return items.map((item, idx) => {
      const isSelected = selectedCommits.some(sel => sel.value === item.value)

      // TODO: we have to give the possibility to choose several values
      return (
        <DropdownMenu.Item
          key={idx}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => handleCommitCheck(e, item)}
          className="flex cursor-pointer items-center"
        >
          <Checkbox checked={isSelected} />
          <Text size={1} className="pl-3 text-primary">
            {item.name}
          </Text>
        </DropdownMenu.Item>
      )
    })
  }

  function renderDropdownMenuItems(items: ApprovalItem[]): JSX.Element[] {
    return items.map(itm => (
      <DropdownMenu.Item
        key={itm.id}
        disabled={isActiveUserPROwner}
        onClick={() => {
          submitReview?.(itm.method as PullReqReviewDecision)
        }}
      >
        <RadioGroup className="flex items-start gap-2">
          <div className="flex flex-col">
            <Text truncate size={1} color="primary">
              {itm.title}
            </Text>
          </div>
        </RadioGroup>
      </DropdownMenu.Item>
    ))
  }

  const commitDropdownItems = renderCommitDropdownItems(commitFilterOptions)
  const itemsToRender = getApprovalItems(approveState, approvalItems)
  const dropdownMenuItems = renderDropdownMenuItems(itemsToRender)
  const handleDiffModeChange = (value: string) => {
    setDiffMode(value === 'Split' ? DiffModeEnum.Split : DiffModeEnum.Unified)
  }

  return (
    <div className="flex items-center justify-between gap-x-5">
      <div className="flex grow items-center gap-x-5">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="group flex items-center gap-x-1.5">
            <div className="flex items-center gap-x-0.5 text-14 text-foreground-2 group-hover:text-foreground-1">
              {selectedCommits[0].value === 'ALL' ? (
                <>
                  <span>{defaultCommitFilter.name}</span>
                  <span className="text-foreground-7">({defaultCommitFilter.count})</span>
                </>
              ) : (
                <>
                  <span>Commits</span>
                  <span className="text-foreground-7">({selectedCommits?.length})</span>
                </>
              )}
            </div>
            <Icon name="chevron-fill-down" size={6} className="chevron-down text-icons-7" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="w-96" align="start">
            <div className="max-h-[360px] overflow-y-auto px-1">{commitDropdownItems}</div>
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="group flex items-center gap-x-1.5 text-14">
            <span className="text-foreground-2 group-hover:text-foreground-1">
              {diffMode === DiffModeEnum.Split ? t('views:pullRequests.split') : t('views:pullRequests.unified')}
            </span>
            <Icon name="chevron-fill-down" size={6} className="chevron-down text-icons-7" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="start">
            <DropdownMenu.Group>
              {DiffModeOptions.map(item => (
                <DropdownMenu.Item
                  className={cn({
                    'bg-background-4': diffMode === (item.value === 'Split' ? DiffModeEnum.Split : DiffModeEnum.Unified)
                  })}
                  key={item.value}
                  onClick={() => handleDiffModeChange(item.value)}
                >
                  {item.name}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        <DropdownMenu.Root>
          <p className="text-14 leading-tight text-foreground-4">
            Showing{' '}
            <DropdownMenu.Trigger className="group">
              <span className="text-foreground-accent underline decoration-transparent underline-offset-4 transition-colors duration-200 group-hover:decoration-foreground-accent">
                {pullReqStats?.files_changed} changed files
              </span>
            </DropdownMenu.Trigger>{' '}
            with {pullReqStats?.additions || 0} additions and {pullReqStats?.deletions || 0} deletions
          </p>
          <DropdownMenu.Content align="start">
            <div className="max-h-[360px] overflow-y-auto px-1">
              {diffData?.map(diff => (
                <DropdownMenu.Item
                  key={diff.filePath}
                  onClick={() => {
                    setJumpToDiff(diff.filePath)
                  }}
                  className="flex w-80 cursor-pointer items-center justify-between px-3 py-2"
                >
                  <span className="flex-1 overflow-hidden truncate text-12 text-primary">{diff.filePath}</span>
                  <div className="ml-4 flex items-center space-x-2">
                    {diff.addedLines != null && diff.addedLines > 0 && (
                      <Badge variant="outline" size="sm" theme="success">
                        +{diff.addedLines}
                      </Badge>
                    )}
                    {diff.deletedLines != null && diff.deletedLines > 0 && (
                      <Badge variant="outline" size="sm" theme="destructive">
                        -{diff.deletedLines}
                      </Badge>
                    )}
                  </div>
                </DropdownMenu.Item>
              ))}
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      <div className="flex items-center gap-x-7">
        {selectedCommits[0].value === 'ALL' && (
          <FileViewGauge.Root>
            <FileViewGauge.Content className="text-foreground-3">
              {viewedFiles}/{pullReqStats?.files_changed} file{pullReqStats?.files_changed === 1 ? '' : 's'} viewed
            </FileViewGauge.Content>
            <FileViewGauge.Bar total={pullReqStats?.files_changed || 0} filled={viewedFiles} />
          </FileViewGauge.Root>
        )}

        <div className="flex items-center gap-x-2.5">
          {commitSuggestionsBatchCount > 0 ? (
            <Button className="gap-x-2" variant="outline" onClick={() => onCommitSuggestionsBatch()}>
              Commit suggestion
              <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded border border-tag-border-blue-1 bg-tag-background-blue-1 px-1 text-11 text-tag-foreground-blue-1">
                {commitSuggestionsBatchCount}
              </span>
            </Button>
          ) : (
            <></>
          )}
          {!shouldHideReviewButton && currentUser && (
            <Button
              hidden={loading}
              onClick={() => {
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
              disabled={isActiveUserPROwner}
              title={isActiveUserPROwner ? 'Self-approval of pull requests is not permitted.' : undefined}
              variant="split"
              size="md_split"
              theme={getApprovalStateTheme(approveState) as ButtonEnum}
              dropdown={
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger insideSplitButton>
                    <Icon name="chevron-down" size={11} className="chevron-down" />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content align="end" className="mt-1">
                    <DropdownMenu.Group>{dropdownMenuItems}</DropdownMenu.Group>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              }
            >
              {approveState === PullReqReviewDecision.approve ? approvalItems[0].title : getApprovalState(approveState)}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
