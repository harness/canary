import { FC, useMemo } from 'react'

import { Layout, StatusBadge, StatusBadgeProps, Table } from '@/components'
import { useTranslation } from '@/context'
import { CodeOwnersSectionProps, PullReqReviewDecision } from '@/views'
import { isEmpty } from 'lodash-es'

import { ReviewersPanel } from './reviewers-panel'

export const CodeOwnersSection: FC<CodeOwnersSectionProps> = ({
  className,
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
  const { t } = useTranslation()
  const codeOwnerStatus: { text: string; theme: StatusBadgeProps['theme'] } = useMemo(() => {
    if (!isEmpty(codeOwnerChangeReqEntries)) {
      return {
        theme: reqCodeOwnerApproval || reqCodeOwnerLatestApproval ? 'danger' : 'warning',
        text: t(
          'views:repo.pullRequest.codeOwnersSection.requestedChanges',
          'Code owners requested changes to the pull request'
        )
      }
    }

    if (!!codeOwnerPendingEntries?.length && reqCodeOwnerLatestApproval) {
      return {
        theme: 'warning',
        text: t(
          'views:repo.pullRequest.codeOwnersSection.waitingOnReviews',
          'Waiting on code owner reviews of latest changes'
        )
      }
    }

    if (!!codeOwnerPendingEntries?.length && reqCodeOwnerApproval) {
      return {
        theme: 'warning',
        text: t(
          'views:repo.pullRequest.codeOwnersSection.changesPendingApproval',
          'Changes are pending approval from code owners'
        )
      }
    }

    if (!!codeOwnerApprovalEntries?.length && !!codeOwnerPendingEntries?.length) {
      return {
        theme: 'success',
        text: t(
          'views:repo.pullRequest.codeOwnersSection.someChangesApproved',
          'Some changes were approved by code owners'
        )
      }
    }

    if (!!latestCodeOwnerApprovalArr?.length && reqCodeOwnerLatestApproval) {
      return {
        theme: 'success',
        text: t(
          'views:repo.pullRequest.codeOwnersSection.latestChangesApproved',
          'Latest changes were approved by code owners'
        )
      }
    }

    if (!!codeOwnerApprovalEntries?.length && reqCodeOwnerApproval) {
      return {
        theme: 'success',
        text: t('views:repo.pullRequest.codeOwnersSection.changesApproved', 'Changes were approved by code owners')
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
          theme: 'warning',
          text: t(
            'views:repo.pullRequest.codeOwnersSection.latestChangesPendingApproval',
            'Latest changes are pending approval from required reviewers'
          )
        }
      }

      return {
        theme: 'success',
        text: t('views:repo.pullRequest.codeOwnersSection.changesApproved', 'Changes were approved by code owners')
      }
    }

    return {
      theme: 'success',
      text: t('views:repo.pullRequest.codeOwnersSection.noReviewsRequired', 'No codeowner reviews required')
    }
  }, [
    t,
    codeOwnerChangeReqEntries,
    codeOwnerPendingEntries?.length,
    reqCodeOwnerLatestApproval,
    reqCodeOwnerApproval,
    codeOwnerApprovalEntries?.length,
    latestCodeOwnerApprovalArr,
    minReqLatestApproval
  ])

  if (!codeOwners || isEmpty(codeOwners.evaluation_entries)) {
    return null
  }

  return (
    <Layout.Vertical gapY="xs" className={className}>
      <Layout.Horizontal align="center" justify="between">
        <StatusBadge variant="status" theme={codeOwnerStatus.theme}>
          {codeOwnerStatus.text}
        </StatusBadge>
        {(reqCodeOwnerApproval || reqCodeOwnerLatestApproval) && (
          <StatusBadge variant="outline">{t('views:repo.pullRequest.requiredMessage', 'Required')}</StatusBadge>
        )}
      </Layout.Horizontal>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head className="w-[34%]">{t('views:repo.pullRequest.codeOwnersSection.code', 'Code')}</Table.Head>
            <Table.Head className="w-[22%]">
              {t('views:repo.pullRequest.codeOwnersSection.owners', 'Owners')}
            </Table.Head>
            <Table.Head className="w-[22%]">
              {t('views:repo.pullRequest.codeOwnersSection.changesRequestedBy', 'Changes requested by')}
            </Table.Head>
            <Table.Head className="w-[22%]">
              {t('views:repo.pullRequest.codeOwnersSection.approvedBy', 'Approved by')}
            </Table.Head>
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
              <Table.Row key={entry.pattern}>
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
                <Table.Cell>{changeReqEvaluations && <ReviewersPanel principals={changeReqEvaluations} />}</Table.Cell>
                <Table.Cell>{approvedEvaluations && <ReviewersPanel principals={approvedEvaluations} />}</Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table.Root>
    </Layout.Vertical>
  )
}
