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
      return <IconV2 size="lg" color="warning" name="clock-solid" />
    case 'warning':
      return <IconV2 size="lg" color="warning" name="warning-triangle-solid" />
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
        className={cn('py-cn-sm', { '[&>.cn-accordion-trigger-indicator]:hidden': !viewBtn })}
        onClick={e => {
          if (!viewBtn) e.preventDefault()
        }}
      >
        <Layout.Flex>
          <StackedList.Field
            title={<LineTitle text={changesInfo.header} icon={getStatusIcon(changesInfo.status)} />}
            description={<LineDescription text={changesInfo.content} />}
          />
          <PanelAccordionShowButton isShowButton={viewBtn} value={ACCORDION_VALUE} accordionValues={accordionValues} />
        </Layout.Flex>
      </Accordion.Trigger>

      <Accordion.Content>
        <Layout.Vertical gap="2xs" className="ml-7">
          {((minApproval ?? 0) > (minReqLatestApproval ?? 0) ||
            (!isEmpty(approvedEvaluations) && minReqLatestApproval === 0 && minApproval && minApproval > 0) ||
            ((minApproval ?? 0) > 0 && minReqLatestApproval === undefined)) && (
            <div className="flex items-center justify-between">
              {approvedEvaluations && minApproval && minApproval <= approvedEvaluations?.length ? (
                <div className="flex items-center gap-x-2">
                  <IconV2 size="lg" color="success" name="check-circle-solid" />
                  <Text variant="body-single-line-normal" color="foreground-1">
                    {`Changes were approved by ${approvedEvaluations?.length} ${easyPluralize(approvedEvaluations?.length, 'reviewer', 'reviewers')}`}
                  </Text>
                </div>
              ) : (
                <div className="flex items-center gap-x-2">
                  <IconV2
                    size="lg"
                    color={Number(approvedEvaluations?.length) >= Number(minApproval) ? 'success' : 'warning'}
                    name={
                      Number(approvedEvaluations?.length) >= Number(minApproval)
                        ? 'check-circle-solid'
                        : 'warning-triangle-solid'
                    }
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
            <div className="flex items-center justify-between">
              {latestApprovalArr !== undefined &&
              minReqLatestApproval !== undefined &&
              minReqLatestApproval <= latestApprovalArr?.length ? (
                <div className="flex items-center gap-x-2">
                  <IconV2 size="lg" color="success" name="clock-solid" />
                  <span className="text-2 text-cn-1">{`Latest changes were approved by ${latestApprovalArr?.length || minReqLatestApproval || ''} ${easyPluralize(latestApprovalArr?.length || minReqLatestApproval, 'reviewer', 'reviewers')}`}</span>
                </div>
              ) : (
                <div className="flex items-center gap-x-2">
                  <IconV2 size="lg" name="circle" className="fill-transparent text-icons-7" />
                  <span className="text-2 text-cn-1">
                    {`${latestApprovalArr?.length || minReqLatestApproval || ''} ${easyPluralize(latestApprovalArr?.length || minReqLatestApproval || 0, 'approval', 'approvals')} pending on latest changes`}
                  </span>
                </div>
              )}
              <StatusBadge variant="outline">Required</StatusBadge>
            </div>
          )}

          {!isEmpty(changeReqEvaluations) && (
            <div className="ml-7 flex items-center justify-between">
              <div className="flex items-center gap-x-2">
                <IconV2 size="lg" color={reqNoChangeReq ? 'danger' : 'warning'} name="warning-triangle-solid" />
                <span className="text-2 text-cn-1">{`${changeReqReviewer} requested changes to the pull request`}</span>
              </div>
              {reqNoChangeReq && <StatusBadge variant="outline">Required</StatusBadge>}
            </div>
          )}

          <DefaultReviewersSection defaultReviewersData={defaultReviewersData} />

          <CodeOwnersSection
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
    </Accordion.Item>
  )
}

PullRequestChangesSection.displayName = 'PullRequestChangesSection'

export default PullRequestChangesSection
