import { MoreActionsTooltip, NoData, Skeleton, Table, Text, TimeAgoCard } from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@utils/cn'

import { SecretListProps } from './types'

const CELL_MIN_WIDTH = 'min-w-[150px]'
const CELL_MIN_WIDTH_ICON = 'min-w-16'

export function SecretList({
  secrets,
  isLoading,
  toSecretDetails,
  onDeleteSecret,
  onEditSecret
}: SecretListProps): JSX.Element {
  const { t } = useTranslation()

  if (isLoading) {
    return <Skeleton.Table countRows={12} countColumns={5} />
  }

  if (!secrets.length) {
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
    <Table.Root
      className={isLoading ? '[mask-image:linear-gradient(to_bottom,black_30%,transparent_100%)]' : ''}
      size="compact"
    >
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
            <Table.Cell className="w-full max-w-[470px]">
              <Text truncate>{secret.identifier}</Text>
            </Table.Cell>
            <Table.Cell className={CELL_MIN_WIDTH}>
              <Text truncate>{secret.spec?.secretManagerIdentifier}</Text>
            </Table.Cell>
            <Table.Cell className={CELL_MIN_WIDTH}>
              {secret?.updatedAt ? (
                <TimeAgoCard timestamp={secret.updatedAt} dateTimeFormatOptions={{ dateStyle: 'medium' }} />
              ) : null}
            </Table.Cell>
            <Table.Cell className={cn(CELL_MIN_WIDTH_ICON, 'text-center')} disableLink>
              <MoreActionsTooltip
                iconName="more-horizontal"
                isInTable
                actions={[
                  {
                    title: t('views:secrets.edit', 'Edit Secret'),
                    iconName: 'edit-pencil',
                    onClick: () => onEditSecret(secret)
                  },
                  {
                    isDanger: true,
                    title: t('views:secrets.delete', 'Delete Secret'),
                    iconName: 'trash',
                    onClick: () => onDeleteSecret(secret.identifier)
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
