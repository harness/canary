import { useCallback, useEffect, useState } from 'react'

import {
  Accordion,
  Badge,
  Button,
  ButtonWithOptions,
  ButtonWithOptionsTheme,
  ButtonWithOptionsVariant,
  Checkbox,
  Icon,
  Layout,
  MoreActionsTooltip,
  Option,
  StackedList
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
            <Badge variant="soft" theme="muted" size="sm">
              <Icon name="branch" size={12} className="text-icons-9" />
              {props?.pullReqMetadata?.source_branch}
            </Badge>
            <span>into</span>
            <Badge variant="soft" theme="muted" size="sm">
              <Icon name="branch" size={12} className="text-icons-9" />
              {props?.pullReqMetadata?.target_branch}
            </Badge>
            <span>{formattedTime}</span>
          </div>
          {props.showDeleteBranchButton ? (
            <Button variant="destructive" onClick={props.onDeleteBranch}>
              Delete Branch
            </Button>
          ) : props.showRestoreBranchButton ? (
            <Button onClick={props.onRestoreBranch}>Restore Branch</Button>
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
      theme: checksInfo.status === 'failure' ? 'disabled' : 'error',
      variant: checksInfo.status === 'failure' ? 'default' : 'destractive'
    }
  }

  if (ruleViolation && canBypass) {
    return {
      disabled: !checkboxBypass,
      theme: checkboxBypass ? 'error' : 'disabled',
      variant: checkboxBypass ? 'destractive' : 'default'
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
    theme: 'disabled'
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
              <Layout.Horizontal className="items-center justify-center space-x-2.5">
                {!!commitSuggestionsBatchCount && (
                  <Button className="gap-x-2" variant="outline" onClick={() => onCommitSuggestions()}>
                    Commit suggestion
                    <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded border border-tag-border-blue-1 bg-tag-background-blue-1 px-1 text-0 text-tag-foreground-blue-1">
                      {commitSuggestionsBatchCount}
                    </span>
                  </Button>
                )}
                {!notBypassable && isMergeable && !isDraft && prPanelData.ruleViolation && (
                  <Option
                    className="mr-2.5 items-center"
                    id="checkbox-bypass"
                    control={
                      <Checkbox
                        id="checkbox-bypass"
                        checked={!!checkboxBypass}
                        onCheckedChange={() => {
                          if (typeof checkboxBypass === 'boolean') {
                            setCheckboxBypass?.(!checkboxBypass)
                          }
                        }}
                      />
                    }
                    label="Bypass and merge anyway"
                    labelProps={{
                      color: 'secondary'
                    }}
                  />
                )}

                {actions && !pullReqMetadata?.closed ? (
                  <ButtonWithOptions
                    id="pr-type"
                    theme={buttonState.theme as ButtonWithOptionsTheme}
                    disabled={buttonState.disabled}
                    variant={buttonState?.variant as ButtonWithOptionsVariant}
                    selectedValue={mergeButtonValue}
                    handleOptionChange={setMergeButtonValue}
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
                  </ButtonWithOptions>
                ) : (
                  <Button
                    disabled={!checkboxBypass && prPanelData.ruleViolation && !isClosed}
                    onClick={actions[0].action}
                  >
                    Open for review
                  </Button>
                )}

                {isShowMoreTooltip && (
                  <MoreActionsTooltip
                    className="!ml-2"
                    iconName="more-dots-fill"
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

            {(!!prPanelData?.resolvedCommentArr || prPanelData.requiresCommentApproval) && !pullReqMetadata?.merged && (
              <PullRequestCommentSection commentsInfo={prPanelData.commentsInfoData} />
            )}

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
          <Layout.Horizontal className="flex w-full items-center justify-between py-4" gap="space-x-2">
            <Layout.Horizontal className="flex w-full items-center" gap="space-x-1">
            <Badge variant="soft" size="sm">
                <Link
                  className="flex items-center gap-x-1.5"
                  to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/code/${pullReqMetadata?.source_branch}`}
                >
                  <Icon name="branch" size={12} className="text-icons-9" />
                  {pullReqMetadata?.source_branch}
                </Link>
              </Badge>
              <span className="text-2 text-cn-foreground-1">branch has unmerged changes.</span>
            </Layout.Horizontal>
            {showDeleteBranchButton && (
              <Button variant="destructive" onClick={onDeleteBranch}>
                Delete Branch
              </Button>
            )}
            {!showDeleteBranchButton && showRestoreBranchButton && (
              <Button theme="primary" onClick={onRestoreBranch}>
                Restore Branch
              </Button>
            )}
          </Layout.Horizontal>
        )}
      </StackedList.Item>
    </StackedList.Root>
  )
}

export { PullRequestPanel }
