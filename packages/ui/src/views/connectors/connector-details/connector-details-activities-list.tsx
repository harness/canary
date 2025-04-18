import { NoData, SkeletonList, SkeletonTable, Table } from '@/components'
import { cn } from '@utils/cn'
import { timeAgo } from '@utils/utils'
import { ExecutionState } from '@views/index'

import { ConnectorActivityItem, ConnectorDetailsActivitiesListProps } from './types'

const Activity = ({ activity }: { activity: React.ReactNode }): JSX.Element => (
  <span className="max-w-full truncate text-sm font-medium leading-tight tracking-tight text-cn-foreground-1">
    {activity}
  </span>
)

const ConnectivityStatus = ({ status }: { status: string }): JSX.Element => {
  const getStatus = (): { status: string; color: string } | undefined => {
    switch (status) {
      case ExecutionState.SUCCESS.toLowerCase():
        return { status: 'Success', color: 'bg-cn-foreground-success' }
      case ExecutionState.ERROR.toLowerCase():
        return { status: 'Failed', color: 'bg-cn-foreground-danger' }
      case ExecutionState.RUNNING.toLowerCase():
        return { status: 'Running', color: 'bg-cn-foreground-warning' }
    }
  }
  const currentStatus = getStatus()
  return (
    <div className="inline-flex items-center gap-2 p-2.5">
      <div className={cn('size-2 rounded-full', currentStatus?.color)} />
      <span className="text-cn-foreground-2">{currentStatus?.status}</span>
    </div>
  )
}
const ConnectorDetailsActivitiesList = ({
  useTranslationStore,
  isLoading,
  activities
}: ConnectorDetailsActivitiesListProps) => {
  const { t } = useTranslationStore()
  const content = activities?.content
  if (isLoading) {
    return <SkeletonList />
  }

  if (!content.length) {
    return (
      <NoData
        withBorder
        className="min-h-[65vh]"
        textWrapperClassName="max-w-[350px]"
        iconName="no-data-cog"
        title={t('views:noData.noEntities', 'No entities yet')}
        description={[t('views:noData.noEntitiesDescription', 'There are no entities yet.')]}
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
          <Table.Head className="w-96 text-cn-foreground-4">{t('views:connectors.activity', 'Activity')}</Table.Head>
          <Table.Head className="w-96 text-cn-foreground-4">{t('views:connectors.time', 'Time')}</Table.Head>
          <Table.Head className="w-44 text-cn-foreground-4">{t('views:connectors.status', 'Status')}</Table.Head>
        </Table.Row>
      </Table.Header>
      {isLoading ? (
        <SkeletonTable countRows={12} countColumns={5} />
      ) : (
        <Table.Body>
          {content.map(({ referredEntity, activityTime, description, activityStatus }: ConnectorActivityItem) => {
            const { name, entityRef } = referredEntity
            const identifier = entityRef?.identifier || name
            return (
              <Table.Row key={identifier} className="cursor-pointer">
                <Table.Cell className="max-w-80 content-center truncate">
                  <Activity activity={description} />
                </Table.Cell>
                <Table.Cell className="max-w-80 content-center truncate font-medium text-cn-foreground-3">
                  {activityTime ? timeAgo(activityTime) : null}
                </Table.Cell>

                <Table.Cell className="max-w-full content-center truncate text-left text-sm font-normal leading-tight tracking-tight text-cn-foreground-4">
                  <ConnectivityStatus status={activityStatus.toLowerCase()} />
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      )}
    </Table.Root>
  )
}

export default ConnectorDetailsActivitiesList
