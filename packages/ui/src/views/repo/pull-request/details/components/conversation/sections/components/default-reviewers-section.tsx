import { FC, useMemo } from 'react'

import { IconV2, StatusBadge, Table } from '@/components'
import {
  DefaultReviewersApprovalsData,
  DefaultReviewersDataProps,
  getDefaultReviewersApprovalCount,
  PrincipalInfoWithReviewDecision,
  PullReqReviewDecision
} from '@/views'
import { isEmpty } from 'lodash-es'

import { AvatarItem } from './commons'

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
          icon: <IconV2 size="lg" color="warning" name="warning-triangle-solid" />,
          text: "Waiting on default reviewer's reviews of latest changes"
        }
      }

      if (defReviewerApprovalRequiredByRule && !defReviewerApprovedChanges) {
        return {
          icon: <IconV2 size="lg" color="warning" name="warning-triangle-solid" />,
          text: 'Changes are pending approval from default reviewers'
        }
      }

      if (defReviewerLatestApprovalRequiredByRule && defReviewerApprovedLatestChanges) {
        return {
          icon: <IconV2 size="lg" color="success" name="check-circle-solid" />,
          text: 'Latest changes were approved by default reviewers'
        }
      }

      if (defReviewerApprovalRequiredByRule && defReviewerApprovedChanges) {
        return {
          icon: <IconV2 size="lg" color="success" name="check-circle-solid" />,
          text: 'Changes were approved by default reviewers'
        }
      }

      return {
        icon: <IconV2 size="lg" color="success" name="check-circle-solid" />,
        text: 'Default reviewers were added to the PR'
      }
    }

    const data = getData()

    return (
      <div className="flex items-center gap-x-2">
        {data.icon}
        <span className="text-2 text-cn-1">{data.text}</span>
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
        <div className="flex items-center justify-between">
          {defaultReviewerStatus}
          <StatusBadge variant="outline">Required</StatusBadge>
        </div>
      )}
      <div className="bg-inherit">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head className="w-[17.125rem]">Required</Table.Head>
              <Table.Head className="w-[11rem]">Default reviewers</Table.Head>
              <Table.Head className="w-[11rem]">Changes requested by</Table.Head>
              <Table.Head className="w-[11rem]">Approved by</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {updatedDefaultApprovals
              ?.filter(
                (data: DefaultReviewersApprovalsData) =>
                  data.minimum_required_count || data.minimum_required_count_latest
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
                  <Table.Row key={index} className="cursor-pointer">
                    <Table.Cell>{getDefaultReviewersApprovalCount(data)}</Table.Cell>
                    <Table.Cell>{data?.principals && <AvatarItem users={data.principals} />}</Table.Cell>
                    <Table.Cell>
                      {defaultReviewersChangeRequested && <AvatarItem users={defaultReviewersChangeRequested} />}
                    </Table.Cell>
                    <Table.Cell>
                      {defaultReviewersApproved && <AvatarItem users={defaultReviewersApproved} />}
                    </Table.Cell>
                  </Table.Row>
                )
              })}
          </Table.Body>
        </Table.Root>
      </div>
    </>
  )
}
