import { useCallback, useEffect, useState } from 'react'

import {
  Accordion,
  Alert,
  Button,
  ButtonLayout,
  Checkbox,
  CounterBadge,
  IconV2,
  Input,
  Layout,
  MoreActionsTooltip,
  SplitButton,
  StackedList,
  StatusBadge,
  Text,
  Textarea,
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
}

const HeaderTitle = ({ ...props }: HeaderProps) => {
  const { pullReqMetadata } = props
  const areRulesBypassed = pullReqMetadata?.merge_violations_bypassed
  const mergeMethod = getMergeMethodDisplay(pullReqMetadata?.merge_method as MergeStrategy)
  if (props?.pullReqMetadata?.state === PullRequestFilterOption.MERGED) {
    return (
      <>
        <div className="inline-flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-1 font-medium">
            <span>{props?.pullReqMetadata?.merger?.display_name}</span>
            <span>
              {areRulesBypassed ? `bypassed branch rules and ${mergeMethod} branch` : `${mergeMethod} branch`}
            </span>
            <StatusBadge icon="git-branch" variant="secondary" theme="muted" size="sm">
              {props?.pullReqMetadata?.source_branch}
            </StatusBadge>
            <span>into</span>
            <StatusBadge icon="git-branch" variant="secondary" theme="muted" size="sm">
              {props?.pullReqMetadata?.target_branch}
            </StatusBadge>
            <TimeAgoCard timestamp={props?.pullReqMetadata?.merged} />
          </div>
          <Layout.Horizontal>
            <Button variant="secondary" onClick={props.onRevertPR}>
              Revert
            </Button>
            {props.showDeleteBranchButton ? (
              <Button variant="secondary" theme="danger" onClick={props.onDeleteBranch}>
                Delete Branch
              </Button>
            ) : props.showRestoreBranchButton ? (
              <Button variant="secondary" onClick={props.onRestoreBranch}>
                Restore Branch
              </Button>
            ) : null}
          </Layout.Horizontal>
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
  checks?: TypesPullReqCheck[] | null
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
  ...routingProps
}: PullRequestPanelProps) => {
  const { Link } = useRouterContext()
  const [notBypassable, setNotBypassable] = useState(false)
  const [mergeButtonValue, setMergeButtonValue] = useState(actions[0].id)
  const [accordionValues, setAccordionValues] = useState<string[]>([])
  const [showMergeInputs, setShowMergeInputs] = useState(false)
  const [showActionBtn, setShowActionBtn] = useState(false)

  useEffect(() => {
    setMergeTitle(`${pullReqMetadata?.title} (#${pullReqMetadata?.number})`)
  }, [pullReqMetadata?.title])

  const handleMergeTypeSelect = (value: string) => {
    if (actions[parseInt(value)].title === 'Squash and merge') {
      setMergeMessage(
        pullReqCommits?.commits
          ?.map(commit => `* ${commit?.sha?.substring(0, 6)} ${commit?.title}`)
          .join('\n\n')
          ?.slice(0, 1000) ?? ''
      )
    } else {
      setMergeMessage('')
    }
    setShowActionBtn(true)
    setMergeButtonValue(value)
    if (
      actions[parseInt(value)].title === 'Merge pull request' ||
      actions[parseInt(value)].title === 'Squash and merge'
    ) {
      setShowMergeInputs(true)
    } else {
      setShowMergeInputs(false)
    }
  }

  const handleCancelMerge = () => {
    setShowMergeInputs(false)
    setShowActionBtn(false)
  }

  const handleConfirmMerge = () => {
    setShowMergeInputs(false)
    setShowActionBtn(false)
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
                onRevertPR={onRevertPR}
                showRestoreBranchButton={showRestoreBranchButton}
                showDeleteBranchButton={showDeleteBranchButton}
                headerMsg={headerMsg}
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
                    {actions && !pullReqMetadata?.closed && !showActionBtn ? (
                      <SplitButton
                        theme={buttonState.theme as Extract<ButtonThemes, 'success' | 'danger' | 'muted'>}
                        disabled={buttonState.disabled}
                        variant="outline"
                        selectedValue={mergeButtonValue}
                        handleOptionChange={handleMergeTypeSelect}
                        options={actions.map(action => ({
                          value: action.id,
                          label: action.title,
                          description: action.description,
                          disabled: action.disabled
                        }))}
                        handleButtonClick={() => handleMergeTypeSelect(mergeButtonValue)}
                      >
                        {actions[parseInt(mergeButtonValue)].title}
                      </SplitButton>
                    ) : null}
                    {/* When in merge input mode, replace dropdown with Cancel/Confirm buttons, keep status/tooltip untouched */}
                    {actions && !pullReqMetadata?.closed && showActionBtn ? (
                      <ButtonLayout>
                        <Button variant="outline" onClick={handleCancelMerge}>
                          Cancel
                        </Button>
                        <Button theme="success" onClick={handleConfirmMerge}>
                          Confirm {actions[parseInt(mergeButtonValue || '0')]?.title || 'Merge'}
                        </Button>
                      </ButtonLayout>
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
              {showMergeInputs && (
                <Layout.Vertical className="items-center w-full mt-4">
                  <Layout.Vertical className="gap-4 w-full">
                    <Input
                      id="merge-title"
                      label="Pull Request Title"
                      className="w-full bg-cn-background-1"
                      value={mergeTitle}
                      onChange={e => setMergeTitle(e.target.value)}
                      optional
                      placeholder="Enter pull request title (optional)"
                    />
                    <Textarea
                      id="merge-message"
                      label="Commit Message"
                      className="w-full"
                      value={mergeMessage}
                      onChange={e => setMergeMessage(e.target.value)}
                      optional
                      placeholder="Enter commit message (optional)"
                    />
                  </Layout.Vertical>
                </Layout.Vertical>
              )}
            </>
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

PullRequestPanel.displayName = 'PullRequestPanel'

export { PullRequestPanel }
