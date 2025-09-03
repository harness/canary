import { IconV2, Layout, NoData, Skeleton, Table, Text, TimeAgoCard } from '@/components'
import { useTranslation } from '@/context'

import { SecretReference } from './types'

interface SecretReferencesListProps {
  secretReferences: SecretReference[]
  isLoading: boolean
}

export function SecretReferencesList({ secretReferences, isLoading }: SecretReferencesListProps): JSX.Element {
  const { t } = useTranslation()

  if (isLoading) {
    return <Skeleton.Table countRows={12} countColumns={5} />
  }

  if (!secretReferences.length) {
    return (
      <NoData
        withBorder
        imageName="no-data-cog"
        title={t('views:noData.noSecrets', 'No secrets yet')}
        description={[
          t('views:noData.noSecrets', 'There are no secrets in this project yet.'),
          t('views:noData.createSecret', 'Create new secret.')
        ]}
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
        {secretReferences.map(reference => (
          <Table.Row key={reference.name} className="cursor-pointer">
            <Table.Cell className="w-2/4 content-center truncate">
              <Text variant="body-normal" className="text-cn-2" truncate>
                {reference.name}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Layout.Horizontal>
                <IconV2 name="connectors" size="sm" />
                <Text variant="body-normal" className="text-cn-2">
                  {reference.type}
                </Text>
              </Layout.Horizontal>
            </Table.Cell>
            <Table.Cell className="content-center">{reference.scope}</Table.Cell>
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
