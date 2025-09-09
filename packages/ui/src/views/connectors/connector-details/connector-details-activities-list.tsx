import { NoData, Skeleton, StatusBadge, StatusBadgeTheme, Table, TimeAgoCard } from '@/components'
import { useTranslation } from '@/context'
import { ExecutionState } from '@views/index'

import { ConnectorActivityItem, ConnectorDetailsActivitiesListProps } from './types'

const Activity = ({ activity }: { activity: React.ReactNode }): JSX.Element => (
  <span className="block max-w-full truncate py-2.5 text-sm font-medium leading-tight tracking-tight text-cn-1">
    {activity}
  </span>
)

const ConnectivityStatus = ({ status }: { status: string }): JSX.Element => {
  const getStatus = (): { status: string; theme: StatusBadgeTheme } | undefined => {
    switch (status) {
      case ExecutionState.SUCCESS.toLowerCase():
        return { status: 'Success', theme: 'success' }
      case ExecutionState.ERROR.toLowerCase():
        return { status: 'Failed', theme: 'danger' }
      case ExecutionState.RUNNING.toLowerCase():
        return { status: 'Running', theme: 'warning' }
    }
  }
  const currentStatus = getStatus()
  return (
    <StatusBadge variant="status" theme={currentStatus?.theme}>
      {currentStatus?.status}
    </StatusBadge>
  )
}
const ConnectorDetailsActivitiesList = ({ isLoading, activities }: ConnectorDetailsActivitiesListProps) => {
  const { t } = useTranslation()
  const content = activities?.content
  if (isLoading) {
    return <Skeleton.Table countRows={12} countColumns={3} />
  }

  if (!content.length) {
    return (
      <NoData
        withBorder
        className="min-h-[65vh]"
        textWrapperClassName="max-w-[350px]"
        imageName="no-data-cog"
        title={t('views:noData.noActivities', 'No activities yet')}
        description={[t('views:noData.noActivitiesDescription', 'There are no activities yet.')]}
      />
    )
  }

  return (
    <Table.Root className={isLoading ? '[mask-image:linear-gradient(to_bottom,black_30%,transparent_100%)]' : ''}>
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-96 text-cn-3">{t('views:connectors.activity', 'Activity')}</Table.Head>
          <Table.Head className="w-96 text-cn-3">{t('views:connectors.time', 'Time')}</Table.Head>
          <Table.Head className="w-44 text-cn-3">{t('views:connectors.status', 'Status')}</Table.Head>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {content.map(({ referredEntity, activityTime, description, activityStatus }: ConnectorActivityItem) => {
          const { name, entityRef } = referredEntity
          const identifier = entityRef?.identifier || name
          return (
            <Table.Row key={identifier} className="cursor-pointer">
              <Table.Cell className="max-w-80 content-center items-center truncate">
                <Activity activity={description} />
              </Table.Cell>
              <Table.Cell className="my-2 block max-w-80 content-center items-center p-2.5">
                {activityTime ? (
                  <TimeAgoCard
                    timestamp={activityTime}
                    textProps={{ variant: 'body-strong', color: 'foreground-3', truncate: true }}
                  />
                ) : null}
              </Table.Cell>

              <Table.Cell className="max-w-full content-center truncate p-2.5 text-left text-sm font-normal leading-tight tracking-tight text-cn-3">
                <ConnectivityStatus status={activityStatus.toLowerCase()} />
              </Table.Cell>
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table.Root>
  )
}

export default ConnectorDetailsActivitiesList
