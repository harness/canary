import { useEffect, useMemo, useState } from 'react'

import {
  Accordion,
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  Icon,
  Layout,
  SplitButton,
  StackedList,
  type ButtonThemes
} from '@/components'
import { useRouterContext } from '@/context'
import {
  EnumCheckStatus,
  extractInfoFromRuleViolationArr,
  MergeCheckStatus,
  PRPanelData,
  PullRequestAction,
  PullRequestChangesSectionProps,
  PullRequestFilterOption,
  PullRequestState,
  TypesPullReqCheck
} from '@/views'
import { cn } from '@utils/cn'
import { timeAgo } from '@utils/utils'
import { TypesPullReq } from '@views/repo/pull-request/pull-request.types'

import { PullRequestRoutingProps } from '../../pull-request-details-types'
import PullRequestChangesSection from './sections/pull-request-changes-section'
import PullRequestCheckSection from './sections/pull-request-checks-section'
import PullRequestCommentSection from './sections/pull-request-comment-section'
import PullRequestMergeSection from './sections/pull-request-merge-section'

export interface PullRequestPanelProps
  extends Omit<
      PullRequestChangesSectionProps,
      'reqNoChangeReq' | 'reqCodeOwnerApproval' | 'minApproval' | 'reqCodeOwnerLatestApproval' | 'minReqLatestApproval'
    >,
    Partial<PullRequestRoutingProps> {
  handleRebaseBranch: () => void
  handlePrState: (state: string) => void
  pullReqMetadata?: TypesPullReq
  checks?: TypesPullReqCheck[] | null
  checksInfo: { header: string; content: string; status: EnumCheckStatus }
  actions: PullRequestAction[]
  checkboxBypass?: boolean
  setCheckboxBypass?: (value: boolean) => void
  onRestoreBranch: () => void
  onDeleteBranch: () => void
  showDeleteBranchButton: boolean
  showRestoreBranchButton: boolean
  headerMsg?: string
  commitSuggestionsBatchCount: number
  onCommitSuggestions: () => void
  prPanelData: PRPanelData
  spaceId?: string
  repoId?: string
}

interface HeaderProps {
  isDraft?: boolean
  isClosed: boolean
  unchecked: boolean
  mergeable: boolean
  isOpen: boolean
  ruleViolation?: boolean
  pullReqMetadata: TypesPullReq | undefined
  onRestoreBranch: () => void
  onDeleteBranch: () => void
  showDeleteBranchButton: boolean
  showRestoreBranchButton: boolean
  headerMsg?: string
}

const HeaderTitle = ({ ...props }: HeaderProps) => {
  if (props?.pullReqMetadata?.state === PullRequestFilterOption.MERGED) {
    // Format the parsed date as relative time from now
    const formattedTime = timeAgo(props?.pullReqMetadata?.merged || 0)

    return (
      <>
        <div className="inline-flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span>{`${props?.pullReqMetadata?.merger?.display_name} merged branch`}</span>
            <Badge variant="soft" theme="muted" size="sm">
              <Icon name="branch" size={12} className="mr-1 text-cn-foreground-3" />
              {props?.pullReqMetadata?.source_branch}
            </Badge>
            <span>into</span>
            <Badge variant="soft" theme="muted" size="sm">
              <Icon name="branch" size={12} className="mr-1 text-cn-foreground-3" />
              {props?.pullReqMetadata?.target_branch}
            </Badge>
            <span>{formattedTime}</span>
          </div>
          {props.showDeleteBranchButton ? (
            <Button variant="soft" theme="muted" size="sm" onClick={props.onDeleteBranch}>
              Delete Branch
            </Button>
          ) : props.showRestoreBranchButton ? (
            <Button variant="soft" theme="muted" size="sm" onClick={props.onRestoreBranch}>
              Restore Branch
            </Button>
          ) : null}
        </div>
        {props.headerMsg && (
          <div className="flex w-full justify-end">
            <span className="text-1 text-cn-foreground-danger">{props.headerMsg}</span>
          </div>
        )}
      </>
    )
  }
  return (
    <div className="inline-flex items-center gap-2">
      <h2 className="font-medium text-cn-foreground-1">
        {props.isDraft
          ? 'This pull request is still a work in progress'
          : props.isClosed
            ? 'This pull request is closed'
            : props.unchecked
              ? 'Checking for ability to merge automatically...'
              : props.mergeable === false && props.isOpen
                ? 'Cannot merge pull request'
                : props.ruleViolation
                  ? 'Cannot merge pull request'
                  : `Pull request can be merged`}
      </h2>
    </div>
  )
}

