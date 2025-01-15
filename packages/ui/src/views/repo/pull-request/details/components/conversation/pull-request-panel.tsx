import { useEffect, useMemo, useState } from 'react'

import {
  Accordion,
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  Icon,
  Layout,
  StackedList
} from '@components/index'
import { cn } from '@utils/cn'
import { timeAgo } from '@utils/utils'
import { TypesPullReq } from '@views/repo/pull-request/pull-request.types'

import {
  EnumCheckStatus,
  MergeCheckStatus,
  PullRequestAction,
  PullRequestChangesSectionProps,
  PullRequestFilterOption,
  PullRequestState,
  TypesPullReqCheck,
  TypesRuleViolations
} from '../../pull-request-details-types'
import { extractInfoFromRuleViolationArr } from '../../pull-request-utils'
import PullRequestChangesSection from './sections/pull-request-changes-section'
import PullRequestCheckSection from './sections/pull-request-checks-section'
import PullRequestCommentSection from './sections/pull-request-comment-section'
import PullRequestMergeSection from './sections/pull-request-merge-section'

interface PullRequestPanelProps extends PullRequestChangesSectionProps {
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
  onCommitSuggestions
}: PullRequestPanelProps) => {
  const mergeable = useMemo(() => pullReqMetadata?.merge_check_status === MergeCheckStatus.MERGEABLE, [pullReqMetadata])
  const isClosed = pullReqMetadata?.state === PullRequestState.CLOSED
  const isOpen = pullReqMetadata?.state === PullRequestState.OPEN
  //   const isConflict = pullReqMetadata?.merge_check_status === MergeCheckStatus.CONFLICT
  const isDraft = pullReqMetadata?.is_draft
  const unchecked = useMemo(
    () => pullReqMetadata?.merge_check_status === MergeCheckStatus.UNCHECKED && !isClosed,
    [pullReqMetadata, isClosed]
  )
  const checkData = checks || []
  const [notBypassable, setNotBypassable] = useState(false)

  useEffect(() => {
    if (ruleViolationArr && !isDraft && ruleViolationArr.data.rule_violations) {
      const { checkIfBypassAllowed } = extractInfoFromRuleViolationArr(ruleViolationArr.data.rule_violations)
      setNotBypassable(checkIfBypassAllowed)
    }
  }, [ruleViolationArr])

  return (
    <StackedList.Root>
      <StackedList.Item className="items-center py-2.5" disableHover>
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
                <Layout.Horizontal className="items-center justify-center">
                  {commitSuggestionsBatchCount > 0 ? (
                    <Button variant={'outline'} onClick={() => onCommitSuggestions()}>
                      {`Commit suggestion (${commitSuggestionsBatchCount})`}
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
                  <Button
                    variant={actions && !pullReqMetadata?.closed ? 'split' : 'default'}
                    size={actions && !pullReqMetadata?.closed ? 'xs_split' : 'xs'}
                    theme={
                      mergeable && !ruleViolation && !pullReqMetadata?.is_draft && !pullReqMetadata?.closed
                        ? 'success'
                        : pullReqMetadata?.is_draft || pullReqMetadata?.closed
                          ? 'primary'
                          : checksInfo.status === 'pending' || checksInfo.status === 'running'
                            ? 'warning'
                            : 'error'
                    }
                    disabled={!checkboxBypass && ruleViolation}
                    onClick={actions[0]?.action}
                    dropdown={
                      actions && (
                        <DropdownMenu>
                          <DropdownMenuTrigger insideSplitButton>
                            <Icon name="chevron-down" size={11} className="chevron-down" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="mt-1 max-w-80" align="end">
                            {/* TODO: it is required to add the state by which the current active action will be determined */}
                            <DropdownMenuRadioGroup value={actions[0]?.id}>
                              {actions.map((action, action_idx) => {
                                return (
                                  <DropdownMenuRadioItem
                                    className="items-start"
                                    value={action.id}
                                    onClick={action.action}
                                    key={action_idx}
                                  >
                                    <div className="flex flex-col">
                                      <span className="leading-none text-foreground-8">{action.title}</span>
                                      <span className="mt-1.5 text-foreground-4">{action.description}</span>
                                    </div>
                                  </DropdownMenuRadioItem>
                                )
                              })}
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )
                    }
                  >
                    {pullReqMetadata?.closed
                      ? 'Open for review'
                      : pullReqMetadata?.is_draft
                        ? 'Ready for review'
                        : 'Squash and merge'}
                  </Button>
                </Layout.Horizontal>
              )
            }
          />
        )}
      </StackedList.Item>
      <StackedList.Item disableHover className="cursor-default py-0 hover:bg-transparent">
        <Accordion type="multiple" className="w-full">
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
          <PullRequestCheckSection checkData={checkData} checksInfo={checksInfo} spaceId={spaceId} repoId={repoId} />

          {!pullReqMetadata?.merged && (
            <PullRequestMergeSection
              unchecked={unchecked}
              mergeable={mergeable}
              pullReqMetadata={pullReqMetadata}
              conflictingFiles={conflictingFiles}
            />
          )}
        </Accordion>
      </StackedList.Item>
    </StackedList.Root>
  )
}

export { PullRequestPanel }
