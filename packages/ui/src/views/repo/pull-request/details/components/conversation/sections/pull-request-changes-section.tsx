import { Accordion, Avatar, AvatarFallback, Badge, Icon, Layout, StackedList } from '@/components'
import {
  easyPluralize,
  TypesCodeOwnerEvaluation,
  TypesCodeOwnerEvaluationEntry,
  TypesOwnerEvaluation,
  TypesPullReqReviewer,
  TypesUserGroupOwnerEvaluation
} from '@/views'
import { cn } from '@utils/cn'
import { getInitials } from '@utils/stringUtils'
import { isEmpty } from 'lodash-es'

import { LineDescription, LineTitle } from './pull-request-line-title'

interface PullRequestChangesSectionProps {
  changesInfo: { header: string; content: string; status: string }
  minApproval?: number
  codeOwners?: TypesCodeOwnerEvaluation | null
  minReqLatestApproval?: number
  approvedEvaluations?: TypesPullReqReviewer[]
  changeReqEvaluations?: TypesPullReqReviewer[]
  latestApprovalArr?: TypesPullReqReviewer[]
  reqNoChangeReq?: boolean
  changeReqReviewer?: string
  codeOwnerChangeReqEntries?: (
    | {
        owner_evaluations: TypesOwnerEvaluation[]
        line_number?: number
        pattern?: string
        user_group_owner_evaluations?: TypesUserGroupOwnerEvaluation[] | null
      }
    | undefined
  )[]
  reqCodeOwnerApproval?: boolean
  reqCodeOwnerLatestApproval?: boolean
  codeOwnerPendingEntries?: TypesCodeOwnerEvaluationEntry[]
  codeOwnerApprovalEntries?: (
    | {
        owner_evaluations: TypesOwnerEvaluation[]
        line_number?: number
        pattern?: string
        user_group_owner_evaluations?: TypesUserGroupOwnerEvaluation[] | null
      }
    | undefined
  )[]
  latestCodeOwnerApprovalArr?: (
    | {
        entryEvaluation: TypesOwnerEvaluation[]
      }
    | undefined
  )[]
}
interface AvatarItemProps {
  evaluations: TypesOwnerEvaluation[] | undefined
}
interface HeaderItemProps {
  header: string
}
const HeaderItem: React.FC<HeaderItemProps> = ({ header }: HeaderItemProps) => {
  return <span className="text-12 text-foreground-1">{header}</span>
}

const AvatarItem: React.FC<AvatarItemProps> = ({ evaluations }: AvatarItemProps) => {
  return (
    <StackedList.Field
      className="pb-0"
      title={
        <div className="flex items-center">
          {evaluations &&
            evaluations.map(({ owner }, idx) => {
              if (idx < 2) {
                return (
                  <Avatar key={owner?.id} className="size-6 rounded-full">
                    <AvatarFallback>
                      <span className="text-12 text-foreground-1">
                        {owner?.display_name && getInitials(owner?.display_name)}
                      </span>
                    </AvatarFallback>
                  </Avatar>
                )
              }
              if (idx === 2 && evaluations.length && evaluations.length > 2) {
                // TODO: do popover with all the names
                return <span key={owner?.id} className="text-12">{`+${evaluations.length - 2}`}</span>
              }
              return null
            })}
        </div>
      }
    />
  )
}

