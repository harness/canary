import { FC, useMemo } from 'react'

import { IconV2, StatusBadge, Table } from '@/components'
import { CodeOwnersSectionProps, PullReqReviewDecision } from '@/views'
import { isEmpty } from 'lodash-es'

import { ReviewersPanel } from './reviewers-panel'

export const CodeOwnersSection: FC<CodeOwnersSectionProps> = ({
  codeOwners,
  pullReqMetadata,
  reqCodeOwnerApproval,
  reqCodeOwnerLatestApproval,
  codeOwnerChangeReqEntries,
  codeOwnerPendingEntries,
  codeOwnerApprovalEntries,
  latestCodeOwnerApprovalArr,
  minReqLatestApproval
}) => {
  const codeOwnerStatus = useMemo(() => {
    const getData = () => {
      if (!!codeOwnerPendingEntries?.length && reqCodeOwnerLatestApproval) {
        return {
          icon: <IconV2 size="lg" color="warning" name="warning-triangle-solid" />,
          text: 'Waiting on code owner reviews of latest changes'
        }
      }

      if (!!codeOwnerPendingEntries?.length && reqCodeOwnerApproval) {
        return {
          icon: <IconV2 size="lg" color="warning" name="warning-triangle-solid" />,
          text: 'Changes are pending approval from code owners'
        }
      }

      if (!!codeOwnerApprovalEntries?.length && !!codeOwnerPendingEntries?.length) {
        return {
          icon: <IconV2 size="lg" name="clock-solid" className="text-cn-3" />,
          text: 'Some changes were approved by code owners'
        }
      }

      if (!!latestCodeOwnerApprovalArr?.length && reqCodeOwnerLatestApproval) {
        return {
          icon: <IconV2 size="lg" color="success" name="check-circle-solid" />,
          text: 'Latest changes were approved by code owners'
        }
      }

      if (!!codeOwnerApprovalEntries?.length && reqCodeOwnerApproval) {
        return {
          icon: <IconV2 size="lg" color="success" name="check-circle-solid" />,
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
            icon: <IconV2 size="lg" color="warning" name="clock-solid" />,
            text: 'Latest changes are pending approval from required reviewers'
          }
        }

        return {
          icon: <IconV2 size="lg" color="success" name="check-circle-solid" />,
          text: 'Changes were approved by code owners'
        }
      }

      return {
        icon: <IconV2 size="lg" color="success" name="check-circle-solid" />,
        text: 'No codeowner reviews required'
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
    codeOwnerPendingEntries,
    reqCodeOwnerLatestApproval,
    codeOwnerApprovalEntries,
    latestCodeOwnerApprovalArr,
    minReqLatestApproval,
    reqCodeOwnerApproval
  ])

  if (!codeOwners || isEmpty(codeOwners.evaluation_entries)) {
    return null
  }

  return (
    <>
      <div className="flex items-center justify-between">
        {!isEmpty(codeOwnerChangeReqEntries) ? (
          <div className="flex items-center gap-x-2">
            <IconV2
              size="lg"
              name="warning-triangle-solid"
              // color={cn({
              //   danger: reqCodeOwnerApproval || reqCodeOwnerLatestApproval,
              //   warning: !reqCodeOwnerApproval || !reqCodeOwnerLatestApproval
              // })}
              color={reqCodeOwnerApproval || reqCodeOwnerLatestApproval ? 'danger' : 'warning'}
            />
            <span className="text-2 text-cn-1">{'Code owners requested changes to the pull request'}</span>
          </div>
        ) : (
          codeOwnerStatus
        )}
        {(reqCodeOwnerApproval || reqCodeOwnerLatestApproval) && <StatusBadge variant="outline">Required</StatusBadge>}
      </div>
      <div className="bg-inherit">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head className="w-[17.125rem]">Code</Table.Head>
              <Table.Head className="w-[11rem]">Owners</Table.Head>
              <Table.Head className="w-[11rem]">Changes requested by</Table.Head>
              <Table.Head className="w-[11rem]">Approved by</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {codeOwners?.evaluation_entries?.map(entry => {
              const changeReqEvaluations = entry?.owner_evaluations
                ?.filter(evaluation => evaluation.review_decision === PullReqReviewDecision.changeReq)
                .map(evaluation => evaluation.owner || {})

              const approvedEvaluations = entry?.owner_evaluations
                ?.filter(
                  evaluation =>
                    evaluation.review_decision === PullReqReviewDecision.approved &&
                    (reqCodeOwnerLatestApproval ? evaluation.review_sha === pullReqMetadata?.source_sha : true)
                )
                .map(evaluation => evaluation.owner || {})

              return (
                <Table.Row key={entry.pattern} className="cursor-pointer">
                  <Table.Cell>{entry?.pattern}</Table.Cell>
                  <Table.Cell>
                    <ReviewersPanel
                      principals={entry?.owner_evaluations?.map(evaluation => evaluation.owner || {})}
                      userGroups={entry?.user_group_owner_evaluations?.map(ev => ({
                        identifier: ev?.id || '',
                        name: ev?.name || ev?.id
                      }))}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {changeReqEvaluations && <ReviewersPanel principals={changeReqEvaluations} />}
                  </Table.Cell>
                  <Table.Cell>{approvedEvaluations && <ReviewersPanel principals={approvedEvaluations} />}</Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table.Root>
      </div>
    </>
  )
}
