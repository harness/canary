import { useCallback } from 'react'

import {
  NoData,
  PermissionIdentifier,
  ResourceType,
  Skeleton,
  Table,
  Text,
  TimeAgoCard
} from '@harnessio/ui/components'
import { useComponents, useCustomDialogTrigger, useTranslation } from '@harnessio/ui/context'

import { SecretListProps } from './types'

export function SecretList({
  secrets,
  isLoading,
  toSecretDetails,
  onDeleteSecret,
  onEditSecret,
  handleResetFiltersQueryAndPages,
  isDirtyList,
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

  if (!secrets.length && isDirtyList) {
    return (
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
    )
  }

  return (
    <Table.Root tableClassName="table-fixed" size="compact" paginationProps={paginationProps}>
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-3/6">{t('views:secret.title', 'Name')}</Table.Head>
          <Table.Head className="w-1/6" contentClassName="truncate">
            {t('views:common.manager', 'Secret Manager')}
          </Table.Head>
          <Table.Head className="w-1/6" containerProps={{ justify: 'end' }}>
            {t('views:common.created', 'Created')}
          </Table.Head>
          <Table.Head className="w-1/6" containerProps={{ justify: 'end' }}>
            {t('views:common.updated', 'Updated')}
          </Table.Head>
          <Table.Head className="w-[68px]" />
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
            <Table.Cell className="text-right">
              {!!secret?.createdAt && (
                <TimeAgoCard timestamp={secret.createdAt} dateTimeFormatOptions={{ dateStyle: 'medium' }} />
              )}
            </Table.Cell>
            <Table.Cell className="text-right">
              {!!secret?.updatedAt && (
                <TimeAgoCard timestamp={secret.updatedAt} dateTimeFormatOptions={{ dateStyle: 'medium' }} />
              )}
            </Table.Cell>
            <Table.Cell className="text-right">
              <RbacMoreActionsTooltip
                iconName="more-horizontal"
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