const PullRequestChangesSection = ({
  changesInfo,
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
  latestCodeOwnerApprovalArr
}: PullRequestChangesSectionProps) => {
  // TODO: consider when states change like refetchReviewers
  // refetchCodeOwners

  const getStatusIcon = (status: string) => {
    switch (status) {
      // TODO: fix icons to use from nucleo
      case 'pending':
        return <Icon name="pending-clock" className="text-icons-alert" />
      case 'warning':
        return <Icon name="triangle-warning" className="text-tertiary-background" />
      case 'error':
        return <Icon name="triangle-warning" className="text-destructive" />
      default:
        return <Icon name="success" className="text-success" />
    }
  }

  // TODO: refactoring of icon styles is required
  function renderCodeOwnerStatus() {
    if (codeOwnerPendingEntries && codeOwnerPendingEntries?.length > 0 && reqCodeOwnerLatestApproval) {
      return (
        <div className="flex items-center gap-x-2">
          <Icon name="circle" className="text-warning" />
          <span className="text-14 text-foreground-1">Waiting on code owner reviews of latest changes</span>
        </div>
      )
    }

    if (codeOwnerPendingEntries && codeOwnerPendingEntries?.length > 0 && reqCodeOwnerApproval) {
      return (
        <div className="flex items-center gap-x-2">
          <Icon name="circle" className="text-warning" />
          <span className="text-14 text-foreground-1">Changes are pending approval from code owners</span>
        </div>
      )
    }

    if (
      codeOwnerPendingEntries &&
      codeOwnerApprovalEntries &&
      codeOwnerApprovalEntries?.length > 0 &&
      codeOwnerPendingEntries?.length > 0
    ) {
      return (
        <div className="flex items-center gap-x-2">
          <Icon name="circle" className="text-tertiary-background" />
          <span className="text-14 text-foreground-1">Some changes were approved by code owners</span>
        </div>
      )
    }
    if (latestCodeOwnerApprovalArr && latestCodeOwnerApprovalArr?.length > 0 && reqCodeOwnerLatestApproval) {
      return (
        <div className="flex items-center gap-x-2">
          <Icon name="success" className="text-success" />
          <span className="text-14 text-foreground-1">Latest changes were approved by code owners</span>
        </div>
      )
    }
    if (codeOwnerApprovalEntries && codeOwnerApprovalEntries?.length > 0 && reqCodeOwnerApproval) {
      return (
        <div className="flex items-center gap-x-2">
          <Icon name="success" className="text-success" />
          <span className="text-14 text-foreground-1">Changes were approved by code owners</span>
        </div>
      )
    }
    if (codeOwnerApprovalEntries && codeOwnerApprovalEntries?.length > 0) {
      if (
        reqCodeOwnerLatestApproval &&
        minReqLatestApproval &&
        latestCodeOwnerApprovalArr &&
        latestCodeOwnerApprovalArr.length < minReqLatestApproval
      ) {
        return (
          <div className="flex items-center gap-x-2">
            <Icon name="pending-clock" className="text-icons-alert" />
            <span className="text-14 text-foreground-1">
              Latest changes are pending approval from required reviewers
            </span>
          </div>
        )
      }
      return (
        <div className="flex items-center gap-x-2">
          <Icon name="circle" className="text-warning" />
          <span className="text-14 text-foreground-1">Changes were approved by code owners</span>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-x-2">
        <Icon name="circle" className="text-tertiary-background" />
        <span className="text-14 text-foreground-1">No codeowner reviews</span>
      </div>
    )
  }

  const viewBtn =
    (minApproval && minApproval > 0 && !isEmpty(approvedEvaluations)) ||
    (minReqLatestApproval && minReqLatestApproval > 0 && !isEmpty(latestApprovalArr)) ||
    !isEmpty(changeReqEvaluations) ||
    (!isEmpty(codeOwners) && !isEmpty(codeOwners?.evaluation_entries))
  return (
    <Accordion.Item value="item-1">
      <Accordion.Trigger
        className="text-left"
        hideChevron={!viewBtn}
        onClick={e => {
          if (!viewBtn) e.preventDefault()
        }}
      >
        <StackedList.Field
          className="gap-y-1"
          title={<LineTitle text={changesInfo.header} icon={getStatusIcon(changesInfo.status)} />}
          description={<LineDescription text={changesInfo.content} />}
        />
        {viewBtn && <span className="px-2 py-1.5 text-14 text-foreground-2">Show more</span>}
      </Accordion.Trigger>

      <Accordion.Content>
        <Layout.Vertical gap={'gap-y-2'}>
          {((minApproval ?? 0) > (minReqLatestApproval ?? 0) ||
            (!isEmpty(approvedEvaluations) && minReqLatestApproval === 0 && minApproval && minApproval > 0) ||
            ((minApproval ?? 0) > 0 && minReqLatestApproval === undefined)) && (
            <div className="ml-6 flex items-center justify-between">
              {approvedEvaluations && minApproval && minApproval <= approvedEvaluations?.length ? (
                <div className="flex items-center gap-x-2">
                  <Icon name="success" className="text-icons-success" />
                  <span className="text-14 text-foreground-1">
                    {`Changes were approved by ${approvedEvaluations?.length} ${easyPluralize(approvedEvaluations?.length, 'reviewer', 'reviewers')}`}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-x-2">
                  <Icon name="circle" className="fill-transparent text-icons-7" />
                  <span className="text-14 text-foreground-1">
                    {`${(approvedEvaluations && approvedEvaluations.length) || '0'}/${minApproval} approvals completed`}
                  </span>
                </div>
              )}
              <Badge variant="quaternary" borderRadius="full" size="xl" disableHover>
                Required
              </Badge>
            </div>
          )}

          {(minReqLatestApproval ?? 0) > 0 && (
            <div className="ml-6 flex items-center justify-between">
              {latestApprovalArr !== undefined &&
              minReqLatestApproval !== undefined &&
              minReqLatestApproval <= latestApprovalArr?.length ? (
                <div className="flex items-center gap-x-2">
                  <Icon name="success" className="text-icons-success" />
                  <span className="text-14 text-foreground-1">{`Latest changes were approved by ${latestApprovalArr?.length || minReqLatestApproval || ''} ${easyPluralize(latestApprovalArr?.length || minReqLatestApproval, 'reviewer', 'reviewers')}`}</span>
                </div>
              ) : (
                <div className="flex items-center gap-x-2">
                  <Icon name="circle" className="fill-transparent text-icons-7" />
                  <span className="text-14 text-foreground-1">
                    {`${latestApprovalArr?.length || minReqLatestApproval || ''} ${easyPluralize(latestApprovalArr?.length || minReqLatestApproval || 0, 'approval', 'approvals')} pending on latest changes`}
                  </span>
                </div>
              )}
              <Badge variant="quaternary" borderRadius="full" size="xl" disableHover>
                Required
              </Badge>
            </div>
          )}

          {!isEmpty(changeReqEvaluations) && (
            <div className="ml-6 flex items-center justify-between">
              <div className="flex items-center gap-x-2">
                <Icon
                  name="triangle-warning"
                  className={cn({
                    'text-icons-danger': reqNoChangeReq,
                    'text-icons-alert': !reqNoChangeReq
                  })}
                />
                <span className="text-14 text-foreground-1">{`${changeReqReviewer} requested changes to the pull request`}</span>
              </div>
              {reqNoChangeReq && (
                <Badge variant="quaternary" borderRadius="full" size="xl" disableHover>
                  Required
                </Badge>
              )}
            </div>
          )}

          {!isEmpty(codeOwners) && !isEmpty(codeOwners.evaluation_entries) && (
            <div className="ml-6 flex items-center justify-between">
              {codeOwnerChangeReqEntries && codeOwnerChangeReqEntries?.length > 0 ? (
                <div className="flex items-center gap-x-2">
                  <Icon
                    name="triangle-warning"
                    className={cn({
                      'text-icons-danger': reqCodeOwnerApproval || reqCodeOwnerLatestApproval,
                      'text-icons-alert': !reqCodeOwnerApproval || !reqCodeOwnerLatestApproval
                    })}
                  />
                  <span className="text-14 text-foreground-1">
                    {'Code owners requested changes to the pull request'}
                  </span>
                </div>
              ) : (
                renderCodeOwnerStatus()
              )}
              {(reqCodeOwnerApproval || reqCodeOwnerLatestApproval) && (
                <Badge variant="quaternary" borderRadius="full" size="xl" disableHover>
                  Required
                </Badge>
              )}
            </div>
          )}
          {/* TODO: add codeowners table */}
          {codeOwners && !isEmpty(codeOwners?.evaluation_entries) && (
            <div className="ml-6 bg-inherit">
              <StackedList.Root className="ml-2 cursor-default border-transparent bg-inherit">
                <StackedList.Item
                  isHeader
                  disableHover
                  className="cursor-default !bg-transparent px-0 text-tertiary-background"
                >
                  <StackedList.Field title={<HeaderItem header="Code" />} />
                  <StackedList.Field title={<HeaderItem header="Owners" />} />
                  <StackedList.Field title={<HeaderItem header="Changes requested by" />} />
                  <StackedList.Field title={<HeaderItem header="Approved by" />} />
                </StackedList.Item>

                {codeOwners?.evaluation_entries?.map(entry => {
                  const changeReqEvaluations = entry?.owner_evaluations?.filter(
                    evaluation => evaluation.review_decision === 'changereq'
                  )
                  const approvedEvaluations = entry?.owner_evaluations?.filter(
                    evaluation => evaluation.review_decision === 'approved'
                  )
                  return (
                    <StackedList.Item key={entry.pattern} disableHover className="px-0 pb-0">
                      <StackedList.Field title={entry?.pattern} />
                      {entry?.owner_evaluations && <AvatarItem evaluations={entry?.owner_evaluations} />}
                      {changeReqEvaluations && <AvatarItem evaluations={changeReqEvaluations} />}
                      {approvedEvaluations && <AvatarItem evaluations={approvedEvaluations} />}
                    </StackedList.Item>
                  )
                })}
              </StackedList.Root>
            </div>
          )}
        </Layout.Vertical>
      </Accordion.Content>
    </Accordion.Item>
  )
}

export default PullRequestChangesSection
