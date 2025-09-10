import { IconV2, NoData, Skeleton, StatusBadge, Table, TimeAgoCard } from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@utils/cn'
import { defaultTo } from 'lodash-es'

import { DelegateConnectivityListProps } from '../types'

const Title = ({ title }: { title: string }): JSX.Element => (
  <span className="max-w-full truncate font-medium">{title}</span>
)

export function DelegateConnectivityList({
  delegates,
  isLoading,
  selectedTags,
  isDelegateSelected
}: DelegateConnectivityListProps): JSX.Element {
  const { t } = useTranslation()

  if (isLoading) {
    return <Skeleton.Table countRows={12} countColumns={4} />
  }

  if (!delegates.length) {
    return (
      <NoData
        withBorder
        imageName="no-data-cog"
        title={t('views:noData.noDelegates', 'No delegates yet')}
        description={[t('views:noData.noDelegates', 'There are no delegates in this project yet.')]}
      />
    )
  }

  return (
    <Table.Root
      className={cn({
        '[mask-image:linear-gradient(to_bottom,black_30%,transparent_100%)]': isLoading
      })}
    >
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-96">{t('views:delegates.delegate', 'Delegate')}</Table.Head>
          <Table.Head className="w-36 whitespace-nowrap">{t('views:delegates.heartbeat', 'Heartbeat')}</Table.Head>
          <Table.Head className="w-96">{t('views:repos.tags', 'Tags')}</Table.Head>
          <Table.Head className="w-24">{t('views:delegates.selected', 'Selected')}</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {delegates.map(
          ({ groupId, groupName, activelyConnected, lastHeartBeat, groupCustomSelectors, groupImplicitSelectors }) => {
            return (
              <Table.Row key={groupId}>
                <Table.Cell className="max-w-80 content-center truncate whitespace-nowrap">
                  <div className="flex items-center gap-2.5">
                    <Title title={groupName} />
                  </div>
                </Table.Cell>
                <Table.Cell className="content-center truncate whitespace-nowrap">
                  <div className="inline-flex items-center gap-2">
                    <IconV2 name="circle" size="2xs" color={activelyConnected ? 'success' : 'danger'} />
                    {lastHeartBeat ? <TimeAgoCard timestamp={lastHeartBeat} /> : null}
                  </div>
                </Table.Cell>
                <Table.Cell className="max-w-96 whitespace-normal break-words">
                  {groupCustomSelectors.map((selector: string) => (
                    <StatusBadge variant="secondary" theme="merged" key={selector} className="mb-1 mr-2">
                      {selector}
                    </StatusBadge>
                  ))}
                </Table.Cell>
                <Table.Cell className="min-w-8 content-center whitespace-nowrap">
                  <div className="flex items-center justify-center">
                    {isDelegateSelected(
                      [...defaultTo(groupImplicitSelectors, []), ...defaultTo(groupCustomSelectors, [])],
                      selectedTags || []
                    ) && <IconV2 name="check" size="2xs" color="success" />}
                  </div>
                </Table.Cell>
              </Table.Row>
            )
          }
        )}
      </Table.Body>
    </Table.Root>
  )
}
