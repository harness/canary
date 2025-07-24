import { useMemo, type FC } from 'react'

import { Accordion, Avatar, AvatarTooltipProps, IconV2, Layout, StackedList, StatusBadge } from '@/components'
import {
  DefaultReviewersApprovalsData,
  easyPluralize,
  getDefaultReviewersApprovalCount,
  PrincipalInfoWithReviewDecision,
  PullReqReviewDecision,
  PullRequestChangesSectionProps,
  TypesOwnerEvaluation
} from '@/views'
import { cn } from '@utils/cn'
import { PanelAccordionShowButton } from '@views/repo/pull-request/details/components/conversation/sections/panel-accordion-show-button'
import { isEmpty } from 'lodash-es'

import { LineDescription, LineTitle } from './pull-request-line-title'

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <IconV2 name="clock-solid" className="text-cn-foreground-warning" />
    case 'warning':
      return <IconV2 name="warning-triangle-solid" className="text-cn-foreground-warning" />
    case 'error':
      return <IconV2 name="warning-triangle-solid" className="text-cn-foreground-danger" />
    default:
      return <IconV2 name="check-circle-solid" className="text-cn-foreground-success" />
  }
}

interface HeaderItemProps {
  header: string
}

const HeaderItem: FC<HeaderItemProps> = ({ header }) => {
  return <span className="text-1 text-cn-foreground-1">{header}</span>
}

interface AvatarUser {
  id?: number
  display_name?: string
  email?: string
}

interface AvatarItemProps {
  users?: AvatarUser[]
}

const AvatarItem: FC<AvatarItemProps> = ({ users }) => {
  return (
    <StackedList.Field
      className="pb-0"
      title={
        <div className="flex items-center">
          {users &&
            users.map((user, idx) => {
              if (idx < 2) {
                const tooltipProps: AvatarTooltipProps = {
                  side: 'top',
                  title: user?.display_name || '',
                  content: user?.email || user?.display_name || ''
                }
                return (
                  <Avatar
                    key={user?.id || idx}
                    name={user?.display_name || ''}
                    size="md"
                    rounded
                    tooltipProps={tooltipProps}
                  />
                )
              }
              if (idx === 2 && users?.length > 2) {
                // Get all emails from remaining users (index 2 and beyond)
                const remainingEmails = users
                  .slice(2)
                  .map(user => user?.email || user?.display_name || '')
                  .filter(Boolean)
                  .join(', ')

                const tooltipProps: AvatarTooltipProps = {
                  side: 'top',
                  content: remainingEmails
                }

                return <Avatar key={idx} name={`+ ${users.length - 2}`} size="md" rounded tooltipProps={tooltipProps} />
              }
              return null
            })}
        </div>
      }
    />
  )
}

const ACCORDION_VALUE = 'item-1'

