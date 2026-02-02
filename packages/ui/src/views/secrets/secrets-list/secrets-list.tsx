import { useCallback } from 'react'

import { NoData, PermissionIdentifier, ResourceType, Skeleton, Table, Text, TimeAgoCard } from '@/components'
import { useComponents, useCustomDialogTrigger, useTranslation } from '@/context'

import { SecretListProps } from './types'

export function SecretList({
  secrets,
  isLoading,
  isFiltered,
  toSecretDetails,
  onCreateSecret,
  onDeleteSecret,
  onEditSecret,
  handleResetFiltersQueryAndPages,
  paginationProps
}: SecretListProps): JSX.Element {
  const { t } = useTranslation()

  const { triggerRef, registerTrigger } = useCustomDialogTrigger()
  const { RbacMoreActionsTooltip } = useComponents()

  const handleDeleteSecret = useCallback(
    (secretId: string) => {
      registerTrigger()
      onDeleteSecret(secretId)
    },
    [onDeleteSecret, registerTrigger]
  )

  if (isLoading) {
    return <Skeleton.Table countRows={12} countColumns={5} />
  }

  if (!secrets.length) {
    return isFiltered ? (
      <NoData
        withBorder
        imageName="no-search-magnifying-glass"
        title={t('views:noData.noResults', 'No search results')}
        description={[
          t('views:noData.checkSpelling', 'Check your spelling and filter options,'),
          t('views:noData.changeSearch', 'or search for a different keyword.')
        ]}
        secondaryButton={{
          icon: 'trash',
          label: t('views:noData.clearFilters', 'Clear filters'),
          onClick: handleResetFiltersQueryAndPages
        }}
      />
    ) : (
      <NoData
        withBorder
        imageName="no-data-cog"
        title={t('views:noData.noSecrets', 'No secrets found')}
        description={[
          t('views:noData.noSecrets', 'There are no secrets in this project yet.'),
          t('views:noData.createNewSecret', 'Create a new Secret if required.')
        ]}
        secondaryButton={{
          icon: 'plus',
          label: t('views:secrets.createNew', 'Create Secret'),
          onClick: onCreateSecret
        }}
      />
    )
  }

  return (
    <Table.Root tableClassName="table-fixed" size="compact" paginationProps={paginationProps}>
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-full">{t('views:secret.title', 'Name')}</Table.Head>
          <Table.Head className="w-48 min-w-48 max-w-48" contentClassName="truncate">
            {t('views:common.manager', 'Secret Manager')}
          </Table.Head>
          <Table.Head className="w-28 min-w-28 max-w-28">{t('views:common.created', 'Created')}</Table.Head>
          <Table.Head className="w-28 min-w-28 max-w-28">{t('views:common.updated', 'Updated')}</Table.Head>
          <Table.Head className="w-16 min-w-16 max-w-16 text-right" />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {secrets.map(secret => (
          <Table.Row key={secret.identifier} to={toSecretDetails?.(secret)}>
            <Table.Cell title={secret.name}>
              <Text truncate>{secret.name}</Text>
            </Table.Cell>
            <Table.Cell>
              <Text truncate>
                {secret.spec?.secretManagerIdentifier === 'harnessSecretManager'
                  ? 'Harness'
                  : secret.spec?.secretManagerIdentifier}
              </Text>
            </Table.Cell>
            <Table.Cell>{!!secret?.createdAt && <TimeAgoCard timestamp={secret.createdAt} />}</Table.Cell>
            <Table.Cell>{!!secret?.updatedAt && <TimeAgoCard timestamp={secret.updatedAt} />}</Table.Cell>
            <Table.Cell className="text-right">
              <RbacMoreActionsTooltip
                isInTable
                ref={triggerRef}
                actions={[
                  {
                    title: t('views:secrets.viewDetails', 'View details'),
                    iconName: 'docs',
                    to: toSecretDetails?.(secret) || ''
                  },
                  {
                    title: t('views:secrets.edit', 'Edit'),
                    iconName: 'edit-pencil',
                    onClick: () => {
                      registerTrigger()
                      onEditSecret(secret)
                    },
                    rbac: {
                      resource: {
                        resourceType: ResourceType.SECRET,
                        resourceIdentifier: secret.identifier
                      },
                      permissions: [PermissionIdentifier.UPDATE_SECRET]
                    }
                  },
                  {
                    isDanger: true,
                    title: t('views:secrets.delete', 'Delete'),
                    iconName: 'trash',
                    onClick: () => handleDeleteSecret(secret.identifier),
                    rbac: {
                      resource: {
                        resourceType: ResourceType.SECRET,
                        resourceIdentifier: secret.identifier
                      },
                      permissions: [PermissionIdentifier.DELETE_SECRET]
                    }
                  }
                ]}
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}
