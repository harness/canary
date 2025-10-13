import { NoData, ScopeTag, Skeleton, Table, Text, TimeAgoCard } from '@/components'
import { useTranslation } from '@/context'

import { SecretActivity } from './types'

interface SecretActivityListProps {
  secretActivity: SecretActivity[]
  isLoading: boolean
  isDirtyList: boolean
  handleResetFiltersQueryAndPages: () => void
}

export function SecretActivityList({
  secretActivity,
  isLoading,
  isDirtyList,
  handleResetFiltersQueryAndPages
}: SecretActivityListProps): JSX.Element {
  const { t } = useTranslation()

  if (isLoading) {
    return <Skeleton.Table countRows={12} countColumns={5} />
  }

  if (!secretActivity.length && isDirtyList) {
    return (
      <NoData
        withBorder
        textWrapperClassName="max-w-[350px]"
        imageName={'no-search-magnifying-glass'}
        title={t('views:noData.noResults', 'No search results')}
        description={[
          t(
            'views:noData.noResultsDescription',
            'No secret references match your search. Try adjusting your keywords or filters.',
            { type: 'secret references' }
          )
        ]}
        secondaryButton={{
          icon: 'trash',
          label: t('views:noData.clearSearch', 'Clear Search'),
          onClick: handleResetFiltersQueryAndPages
        }}
      />
    )
  }

  return (
    <Table.Root tableClassName="table-fixed" disableHighlightOnHover size="relaxed">
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-2/4">{t('views:secretActivity.event', 'Event')}</Table.Head>
          <Table.Head className="w-1/5">{t('views:secretActivity.entity', 'Entity')}</Table.Head>
          <Table.Head className="w-1/5">{t('views:secretActivity.scope', 'Scope')}</Table.Head>
          <Table.Head className="w-1/5">{t('views:secretActivity.timestamp', 'Timestamp')}</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {secretActivity.map(activity => (
          <Table.Row key={activity.event}>
            <Table.Cell>
              <Text color="foreground-1" truncate>
                {activity.event}
              </Text>
            </Table.Cell>
            <Table.Cell>{activity?.entityRenderer ?? <Text>{activity.type}</Text>}</Table.Cell>
            <Table.Cell>
              <ScopeTag className="max-w-full" scopeType={activity.scope} scopedPath={activity.scopedPath} />
            </Table.Cell>
            <Table.Cell>
              {!!activity?.createdAt && (
                <TimeAgoCard
                  timestamp={activity.createdAt}
                  dateTimeFormatOptions={{ day: 'numeric', month: 'short', year: 'numeric' }}
                />
              )}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}
