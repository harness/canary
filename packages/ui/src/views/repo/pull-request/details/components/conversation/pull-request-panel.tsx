import { useEffect, useMemo, useState } from 'react'

import {
  Accordion,
  Badge,
  Button,
  ButtonWithOptions,
  Checkbox,
  DropdownMenu,
  Icon,
  Layout,
  StackedList
} from '@/components'
import {
  EnumCheckStatus,
  extractInfoFromRuleViolationArr,
  MergeCheckStatus,
  PullRequestAction,
  PullRequestChangesSectionProps,
  PullRequestFilterOption,
  PullRequestState,
  TypesPullReqCheck,
  TypesRuleViolations
} from '@/views'
import { cn } from '@utils/cn'
import { timeAgo } from '@utils/utils'
import { TypesPullReq } from '@views/repo/pull-request/pull-request.types'

import { PullRequestRoutingProps } from '../../pull-request-details-types'
import PullRequestChangesSection from './sections/pull-request-changes-section'
import PullRequestCheckSection from './sections/pull-request-checks-section'
import PullRequestCommentSection from './sections/pull-request-comment-section'
import PullRequestMergeSection from './sections/pull-request-merge-section'

interface PullRequestPanelProps extends PullRequestChangesSectionProps, Partial<PullRequestRoutingProps> {
  handleRebaseBranch: () => void
  handlePrState: (state: string) => void
  pullReqMetadata: TypesPullReq | undefined
  conflictingFiles?: string[]
  PRStateLoading: boolean
  checks?: TypesPullReqCheck[] | null
  ruleViolation?: boolean //TODO: fix type
  checksInfo: { header: string; content: string; status: EnumCheckStatus }
  commentsInfo: { header: string; content?: string | undefined; status: string }
  actions: PullRequestAction[]
  resolvedCommentArr?: { params: number[] }
  requiresCommentApproval?: boolean
  checkboxBypass?: boolean
  spaceId?: string
  repoId?: string
  setCheckboxBypass?: (value: boolean) => void
  ruleViolationArr:
    | {
        data: {
          rule_violations: TypesRuleViolations[]
        }
      }
    | undefined
  onRestoreBranch: () => void
  onDeleteBranch: () => void
  showDeleteBranchButton: boolean
  showRestoreBranchButton: boolean
  headerMsg?: string
  commitSuggestionsBatchCount: number
  onCommitSuggestions: () => void
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
            <Badge variant="secondary" size="xs">
              <Icon name="branch" size={12} className="mr-1 text-tertiary-background" />
              {props?.pullReqMetadata?.source_branch}
            </Badge>
            <span>into</span>
            <Badge variant="secondary" size="xs">
              <Icon name="branch" size={12} className="mr-1 text-tertiary-background" />
              {props?.pullReqMetadata?.target_branch}
            </Badge>
            <span>{formattedTime}</span>
          </div>
          {props.showRestoreBranchButton ? (
            <Button variant="secondary" size="sm" onClick={props.onRestoreBranch}>
              Restore Branch
            </Button>
          ) : props.showDeleteBranchButton ? (
            <Button variant="secondary" size="sm" onClick={props.onDeleteBranch}>
              Delete Branch
            </Button>
          ) : null}
        </div>
        {props.headerMsg && (
          <div className="flex w-full justify-end">
            <span className="text-12 text-destructive">{props.headerMsg}</span>
          </div>
        )}
      </>
    )
  }
  return (
    <div className="inline-flex items-center gap-2">
      <h2 className="font-medium text-foreground-1">
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

const PullRequestPanel = ({
  pullReqMetadata,
  // PRStateLoading,
  checks,
  changesInfo,
  checksInfo,
  commentsInfo,
  ruleViolation,
  minApproval,
  minReqLatestApproval,
  approvedEvaluations,
  changeReqEvaluations,
  codeOwners,
  latestApprovalArr,
  reqNoChangeReq,
  changeReqReviewer,
  reqCodeOwnerApproval,
  reqCodeOwnerLatestApproval,
  codeOwnerChangeReqEntries,
  codeOwnerPendingEntries,
  codeOwnerApprovalEntries,
  latestCodeOwnerApprovalArr,
  conflictingFiles,
  actions,
  requiresCommentApproval,
  resolvedCommentArr,
  ruleViolationArr,
  checkboxBypass,
  setCheckboxBypass,
  spaceId,
  repoId,
  onRestoreBranch,
  onDeleteBranch,
  showRestoreBranchButton,
  showDeleteBranchButton,
  headerMsg,
  commitSuggestionsBatchCount,
  onCommitSuggestions,
  handlePrState,
  handleRebaseBranch,
  ...routingProps
}: PullRequestPanelProps) => {
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
    if (ruleViolationArr && !isDraft && ruleViolationArr.data.rule_violations) {
      const { checkIfBypassAllowed } = extractInfoFromRuleViolationArr(ruleViolationArr.data.rule_violations)
      setNotBypassable(checkIfBypassAllowed)
    }
  }, [ruleViolationArr, isDraft])

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
        <DropdownMenu.Trigger className="group flex h-6 items-center px-2">
          <Icon
            className="text-icons-1 transition-colors duration-200 group-hover:text-icons-2"
            name="more-dots-fill"
            size={12}
          />
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
              ruleViolation={ruleViolation}
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
                    <Button className="gap-x-2" variant="outline" onClick={() => onCommitSuggestions()}>
                      Commit suggestion
                      <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded border border-tag-border-blue-1 bg-tag-background-blue-1 px-1 text-11 text-tag-foreground-blue-1">
                        {commitSuggestionsBatchCount}
                      </span>
                    </Button>
                  ) : (
                    <></>
                  )}
                  {!notBypassable && mergeable && !isDraft && ruleViolation && (
                    <Layout.Horizontal className="items-center justify-center">
                      <Checkbox
                        checked={checkboxBypass}
                        onCheckedChange={() => {
                          if (typeof checkboxBypass === 'boolean') {
                            setCheckboxBypass?.(!checkboxBypass)
                          }
                        }}
                      />
                      <span className="text-12 text-primary">Bypass and merge anyway</span>
                    </Layout.Horizontal>
                  )}

                  {actions && !pullReqMetadata?.closed ? (
                    <ButtonWithOptions
                      id="pr-type"
                      theme={
                        mergeable && !ruleViolation && !pullReqMetadata?.is_draft
                          ? 'success'
                          : pullReqMetadata?.is_draft
                            ? 'primary'
                            : checksInfo.status === 'pending' || checksInfo.status === 'running'
                              ? 'warning'
                              : 'disabled'
                      }
                      disabled={
                        (!checkboxBypass && ruleViolation) ||
                        !mergeable ||
                        ['pending', 'running', 'failed'].includes(checksInfo.status)
                      }
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
                    </ButtonWithOptions>
                  ) : (
                    <Button theme="primary" disabled={!checkboxBypass && ruleViolation} onClick={actions[0].action}>
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
        <Accordion.Root type="multiple" className="w-full">
          {!pullReqMetadata?.merged && (
            <PullRequestChangesSection
              changesInfo={changesInfo}
              minApproval={minApproval}
              minReqLatestApproval={minReqLatestApproval}
              approvedEvaluations={approvedEvaluations}
              changeReqEvaluations={changeReqEvaluations}
              codeOwners={codeOwners}
              latestApprovalArr={latestApprovalArr}
              reqNoChangeReq={reqNoChangeReq}
              changeReqReviewer={changeReqReviewer}
              codeOwnerChangeReqEntries={codeOwnerChangeReqEntries}
              reqCodeOwnerApproval={reqCodeOwnerApproval}
              reqCodeOwnerLatestApproval={reqCodeOwnerLatestApproval}
              codeOwnerPendingEntries={codeOwnerPendingEntries}
              codeOwnerApprovalEntries={codeOwnerApprovalEntries}
              latestCodeOwnerApprovalArr={latestCodeOwnerApprovalArr}
            />
          )}
          {(!!resolvedCommentArr || requiresCommentApproval) && !pullReqMetadata?.merged && (
            <PullRequestCommentSection commentsInfo={commentsInfo} />
          )}
          <PullRequestCheckSection
            checkData={checkData}
            checksInfo={checksInfo}
            spaceId={spaceId}
            repoId={repoId}
            {...routingProps}
          />

          {!pullReqMetadata?.merged && (
            <PullRequestMergeSection
              unchecked={unchecked}
              mergeable={mergeable}
              pullReqMetadata={pullReqMetadata}
              conflictingFiles={conflictingFiles}
            />
          )}
        </Accordion.Root>
      </StackedList.Item>
    </StackedList.Root>
  )
}

export { PullRequestPanel }