const getButtonState = ({
  mergeable,
  ruleViolation,
  isDraft,
  checksInfo,
  checkboxBypass,
  canBypass
}: {
  mergeable: boolean
  ruleViolation?: boolean
  isDraft?: boolean
  checksInfo: { status: EnumCheckStatus }
  checkboxBypass?: boolean
  canBypass?: boolean
}) => {
  if (isDraft) {
    return {
      disabled: false,
      theme: 'primary'
    }
  }

  if (['pending', 'running', 'failure'].includes(checksInfo.status)) {
    return {
      disabled: true,
      theme: checksInfo.status === 'failure' ? null : 'danger'
    }
  }

  if (ruleViolation) {
    if (canBypass) {
      return {
        disabled: !checkboxBypass,
        theme: checkboxBypass ? 'danger' : null
      }
    }
  }

  if (mergeable && !ruleViolation) {
    return {
      disabled: false,
      theme: 'success'
    }
  }

  return {
    disabled: true,
    theme: null
  }
}

const PullRequestPanel = ({
  pullReqMetadata,
  checks,
  changesInfo,
  checksInfo,
  approvedEvaluations,
  changeReqEvaluations,
  codeOwners,
  latestApprovalArr,
  changeReqReviewer,
  codeOwnerChangeReqEntries,
  codeOwnerPendingEntries,
  codeOwnerApprovalEntries,
  latestCodeOwnerApprovalArr,
  actions,
  checkboxBypass,
  setCheckboxBypass,
  onRestoreBranch,
  onDeleteBranch,
  showRestoreBranchButton,
  showDeleteBranchButton,
  headerMsg,
  commitSuggestionsBatchCount,
  onCommitSuggestions,
  handlePrState,
  handleRebaseBranch,
  prPanelData,
  spaceId,
  repoId,
  ...routingProps
}: PullRequestPanelProps) => {
  const { Link } = useRouterContext()
  const mergeable = useMemo(() => pullReqMetadata?.merge_check_status === MergeCheckStatus.MERGEABLE, [pullReqMetadata])
  const isClosed = pullReqMetadata?.state === PullRequestState.CLOSED
  const isOpen = pullReqMetadata?.state === PullRequestState.OPEN
  //   const isConflict = pullReqMetadata?.merge_check_status === MergeCheckStatus.CONFLICT
  const isDraft = useMemo(() => pullReqMetadata?.is_draft, [pullReqMetadata?.is_draft])
  const unchecked = useMemo(
    () => pullReqMetadata?.merge_check_status === MergeCheckStatus.UNCHECKED && !isClosed,
    [pullReqMetadata, isClosed]
  )
  const checkData = checks || []
  const [notBypassable, setNotBypassable] = useState(false)
  const [mergeButtonValue, setMergeButtonValue] = useState(actions[0].id)

  useEffect(() => {
    const ruleViolationArr = prPanelData?.ruleViolationArr

    if (!!ruleViolationArr && !isDraft && ruleViolationArr.data.rule_violations) {
      const { checkIfBypassAllowed } = extractInfoFromRuleViolationArr(ruleViolationArr.data.rule_violations)
      setNotBypassable(checkIfBypassAllowed)
    }
  }, [prPanelData?.ruleViolationArr, isDraft])

  const rebasePossible = useMemo(
    () => pullReqMetadata?.merge_target_sha !== pullReqMetadata?.merge_base_sha && !pullReqMetadata?.merged,
    [pullReqMetadata]
  )

  const isShowMoreTooltip = useMemo(
    () => pullReqMetadata?.state === PullRequestState.OPEN && !pullReqMetadata?.is_draft,
    [pullReqMetadata]
  )

  const moreTooltip = () => {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button iconOnly variant="ghost" size="sm">
            <Icon name="vertical-ellipsis" size={12} />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-[200px]" align="end">
          <DropdownMenu.Group>
            <DropdownMenu.Item
              onClick={e => {
                handlePrState('draft')
                e.stopPropagation()
              }}
            >
              Mark as draft
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={e => {
                handlePrState('closed')
                e.stopPropagation()
              }}
            >
              Close pull request
            </DropdownMenu.Item>
            {rebasePossible && (
              <DropdownMenu.Item
                onClick={e => {
                  handleRebaseBranch()
                  e.stopPropagation()
                }}
              >
                Rebase
              </DropdownMenu.Item>
            )}
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    )
  }

  const buttonState = getButtonState({
    mergeable,
    ruleViolation: prPanelData.ruleViolation,
    isDraft,
    checksInfo,
    checkboxBypass,
    canBypass: !notBypassable
  })
  return (
    <StackedList.Root>
      <StackedList.Item
        className={cn('items-center py-2.5', {
          'pr-2': isShowMoreTooltip
        })}
        disableHover
      >
        <StackedList.Field
          className={cn({ 'w-full': !pullReqMetadata?.merged })}
          title={
            <HeaderTitle
              isDraft={isDraft}
              isClosed={isClosed}
              unchecked={unchecked}
              mergeable={mergeable}
              isOpen={isOpen}
              ruleViolation={prPanelData.ruleViolation}
              pullReqMetadata={pullReqMetadata}
              onRestoreBranch={onRestoreBranch}
              onDeleteBranch={onDeleteBranch}
              showRestoreBranchButton={showRestoreBranchButton}
              showDeleteBranchButton={showDeleteBranchButton}
              headerMsg={headerMsg}
            />
          }
        />

        {!pullReqMetadata?.merged && (
          <StackedList.Field
            right
            title={
              !pullReqMetadata?.merged && (
                <Layout.Horizontal className="items-center justify-center space-x-2.5">
                  {commitSuggestionsBatchCount > 0 ? (
                    <Button variant="surface" theme="muted" onClick={() => onCommitSuggestions()}>
                      Commit suggestion
                      {/* TODO: Design system: Add Badge counter icon theme once it is ready */}
                      <Badge variant="counter" size="sm">
                        {commitSuggestionsBatchCount}
                      </Badge>
                    </Button>
                  ) : (
                    <></>
                  )}
                  {!notBypassable && mergeable && !isDraft && prPanelData.ruleViolation && (
                    <Layout.Horizontal className="items-center justify-center">
                      <Checkbox
                        checked={checkboxBypass}
                        onCheckedChange={() => {
                          if (typeof checkboxBypass === 'boolean') {
                            setCheckboxBypass?.(!checkboxBypass)
                          }
                        }}
                      />
                      <span className="text-1 text-cn-foreground-1">Bypass and merge anyway</span>
                    </Layout.Horizontal>
                  )}

                  {actions && !pullReqMetadata?.closed ? (
                    <SplitButton
                      id="pr-type"
                      theme={buttonState.theme as Extract<ButtonThemes, 'success' | 'danger' | 'muted'>}
                      disabled={buttonState.disabled}
                      variant="surface"
                      selectedValue={mergeButtonValue}
                      handleOptionChange={value => setMergeButtonValue(value)}
                      options={actions.map(action => ({
                        value: action.id,
                        label: action.title,
                        description: action.description
                      }))}
                      handleButtonClick={() => {
                        actions[parseInt(mergeButtonValue)]?.action?.()
                      }}
                    >
                      {actions[parseInt(mergeButtonValue)].title}
                    </SplitButton>
                  ) : (
                    <Button
                      disabled={!checkboxBypass && prPanelData.ruleViolation && !isClosed}
                      onClick={actions[0].action}
                    >
                      Open for review
                    </Button>
                  )}

                  {isShowMoreTooltip && moreTooltip()}
                </Layout.Horizontal>
              )
            }
          />
        )}
      </StackedList.Item>
      <StackedList.Item disableHover className="cursor-default py-0 hover:bg-transparent">
        {!isClosed ? (
          <Accordion.Root type="multiple" className="w-full">
            {!pullReqMetadata?.merged && (
              <PullRequestChangesSection
                changesInfo={changesInfo}
                minApproval={prPanelData.minApproval}
                minReqLatestApproval={prPanelData.minReqLatestApproval}
                approvedEvaluations={approvedEvaluations}
                changeReqEvaluations={changeReqEvaluations}
                codeOwners={codeOwners}
                latestApprovalArr={latestApprovalArr}
                reqNoChangeReq={prPanelData.atLeastOneReviewerRule}
                changeReqReviewer={changeReqReviewer}
                codeOwnerChangeReqEntries={codeOwnerChangeReqEntries}
                reqCodeOwnerApproval={prPanelData.reqCodeOwnerApproval}
                reqCodeOwnerLatestApproval={prPanelData.reqCodeOwnerLatestApproval}
                codeOwnerPendingEntries={codeOwnerPendingEntries}
                codeOwnerApprovalEntries={codeOwnerApprovalEntries}
                latestCodeOwnerApprovalArr={latestCodeOwnerApprovalArr}
              />
            )}
            {(!!prPanelData?.resolvedCommentArr || prPanelData.requiresCommentApproval) && !pullReqMetadata?.merged && (
              <PullRequestCommentSection commentsInfo={prPanelData.commentsInfoData} />
            )}
            <PullRequestCheckSection checkData={checkData} checksInfo={checksInfo} {...routingProps} />

            {!pullReqMetadata?.merged && (
              <PullRequestMergeSection
                unchecked={unchecked}
                mergeable={mergeable}
                pullReqMetadata={pullReqMetadata}
                conflictingFiles={prPanelData.conflictingFiles}
              />
            )}
          </Accordion.Root>
        ) : (
          <Layout.Horizontal gap="space-x-2" className="flex w-full items-center justify-between py-4">
            <Layout.Horizontal className="flex w-full">
              {/* TODO: Design system: fix this */}
              <Badge variant="soft" size="sm">
                <Link
                  className="flex items-center gap-x-1.5"
                  to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/code/${pullReqMetadata?.source_branch}`}
                >
                  <Icon name="branch" size={12} className="text-icons-9" />
                  {pullReqMetadata?.source_branch}
                </Link>
              </Badge>{' '}
              <span className="text-2 text-cn-foreground-1"> branch has unmerged changes.</span>
            </Layout.Horizontal>
            {showDeleteBranchButton ? (
              <Button size="sm" onClick={onDeleteBranch}>
                Delete Branch
              </Button>
            ) : showRestoreBranchButton ? (
              <Button size="sm" onClick={onRestoreBranch}>
                Restore Branch
              </Button>
            ) : null}
          </Layout.Horizontal>
        )}
      </StackedList.Item>
    </StackedList.Root>
  )
}

export { PullRequestPanel }
