import { useCallback, useEffect, useState } from 'react'

import {
  Accordion,
  Alert,
  Avatar,
  BranchTag,
  Button,
  ButtonLayout,
  Checkbox,
  CounterBadge,
  IconV2,
  Layout,
  MoreActionsTooltip,
  SplitButton,
  StackedList,
  StatusBadge,
  Text,
  Textarea,
  TextInput,
  TimeAgoCard,
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
  TypesListCommitResponse,
  TypesPullReqCheck
} from '@/views'
import { cn } from '@utils/cn'
import { PrState, TypesPullReq } from '@views/repo/pull-request/pull-request.types'

import {
  DefaultReviewersDataProps,
  mergeMethodMapping,
  MergeStrategy,
  PullRequestRoutingProps
} from '../../pull-request-details-types'
import PullRequestChangesSection from './sections/pull-request-changes-section'
import PullRequestCheckSection from './sections/pull-request-checks-section'
import PullRequestCommentSection from './sections/pull-request-comment-section'
import PullRequestMergeSection from './sections/pull-request-merge-section'

const MERGE_METHOD_TITLES: Record<MergeStrategy, string> = {
  [MergeStrategy.FAST_FORWARD]: 'Fast-forward merge',
  [MergeStrategy.SQUASH]: 'Squash and merge',
  [MergeStrategy.MERGE]: 'Merge pull request',
  [MergeStrategy.REBASE]: 'Rebase and merge'
}

const getMergeStrategyFromTitle = (title?: string): MergeStrategy | undefined => {
  if (!title) return undefined
  const entry = Object.entries(MERGE_METHOD_TITLES).find(([, display]) => display === title)
  return entry ? (entry[0] as MergeStrategy) : undefined
}

export const getMergeMethodDisplay = (mergeMethodType: MergeStrategy): string => {
  return mergeMethodMapping[mergeMethodType]
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
  onRevertPR: () => void
  showDeleteBranchButton: boolean
  showRestoreBranchButton: boolean
  headerMsg?: string
  spaceId?: string
  repoId?: string
  actions?: PullRequestAction[]
  mergeButtonValue?: string
}

interface ButtonStateProps {
  isMergeable?: boolean
  ruleViolation?: boolean
  isDraft?: boolean
  checks?: TypesPullReqCheck[]
  checkboxBypass?: boolean
  canBypass?: boolean
}

