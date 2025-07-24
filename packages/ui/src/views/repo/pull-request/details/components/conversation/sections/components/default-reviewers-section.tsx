import { FC, useMemo } from 'react'

import { IconV2, StackedList, StatusBadge } from '@/components'
import {
  DefaultReviewersApprovalsData,
  DefaultReviewersDataProps,
  getDefaultReviewersApprovalCount,
  PrincipalInfoWithReviewDecision,
  PullReqReviewDecision
} from '@/views'
import { isEmpty } from 'lodash-es'

import { AvatarItem, HeaderItem } from './commons'

interface DefaultReviewersSectionProps {
  defaultReviewersData?: DefaultReviewersDataProps
}

export const DefaultReviewersSection: FC<DefaultReviewersSectionProps> = ({ defaultReviewersData }) => {
  const {
    defReviewerLatestApprovalRequiredByRule = false,
    defReviewerApprovalRequiredByRule = false,
    defReviewerApprovedChanges = false,
    defReviewerApprovedLatestChanges = false,
    defaultReviewersApprovals = [],
    updatedDefaultApprovals = []
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
  }, [
    defReviewerLatestApprovalRequiredByRule,
    defReviewerApprovalRequiredByRule,
    defReviewerApprovedChanges,
    defReviewerApprovedLatestChanges
  ])

  if (isEmpty(defaultReviewersApprovals)) {
    return null
  }

  return (
    <>
      {(defReviewerApprovalRequiredByRule || defReviewerLatestApprovalRequiredByRule) && (
        <div className="ml-6 flex items-center justify-between">
          {defaultReviewerStatus}
          <StatusBadge variant="secondary">Required</StatusBadge>
        </div>
      )}
      <div className="ml-6 bg-inherit">
        <StackedList.Root className="ml-2 cursor-default border-transparent bg-inherit">
          <StackedList.Item isHeader disableHover className="text-cn-foreground-3 cursor-default !bg-transparent px-0">
            <StackedList.Field title={<HeaderItem header="Required" />} />
            <StackedList.Field title={<HeaderItem header="Default reviewers" />} />
            <StackedList.Field title={<HeaderItem header="Changes requested by" />} />
            <StackedList.Field title={<HeaderItem header="Approved by" />} />
          </StackedList.Item>
          {updatedDefaultApprovals
            ?.filter(
              (data: DefaultReviewersApprovalsData) => data.minimum_required_count || data.minimum_required_count_latest
            ) // only consider response with min default reviewers required (>0)
            .map((data: DefaultReviewersApprovalsData, index: number) => {
              // changes requested by default reviewers
              const defaultReviewersChangeRequested = (data?.principals as PrincipalInfoWithReviewDecision[])?.filter(
                principal => principal?.review_decision === PullReqReviewDecision.changeReq
              )

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
    </>
  )
}
