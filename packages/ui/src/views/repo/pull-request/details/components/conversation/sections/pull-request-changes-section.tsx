import { useMemo, type FC } from 'react'

import { Accordion, Avatar, Icon, Layout, StackedList, StatusBadge } from '@/components'
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
import { PanelAccordionShowButton } from '@views/repo/pull-request/details/components/conversation/sections/panel-accordion-show-button'
import { isEmpty } from 'lodash-es'

import { LineDescription, LineTitle } from './pull-request-line-title'

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Icon name="pending-clock" className="text-icons-alert" />
    case 'warning':
      return <Icon name="triangle-warning" className="text-cn-foreground-3" />
    case 'error':
      return <Icon name="triangle-warning" className="text-cn-foreground-danger" />
    default:
      return <Icon name="success" className="text-cn-foreground-success" />
  }
}

interface HeaderItemProps {
  header: string
}

const HeaderItem: FC<HeaderItemProps> = ({ header }) => {
  return <span className="text-1 text-cn-foreground-1">{header}</span>
}

interface AvatarItemProps {
  evaluations?: TypesOwnerEvaluation[]
}

const AvatarItem: FC<AvatarItemProps> = ({ evaluations }) => {
  return (
    <StackedList.Field
      className="pb-0"
      title={
        <div className="flex items-center">
          {evaluations &&
            evaluations.map(({ owner }, idx) => {
              if (idx < 2) {
                return <Avatar key={owner?.id || idx} name={owner?.display_name || ''} size="default" rounded />
              }
              if (idx === 2 && evaluations?.length > 2) {
                // TODO: do popover with all the names
                return (
                  <span key={owner?.id} className="text-1">
                    +{evaluations.length - 2}
                  </span>
                )
              }
              return null
            })}
        </div>
      }
    />
  )
}

const ACCORDION_VALUE = 'item-1'

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
  accordionValues: string[]
}

