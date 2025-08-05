import { type FC } from 'react'

import { Accordion, IconV2, Layout, StackedList, StatusBadge, Text } from '@/components'
import { easyPluralize, PullRequestChangesSectionProps } from '@/views'
import { cn } from '@utils/cn'
import { PanelAccordionShowButton } from '@views/repo/pull-request/details/components/conversation/sections/panel-accordion-show-button'
import { isEmpty } from 'lodash-es'

import { CodeOwnersSection } from './components/code-owners-section'
import { DefaultReviewersSection } from './components/default-reviewers-section'
import { LineDescription, LineTitle } from './pull-request-line-title'

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <IconV2 size="md" name="clock-solid" className="text-cn-foreground-warning" />
    case 'warning':
      return <IconV2 size="md" name="warning-triangle-solid" className="text-cn-foreground-warning" />
    case 'error':
      return <IconV2 size="md" name="warning-triangle-solid" className="text-cn-foreground-danger" />
    default:
      return <IconV2 size="md" name="check-circle-solid" className="text-cn-icon-success" />
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
  defaultReviewersData
}) => {
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
        <Layout.Vertical gap="xs" className="ml-7">
          {((minApproval ?? 0) > (minReqLatestApproval ?? 0) ||
            (!isEmpty(approvedEvaluations) && minReqLatestApproval === 0 && minApproval && minApproval > 0) ||
            ((minApproval ?? 0) > 0 && minReqLatestApproval === undefined)) && (
            <div className="ml-7 flex items-center justify-between">
              {approvedEvaluations && minApproval && minApproval <= approvedEvaluations?.length ? (
                <div className="flex items-center gap-x-2">
                  <IconV2 size="md" name="check-circle-solid" className="text-cn-icon-success" />
                  <Text variant="body-single-line-normal" color="foreground-1">
                    {`Changes were approved by ${approvedEvaluations?.length} ${easyPluralize(approvedEvaluations?.length, 'reviewer', 'reviewers')}`}
                  </Text>
                </div>
              ) : (
                <div className="flex items-center gap-x-2">
                  <IconV2
                    size="md"
                    name={
                      Number(approvedEvaluations?.length) >= Number(minApproval)
                        ? 'check-circle-solid'
                        : 'warning-triangle-solid'
                    }
                    className={cn({
                      'text-cn-icon-success': Number(approvedEvaluations?.length) >= Number(minApproval),
                      'text-cn-foreground-warning': Number(approvedEvaluations?.length) < Number(minApproval)
                    })}
                  />
                  <Text variant="body-single-line-normal" color="foreground-1">
                    {`${(approvedEvaluations && approvedEvaluations.length) || '0'}/${minApproval} approvals completed`}
                  </Text>
                </div>
              )}
              <StatusBadge variant="outline">Required</StatusBadge>
            </div>
          )}

          {(minReqLatestApproval ?? 0) > 0 && (
            <div className="ml-7 flex items-center justify-between">
              {latestApprovalArr !== undefined &&
              minReqLatestApproval !== undefined &&
              minReqLatestApproval <= latestApprovalArr?.length ? (
                <div className="flex items-center gap-x-2">
                  <IconV2 size="md" name="clock-solid" className="text-cn-icon-success" />
                  <span className="text-2 text-cn-foreground-1">{`Latest changes were approved by ${latestApprovalArr?.length || minReqLatestApproval || ''} ${easyPluralize(latestApprovalArr?.length || minReqLatestApproval, 'reviewer', 'reviewers')}`}</span>
                </div>
              ) : (
                <div className="flex items-center gap-x-2">
                  <IconV2 size="md" name="circle" className="fill-transparent text-icons-7" />
                  <span className="text-2 text-cn-foreground-1">
                    {`${latestApprovalArr?.length || minReqLatestApproval || ''} ${easyPluralize(latestApprovalArr?.length || minReqLatestApproval || 0, 'approval', 'approvals')} pending on latest changes`}
                  </span>
                </div>
              )}
              <StatusBadge variant="secondary">Required</StatusBadge>
            </div>
          )}

          {!isEmpty(changeReqEvaluations) && (
            <div className="ml-7 flex items-center justify-between">
              <div className="flex items-center gap-x-2">
                <IconV2
                  size="md"
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

          <DefaultReviewersSection defaultReviewersData={defaultReviewersData} />

          <CodeOwnersSection
            codeOwners={codeOwners}
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
    </Accordion.Item>
  )
}

PullRequestChangesSection.displayName = 'PullRequestChangesSection'

export default PullRequestChangesSection
