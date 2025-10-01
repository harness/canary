import { useCallback } from 'react'

import { NoData, PermissionIdentifier, ResourceType, Skeleton, Table, Text, TimeAgoCard } from '@/components'
import { useComponents, useCustomDialogTrigger, useTranslation } from '@/context'
import { cn } from '@utils/cn'

import { SecretListProps } from './types'

const CELL_MIN_WIDTH = 'min-w-[150px]'
const CELL_MIN_WIDTH_ICON = 'min-w-16'

export function SecretList({
  secrets,
  isLoading,
  toSecretDetails,
  onDeleteSecret,
  onEditSecret,
  handleResetFiltersQueryAndPages,
  isDirtyList
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
    <Table.Root size="compact">
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-full">{t('views:secret.title', 'Name')}</Table.Head>
          <Table.Head className={CELL_MIN_WIDTH}>{t('views:common.manager', 'Secrets Manager')}</Table.Head>
          <Table.Head className={CELL_MIN_WIDTH}>{t('views:common.lastActivity', 'Last Activity')}</Table.Head>
          <Table.Head></Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {secrets.map(secret => (
          <Table.Row key={secret.identifier} to={toSecretDetails?.(secret)}>
            <Table.Cell className="w-full max-w-[470px]" title={secret.identifier}>
              <Text truncate>{secret.identifier}</Text>
            </Table.Cell>
            <Table.Cell className={CELL_MIN_WIDTH}>
              <Text truncate>
                {secret.spec?.secretManagerIdentifier === 'harnessSecretManager'
                  ? 'Harness'
                  : secret.spec?.secretManagerIdentifier}
              </Text>
            </Table.Cell>
            <Table.Cell className={CELL_MIN_WIDTH}>
              {secret?.updatedAt ? (
                <TimeAgoCard timestamp={secret.updatedAt} dateTimeFormatOptions={{ dateStyle: 'medium' }} />
              ) : null}
            </Table.Cell>
            <Table.Cell className={cn(CELL_MIN_WIDTH_ICON, 'text-center')} disableLink>
              <RbacMoreActionsTooltip
                iconName="more-horizontal"
                isInTable
                ref={triggerRef}
                actions={[
                  {
                    title: t('views:secrets.edit', 'Edit Secret'),
                    iconName: 'edit-pencil',
                    onClick: () => onEditSecret(secret),
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
                    title: t('views:secrets.delete', 'Delete Secret'),
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
