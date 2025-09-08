import { Layout, NoData, ScopeTag, Skeleton, Table, Text, TimeAgoCard } from '@/components'
import { useTranslation } from '@/context'

import { SecretActivity } from './types'

interface SecretActivityListProps {
  secretActivity: SecretActivity[]
  isLoading: boolean
}

export function SecretActivityList({ secretActivity, isLoading }: SecretActivityListProps): JSX.Element {
  const { t } = useTranslation()

  if (isLoading) {
    return <Skeleton.Table countRows={12} countColumns={5} />
  }

  if (!secretActivity.length) {
    return (
      <NoData
        withBorder
        imageName="no-data-cog"
        title={t('views:noData.noActivity', 'No secret activity yet')}
        description={[t('views:noData.noActivity', 'There is no secret activity in this project yet.')]}
      />
    )
  }

  return (
    <Table.Root className={isLoading ? '[mask-image:linear-gradient(to_bottom,black_30%,transparent_100%)]' : ''}>
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-2/5">{t('views:secretActivity.event', 'Event')}</Table.Head>
          <Table.Head className="w-1/5">{t('views:secretActivity.entity', 'Entity')}</Table.Head>
          <Table.Head className="w-1/5">{t('views:secretActivity.scope', 'Scope')}</Table.Head>
          <Table.Head className="w-1/5">{t('views:secretActivity.timestamp', 'Timestamp')}</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {secretActivity.map(activity => (
          <Table.Row key={activity.event} className="cursor-pointer">
            <Table.Cell className="w-2/4 content-center truncate">
              <Text variant="body-normal" className="text-cn-2">
                {activity.event}
              </Text>
            </Table.Cell>
            <Table.Cell>
              {activity.entityRenderer ? (
                activity.entityRenderer
              ) : (
                <Layout.Horizontal>
                  <Text variant="body-normal" className="text-cn-2">
                    {activity.type}
                  </Text>
                </Layout.Horizontal>
              )}
            </Table.Cell>
            <Table.Cell className="content-center">
              <ScopeTag scopeType={activity.scope} scopedPath={activity.scopedPath} />
            </Table.Cell>
            <Table.Cell className="content-center">
              {activity?.createdAt ? (
                <TimeAgoCard
                  timestamp={activity.createdAt}
                  dateTimeFormatOptions={{ day: 'numeric', month: 'short', year: 'numeric' }}
                />
              ) : null}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}
