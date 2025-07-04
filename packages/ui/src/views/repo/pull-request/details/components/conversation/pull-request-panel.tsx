import { useCallback, useEffect, useState } from 'react'

import {
  Accordion,
  Alert,
  Button,
  Checkbox,
  CounterBadge,
  IconV2,
  Layout,
  MoreActionsTooltip,
  SplitButton,
  StackedList,
  StatusBadge,
  Text,
  type ButtonThemes
} from '@/components'
import { useRouterContext } from '@/context'
import { timeAgo } from '@/utils'
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
import { TypesPullReq } from '@views/repo/pull-request/pull-request.types'

import { PullRequestRoutingProps } from '../../pull-request-details-types'
import PullRequestChangesSection from './sections/pull-request-changes-section'
import PullRequestCheckSection from './sections/pull-request-checks-section'
import PullRequestCommentSection from './sections/pull-request-comment-section'
import PullRequestMergeSection from './sections/pull-request-merge-section'

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
          <div className="flex items-center gap-1 font-medium">
            <span>{`${props?.pullReqMetadata?.merger?.display_name} merged branch`}</span>
            <StatusBadge icon="git-branch" variant="secondary" theme="muted" size="sm">
              {props?.pullReqMetadata?.source_branch}
            </StatusBadge>
            <span>into</span>
            <StatusBadge icon="git-branch" variant="secondary" theme="muted" size="sm">
              {props?.pullReqMetadata?.target_branch}
            </StatusBadge>
            <span>{formattedTime}</span>
          </div>
          {props.showDeleteBranchButton ? (
            <Button variant="secondary" theme="danger" onClick={props.onDeleteBranch}>
              Delete Branch
            </Button>
          ) : props.showRestoreBranchButton ? (
            <Button variant="secondary" onClick={props.onRestoreBranch}>
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
      <Text variant="body-strong" as="h2" color="foreground-1">
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
      </Text>
    </div>
  )
}

