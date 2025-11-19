import { ScopeTag } from '@/components/scope'

import { IconV2, Layout, NoData, PaginationProps, Skeleton, Table, Text, TimeAgoCard } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

import { SecretReference } from './types'

interface SecretReferencesListProps {
  secretReferences: SecretReference[]
  isLoading: boolean
  isDirtyList: boolean
  handleResetFiltersQueryAndPages: () => void
  paginationProps?: PaginationProps
}

export function SecretReferencesList({
  secretReferences,
  isLoading,
  isDirtyList,
  handleResetFiltersQueryAndPages,
  paginationProps
}: SecretReferencesListProps): JSX.Element {
  const { t } = useTranslation()

  if (isLoading) {
    return <Skeleton.Table countRows={12} countColumns={5} />
  }

  if (!secretReferences.length && isDirtyList) {
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
    <Table.Root tableClassName="table-fixed" size="relaxed" paginationProps={paginationProps}>
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-2/4">{t('views:entityReference.entity', 'Entity')}</Table.Head>
          <Table.Head className="w-1/5">{t('views:entityReference.type', 'Type')}</Table.Head>
          <Table.Head className="w-1/5">{t('views:entityReference.scope', 'Scope')}</Table.Head>
          <Table.Head className="w-1/5">{t('views:entityReference.created', 'Created')}</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {secretReferences.map(reference => (
          <Table.Row key={reference.name} className="cursor-pointer" to={reference.rowLink}>
            <Table.Cell>
              <Text color="foreground-1" truncate>
                {reference.name}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Layout.Horizontal gap="xs">
                <IconV2 name={reference.iconType} size="md" fallback="connectors" />
                <Text color="foreground-1">{reference.type}</Text>
              </Layout.Horizontal>
            </Table.Cell>
            <Table.Cell>
              <ScopeTag className="max-w-full" scopeType={reference.scope} scopedPath={reference.scopedPath} />
            </Table.Cell>
            <Table.Cell>
              {!!reference?.createdAt && (
                <TimeAgoCard
                  timestamp={reference.createdAt}
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
