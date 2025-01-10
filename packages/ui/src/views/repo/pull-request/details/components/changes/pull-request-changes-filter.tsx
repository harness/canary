import { useEffect, useMemo, useState } from 'react'

import { TypesUser } from '@/types'
import {
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  ListActions,
  RadioGroup,
  Text
} from '@components/index'
import { DiffModeEnum } from '@git-diff-view/react'
import { cn } from '@utils/cn'
import { DiffModeOptions, TranslationStore, TypesCommit } from '@views/index'

import { EnumPullReqReviewDecision, PullReqReviewDecision, TypesPullReq } from '../../../pull-request.types'
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
  value: string
}

export interface FilterViewProps {
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
  totalFiles: number
  commitSuggestionsBatchCount: number
  onCommitSuggestionsBatch: () => void
}

export const PullRequestChangesFilter: React.FC<FilterViewProps> = ({
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
  totalFiles,
  commitSuggestionsBatchCount,
  onCommitSuggestionsBatch
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
          value: commitInfo.sha || ''
        })
      })
      setCommitFilterOptions(commitsList)
    }
  }, [pullReqCommits])

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
      return (
        <DropdownMenuItem
          key={idx}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => handleCommitCheck(e, item)}
          className="flex cursor-pointer items-center"
        >
          <Checkbox checked={isSelected} />
          <Text size={1} className="pl-3 text-primary">
            {item.name}
          </Text>
        </DropdownMenuItem>
      )
    })
  }

  function renderDropdownMenuItems(items: ApprovalItem[]): JSX.Element[] {
    return items.map(itm => (
      <DropdownMenuItem
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
      </DropdownMenuItem>
    ))
  }

  const commitDropdownItems = renderCommitDropdownItems(commitFilterOptions)
  const itemsToRender = getApprovalItems(approveState, approvalItems)
  const dropdownMenuItems = renderDropdownMenuItems(itemsToRender)
  const handleDiffModeChange = (value: string) => {
    setDiffMode(value === 'Split' ? DiffModeEnum.Split : DiffModeEnum.Unified)
  }
  return (
    <ListActions.Root>
      <ListActions.Left>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex cursor-pointer items-center gap-1.5 text-tertiary-background duration-100 ease-in-out hover:text-primary">
            <span className="size-[4px] rounded-full bg-primary"></span>
            <Text
              size={2}
              className={cn('text-primary/80', {
                ['font-bold']: selectedCommits?.length
              })}
            >
              {selectedCommits[0].value === 'ALL' ? defaultCommitFilter.name : `${selectedCommits?.length} Commits`}
            </Text>
            <Icon name="chevron-down" size={12} className="chevron-down" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>{commitDropdownItems}</DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <ListActions.Dropdown
          selectedValue={
            diffMode === DiffModeEnum.Split ? t('views:pullRequests.split') : t('views:pullRequests.unified')
          }
          onChange={handleDiffModeChange}
          title={diffMode === DiffModeEnum.Split ? t('views:pullRequests.split') : t('views:pullRequests.unified')}
          items={DiffModeOptions}
        />
        <Text size={2}>
          {`Showing ${pullRequestMetadata?.stats?.files_changed || 0} changed files with ${
            pullRequestMetadata?.stats?.additions || 0
          } additions and ${pullRequestMetadata?.stats?.deletions || 0} deletions `}
        </Text>
      </ListActions.Left>
      <ListActions.Right>
        <FileViewGauge.Root>
          <FileViewGauge.Content>
            {viewedFiles}/{totalFiles} file{totalFiles === 1 ? '' : 's'} viewed
          </FileViewGauge.Content>
          <FileViewGauge.Bar total={totalFiles} filled={viewedFiles} />
        </FileViewGauge.Root>
        {commitSuggestionsBatchCount > 0 ? (
          <Button variant={'outline'} onClick={() => onCommitSuggestionsBatch()}>
            {`Commit suggestion (${commitSuggestionsBatchCount})`}
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
            size="xs_split"
            theme={getApprovalStateTheme(approveState) as ButtonEnum}
            dropdown={
              <DropdownMenu>
                <DropdownMenuTrigger insideSplitButton>
                  <Icon name="chevron-down" size={11} className="chevron-down" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="mt-1">
                  <DropdownMenuGroup>{dropdownMenuItems}</DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            }
          >
            {approveState === PullReqReviewDecision.approve ? approvalItems[0].title : getApprovalState(approveState)}
          </Button>
        )}
      </ListActions.Right>
    </ListActions.Root>
  )
}
