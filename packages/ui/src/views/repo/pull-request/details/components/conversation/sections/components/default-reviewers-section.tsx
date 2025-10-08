import { FC, useMemo } from 'react'

import { Layout, StatusBadge, StatusBadgeProps, Table, Text } from '@/components'
import {
  DefaultReviewersApprovalsData,
  DefaultReviewersDataProps,
  getDefaultReviewersApprovalCount,
  PullReqReviewDecision
} from '@/views'
import { isEmpty } from 'lodash-es'

import { ReviewersPanel } from './reviewers-panel'

interface DefaultReviewersSectionProps {
  defaultReviewersData?: DefaultReviewersDataProps
  className?: string
}

export const DefaultReviewersSection: FC<DefaultReviewersSectionProps> = ({ defaultReviewersData, className }) => {
  const {
    defReviewerLatestApprovalRequiredByRule,
    defReviewerApprovalRequiredByRule,
    defReviewerApprovedChanges,
    defReviewerApprovedLatestChanges,
    defaultReviewersApprovals
  } = defaultReviewersData || {}

  const defaultReviewerStatus: { text: string; theme: StatusBadgeProps['theme'] } = useMemo(() => {
    if (defReviewerLatestApprovalRequiredByRule && !defReviewerApprovedLatestChanges) {
      return { theme: 'warning', text: "Waiting on default reviewer's reviews of latest changes" }
    }

    if (defReviewerApprovalRequiredByRule && !defReviewerApprovedChanges) {
      return { theme: 'warning', text: 'Changes are pending approval from default reviewers' }
    }

    if (defReviewerLatestApprovalRequiredByRule && defReviewerApprovedLatestChanges) {
      return { theme: 'success', text: 'Latest changes were approved by default reviewers' }
    }

    if (defReviewerApprovalRequiredByRule && defReviewerApprovedChanges) {
      return { theme: 'success', text: 'Changes were approved by default reviewers' }
    }

    return { theme: 'success', text: 'Default reviewers were added to the PR' }
  }, [
    defReviewerLatestApprovalRequiredByRule,
    defReviewerApprovedLatestChanges,
    defReviewerApprovalRequiredByRule,
    defReviewerApprovedChanges
  ])

  if (isEmpty(defaultReviewersApprovals)) {
    return null
  }

  return (
    <Layout.Vertical gapY="xs" className={className}>
      {(defReviewerApprovalRequiredByRule || defReviewerLatestApprovalRequiredByRule) && (
        <Layout.Horizontal align="center" justify="between">
          <StatusBadge variant="status" theme={defaultReviewerStatus.theme}>
            {defaultReviewerStatus.text}
          </StatusBadge>
          <StatusBadge variant="outline">Required</StatusBadge>
        </Layout.Horizontal>
      )}
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head className="w-[34%]">Required</Table.Head>
            <Table.Head className="w-[22%]">Default reviewers</Table.Head>
            <Table.Head className="w-[22%]">Changes requested by</Table.Head>
            <Table.Head className="w-[22%]">Approved by</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {defaultReviewersApprovals
            ?.filter(
              (data: DefaultReviewersApprovalsData) => data.minimum_required_count || data.minimum_required_count_latest
            ) // only consider response with min default reviewers required (>0)
            .map((data: DefaultReviewersApprovalsData, index: number) => {
              // changes requested by default reviewers
              const defaultReviewersChangeRequested = data?.evaluations
                ?.filter(ev => ev?.decision === PullReqReviewDecision.changeReq)
                .map(ev => ev?.reviewer || {})
              // approved by default reviewers
              const defaultReviewersApproved = data?.evaluations
                ?.filter(ev => ev?.decision === PullReqReviewDecision.approved)
                .map(ev => ev?.reviewer || {})

              return (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Text>{getDefaultReviewersApprovalCount(data)}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <ReviewersPanel principals={data.principals || []} userGroups={data.user_groups || []} />
                  </Table.Cell>
                  <Table.Cell>
                    {defaultReviewersChangeRequested && (
                      <ReviewersPanel principals={defaultReviewersChangeRequested || []} />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {defaultReviewersApproved && <ReviewersPanel principals={defaultReviewersApproved || []} />}
                  </Table.Cell>
                </Table.Row>
              )
            })}
        </Table.Body>
      </Table.Root>
    </Layout.Vertical>
  )
}
