import { type FC } from 'react'

import { Accordion, IconV2, Layout, StatusBadge, Text } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
import { easyPluralize, PullRequestChangesSectionProps } from '@views'
import { cn } from '@harnessio/ui/utils'
import { PanelAccordionShowButton } from '@views/repo/pull-request/details/components/conversation/sections/panel-accordion-show-button'
import { isEmpty } from 'lodash-es'

import { CodeOwnersSection } from './components/code-owners-section'
import { DefaultReviewersSection } from './components/default-reviewers-section'
import { LineDescription, LineTitle } from './pull-request-line-title'

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <IconV2 size="lg" color="warning" name="clock-solid" />
    case 'error':
      return <IconV2 size="lg" color="danger" name="warning-triangle-solid" />
    default:
      return <IconV2 size="lg" color="success" name="check-circle-solid" />
  }
}

const ACCORDION_VALUE = 'item-1'

const PullRequestChangesSection: FC<PullRequestChangesSectionProps> = ({
  changesInfo,
  minApproval,
  minReqLatestApproval,
  approvedEvaluations,
  changeReqEvaluations,
  latestApprovalArr,
  reqNoChangeReq,
  changeReqReviewer,
  codeOwnersData,
  accordionValues,
  defaultReviewersData,
  pullReqMetadata
}) => {
  const { t } = useTranslation()
  const {
    codeOwners,
    reqCodeOwnerApproval,
    reqCodeOwnerLatestApproval,
    codeOwnerChangeReqEntries,
    codeOwnerPendingEntries,
    codeOwnerApprovalEntries,
    latestCodeOwnerApprovalArr
  } = codeOwnersData

  const viewBtn =
    (minApproval && minApproval > 0) ||
    (minReqLatestApproval && minReqLatestApproval > 0) ||
    !isEmpty(changeReqEvaluations) ||
    (!isEmpty(codeOwners) && !isEmpty(codeOwners?.evaluation_entries))

  const hasApprovals =
    (minApproval ?? 0) > (minReqLatestApproval ?? 0) ||
    (!isEmpty(approvedEvaluations) && minReqLatestApproval === 0 && minApproval && minApproval > 0) ||
    ((minApproval ?? 0) > 0 && minReqLatestApproval === undefined)
  const hasRequiredLatestApprovals = Number(minReqLatestApproval) > 0
  const hasLatestApprovals =
    latestApprovalArr !== undefined &&
    minReqLatestApproval !== undefined &&
    minReqLatestApproval <= latestApprovalArr?.length
  const latestApprovalsCount = Number(latestApprovalArr?.length || minReqLatestApproval)
  const hasEnoughApprovals = approvedEvaluations && minApproval && minApproval <= approvedEvaluations?.length
  const hasContent =
    hasApprovals ||
    hasRequiredLatestApprovals ||
    !isEmpty(changeReqEvaluations) ||
    !isEmpty(defaultReviewersData?.defaultReviewersApprovals) ||
    (codeOwners && !isEmpty(codeOwners?.evaluation_entries))
  const hasChangesStatuses =
    (hasApprovals && hasEnoughApprovals) ||
    (hasRequiredLatestApprovals && hasLatestApprovals) ||
    !isEmpty(changeReqEvaluations)

  return (
    <Accordion.Item value={ACCORDION_VALUE}>
      <Accordion.Trigger
        className="py-cn-sm group"
        indicatorProps={{ className: cn('self-center mt-0', { hidden: !viewBtn }) }}
        suffix={
          <PanelAccordionShowButton isShowButton={viewBtn} value={ACCORDION_VALUE} accordionValues={accordionValues} />
        }
        clickable={!!hasContent}
      >
        <Layout.Grid gapY="4xs">
          <LineTitle text={changesInfo.header} icon={getStatusIcon(changesInfo.status)} />
          <LineDescription text={changesInfo.content} />
        </Layout.Grid>
      </Accordion.Trigger>

      {hasContent && (
        <Accordion.Content className="pt-cn-3xs pb-cn-sm">
          <Layout.Vertical gapY="lg">
            {hasChangesStatuses && (
              <Layout.Vertical gapY="sm">
                {hasApprovals && hasEnoughApprovals && (
                  // TODO: Replace ml-[28px] with a proper spacing token when available
                  <Layout.Horizontal align="center" gap="2xs" className="ml-[28px]">
                    <IconV2 size="lg" color="success" name="check-circle-solid" />
                    <Text color="foreground-1">
                      {t(
                        'views:repo.pullRequest.changesSection.approvalsMessage',
                        `Changes were approved by {{approvalsCount}} {{approvedBy}}`,
                        {
                          approvalsCount: approvedEvaluations?.length || 0,
                          approvedBy: easyPluralize(approvedEvaluations?.length, 'reviewer', 'reviewers')
                        }
                      )}
                    </Text>
                  </Layout.Horizontal>
                )}

                {hasRequiredLatestApprovals && hasLatestApprovals && (
                  <Layout.Horizontal align="center" gap="2xs" className="ml-[28px]">
                    <IconV2 size="lg" color="success" name="clock-solid" />
                    <Text color="foreground-1">
                      {t(
                        'views:repo.pullRequest.changesSection.latestApprovalsMessage',
                        `Latest changes were approved by {{latestApprovalsCount}} {{approvedBy}}`,
                        {
                          latestApprovalsCount: latestApprovalsCount,
                          approvedBy: easyPluralize(latestApprovalsCount, 'reviewer', 'reviewers')
                        }
                      )}
                    </Text>
                  </Layout.Horizontal>
                )}

                {!isEmpty(changeReqEvaluations) && (
                  <Layout.Horizontal align="center" justify="between" className="ml-[28px]">
                    <Layout.Horizontal align="center" gap="2xs">
                      <IconV2 size="lg" color="danger" name="warning-triangle-solid" />
                      <Text color="foreground-1">
                        {t(
                          'views:repo.pullRequest.changesSection.changeRequestedMessage',
                          `{{reviewer}} requested changes to the pull request`,
                          { reviewer: changeReqReviewer }
                        )}
                      </Text>
                    </Layout.Horizontal>
                    {reqNoChangeReq && (
                      <StatusBadge variant="outline">
                        {t('views:repo.pullRequest.requiredMessage', 'Required')}
                      </StatusBadge>
                    )}
                  </Layout.Horizontal>
                )}
              </Layout.Vertical>
            )}

            {hasApprovals && !hasEnoughApprovals && (
              <Layout.Horizontal align="center" justify="between" className="ml-cn-xl">
                <StatusBadge variant="status" theme="success">
                  {t(
                    'views:repo.pullRequest.changesSection.pendingApprovalsMessage',
                    '{{approvalsCount}}/{{minApproval}} approvals completed',
                    {
                      approvalsCount: (approvedEvaluations && approvedEvaluations.length) || 0,
                      minApproval: minApproval || 0
                    }
                  )}
                </StatusBadge>
                <StatusBadge variant="outline">{t('views:repo.pullRequest.requiredMessage', 'Required')}</StatusBadge>
              </Layout.Horizontal>
            )}

            {hasRequiredLatestApprovals && !hasLatestApprovals && (
              <Layout.Horizontal align="center" justify="between" className="ml-cn-xl">
                <StatusBadge variant="status" theme="warning">
                  {t(
                    'views:repo.pullRequest.changesSection.pendingLatestApprovalsMessage',
                    '{{latestApprovalsCount}} {{approval}} pending on latest changes',
                    {
                      latestApprovalsCount:
                        (latestApprovalArr && latestApprovalArr.length) || minReqLatestApproval || 0,
                      approval: easyPluralize(latestApprovalsCount, 'approval', 'approvals')
                    }
                  )}
                </StatusBadge>
                <StatusBadge variant="outline">{t('views:repo.pullRequest.requiredMessage', 'Required')}</StatusBadge>
              </Layout.Horizontal>
            )}

            <DefaultReviewersSection defaultReviewersData={defaultReviewersData} className="ml-cn-xl" />

            <CodeOwnersSection
              className="ml-cn-xl"
              codeOwners={codeOwners}
              pullReqMetadata={pullReqMetadata}
              reqCodeOwnerApproval={reqCodeOwnerApproval}
              reqCodeOwnerLatestApproval={reqCodeOwnerLatestApproval}
              codeOwnerChangeReqEntries={codeOwnerChangeReqEntries}
              codeOwnerPendingEntries={codeOwnerPendingEntries}
              codeOwnerApprovalEntries={codeOwnerApprovalEntries}
              latestCodeOwnerApprovalArr={latestCodeOwnerApprovalArr}
              minReqLatestApproval={minReqLatestApproval}
            />
          </Layout.Vertical>
        </Accordion.Content>
      )}
    </Accordion.Item>
  )
}

PullRequestChangesSection.displayName = 'PullRequestChangesSection'

export default PullRequestChangesSection
