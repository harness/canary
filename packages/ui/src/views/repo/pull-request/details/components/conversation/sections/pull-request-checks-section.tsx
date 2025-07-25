import { Accordion, IconV2, Layout, Link, StackedList, StatusBadge, Text } from '@/components'
import { timeDistance } from '@/utils'
import { EnumCheckStatus, ExecutionState, TypesPullReqCheck } from '@/views'
import { cn } from '@utils/cn'
import { PanelAccordionShowButton } from '@views/repo/pull-request/details/components/conversation/sections/panel-accordion-show-button'
import { isEmpty } from 'lodash-es'

import { PullRequestRoutingProps } from '../../../pull-request-details-types'
import { LineDescription, LineTitle } from './pull-request-line-title'

const ACCORDION_VALUE = 'item-3'

interface PullRequestMergeSectionProps extends Partial<PullRequestRoutingProps> {
  checkData: TypesPullReqCheck[]
  checksInfo: { header: string; content: string; status: EnumCheckStatus }
  accordionValues: string[]
}

const PullRequestCheckSection = ({
  checkData,
  checksInfo,
  // toPRCheck, TODO: add back when checks page is implemented
  accordionValues
}: PullRequestMergeSectionProps) => {
  const getStatusIcon = (status: EnumCheckStatus) => {
    switch (status) {
      // TODO: fix icons to use from nucleo
      case ExecutionState.PENDING:
      case ExecutionState.BLOCKED:
        return <IconV2 name="clock-solid" className="text-cn-foreground-warning" />
      case ExecutionState.RUNNING:
        return <IconV2 name="message" className="text-cn-foreground-warning" />
      case ExecutionState.FAILURE:
      case ExecutionState.ERROR:
        return <IconV2 name="warning-triangle-solid" className="text-cn-foreground-danger" />
      default:
        return <IconV2 name="check-circle-solid" className="text-cn-foreground-success" />
    }
  }

  return !isEmpty(checkData) ? (
    <Accordion.Item value={ACCORDION_VALUE}>
      <Accordion.Trigger className="py-3">
        <Layout.Flex>
          <StackedList.Field
            className="flex gap-y-1"
            title={<LineTitle text={checksInfo.header} icon={getStatusIcon(checksInfo.status)} />}
            description={<LineDescription text={checksInfo.content} />}
          />
          <PanelAccordionShowButton isShowButton value={ACCORDION_VALUE} accordionValues={accordionValues} />
        </Layout.Flex>
      </Accordion.Trigger>
      <Accordion.Content className={cn('flex flex-col pl-6', { 'pb-0': checkData.length === 1 })}>
        {checkData.map(check => {
          const time = timeDistance(check?.check?.created, check?.check?.updated)

          return (
            <div key={check.check?.id} className={cn('flex items-center justify-between gap-2 border-t py-2.5')}>
              <div className="flex items-center gap-2">
                {getStatusIcon(check?.check?.status as EnumCheckStatus)}
                <Text color="foreground-1" truncate className="max-w-[300px] overflow-hidden">
                  {check?.check?.identifier}
                </Text>
                <Text color="foreground-3">
                  {check?.check?.status === ExecutionState.SUCCESS ||
                  check?.check?.status === ExecutionState.FAILURE_IGNORED
                    ? `Succeeded in ${time}`
                    : check?.check?.status === ExecutionState.FAILURE
                      ? `Failed in ${time}`
                      : check?.check?.status === ExecutionState.RUNNING
                        ? 'Running...'
                        : check?.check?.status === ExecutionState.PENDING
                          ? 'Pending...'
                          : `Errored in ${time}`}
                </Text>
              </div>
              <div className="grid grid-cols-[84px_auto] items-center">
                <div className="col-span-1">
                  {check?.check?.status !== ExecutionState.PENDING && (
                    <Link to={check?.check?.link || ''} target="_blank" rel="noopener noreferrer">
                      Details
                    </Link>
                  )}
                </div>
                <div className="col-span-1 flex justify-end">
                  {check?.required ? (
                    <StatusBadge variant="outline" size="sm">
                      <Text color="foreground-3">Required</Text>
                    </StatusBadge>
                  ) : (
                    <div className="min-w-[70px]"></div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </Accordion.Content>
    </Accordion.Item>
  ) : null
}

PullRequestCheckSection.displayName = 'PullRequestCheckSection'

export default PullRequestCheckSection
