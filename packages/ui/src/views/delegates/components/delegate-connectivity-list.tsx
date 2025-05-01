import { Icon, NoData, SkeletonList, SkeletonTable, StatusBadge, Table } from '@/components'
import { cn } from '@utils/cn'
import { timeAgo } from '@utils/utils'
import { defaultTo } from 'lodash-es'

import { DelegateConnectivityListProps } from '../types'

const Title = ({ title }: { title: string }): JSX.Element => (
  <span className="max-w-full truncate font-medium">{title}</span>
)

export function DelegateConnectivityList({
  delegates,
  useTranslationStore,
  isLoading,
  selectedTags,
  isDelegateSelected
}: DelegateConnectivityListProps): JSX.Element {
  const { t } = useTranslationStore()

  if (isLoading) {
    return <SkeletonList />
  }

  if (!delegates.length) {
    return (
      <NoData
        withBorder
        iconName="no-data-cog"
        title={t('views:noData.noDelegates', 'No delegates yet')}
        description={[t('views:noData.noDelegates', 'There are no delegates in this project yet.')]}
      />
    )
  }

  return (
    <Table.Root
      className={isLoading ? '[mask-image:linear-gradient(to_bottom,black_30%,transparent_100%)]' : ''}
      variant="asStackedList"
    >
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-96">Delegate</Table.Head>
          <Table.Head className="w-44 whitespace-nowrap">Heartbeat</Table.Head>
          <Table.Head className="w-96">Tags</Table.Head>
          <Table.Head className="w-44">Selected</Table.Head>
        </Table.Row>
      </Table.Header>
      {isLoading ? (
        <SkeletonTable countRows={12} countColumns={5} />
      ) : (
        <Table.Body>
          {delegates.map(
            ({
              groupId,
              groupName,
              activelyConnected,
              lastHeartBeat,
              groupCustomSelectors,
              groupImplicitSelectors
            }) => {
              return (
                <Table.Row key={groupId}>
                  <Table.Cell className="max-w-80 content-center truncate">
                    <div className="flex items-center gap-2.5">
                      <Title title={groupName} />
                    </div>
                  </Table.Cell>
                  <Table.Cell className="content-center">
                    <div className="inline-flex items-center gap-2">
                      <Icon
                        name="dot"
                        size={8}
                        className={cn(activelyConnected ? 'text-icons-success' : 'text-icons-danger')}
                      />
                      {lastHeartBeat ? timeAgo(lastHeartBeat) : null}
                    </div>
                  </Table.Cell>
                  <Table.Cell className="max-w-80 content-center truncate">
                    {groupCustomSelectors.map((selector: string) => (
                      <StatusBadge variant="secondary" theme="merged" key={selector} className="mr-2">
                        {selector}
                      </StatusBadge>
                    ))}
                  </Table.Cell>
                  <Table.Cell className="min-w-8 text-right">
                    {isDelegateSelected(
                      [...defaultTo(groupImplicitSelectors, []), ...defaultTo(groupCustomSelectors, [])],
                      selectedTags || []
                    ) && <Icon name="tick" size={12} className="text-icons-success" />}
                  </Table.Cell>
                </Table.Row>
              )
            }
          )}
        </Table.Body>
      )}
    </Table.Root>
  )
}
