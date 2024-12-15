import { useEffect, useMemo, useState } from 'react'

import {
  Accordion,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  Layout,
  StackedList,
  Text
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
          <Text className="flex items-center gap-2 space-x-2" weight="medium">
            <Text>{`${props?.pullReqMetadata?.merger?.display_name} merged branch`}</Text>
            <Button variant="secondary" size="xs">
              <Icon name="branch" size={12} className="mr-1 text-tertiary-background" />
              {props?.pullReqMetadata?.source_branch}
            </Button>
            <Text>{'into'}</Text>
            <Button variant="secondary" size="xs">
              <Icon name="branch" size={12} className="mr-1 text-tertiary-background" />
              {props?.pullReqMetadata?.target_branch}
            </Button>
            <Text>{formattedTime}</Text>
          </Text>
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
            <Text size={1} className="text-destructive">
              {props.headerMsg}
            </Text>
          </div>
        )}
      </>
    )
  }
  return (
    <div className="inline-flex items-center gap-2">
      <Text weight="medium">
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
  headerMsg
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
      <StackedList.Item className="items-center" isHeader disableHover>
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
                      <Text size={1} className="text-primary">
                        Bypass and merge anyway
                      </Text>
                    </Layout.Horizontal>
                  )}
                  <Button
                    variant="split"
                    size="xs_split"
                    theme={
                      mergeable && !ruleViolation
                        ? 'success'
                        : checksInfo.status === 'pending' || checksInfo.status === 'running'
                          ? 'warning'
                          : 'error'
                    }
                    disabled={!checkboxBypass && ruleViolation}
                    onClick={actions[0]?.action}
                    dropdown={
                      <DropdownMenu>
                        <DropdownMenuTrigger insideSplitButton>
                          <Icon name="chevron-down" size={11} className="chevron-down" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="mt-1">
                          <DropdownMenuGroup>
                            {actions &&
                              actions.map((action, action_idx) => {
                                return (
                                  <DropdownMenuItem onClick={action.action} key={action_idx}>
                                    <div className="flex flex-col">
                                      <Text color="primary">{action.title}</Text>
                                      <Text color="tertiaryBackground">{action.description}</Text>
                                    </div>
                                  </DropdownMenuItem>
                                )
                              })}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    }
                  >
                    Squash and merge
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