const getButtonState = ({
  isMergeable,
  ruleViolation,
  isDraft,
  checksInfo,
  checkboxBypass,
  canBypass
}: {
  isMergeable?: boolean
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

  if (isMergeable && !ruleViolation) {
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

const getDataFromPullReqMetadata = (pullReqMetadata?: TypesPullReq) => {
  const isClosed = pullReqMetadata?.state === PullRequestState.CLOSED
  const isOpen = pullReqMetadata?.state === PullRequestState.OPEN
  const isDraft = !!pullReqMetadata?.is_draft

  return {
    isMergeable: pullReqMetadata?.merge_check_status === MergeCheckStatus.MERGEABLE,
    isClosed,
    isOpen,
    isDraft,
    isUnchecked: pullReqMetadata?.merge_check_status === MergeCheckStatus.UNCHECKED && !isClosed,
    isRebasable: pullReqMetadata?.merge_target_sha !== pullReqMetadata?.merge_base_sha && !pullReqMetadata?.merged,
    isShowMoreTooltip: isOpen && !isDraft
  }
}

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
  error?: string | null
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
  error,
  ...routingProps
}: PullRequestPanelProps) => {
  const { Link } = useRouterContext()
  const [notBypassable, setNotBypassable] = useState(false)
  const [mergeButtonValue, setMergeButtonValue] = useState(actions[0].id)
  const [accordionValues, setAccordionValues] = useState<string[]>([])

  const handleAccordionValuesChange = useCallback((data: string | string[]) => {
    if (typeof data === 'string') return

    setAccordionValues(data)
  }, [])

  const { isMergeable, isClosed, isOpen, isDraft, isUnchecked, isRebasable, isShowMoreTooltip } =
    getDataFromPullReqMetadata(pullReqMetadata)

  useEffect(() => {
    const firstEnabledAction = actions.find(action => !action.disabled)
    if (firstEnabledAction) {
      setMergeButtonValue(firstEnabledAction.id)
    } else {
      setMergeButtonValue(actions[0].id)
    }
  }, [actions])

  useEffect(() => {
    const ruleViolationArr = prPanelData?.ruleViolationArr

    if (!!ruleViolationArr && !isDraft && ruleViolationArr.data.rule_violations) {
      const { checkIfBypassAllowed } = extractInfoFromRuleViolationArr(ruleViolationArr.data.rule_violations)
      setNotBypassable(checkIfBypassAllowed)
    }
  }, [prPanelData?.ruleViolationArr, isDraft])

  const buttonState = getButtonState({
    isMergeable,
    ruleViolation: prPanelData.ruleViolation,
    isDraft,
    checksInfo,
    checkboxBypass,
    canBypass: !notBypassable
  })

  return (
    <>
      <StackedList.Root>
        <StackedList.Item
          className={cn('items-center py-2', {
            'pr-1.5': isShowMoreTooltip
          })}
          disableHover
        >
          <StackedList.Field
            className={cn({ 'w-full': !pullReqMetadata?.merged })}
            title={
              <HeaderTitle
                isDraft={isDraft}
                isClosed={isClosed}
                unchecked={isUnchecked}
                mergeable={isMergeable}
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
                <Layout.Horizontal align="center" justify="center" gap="xs">
                  {!!commitSuggestionsBatchCount && (
                    <Button variant="outline" onClick={() => onCommitSuggestions()}>
                      Commit suggestion
                      {/* TODO: Design system: Add Badge counter icon theme once it is ready */}
                      <CounterBadge theme="info">{commitSuggestionsBatchCount}</CounterBadge>
                    </Button>
                  )}
                  {!notBypassable && isMergeable && !isDraft && prPanelData.ruleViolation && (
                    <Checkbox
                      id="checkbox-bypass"
                      showOptionalLabel
                      checked={!!checkboxBypass}
                      onCheckedChange={() => {
                        if (typeof checkboxBypass === 'boolean') {
                          setCheckboxBypass?.(!checkboxBypass)
                        }
                      }}
                      label="Bypass and merge anyway"
                    />
                  )}

                  {actions && !pullReqMetadata?.closed ? (
                    <SplitButton
                      theme={buttonState.theme as Extract<ButtonThemes, 'success' | 'danger' | 'muted'>}
                      disabled={buttonState.disabled}
                      variant="outline"
                      selectedValue={mergeButtonValue}
                      handleOptionChange={setMergeButtonValue}
                      options={actions.map(action => ({
                        value: action.id,
                        label: action.title,
                        description: action.description,
                        disabled: action.disabled
                      }))}
                      handleButtonClick={() => {
                        actions[parseInt(mergeButtonValue)]?.action?.()
                      }}
                    >
                      {actions[parseInt(mergeButtonValue)].title}
                    </SplitButton>
                  ) : (
                    <Button
                      disabled={(!checkboxBypass && prPanelData.ruleViolation && !isClosed) || showRestoreBranchButton}
                      onClick={actions[0].action}
                    >
                      Open for review
                    </Button>
                  )}

                  {isShowMoreTooltip && (
                    <MoreActionsTooltip
                      className="!ml-2"
                      iconName="more-horizontal"
                      sideOffset={-8}
                      alignOffset={2}
                      actions={[
                        {
                          title: 'Mark as draft',
                          onClick: () => handlePrState('draft')
                        },
                        {
                          title: 'Close pull request',
                          onClick: () => handlePrState('closed')
                        },
                        ...(isRebasable
                          ? [
                              {
                                title: 'Rebase',
                                onClick: () => handleRebaseBranch()
                              }
                            ]
                          : [])
                      ]}
                    />
                  )}
                </Layout.Horizontal>
              }
            />
          )}
        </StackedList.Item>
        <StackedList.Item disableHover className="cursor-default py-0 hover:bg-transparent">
          {!isClosed ? (
            <Accordion.Root
              className="w-full"
              type="multiple"
              value={accordionValues}
              onValueChange={handleAccordionValuesChange}
            >
              {!pullReqMetadata?.merged && (
                <PullRequestChangesSection
                  accordionValues={accordionValues}
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

              {(!!prPanelData?.resolvedCommentArr || prPanelData.requiresCommentApproval) &&
                !pullReqMetadata?.merged && <PullRequestCommentSection commentsInfo={prPanelData.commentsInfoData} />}

              <PullRequestCheckSection
                checkData={checks ?? []}
                checksInfo={checksInfo}
                accordionValues={accordionValues}
                {...routingProps}
              />

              {!pullReqMetadata?.merged && (
                <PullRequestMergeSection
                  unchecked={isUnchecked}
                  mergeable={isMergeable}
                  pullReqMetadata={pullReqMetadata}
                  conflictingFiles={prPanelData.conflictingFiles}
                  accordionValues={accordionValues}
                  setAccordionValues={setAccordionValues}
                />
              )}
            </Accordion.Root>
          ) : (
            <Layout.Horizontal gap="xs" align="center" justify="between" className="w-full py-4">
              <Layout.Horizontal align="center" className="w-full" gap="xs">
                <StatusBadge variant="secondary" size="sm">
                  <Link
                    className="flex items-center gap-x-1.5"
                    to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/code/${pullReqMetadata?.source_branch}`}
                  >
                    <IconV2 name="git-branch" size="2xs" className="text-icons-9" />
                    {pullReqMetadata?.source_branch}
                  </Link>
                </StatusBadge>
                <span className="text-2 text-cn-foreground-1"> branch has unmerged changes.</span>
              </Layout.Horizontal>
              {showDeleteBranchButton && (
                <Button theme="danger" onClick={onDeleteBranch}>
                  Delete Branch
                </Button>
              )}
              {!showDeleteBranchButton && showRestoreBranchButton && (
                <Button onClick={onRestoreBranch}>Restore Branch</Button>
              )}
            </Layout.Horizontal>
          )}
        </StackedList.Item>
      </StackedList.Root>
      {!!error && (
        <Alert.Root theme="danger" className="mt-2">
          <Alert.Title>{error}</Alert.Title>
        </Alert.Root>
      )}
    </>
  )
}

export { PullRequestPanel }
