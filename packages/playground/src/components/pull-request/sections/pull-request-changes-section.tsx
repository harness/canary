import { CheckCircleSolid } from '@harnessio/icons-noir'
import React from 'react'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Avatar,
  AvatarFallback,
  Icon,
  StackedList,
  Text
} from '@harnessio/canary'
import { LineDescription, LineTitle } from '../pull-request-line-title'
import { isEmpty } from 'lodash-es'
import cx from 'classnames'
import {
  TypesCodeOwnerEvaluation,
  TypesCodeOwnerEvaluationEntry,
  TypesOwnerEvaluation,
  TypesPullReqReviewer,
  TypesUserGroupOwnerEvaluation
} from '../interfaces'
import { getInitials } from '../../../utils/utils'
import pluralize from 'pluralize'

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
  return (
    <Text size={0} color="tertiaryBackground">
      {header}
    </Text>
  )
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
                  <Avatar className={cx('w-6 h-6 rounded-full')}>
                    <AvatarFallback>
                      <Text size={1} color="tertiaryBackground">
                        {owner?.display_name && getInitials(owner?.display_name)}
                      </Text>
                    </AvatarFallback>
                  </Avatar>
                )
              }
              if (idx === 2 && evaluations.length && evaluations.length > 2) {
                // TODO: do popover with all the names
                return <Text size={0}>{`+${evaluations.length - 2}`}</Text>
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
        return <Icon name="pending-clock" className="text-warning" />
      case 'warning':
        return <Icon name="triangle-warning" className="text-tertiary-background" />
      case 'error':
        return <Icon name="triangle-warning" className="text-destructive" />
      default:
        return <Icon name="success" className="text-success" />
    }
  }
  function renderCodeOwnerStatus() {
    if (codeOwnerPendingEntries && codeOwnerPendingEntries?.length > 0 && reqCodeOwnerLatestApproval) {
      return (
        <div className="flex pl-2">
          <Icon name="circle" className="text-warning" />
          <Text className="pl-2 text-xs">{'Waiting on code owner reviews of latest changes'}</Text>
        </div>
      )
    }

    if (codeOwnerPendingEntries && codeOwnerPendingEntries?.length > 0 && reqCodeOwnerApproval) {
      return (
        <div className="flex pl-2">
          <Icon name="circle" className="text-warning" />
          <Text className="pl-2 text-xs">{`Changes are pending approval from code owners`}</Text>
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
        <div className="flex pl-2">
          <Icon name="circle" className="text-tertiary-background" />
          <Text className="pl-2 text-xs">{`Some changes were approved by code owners`}</Text>
        </div>
      )
    }
    if (latestCodeOwnerApprovalArr && latestCodeOwnerApprovalArr?.length > 0 && reqCodeOwnerLatestApproval) {
      return (
        <Text className="flex ml-2">
          <CheckCircleSolid className="text-success" />
          <Text className="pl-2 text-xs">{`Latest changes were approved by code owners`}</Text>
        </Text>
      )
    }
    if (codeOwnerApprovalEntries && codeOwnerApprovalEntries?.length > 0 && reqCodeOwnerApproval) {
      return (
        <Text className="flex ml-2">
          <CheckCircleSolid className="text-success" />
          <Text className="pl-2 text-xs">{`Changes were approved by code owners`}</Text>
        </Text>
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
          <div className="flex pl-2">
            <Icon name="pending-clock" className="text-warning" />
            <Text className="pl-2 text-xs">{`Latest changes are pending approval from required reviewers`}</Text>
          </div>
        )
      }
      return (
        <div className="flex pl-2">
          <Icon name="circle" className="text-warning" />
          <Text className="pl-2 text-xs">{`Changes were approved by code owners`}</Text>
        </div>
      )
    }

    return (
      <div className="flex pl-2">
        <Icon name="circle" className="text-tertiary-background" />

        <Text className="pl-2 text-xs">{`No codeowner reviews`}</Text>
      </div>
    )
  }

  const viewBtn =
    (minApproval && minReqLatestApproval && minApproval > minReqLatestApproval) ||
    (!isEmpty(approvedEvaluations) && minReqLatestApproval === 0) ||
    (minApproval && minApproval > 0 && minReqLatestApproval === undefined) ||
    (minReqLatestApproval && minReqLatestApproval > 0) ||
    !isEmpty(changeReqEvaluations) ||
    !isEmpty(codeOwners) ||
    false

  return (
    <AccordionItem value="item-1">
      <AccordionTrigger className="text-left">
        <StackedList.Field
          title={<LineTitle text={changesInfo.header} icon={getStatusIcon(changesInfo.status)} />}
          description={<LineDescription text={changesInfo.content} />}
        />
        {viewBtn && <Text className="text-xs px-2 py-1.5">Show more</Text>}
      </AccordionTrigger>
      <AccordionContent>
        <div>
          {((minApproval ?? 0) > (minReqLatestApproval ?? 0) ||
            (!isEmpty(approvedEvaluations) && minReqLatestApproval === 0 && minApproval && minApproval > 0) ||
            ((minApproval ?? 0) > 0 && minReqLatestApproval === undefined)) && (
            <div className="ml-4">
              <div className="flex pt-2 border-t mt-3 ml-2 items-center justify-between">
                {approvedEvaluations && minApproval && minApproval <= approvedEvaluations?.length ? (
                  <Text className="flex ml-2">
                    <CheckCircleSolid className="text-success" />
                    <Text className="pl-2 text-xs">
                      {`Changes were approved by ${approvedEvaluations?.length} ${pluralize('reviewers', approvedEvaluations?.length)}`}
                    </Text>
                  </Text>
                ) : (
                  <div className="flex ml-2">
                    <Icon name="circle" className="text-warning" />
                    <Text className="pl-2 text-xs">
                      {`${(approvedEvaluations && approvedEvaluations.length) || ''}/${minApproval} approvals completed`}
                    </Text>
                  </div>
                )}
                <div className="border rounded-full bg-transparent">
                  <Text className="text-xs text-tertiary-background px-2 py-1.5">required</Text>
                </div>
              </div>
            </div>
          )}

          {(minReqLatestApproval ?? 0) > 0 && (
            <div className="ml-4">
              <div className="flex pt-2 border-t mt-3 ml-2 items-center justify-between">
                {latestApprovalArr !== undefined &&
                minReqLatestApproval !== undefined &&
                minReqLatestApproval <= latestApprovalArr?.length ? (
                  <Text className="flex ml-2">
                    <CheckCircleSolid className="text-success" />
                    <Text className="pl-2 text-xs">{`Latest changes were approved by ${latestApprovalArr?.length || minReqLatestApproval || ''} ${pluralize('reviewer', latestApprovalArr?.length || minReqLatestApproval)}`}</Text>
                  </Text>
                ) : (
                  <div className="flex ml-2">
                    <Icon name="circle" className="text-warning" />
                    <Text className="pl-2 text-xs">
                      {`${latestApprovalArr?.length || minReqLatestApproval || ''} ${pluralize('approval', latestApprovalArr?.length || minReqLatestApproval)} pending on latest changes`}
                    </Text>
                  </div>
                )}
                <div className="border rounded-full bg-transparent">
                  <Text className="text-xs text-tertiary-background px-2 py-1.5">required</Text>
                </div>
              </div>
            </div>
          )}

          {!isEmpty(changeReqEvaluations) && (
            <div className="ml-4">
              <div className="flex pt-2 border-t mt-3 ml-2 items-center justify-between">
                <Text className="flex ml-2">
                  <Icon
                    name="triangle-warning"
                    className={cx('', {
                      'text-destructive': reqNoChangeReq,
                      'text-tertiary-background': !reqNoChangeReq
                    })}
                  />
                  <Text className="pl-2 text-xs">{`${changeReqReviewer} requested changes to the pull request`}</Text>
                </Text>
                {reqNoChangeReq && (
                  <div className="border rounded-full bg-transparent">
                    <Text className="text-xs text-tertiary-background px-2 py-1.5">required</Text>
                  </div>
                )}
              </div>
            </div>
          )}
          {!isEmpty(codeOwners) && !isEmpty(codeOwners.evaluation_entries) && (
            <div className="ml-4">
              <div className="flex pt-2 border-t mt-3 ml-2 items-center justify-between">
                {codeOwnerChangeReqEntries && codeOwnerChangeReqEntries?.length > 0 ? (
                  <Text className="flex ml-2">
                    <Icon
                      name="triangle-warning"
                      className={cx('', {
                        'text-destructive': reqCodeOwnerApproval || reqCodeOwnerLatestApproval,
                        'text-tertiary-background': !reqCodeOwnerApproval || !reqCodeOwnerLatestApproval
                      })}
                    />
                    <Text className="pl-2 text-xs">{'Code owners requested changes to the pull request'}</Text>
                  </Text>
                ) : (
                  renderCodeOwnerStatus()
                )}
                {(reqCodeOwnerApproval || reqCodeOwnerLatestApproval) && (
                  <div className="border rounded-full bg-transparent">
                    <Text className="text-xs text-tertiary-background px-2 py-1.5">required</Text>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* TODO: add codeowners table */}
          {codeOwners && !isEmpty(codeOwners?.evaluation_entries) && (
            <div className="ml-6 bg-inherit">
              <StackedList.Root className="bg-inherit cursor-default border-transparent ml-2">
                <StackedList.Item
                  isHeader
                  disableHover
                  className="cursor-default px-0 !bg-transparent text-tertiary-background">
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
                    <StackedList.Item disableHover className="px-0 pb-0">
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
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export default PullRequestChangesSection
