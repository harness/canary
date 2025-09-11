import { Accordion, IconV2, Layout, Link, StackedList, StatusBadge, Table, Text } from '@/components'
import { timeDistance } from '@/utils'
import { EnumCheckStatus, ExecutionState, TypesPullReqCheck } from '@/views'
import { PanelAccordionShowButton } from '@views/repo/pull-request/details/components/conversation/sections/panel-accordion-show-button'

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
  const getStatusIcon = (status: EnumCheckStatus, isTitle: boolean = true) => {
    switch (status) {
      // TODO: fix icons to use from nucleo
      case ExecutionState.PENDING:
      case ExecutionState.BLOCKED:
        return <IconV2 size="lg" color="warning" name="clock-solid" />
      case ExecutionState.RUNNING:
        return <IconV2 size="lg" color="warning" className="animate-spin" name="loader" />
      case ExecutionState.FAILURE:
      case ExecutionState.ERROR:
        return <IconV2 size="lg" color="danger" name={isTitle ? 'warning-triangle-solid' : 'xmark-circle-solid'} />
      default:
        return <IconV2 size="lg" color="success" name="check-circle-solid" />
    }
  }

  return (
    <Accordion.Item value={ACCORDION_VALUE}>
      <Accordion.Trigger className="py-3">
        <Layout.Flex>
          <StackedList.Field
            title={<LineTitle text={checksInfo.header} icon={getStatusIcon(checksInfo.status, true)} />}
            description={<LineDescription text={checksInfo.content} />}
          />
          <PanelAccordionShowButton isShowButton value={ACCORDION_VALUE} accordionValues={accordionValues} />
        </Layout.Flex>
      </Accordion.Trigger>
      <Accordion.Content className="pl-3">
        <Table.Root className="ml-4 rounded-none border-0 border-t">
          <Table.Body>
            {checkData.map(check => {
              const time = timeDistance(check?.check?.created, check?.check?.updated)
              return (
                <Table.Row key={check.check?.identifier}>
                  <Table.Cell className="w-80 pl-0">
                    <Layout.Horizontal align="center" gap="2xs">
                      {getStatusIcon(check?.check?.status as EnumCheckStatus)}
                      <Text color="foreground-1" truncate className="overflow-hidden">
                        {check?.check?.identifier}
                      </Text>
                    </Layout.Horizontal>
                  </Table.Cell>
                  <Table.Cell className="w-72">
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
                  </Table.Cell>
                  <Table.Cell className="w-16">
                    {check?.check?.status !== ExecutionState.PENDING && !!check?.check?.link && (
                      <Link to={check?.check?.link || ''} target="_blank" rel="noopener noreferrer">
                        Details
                      </Link>
                    )}
                  </Table.Cell>
                  <Table.Cell className="w-20">
                    {check?.required && (
                      <StatusBadge variant="outline" size="sm">
                        <Text color="foreground-3">Required</Text>
                      </StatusBadge>
                    )}
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table.Root>
      </Accordion.Content>
    </Accordion.Item>
  )
}

PullRequestCheckSection.displayName = 'PullRequestCheckSection'

export default PullRequestCheckSection
