import { useCallback, useEffect, useState } from 'react'

import {
  Accordion,
  Alert,
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
import { TypesPullReq } from '@views/repo/pull-request/pull-request.types'

import {
  DefaultReviewersDataProps,
  mergeMethodMapping,
  MergeStrategy,
  PullRequestRoutingProps
} from '../../pull-request-details-types'
import PullRequestBranchBadge from './pull-request-branch-badge'
import PullRequestChangesSection from './sections/pull-request-changes-section'
import PullRequestCheckSection from './sections/pull-request-checks-section'
import PullRequestCommentSection from './sections/pull-request-comment-section'
import PullRequestMergeSection from './sections/pull-request-merge-section'

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
    ruleViolation
  } = props
  const areRulesBypassed = pullReqMetadata?.merge_violations_bypassed
  const mergeMethod = getMergeMethodDisplay(pullReqMetadata?.merge_method as MergeStrategy)
  if (pullReqMetadata?.state === PullRequestFilterOption.MERGED) {
    return (
      <>
        <div className="inline-flex w-full items-center justify-between gap-2">
          <Text className="flex items-center space-x-1" variant="body-single-line-strong" as="h2" color="foreground-1">
            <span>{pullReqMetadata?.merger?.display_name}</span>
            <span>{areRulesBypassed ? `bypassed rules and ${mergeMethod}` : `${mergeMethod}`}</span>
            <span>into</span>
            <PullRequestBranchBadge
              branchName={pullReqMetadata?.target_branch || ''}
              spaceId={spaceId}
              repoId={repoId}
            />
            <span>from</span>
            <PullRequestBranchBadge
              branchName={pullReqMetadata?.source_branch || ''}
              spaceId={spaceId}
              repoId={repoId}
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
      <Text variant="body-single-line-strong" as="h2" color="foreground-1">
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
    isRebasable: pullReqMetadata?.merge_target_sha !== pullReqMetadata?.merge_base_sha && !pullReqMetadata?.merged,
    isShowMoreTooltip: isOpen && !isDraft
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
    if (selectedAction.title === 'Squash and merge') {
      setMergeMessage(
        pullReqCommits?.commits
          ?.map(commit => `* ${commit?.sha?.substring(0, 6)} ${commit?.title}`)
          .join('\n\n')
          ?.slice(0, 1000) ?? ''
      )
      onMergeMethodSelect?.('squash')
    } else if (selectedAction.title === 'Merge pull request') {
      setMergeMessage('')
      onMergeMethodSelect?.('merge')
    } else if (selectedAction.title === 'Rebase and merge') {
      setMergeMessage('')
      onMergeMethodSelect?.('rebase')
    } else if (selectedAction.title === 'Fast-forward merge') {
      setMergeMessage('')
      onMergeMethodSelect?.('fast-forward')
    }

    setShowActionBtn(true)
    setMergeButtonValue(value)
    if (selectedAction.title === 'Merge pull request' || selectedAction.title === 'Squash and merge') {
      setShowMergeInputs(true)
    } else {
      setShowMergeInputs(false)
    }
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

  const handleAccordionValuesChange = useCallback((data: string | string[]) => {
    if (typeof data === 'string') return

    setAccordionValues(data)
  }, [])

  const { isMergeable, isClosed, isOpen, isDraft, isUnchecked, isRebasable, isShowMoreTooltip } =
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

  const buttonState = getButtonState({
    isMergeable,
    ruleViolation: prPanelData.ruleViolation,
    isDraft,
    checks,
    checkboxBypass,
    canBypass: !notBypassable
  })

  return (
    <>
      <StackedList.Root className="border-cn-borders-3 bg-cn-background-1">
        <StackedList.Item
          className={cn('items-center py-2 border-cn-borders-3', {
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
                onRevertPR={onRevertPR}
                showRestoreBranchButton={showRestoreBranchButton}
                showDeleteBranchButton={showDeleteBranchButton}
                headerMsg={headerMsg}
                spaceId={spaceId}
                repoId={repoId}
              />
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
                    {(() => {
                      // Only show SplitButton if we're not in any merge-related state
                      const shouldShowSplitButton =
                        actions &&
                        !pullReqMetadata?.closed &&
                        !showActionBtn &&
                        !isMerging &&
                        !pullReqMetadata?.merged &&
                        !mergeInitiated
                      return shouldShowSplitButton ? (
                        <SplitButton
                          // because of the complex SplitButtonProps type, we need to cast the theme and variant to const
                          {...(buttonState.variant === 'primary'
                            ? { theme: 'default' as const, variant: 'primary' as const }
                            : {
                                theme: (buttonState.theme || 'default') as 'success' | 'danger' | 'default',
                                variant: 'outline' as const
                              })}
                          disabled={buttonState.disabled}
                          loading={actions[parseInt(mergeButtonValue)]?.loading}
                          selectedValue={mergeButtonValue}
                          handleOptionChange={handleMergeTypeSelect}
                          options={actions.map(action => ({
                            value: action.id,
                            label: action.title,
                            description: action.description,
                            disabled: action.disabled
                          }))}
                          handleButtonClick={() => {
                            const selectedAction = actions[parseInt(mergeButtonValue)]
                            if (!selectedAction.disabled) {
                              handleMergeTypeSelect(mergeButtonValue)
                            }
                          }}
                          size="md"
                        >
                          {actions[parseInt(mergeButtonValue)].title}
                        </SplitButton>
                      ) : null
                    })()}
                    {/* When in merge input mode or merging, show Cancel/Confirm buttons */}
                    {(() => {
                      const shouldShowButtonLayout =
                        actions && !pullReqMetadata?.closed && (showActionBtn || isMerging || mergeInitiated)
                      return shouldShowButtonLayout ? (
                        <ButtonLayout>
                          <Button
                            variant="outline"
                            onClick={handleCancelMerge}
                            loading={cancelInitiated}
                            disabled={isMerging || mergeInitiated}
                          >
                            Cancel
                          </Button>
                          <Button
                            theme="success"
                            onClick={handleConfirmMerge}
                            loading={isMerging || mergeInitiated}
                            disabled={cancelInitiated}
                          >
                            Confirm {actions[parseInt(mergeButtonValue || '0')]?.title || 'Merge'}
                          </Button>
                        </ButtonLayout>
                      ) : null
                    })()}
                    {actions && pullReqMetadata?.closed ? (
                      <Button variant="primary" theme="default" size="sm" onClick={actions[0].action}>
                        {actions[0].title}
                      </Button>
                    ) : null}
                    {isShowMoreTooltip && (
                      <MoreActionsTooltip
                        className="!ml-2"
                        iconName="more-horizontal"
                        sideOffset={-8}
                        alignOffset={2}
                        actions={[
                          {
                            title: 'Mark as draft',
                            onClick: () => handlePrState('draft'),
                            iconName: 'page-edit'
                          },
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
                  <Layout.Vertical className="w-full gap-1">
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
                      className="w-full"
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
                />
              )}

              {(!!prPanelData?.resolvedCommentArr || prPanelData.requiresCommentApproval) &&
                !pullReqMetadata?.merged && <PullRequestCommentSection commentsInfo={prPanelData.commentsInfoData} />}

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
