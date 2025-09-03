import { IconV2, Layout, Link, NoData, Skeleton, Table, Text, TimeAgoCard } from '@/components'
import { useTranslation } from '@/context'

import { ConnectorReferenceListProps } from './types'

const ConnectorDetailsReferenceList = ({
  connectorReferences,
  isLoading,
  toScope
}: ConnectorReferenceListProps): JSX.Element => {
  const { t } = useTranslation()
  if (isLoading) {
    return <Skeleton.Table countRows={12} countColumns={3} />
  }

  if (!connectorReferences.length) {
    return (
      <NoData
        withBorder
        className="min-h-[65vh]"
        textWrapperClassName="max-w-[350px]"
        imageName="no-data-cog"
        title={t('views:noData.noEntities', 'No entities yet')}
        description={[t('views:noData.noEntitiesDescription', 'There are no entities yet.')]}
      />
    )
  }

  return (
    <Table.Root className={isLoading ? '[mask-image:linear-gradient(to_bottom,black_30%,transparent_100%)]' : ''}>
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-2/5">{t('views:entityReference.entity', 'Entity')}</Table.Head>
          <Table.Head className="w-1/5">{t('views:entityReference.type', 'Type')}</Table.Head>
          <Table.Head className="w-1/5">{t('views:entityReference.scope', 'Scope')}</Table.Head>
          <Table.Head className="w-1/5">{t('views:entityReference.created', 'Created')}</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {connectorReferences.map(reference => (
          <Table.Row key={reference.name} className="cursor-pointer">
            <Table.Cell className="w-2/4 content-center truncate">
              <Text variant="body-normal" className="text-cn-foreground-2" truncate>
                {reference.name}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Layout.Horizontal>
                <IconV2 name="connectors" size="sm" />
                <Text variant="body-normal" className="text-cn-foreground-2">
                  {reference.type}
                </Text>
              </Layout.Horizontal>
            </Table.Cell>
            <Table.Cell className="content-center">
              <Link to={toScope(reference.scope)}>{reference.scope}</Link>
            </Table.Cell>
            <Table.Cell className="content-center">
              {reference?.createdAt ? (
                <TimeAgoCard
                  timestamp={reference.createdAt}
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
export default ConnectorDetailsReferenceList
