import { Accordion, IconV2, Layout, Link, StatusBadge, Text } from '@/components'
import { useTranslation } from '@/context'
import { cn, timeDistance } from '@/utils'
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
  const { t } = useTranslation()
  const getStatusIcon = (status: EnumCheckStatus, isTitle: boolean = true) => {
    switch (status) {
      // TODO: fix icons to use from nucleo
      case ExecutionState.PENDING:
      case ExecutionState.BLOCKED:
        return <IconV2 size="lg" color="warning" name="clock-solid" />
      case ExecutionState.RUNNING:
        return <IconV2 size="lg" className="animate-spin" name="loader" />
      case ExecutionState.FAILURE:
      case ExecutionState.ERROR:
        return <IconV2 size="lg" color="danger" name={isTitle ? 'warning-triangle-solid' : 'xmark-circle-solid'} />
      default:
        return <IconV2 size="lg" color="success" name="check-circle-solid" />
    }
  }

  return (
    <Accordion.Item value={ACCORDION_VALUE} className="only:border-0">
      <Accordion.Trigger
        className="py-cn-sm group"
        suffix={<PanelAccordionShowButton isShowButton value={ACCORDION_VALUE} accordionValues={accordionValues} />}
        indicatorProps={{ className: 'self-center mt-0' }}
      >
        <Layout.Grid gapY="4xs">
          <LineTitle text={checksInfo.header} icon={getStatusIcon(checksInfo.status, true)} />
          <LineDescription text={checksInfo.content} />
        </Layout.Grid>
      </Accordion.Trigger>
      <Accordion.Content>
        {/* TODO: Replace ml-[28px] with a proper spacing token when available */}
        <Layout.Vertical className="ml-[28px]" gap="none">
          {checkData.map(check => {
            const time = timeDistance(check?.check?.created, check?.check?.ended || check?.check?.updated)
            return (
              <Layout.Grid
                key={check.check?.identifier}
                flow="column"
                align="center"
                columns="1fr 1fr auto"
                className="py-cn-sm border-t"
              >
                <Layout.Horizontal align="center" gap="2xs" className="truncate">
                  {getStatusIcon(check?.check?.status as EnumCheckStatus)}
                  <Text color="foreground-1" truncate>
                    {check?.check?.identifier}
                  </Text>
                </Layout.Horizontal>

                <Text color="foreground-3">
                  {check?.check?.status === ExecutionState.SUCCESS ||
                  check?.check?.status === ExecutionState.FAILURE_IGNORED
                    ? t('views:repo.pullRequest.checksSection.succeededMessage', 'Succeeded in {{time}}', { time })
                    : check?.check?.status === ExecutionState.FAILURE
                      ? t('views:repo.pullRequest.checksSection.failedMessage', 'Failed in {{time}}', { time })
                      : check?.check?.status === ExecutionState.RUNNING
                        ? t('views:repo.pullRequest.checksSection.runningMessage', 'Running...')
                        : check?.check?.status === ExecutionState.PENDING
                          ? t('views:repo.pullRequest.checksSection.pendingMessage', 'Pending...')
                          : t('views:repo.pullRequest.checksSection.erroredMessage', 'Errored in {{time}}', { time })}
                </Text>

                <Layout.Horizontal gap="2xl" align="center">
                  <StatusBadge variant="outline" size="sm" className={cn({ invisible: !check?.required })}>
                    {t('views:repo.pullRequest.requiredMessage', 'Required')}
                  </StatusBadge>
                  <Link
                    to={check?.check?.link || ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn({
                      'invisible pointer-events-none':
                        check?.check?.status === ExecutionState.PENDING || !check?.check?.link
                    })}
                  >
                    {t('views:repo.pullRequest.checksSection.detailsLink', 'Details')}
                  </Link>
                </Layout.Horizontal>
              </Layout.Grid>
            )
          })}
        </Layout.Vertical>
      </Accordion.Content>
    </Accordion.Item>
  )
}

PullRequestCheckSection.displayName = 'PullRequestCheckSection'

export default PullRequestCheckSection