const PullRequestChangesSection: FC<PullRequestChangesSectionProps> = ({
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
  latestCodeOwnerApprovalArr,
  accordionValues
}) => {
  // TODO: consider when states change like refetchReviewers
  // refetchCodeOwners

  const codeOwnerStatus = useMemo(() => {
    const getData = () => {
      if (!!codeOwnerPendingEntries?.length && reqCodeOwnerLatestApproval) {
        return {
          icon: <Icon name="circle" className="text-cn-foreground-warning" />,
          text: 'Waiting on code owner reviews of latest changes'
        }
      }

      if (!!codeOwnerPendingEntries?.length && reqCodeOwnerApproval) {
        return {
          icon: <Icon name="circle" className="text-cn-foreground-warning" />,
          text: 'Changes are pending approval from code owners'
        }
      }

      if (!!codeOwnerApprovalEntries?.length && !!codeOwnerPendingEntries?.length) {
        return {
          icon: <Icon name="circle" className="text-cn-foreground-3" />,
          text: 'Some changes were approved by code owners'
        }
      }

      if (!!latestCodeOwnerApprovalArr?.length && reqCodeOwnerLatestApproval) {
        return {
          icon: <Icon name="success" className="text-cn-foreground-success" />,
          text: 'Latest changes were approved by code owners'
        }
      }

      if (!!codeOwnerApprovalEntries?.length && reqCodeOwnerApproval) {
        return {
          icon: <Icon name="success" className="text-cn-foreground-success" />,
          text: 'Changes were approved by code owners'
        }
      }

      if (codeOwnerApprovalEntries?.length) {
        if (
          reqCodeOwnerLatestApproval &&
          minReqLatestApproval &&
          latestCodeOwnerApprovalArr &&
          latestCodeOwnerApprovalArr?.length < minReqLatestApproval
        ) {
          return {
            icon: <Icon name="pending-clock" className="text-icons-alert" />,
            text: 'Latest changes are pending approval from required reviewers'
          }
        }

        return {
          icon: <Icon name="circle" className="text-cn-foreground-warning" />,
          text: 'Changes were approved by code owners'
        }
      }

      return {
        icon: <Icon name="circle" className="text-cn-foreground-warning" />,
        text: 'No codeowner reviews'
      }
    }

    const data = getData()

    return (
      <div className="flex items-center gap-x-2">
        {data.icon}
        <span className="text-2 text-cn-foreground-1">{data.text}</span>
      </div>
    )
  }, [
    codeOwnerPendingEntries,
    reqCodeOwnerLatestApproval,
    codeOwnerApprovalEntries,
    latestCodeOwnerApprovalArr,
    minReqLatestApproval,
    reqCodeOwnerApproval
  ])

  const viewBtn =
    (minApproval && minApproval > 0) ||
    (minReqLatestApproval && minReqLatestApproval > 0) ||
    !isEmpty(changeReqEvaluations) ||
    (!isEmpty(codeOwners) && !isEmpty(codeOwners?.evaluation_entries))

  return (
    <Accordion.Item value={ACCORDION_VALUE}>
      <Accordion.Trigger
        className={cn('py-3', { '[&>.cn-accordion-trigger-indicator]:hidden': !viewBtn })}
        onClick={e => {
          if (!viewBtn) e.preventDefault()
        }}
      >
        <StackedList.Field
          className="flex gap-y-1"
          title={<LineTitle text={changesInfo.header} icon={getStatusIcon(changesInfo.status)} />}
          description={<LineDescription text={changesInfo.content} />}
        />
        <PanelAccordionShowButton isShowButton={viewBtn} value={ACCORDION_VALUE} accordionValues={accordionValues} />
      </Accordion.Trigger>

      <Accordion.Content>
        <Layout.Vertical gap={'gap-y-2'}>
          {((minApproval ?? 0) > (minReqLatestApproval ?? 0) ||
            (!isEmpty(approvedEvaluations) && minReqLatestApproval === 0 && minApproval && minApproval > 0) ||
            ((minApproval ?? 0) > 0 && minReqLatestApproval === undefined)) && (
            <div className="ml-6 flex items-center justify-between">
              {approvedEvaluations && minApproval && minApproval <= approvedEvaluations?.length ? (
                <div className="flex items-center gap-x-2">
                  <Icon name="success" className="text-cn-foreground-success" />
                  <span className="text-2 text-cn-foreground-1">
                    {`Changes were approved by ${approvedEvaluations?.length} ${easyPluralize(approvedEvaluations?.length, 'reviewer', 'reviewers')}`}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-x-2">
                  <Icon name="circle" className="fill-transparent text-icons-7" />
                  <span className="text-2 text-cn-foreground-1">
                    {`${(approvedEvaluations && approvedEvaluations.length) || '0'}/${minApproval} approvals completed`}
                  </span>
                </div>
              )}
              <StatusBadge variant="secondary">Required</StatusBadge>
            </div>
          )}

          {(minReqLatestApproval ?? 0) > 0 && (
            <div className="ml-6 flex items-center justify-between">
              {latestApprovalArr !== undefined &&
              minReqLatestApproval !== undefined &&
              minReqLatestApproval <= latestApprovalArr?.length ? (
                <div className="flex items-center gap-x-2">
                  <Icon name="success" className="text-cn-foreground-success" />
                  <span className="text-2 text-cn-foreground-1">{`Latest changes were approved by ${latestApprovalArr?.length || minReqLatestApproval || ''} ${easyPluralize(latestApprovalArr?.length || minReqLatestApproval, 'reviewer', 'reviewers')}`}</span>
                </div>
              ) : (
                <div className="flex items-center gap-x-2">
                  <Icon name="circle" className="fill-transparent text-icons-7" />
                  <span className="text-2 text-cn-foreground-1">
                    {`${latestApprovalArr?.length || minReqLatestApproval || ''} ${easyPluralize(latestApprovalArr?.length || minReqLatestApproval || 0, 'approval', 'approvals')} pending on latest changes`}
                  </span>
                </div>
              )}
              <StatusBadge variant="secondary">Required</StatusBadge>
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
                <span className="text-2 text-cn-foreground-1">{`${changeReqReviewer} requested changes to the pull request`}</span>
              </div>
              {reqNoChangeReq && <StatusBadge variant="secondary">Required</StatusBadge>}
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
                  <span className="text-2 text-cn-foreground-1">
                    {'Code owners requested changes to the pull request'}
                  </span>
                </div>
              ) : (
                codeOwnerStatus
              )}
              {(reqCodeOwnerApproval || reqCodeOwnerLatestApproval) && (
                <StatusBadge variant="secondary">Required</StatusBadge>
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
                  className="cursor-default !bg-transparent px-0 text-cn-foreground-3"
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