const HeaderTitle = ({ ...props }: HeaderProps) => {
  const {
    pullReqMetadata,
    spaceId,
    repoId,
    onRevertPR,
    onDeleteBranch,
    onRestoreBranch,
    headerMsg,
    showDeleteBranchButton,
    showRestoreBranchButton,
    isDraft,
    isClosed,
    unchecked,
    mergeable,
    isOpen,
    ruleViolation,
    actions,
    mergeButtonValue
  } = props
  const areRulesBypassed = pullReqMetadata?.merge_violations_bypassed
  const mergeMethod = getMergeMethodDisplay(pullReqMetadata?.merge_method as MergeStrategy)
  const isRebasable = pullReqMetadata?.merge_target_sha !== pullReqMetadata?.merge_base_sha && !pullReqMetadata?.merged

  // Get the current selected merge method
  const getCurrentMergeMethod = () => {
    const selectedAction = actions?.[parseInt(mergeButtonValue || '0')]
    switch (getMergeStrategyFromTitle(selectedAction?.title)) {
      case MergeStrategy.FAST_FORWARD:
        return MergeStrategy.FAST_FORWARD
      case MergeStrategy.SQUASH:
        return MergeStrategy.SQUASH
      case MergeStrategy.MERGE:
        return MergeStrategy.MERGE
      case MergeStrategy.REBASE:
        return MergeStrategy.REBASE
      default:
        return undefined
    }
  }

  const currentMergeMethod = getCurrentMergeMethod()
  const isFastForwardNotPossible = isRebasable && currentMergeMethod === MergeStrategy.FAST_FORWARD

  const getStatusTextColor = (): 'success' | 'danger' | 'foreground-1' => {
    if (isDraft || isClosed) return 'foreground-1'

    if (isOpen && (mergeable === false || ruleViolation || isFastForwardNotPossible)) {
      return 'danger'
    }

    if (isOpen && !unchecked) {
      return 'success'
    }
    return 'foreground-1'
  }

  if (pullReqMetadata?.state === PullRequestFilterOption.MERGED) {
    return (
      <>
        <div className="inline-flex w-full items-center justify-between gap-2">
          <Text
            className="flex items-center space-x-1 text-[var(--cn-set-purple-surface-text)]"
            variant="body-single-line-strong"
            as="h2"
            color="inherit"
          >
            <Avatar name={pullReqMetadata?.merger?.display_name || ''} rounded size="sm" />
            <span>{pullReqMetadata?.merger?.display_name}</span>
            <span>{areRulesBypassed ? `bypassed rules and ${mergeMethod}` : `${mergeMethod}`}</span>
            <span>into</span>
            <BranchTag
              branchName={pullReqMetadata?.target_branch || ''}
              spaceId={spaceId}
              repoId={repoId}
              theme="violet"
              variant="secondary"
            />
            <span>from</span>
            <BranchTag
              branchName={pullReqMetadata?.source_branch || ''}
              spaceId={spaceId}
              repoId={repoId}
              theme="violet"
              variant="secondary"
            />
            <TimeAgoCard timestamp={pullReqMetadata?.merged} />
          </Text>
          <Layout.Horizontal>
            <Button variant="secondary" onClick={onRevertPR}>
              Revert
            </Button>
            {showDeleteBranchButton ? (
              <Button variant="primary" theme="danger" onClick={onDeleteBranch}>
                Delete Branch
              </Button>
            ) : showRestoreBranchButton ? (
              <Button variant="outline" onClick={onRestoreBranch}>
                Restore Branch
              </Button>
            ) : null}
          </Layout.Horizontal>
        </div>
        {headerMsg && (
          <div className="flex w-full justify-end">
            <span className="text-1 text-cn-foreground-danger">{headerMsg}</span>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="inline-flex items-center gap-2">
      <Text variant="body-single-line-strong" as="h2" color={getStatusTextColor()}>
        {isDraft
          ? 'This pull request is still a work in progress'
          : isClosed
            ? 'This pull request is closed'
            : unchecked
              ? 'Checking for ability to merge automatically...'
              : mergeable === false && isOpen
                ? 'Cannot merge pull request'
                : ruleViolation
                  ? 'Cannot merge pull request'
                  : isFastForwardNotPossible
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
  checks,
  checkboxBypass,
  canBypass
}: ButtonStateProps): {
  disabled: boolean
  theme: ButtonThemes
  variant?: 'primary' | 'outline'
} => {
  if (isDraft) {
    return {
      disabled: false,
      theme: 'default',
      variant: 'primary'
    }
  }

  let checksNotAllowingMerge = false
  checks?.forEach(check => {
    if (check.required && check.check?.status && ['pending', 'running', 'failure'].includes(check.check.status)) {
      checksNotAllowingMerge = true
    }
  })
  if (checksNotAllowingMerge) {
    return {
      disabled: canBypass ? !checkboxBypass : true,
      theme: 'danger',
      variant: 'primary'
    }
  }

  if (ruleViolation) {
    if (canBypass) {
      return {
        disabled: !checkboxBypass,
        theme: checkboxBypass ? 'danger' : 'default',
        variant: checkboxBypass ? 'outline' : 'primary'
      }
    }
  }

  if (isMergeable && !ruleViolation) {
    return {
      disabled: false,
      theme: 'success',
      variant: 'outline'
    }
  }

  return {
    disabled: true,
    theme: 'default',
    variant: 'outline'
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
    isRebasable: pullReqMetadata?.merge_target_sha !== pullReqMetadata?.merge_base_sha && !pullReqMetadata?.merged
  }
}

export interface PullRequestPanelProps
  extends Omit<
      PullRequestChangesSectionProps,
      | 'reqNoChangeReq'
      | 'reqCodeOwnerApproval'
      | 'minApproval'
      | 'reqCodeOwnerLatestApproval'
      | 'minReqLatestApproval'
      | 'accordionValues'
    >,
    Partial<PullRequestRoutingProps> {
  handleRebaseBranch: () => void
  handlePrState: (state: string) => void
  handleViewUnresolvedComments: () => void
  pullReqMetadata?: TypesPullReq
  checks?: TypesPullReqCheck[]
  checksInfo: { header: string; content: string; status: EnumCheckStatus }
  actions: PullRequestAction[]
  checkboxBypass?: boolean
  setCheckboxBypass?: (value: boolean) => void
  onRestoreBranch: () => void
  onDeleteBranch: () => void
  onRevertPR: () => void
  showDeleteBranchButton: boolean
  showRestoreBranchButton: boolean
  headerMsg?: string
  commitSuggestionsBatchCount: number
  onCommitSuggestions: () => void
  prPanelData: PRPanelData
  spaceId?: string
  repoId?: string
  error?: string | null
  defaultReviewersData?: DefaultReviewersDataProps
  pullReqCommits: TypesListCommitResponse | undefined
  mergeTitle: string
  mergeMessage: string
  setMergeTitle: (title: string) => void
  setMergeMessage: (message: string) => void
  isMerging?: boolean
  isRebasing?: boolean
  onMergeMethodSelect?: (method: string) => void
}

const PullRequestPanel = ({
  pullReqCommits,
  pullReqMetadata,
  checks,
  changesInfo,
  checksInfo,
  approvedEvaluations,
  changeReqEvaluations,
  codeOwnersData,
  latestApprovalArr,
  changeReqReviewer,
  actions,
  checkboxBypass,
  setCheckboxBypass,
  onRestoreBranch,
  onDeleteBranch,
  onRevertPR,
  showRestoreBranchButton,
  showDeleteBranchButton,
  headerMsg,
  commitSuggestionsBatchCount,
  onCommitSuggestions,
  handlePrState,
  handleRebaseBranch,
  handleViewUnresolvedComments,
  prPanelData,
  spaceId,
  repoId,
  error,
  defaultReviewersData,
  mergeTitle,
  mergeMessage,
  setMergeTitle,
  setMergeMessage,
  isMerging,
  isRebasing,
  onMergeMethodSelect,
  ...routingProps
}: PullRequestPanelProps) => {
  const { Link } = useRouterContext()
  const [notBypassable, setNotBypassable] = useState(false)
  const [mergeButtonValue, setMergeButtonValue] = useState<string>(() => {
    const firstEnabledAction = actions.find(action => !action.disabled)
    return firstEnabledAction?.id || actions[0]?.id || ''
  })
  const [accordionValues, setAccordionValues] = useState<string[]>([])
  const [showMergeInputs, setShowMergeInputs] = useState(false)
  const [showActionBtn, setShowActionBtn] = useState(false)
  const [mergeInitiated, setMergeInitiated] = useState(false)
  const [cancelInitiated, setCancelInitiated] = useState(false)

  useEffect(() => {
    setMergeTitle(`${pullReqMetadata?.title} (#${pullReqMetadata?.number})`)
  }, [pullReqMetadata?.title])

  const handleMergeTypeSelect = (value: string) => {
    const selectedAction = actions[parseInt(value)]
    const strategy = getMergeStrategyFromTitle(selectedAction.title)
    const mergeActionTitles = new Set(Object.values(MERGE_METHOD_TITLES))
    const isMergeAction = mergeActionTitles.has(selectedAction.title)
    setMergeButtonValue(value)
    if (!isMergeAction) {
      return
    }
    setShowActionBtn(true)

    switch (strategy) {
      case MergeStrategy.SQUASH:
        setMergeMessage(
          pullReqCommits?.commits
            ?.map(commit => `* ${commit?.sha?.substring(0, 6)} ${commit?.title}`)
            .join('\n\n')
            ?.slice(0, 1000) ?? ''
        )
        onMergeMethodSelect?.(MergeStrategy.SQUASH)
        break
      case MergeStrategy.MERGE:
        setMergeMessage('')
        onMergeMethodSelect?.(MergeStrategy.MERGE)
        break
      case MergeStrategy.REBASE:
        setMergeMessage('')
        onMergeMethodSelect?.(MergeStrategy.REBASE)
        break
      case MergeStrategy.FAST_FORWARD:
        setMergeMessage('')
        onMergeMethodSelect?.(MergeStrategy.FAST_FORWARD)
        break
      default:
        break
    }
    const showInputs = strategy === MergeStrategy.MERGE || strategy === MergeStrategy.SQUASH
    setShowMergeInputs(!!showInputs)
  }

  const handleCancelMerge = () => {
    setCancelInitiated(true)
    setShowMergeInputs(false)
    setShowActionBtn(false)
    setMergeInitiated(false)
  }

  const handleConfirmMerge = () => {
    setShowMergeInputs(false)
    setShowActionBtn(false)
    setMergeInitiated(true)

    const actionIdx = actions.findIndex(action => action.id === mergeButtonValue)
    if (actionIdx !== -1) {
      actions[actionIdx]?.action?.()
    }
  }

  // Check if Fast-Forward merge should be disabled
  const shouldDisableFastForwardMerge = () => {
    const selectedAction = actions[parseInt(mergeButtonValue || '0')]
    const isRebasable =
      pullReqMetadata?.merge_target_sha !== pullReqMetadata?.merge_base_sha && !pullReqMetadata?.merged
    const isFastForwardSelected = getMergeStrategyFromTitle(selectedAction?.title) === MergeStrategy.FAST_FORWARD
    return isFastForwardSelected && isRebasable
  }

  // To get the selected merge method
  const getSelectedMergeMethod = () => {
    const selectedAction = actions[parseInt(mergeButtonValue || '0')]
    return getMergeStrategyFromTitle(selectedAction?.title)
  }

  const handleAccordionValuesChange = useCallback((data: string | string[]) => {
    if (typeof data === 'string') return

    setAccordionValues(data)
  }, [])

  const { isMergeable, isClosed, isOpen, isDraft, isUnchecked, isRebasable } =
    getDataFromPullReqMetadata(pullReqMetadata)

  useEffect(() => {
    // Update mergeButtonValue if current selection is no longer valid or if actions change
    const currentAction = actions.find(action => action.id === mergeButtonValue)
    if (!currentAction || currentAction.disabled) {
      const firstEnabledAction = actions.find(action => !action.disabled)
      if (firstEnabledAction) {
        setMergeButtonValue(firstEnabledAction.id)
      } else if (actions.length > 0) {
        setMergeButtonValue(actions[0].id)
      }
    }
  }, [actions, mergeButtonValue])

  useEffect(() => {
    const ruleViolationArr = prPanelData?.ruleViolationArr

    if (!!ruleViolationArr && !isDraft && ruleViolationArr.data.rule_violations) {
      const { checkIfBypassAllowed } = extractInfoFromRuleViolationArr(ruleViolationArr.data.rule_violations)
      setNotBypassable(checkIfBypassAllowed)
    }
  }, [prPanelData?.ruleViolationArr, isDraft])

  // Reset mergeInitiated only when PR metadata shows it's merged
  useEffect(() => {
    if (pullReqMetadata?.merged && mergeInitiated) {
      setMergeInitiated(false)
    }
  }, [pullReqMetadata?.merged, mergeInitiated])

  // Reset cancelInitiated when showActionBtn becomes false (cancel operation completes)
  useEffect(() => {
    if (!showActionBtn && cancelInitiated) {
      setCancelInitiated(false)
    }
  }, [showActionBtn, cancelInitiated])

  // Reset mergeInitiated when there's a merge error
  useEffect(() => {
    if (error && mergeInitiated) {
      setMergeInitiated(false)
      setShowActionBtn(false)
    }
  }, [error, mergeInitiated])

  // Reset mergeInitiated when PR state changes (e.g., from draft to open)
  useEffect(() => {
    if (mergeInitiated && !isMerging && !pullReqMetadata?.is_draft) {
      // Reset loading state when PR changes from draft to open (API success)
      setMergeInitiated(false)
      setShowActionBtn(false)
    }
  }, [mergeInitiated, isMerging, pullReqMetadata?.is_draft])

  const buttonState = getButtonState({
    isMergeable,
    ruleViolation: prPanelData.ruleViolation,
    isDraft,
    checks,
    checkboxBypass,
    canBypass: !notBypassable
  })

  const fastForwardDisabled = shouldDisableFastForwardMerge()
  const getPrState = (): PrState => {
    if (pullReqMetadata?.state === PullRequestFilterOption.MERGED) {
      return PrState.Merged
    } else if (isClosed && !pullReqMetadata?.merged) {
      return PrState.Closed
    } else if (isOpen && isDraft) {
      return PrState.Draft
    } else if (isOpen && (!isMergeable || prPanelData.ruleViolation || fastForwardDisabled)) {
      return PrState.Error
    } else if (isOpen && !isDraft && !isClosed && isMergeable && !prPanelData.ruleViolation && !fastForwardDisabled) {
      return PrState.Success
    } else {
      return PrState.Ready
    }
  }

  const prState = getPrState()
  const headerRowBgClass = cn({
    'bg-[var(--cn-set-green-surface-bg)]': prState === PrState.Success,
    'bg-cn-background-2': prState === PrState.Draft,
    'bg-label-background-red': prState === PrState.Error,
    'bg-cn-background-softgray': prState === PrState.Closed,
    'bg-[var(--cn-set-purple-surface-bg)]': prState === PrState.Merged
  })

  const headerTitleColorClass = cn({
    'text-cn-foreground-success': prState === PrState.Success,
    'text-cn-foreground-danger': prState === PrState.Error
  })

  const shouldShowSplitButton =
    actions?.length > 1 &&
    !pullReqMetadata?.closed &&
    !showActionBtn &&
    !isMerging &&
    !pullReqMetadata?.merged &&
    !mergeInitiated

  console.log(actions)

  return (
    <>
      <StackedList.Root className="border-cn-borders-3 bg-cn-background-1">
        <StackedList.Item
          className={cn('items-center py-2 border-cn-borders-3', { 'pr-1.5': isOpen }, headerRowBgClass)}
          disableHover
        >
          <StackedList.Field
            className={cn({ 'w-full': !pullReqMetadata?.merged })}
            title={
              <div className={headerTitleColorClass}>
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
                  onRevertPR={onRevertPR}
                  showRestoreBranchButton={showRestoreBranchButton}
                  showDeleteBranchButton={showDeleteBranchButton}
                  headerMsg={headerMsg}
                  spaceId={spaceId}
                  repoId={repoId}
                  actions={actions}
                  mergeButtonValue={mergeButtonValue}
                />
              </div>
            }
          />

          {!pullReqMetadata?.merged && (
            <>
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
                        className="flex-1"
                        id="checkbox-bypass"
                        showOptionalLabel
                        checked={!!checkboxBypass}
                        onCheckedChange={() => {
                          if (typeof checkboxBypass === 'boolean') {
                            setCheckboxBypass?.(!checkboxBypass)
                          }
                        }}
                        label="Bypass and merge anyway"
                        truncateLabel={false}
                      />
                    )}

                    {/*Only show SplitButton if we're not in any merge-related state*/}
                    {shouldShowSplitButton && (
                      <SplitButton
                        theme={buttonState.variant === 'primary' ? 'default' : (buttonState.theme ?? 'outline')}
                        variant={buttonState.variant}
                        disabled={buttonState.disabled}
                        loading={actions[parseInt(mergeButtonValue)]?.loading}
                        handleOptionChange={handleMergeTypeSelect}
                        options={actions.map(action => {
                          return {
                            value: action.id,
                            label: action.title,
                            description: action.description,
                            disabled: action.disabled
                          }
                        })}
                        handleButtonClick={() => {
                          const selectedAction = actions[parseInt(mergeButtonValue)]
                          if (!selectedAction.disabled) {
                            const mergeActionTitles = new Set(Object.values(MERGE_METHOD_TITLES))
                            const isMergeAction = mergeActionTitles.has(selectedAction.title)

                            if (!isMergeAction) {
                              selectedAction.action?.()
                            } else {
                              handleMergeTypeSelect(mergeButtonValue)
                            }
                          }
                        }}
                        size="md"
                      >
                        {actions[parseInt(mergeButtonValue)].title}
                      </SplitButton>
                    )}

                    {actions?.length === 1 && (
                      <Button variant="primary" theme="default" onClick={actions[0].action}>
                        {actions[0].title}
                      </Button>
                    )}

                    {isOpen && (
                      <MoreActionsTooltip
                        className="!ml-2"
                        iconName="more-horizontal"
                        sideOffset={4}
                        alignOffset={0}
                        actions={[
                          ...(!isDraft
                            ? [
                                {
                                  title: 'Mark as draft',
                                  onClick: () => handlePrState('draft'),
                                  iconName: 'page-edit'
                                }
                              ]
                            : []),
                          {
                            title: 'Close pull request',
                            onClick: () => handlePrState('closed'),
                            iconName: 'git-pull-request-closed'
                          },
                          ...(isRebasable
                            ? [
                                {
                                  title: 'Rebase',
                                  onClick: () => handleRebaseBranch(),
                                  iconName: 'git-rebase' as const
                                }
                              ]
                            : [])
                        ]}
                      />
                    )}
                  </Layout.Horizontal>
                }
              />
              {showMergeInputs && (
                <Layout.Vertical className="mt-2 w-full items-center pr-cn-xs pb-cn-xs">
                  <Layout.Vertical className="w-full gap-1 rounded-md border border-cn-borders-3 bg-cn-background-1 p-3">
                    <TextInput
                      id="merge-title"
                      label="Commit message"
                      className="w-full bg-cn-background-1"
                      value={mergeTitle}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMergeTitle(e.target.value)}
                      optional
                      placeholder="Enter commit message (optional)"
                    />
                    <Textarea
                      id="merge-message"
                      label="Commit description"
                      className="w-full bg-cn-background-1"
                      value={mergeMessage}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMergeMessage(e.target.value)}
                      optional
                      resizable
                      rows={5}
                      placeholder="Enter commit description (optional)"
                    />
                  </Layout.Vertical>
                </Layout.Vertical>
              )}
            </>
          )}
        </StackedList.Item>
        <StackedList.Item disableHover className="cursor-default border-cn-borders-3 py-0 hover:bg-transparent">
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
                  latestApprovalArr={latestApprovalArr}
                  reqNoChangeReq={prPanelData.atLeastOneReviewerRule}
                  changeReqReviewer={changeReqReviewer}
                  codeOwnersData={codeOwnersData}
                  defaultReviewersData={defaultReviewersData}
                  pullReqMetadata={pullReqMetadata}
                />
              )}

              {(!!prPanelData?.resolvedCommentArr || prPanelData.requiresCommentApproval) &&
                !pullReqMetadata?.merged && (
                  <PullRequestCommentSection
                    commentsInfo={prPanelData.commentsInfoData}
                    handleAction={handleViewUnresolvedComments}
                  />
                )}

              <PullRequestCheckSection
                {...routingProps}
                checkData={checks ?? []}
                checksInfo={checksInfo}
                accordionValues={accordionValues}
              />

              {!pullReqMetadata?.merged && (
                <PullRequestMergeSection
                  unchecked={isUnchecked}
                  mergeable={isMergeable}
                  pullReqMetadata={pullReqMetadata}
                  conflictingFiles={prPanelData.conflictingFiles}
                  accordionValues={accordionValues}
                  setAccordionValues={setAccordionValues}
                  handleRebaseBranch={handleRebaseBranch}
                  isRebasing={isRebasing}
                  selectedMergeMethod={getSelectedMergeMethod()}
                />
              )}
            </Accordion.Root>
          ) : (
            <Layout.Horizontal gap="xs" align="center" justify="between" className="w-full py-4">
              <Layout.Horizontal gap="3xs" align="center" className="w-full">
                <StatusBadge variant="secondary" size="sm">
                  <Link
                    className="flex items-center gap-x-1.5"
                    to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/files/${pullReqMetadata?.source_branch}`}
                  >
                    <IconV2 name="git-branch" size="2xs" className="text-icons-9" />
                    {pullReqMetadata?.source_branch}
                  </Link>
                </StatusBadge>
                <span className="text-2 text-cn-foreground-1"> branch has unmerged changes.</span>
              </Layout.Horizontal>
              {showDeleteBranchButton && (
                <Button theme="danger" size="sm" onClick={onDeleteBranch}>
                  Delete Branch
                </Button>
              )}
              {!showDeleteBranchButton && showRestoreBranchButton && (
                <Button size="sm" onClick={onRestoreBranch}>
                  Restore Branch
                </Button>
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

PullRequestPanel.displayName = 'PullRequestPanel'

export { PullRequestPanel }
