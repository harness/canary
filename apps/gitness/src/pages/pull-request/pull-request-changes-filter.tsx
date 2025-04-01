import { FC, useEffect, useMemo, useState } from 'react'

// import { FileViewGauge } from '@harnessio/views'
import { DiffModeEnum } from '@git-diff-view/react'

import { EnumPullReqReviewDecision } from '@harnessio/code-service-client'
import { Button, DropdownMenu, Icon, ListActions, RadioButton, RadioGroup, Text } from '@harnessio/ui/components'
import { DiffModeOptions } from '@harnessio/views'

import { approvalItems, determineOverallDecision, getApprovalItems, getApprovalStateTheme } from './diff-utils'
import { ApprovalItem, ButtonEnum, FilterViewProps, PullReqReviewDecision } from './types/types'
import { processReviewDecision } from './utils'

// const filesViewed = {
//   total: 3,
//   viewed: 1
// }

// TODO: workon on filter and files viewed
export const PullRequestChangesFilter: FC<FilterViewProps> = ({
  currentUser,
  pullRequestMetadata,
  reviewers,
  submitReview,
  refetchReviewers,
  diffMode,
  setDiffMode
}) => {
  // const filterOptions = [{ name: 'Filter option 1' }, { name: 'Filter option 2' }, { name: 'Filter option 3' }]
  // const sortOptions = [{ name: 'Sort option 1' }, { name: 'Sort option 2' }, { name: 'Sort option 3' }]
  // const viewOptions = [{ name: 'View option 1' }, { name: 'View option 2' }]

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
      return 'Approve'
    } else if (state === PullReqReviewDecision.approved) {
      return 'Approved'
    } else if (state === PullReqReviewDecision.changeReq) {
      return 'Changes Requested'
    } else {
      return 'approve'
    }
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
          <RadioButton value="false" className="mt-1 size-3 text-tertiary-background" />
          <div className="flex flex-col">
            <Text truncate size={1} color="primary">
              {itm.title}
            </Text>
          </div>
        </RadioGroup>
      </DropdownMenu.Item>
    ))
  }

  const itemsToRender = getApprovalItems(approveState, approvalItems)
  const dropdownMenuItems = renderDropdownMenuItems(itemsToRender)
  const handleDiffModeChange = (value: string) => {
    setDiffMode(value === 'Split' ? DiffModeEnum.Split : DiffModeEnum.Unified)
  }
  return (
    <ListActions.Root>
      <ListActions.Left>
        <></>
        {/* <ListActions.Dropdown title="All commits" items={filterOptions} />
        <ListActions.Dropdown title="File filter" items={sortOptions} />
        <ListActions.Dropdown title="View" items={viewOptions} /> */}
        <ListActions.Dropdown
          selectedValue={diffMode === DiffModeEnum.Split ? 'Split' : 'Unified'}
          onChange={handleDiffModeChange}
          title={diffMode === DiffModeEnum.Split ? 'Split' : 'Unified'}
          items={DiffModeOptions}
        />
      </ListActions.Left>
      <ListActions.Right>
        {/* <FileViewGauge.Root>
          <FileViewGauge.Content>
            {filesViewed.viewed}/{filesViewed.total} file{filesViewed.total === 1 ? '' : 's'} viewed
          </FileViewGauge.Content>
          <FileViewGauge.Bar total={filesViewed.total} filled={filesViewed.viewed} />
        </FileViewGauge.Root> */}
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
            variant="split"
            size="xs_split"
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
      </ListActions.Right>
    </ListActions.Root>
  )
}
