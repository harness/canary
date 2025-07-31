import { Accordion, IconV2, Layout, Link, StackedList, StatusBadge, Text } from '@/components'
import { timeDistance } from '@/utils'
import { EnumCheckStatus, ExecutionState, TypesPullReqCheck } from '@/views'
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
        return <IconV2 className="text-cn-foreground-warning animate-spin" name="loader" />
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
      <Accordion.Content>
        <div className="ml-6 bg-inherit">
          <StackedList.Root className="cursor-default border-transparent bg-inherit">
            {checkData.map(check => {
              const time = timeDistance(check?.check?.created, check?.check?.updated)
              return (
                <StackedList.Item key={check.check?.id}>
                  {getStatusIcon(check?.check?.status as EnumCheckStatus)}
                  <StackedList.Field title={check?.check?.identifier} />
                  <StackedList.Field
                    title={
                      check?.check?.status === ExecutionState.SUCCESS ||
                      check?.check?.status === ExecutionState.FAILURE_IGNORED
                        ? `Succeeded in ${time}`
                        : check?.check?.status === ExecutionState.FAILURE
                          ? `Failed in ${time}`
                          : check?.check?.status === ExecutionState.RUNNING
                            ? 'Running...'
                            : check?.check?.status === ExecutionState.PENDING
                              ? 'Pending...'
                              : `Errored in ${time}`
                    }
                  />
                  <StackedList.Field
                    title={
                      check?.required && (
                        <StatusBadge variant="outline" size="sm">
                          <Text color="foreground-3">Required</Text>
                        </StatusBadge>
                      )
                    }
                  />
                  <StackedList.Field
                    title={
                      check?.check?.status !== ExecutionState.PENDING && (
                        <Link to={check?.check?.link || ''} target="_blank" rel="noopener noreferrer">
                          Details
                        </Link>
                      )
                    }
                  />
                </StackedList.Item>
              )
            })}
          </StackedList.Root>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  ) : null
}

PullRequestCheckSection.displayName = 'PullRequestCheckSection'

export default PullRequestCheckSection