const mapEvaluationsToUsers = (evaluations: TypesOwnerEvaluation[]): AvatarUser[] => {
  return evaluations.map(({ owner }) => ({
    id: owner?.id,
    display_name: owner?.display_name,
    email: owner?.email
  }))
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
  accordionValues,
  defaultReviewersData
}) => {
  // TODO: consider when states change like refetchReviewers
  // refetchCodeOwners

  const codeOwnerStatus = useMemo(() => {
    const getData = () => {
      if (!!codeOwnerPendingEntries?.length && reqCodeOwnerLatestApproval) {
        return {
          icon: <IconV2 name="circle" className="text-cn-foreground-warning" />,
          text: 'Waiting on code owner reviews of latest changes'
        }
      }

      if (!!codeOwnerPendingEntries?.length && reqCodeOwnerApproval) {
        return {
          icon: <IconV2 name="circle" className="text-cn-foreground-warning" />,
          text: 'Changes are pending approval from code owners'
        }
      }

      if (!!codeOwnerApprovalEntries?.length && !!codeOwnerPendingEntries?.length) {
        return {
          icon: <IconV2 name="circle" className="text-cn-foreground-3" />,
          text: 'Some changes were approved by code owners'
        }
      }

      if (!!latestCodeOwnerApprovalArr?.length && reqCodeOwnerLatestApproval) {
        return {
          icon: <IconV2 name="check-circle-solid" className="text-cn-foreground-success" />,
          text: 'Latest changes were approved by code owners'
        }
      }

      if (!!codeOwnerApprovalEntries?.length && reqCodeOwnerApproval) {
        return {
          icon: <IconV2 name="check-circle-solid" className="text-cn-foreground-success" />,
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
            icon: <IconV2 name="clock-solid" className="text-cn-foreground-warning" />,
            text: 'Latest changes are pending approval from required reviewers'
          }
        }

        return {
          icon: <IconV2 name="circle" className="text-cn-foreground-warning" />,
          text: 'Changes were approved by code owners'
        }
      }

      return {
        icon: <IconV2 name="circle" className="text-cn-foreground-warning" />,
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

  const {
    defReviewerLatestApprovalRequiredByRule = false,
    defReviewerApprovalRequiredByRule = false,
    defReviewerApprovedChanges = false,
    defReviewerApprovedLatestChanges = false,
    defaultReviewersApprovals = []
  } = defaultReviewersData || {}

  const defaultReviewerStatus = useMemo(() => {
    const getData = () => {
      if (defReviewerLatestApprovalRequiredByRule && !defReviewerApprovedLatestChanges) {
        return {
          icon: <IconV2 name="circle" className="text-cn-foreground-warning" />,
          text: "Waiting on default reviewer's reviews of latest changes"
        }
      }

      if (defReviewerApprovalRequiredByRule && !defReviewerApprovedChanges) {
        return {
          icon: <IconV2 name="circle" className="text-cn-foreground-warning" />,
          text: 'Changes are pending approval from default reviewers'
        }
      }

      if (defReviewerLatestApprovalRequiredByRule && defReviewerApprovedLatestChanges) {
        return {
          icon: <IconV2 name="check-circle-solid" className="text-cn-foreground-success" />,
          text: 'Latest changes were approved by default reviewers'
        }
      }

      if (defReviewerApprovalRequiredByRule && defReviewerApprovedChanges) {
        return {
          icon: <IconV2 name="check-circle-solid" className="text-cn-foreground-success" />,
          text: 'changes were approved by code owners'
        }
      }

      return {
        icon: <IconV2 name="check-circle-solid" className="text-cn-foreground-success" />,
        text: 'Default reviewers were added to the PR'
      }
    }

    const data = getData()

    return (
      <div className="flex items-center gap-x-2">
        {data.icon}
        <span className="text-2 text-cn-foreground-1">{data.text}</span>
      </div>
    )
  }, [defaultReviewersData])

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
        <Layout.Flex>
          <StackedList.Field
            className="flex gap-y-1"
            title={<LineTitle text={changesInfo.header} icon={getStatusIcon(changesInfo.status)} />}
            description={<LineDescription text={changesInfo.content} />}
          />
          <PanelAccordionShowButton isShowButton={viewBtn} value={ACCORDION_VALUE} accordionValues={accordionValues} />
        </Layout.Flex>
      </Accordion.Trigger>

      <Accordion.Content>
        <Layout.Vertical gap="xs">
          {((minApproval ?? 0) > (minReqLatestApproval ?? 0) ||
            (!isEmpty(approvedEvaluations) && minReqLatestApproval === 0 && minApproval && minApproval > 0) ||
            ((minApproval ?? 0) > 0 && minReqLatestApproval === undefined)) && (
            <div className="ml-6 flex items-center justify-between">
              {approvedEvaluations && minApproval && minApproval <= approvedEvaluations?.length ? (
                <div className="flex items-center gap-x-2">
                  <IconV2 name="check-circle-solid" className="text-cn-foreground-success" />
                  <span className="text-2 text-cn-foreground-1">
                    {`Changes were approved by ${approvedEvaluations?.length} ${easyPluralize(approvedEvaluations?.length, 'reviewer', 'reviewers')}`}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-x-2">
                  <IconV2 name="circle" className="text-icons-7 fill-transparent" />
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
                  <IconV2 name="clock-solid" className="text-cn-foreground-success" />
                  <span className="text-2 text-cn-foreground-1">{`Latest changes were approved by ${latestApprovalArr?.length || minReqLatestApproval || ''} ${easyPluralize(latestApprovalArr?.length || minReqLatestApproval, 'reviewer', 'reviewers')}`}</span>
                </div>
              ) : (
                <div className="flex items-center gap-x-2">
                  <IconV2 name="circle" className="text-icons-7 fill-transparent" />
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
                <IconV2
                  name="warning-triangle-solid"
                  className={cn({
                    'text-cn-foreground-danger': reqNoChangeReq,
                    'text-cn-foreground-warning': !reqNoChangeReq
                  })}
                />
                <span className="text-2 text-cn-foreground-1">{`${changeReqReviewer} requested changes to the pull request`}</span>
              </div>
              {reqNoChangeReq && <StatusBadge variant="secondary">Required</StatusBadge>}
            </div>
          )}

          {!isEmpty(defaultReviewersApprovals) &&
            (defaultReviewersData?.defReviewerApprovalRequiredByRule ||
              defaultReviewersData?.defReviewerLatestApprovalRequiredByRule) && (
              <div className="ml-6 flex items-center justify-between">
                {defaultReviewerStatus}
                {(defaultReviewersData?.defReviewerApprovalRequiredByRule ||
                  defaultReviewersData?.defReviewerLatestApprovalRequiredByRule) && (
                  <StatusBadge variant="secondary">Required</StatusBadge>
                )}
              </div>
            )}

          {!isEmpty(defaultReviewersApprovals) && (
            <div className="ml-6 bg-inherit">
              <StackedList.Root className="ml-2 cursor-default border-transparent bg-inherit">
                <StackedList.Item
                  isHeader
                  disableHover
                  className="text-cn-foreground-3 cursor-default !bg-transparent px-0"
                >
                  <StackedList.Field title={<HeaderItem header="Required" />} />
                  <StackedList.Field title={<HeaderItem header="Default reviewers" />} />
                  <StackedList.Field title={<HeaderItem header="Changes requested by" />} />
                  <StackedList.Field title={<HeaderItem header="Approved by" />} />
                </StackedList.Item>
                {defaultReviewersData?.updatedDefaultApprovals
                  ?.filter(
                    (data: DefaultReviewersApprovalsData) =>
                      data.minimum_required_count || data.minimum_required_count_latest
                  ) // only consider response with min default reviewers required (>0)
                  .map((data: DefaultReviewersApprovalsData, index: number) => {
                    // changes requested by default reviewers
                    const defaultReviewersChangeRequested = (
                      data?.principals as PrincipalInfoWithReviewDecision[]
                    )?.filter(principal => principal?.review_decision === PullReqReviewDecision.changeReq)

                    // approved by default reviewers
                    const defaultReviewersApproved = (data?.principals as PrincipalInfoWithReviewDecision[])?.filter(
                      principal => principal?.review_decision === PullReqReviewDecision.approved
                    )

                    return (
                      <StackedList.Item key={index} disableHover>
                        <StackedList.Field title={getDefaultReviewersApprovalCount(data)} />
                        {data?.principals && <AvatarItem users={data.principals} />}
                        {defaultReviewersChangeRequested && <AvatarItem users={defaultReviewersChangeRequested} />}
                        {defaultReviewersApproved && <AvatarItem users={defaultReviewersApproved} />}
                      </StackedList.Item>
                    )
                  })}
              </StackedList.Root>
            </div>
          )}

          {!isEmpty(codeOwners) && !isEmpty(codeOwners.evaluation_entries) && (
            <div className="ml-6 flex items-center justify-between">
              {codeOwnerChangeReqEntries && codeOwnerChangeReqEntries?.length > 0 ? (
                <div className="flex items-center gap-x-2">
                  <IconV2
                    name="warning-triangle-solid"
                    className={cn({
                      'text-cn-foreground-danger': reqCodeOwnerApproval || reqCodeOwnerLatestApproval,
                      'text-cn-foreground-warning': !reqCodeOwnerApproval || !reqCodeOwnerLatestApproval
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
                  className="text-cn-foreground-3 cursor-default !bg-transparent px-0"
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
                    <StackedList.Item key={entry.pattern} disableHover>
                      <StackedList.Field title={entry?.pattern} />
                      {entry?.owner_evaluations && (
                        <AvatarItem users={mapEvaluationsToUsers(entry?.owner_evaluations)} />
                      )}
                      {changeReqEvaluations && <AvatarItem users={mapEvaluationsToUsers(changeReqEvaluations)} />}
                      {approvedEvaluations && <AvatarItem users={mapEvaluationsToUsers(approvedEvaluations)} />}
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

PullRequestChangesSection.displayName = 'PullRequestChangesSection'

export default PullRequestChangesSection
