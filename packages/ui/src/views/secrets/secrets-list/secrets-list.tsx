import { Icon, MoreActionsTooltip, NoData, SkeletonList, SkeletonTable, Table } from '@/components'
import { timeAgo } from '@utils/utils'

import { SecretListProps } from './types'

const Title = ({ title }: { title: string }): JSX.Element => (
  <span className="max-w-full truncate font-medium">{title}</span>
)

export function SecretList({
  secrets,
  useTranslationStore,
  isLoading,
  toSecretDetails,
  onDeleteSecret
}: SecretListProps): JSX.Element {
  const { t } = useTranslationStore()

  if (isLoading) {
    return <SkeletonList />
  }

  if (!secrets.length) {
    return (
      <NoData
        withBorder
        iconName="no-data-cog"
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
      variant="asStackedList"
    >
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-96">{t('views:secret.title', 'Secret')}</Table.Head>
          <Table.Head className="w-96">{t('views:common.details', 'Details')}</Table.Head>
          <Table.Head className="w-44">{t('views:common.lastActivity', 'Last Activity')}</Table.Head>
          <Table.Head className="w-44">{t('views:common.created', 'Created')}</Table.Head>
        </Table.Row>
      </Table.Header>
      {isLoading ? (
        <SkeletonTable countRows={12} countColumns={5} />
      ) : (
        <Table.Body>
          {secrets.map(secret => (
            <Table.Row key={secret.identifier} className="cursor-pointer" onClick={() => toSecretDetails?.(secret)}>
              <Table.Cell className="max-w-80 content-center truncate">
                <div className="flex items-center gap-2.5">
                  <Icon name="ssh-key" size={24} />
                  <Title title={secret.identifier} />
                </div>
              </Table.Cell>
              <Table.Cell className="max-w-80 content-center truncate">
                {t('views:common.manager', 'Manager')}: {secret.spec?.secretManagerIdentifier}
              </Table.Cell>
              <Table.Cell className="content-center">{secret?.updatedAt ? timeAgo(secret.updatedAt) : null}</Table.Cell>
              <Table.Cell className="content-center">{secret?.createdAt ? timeAgo(secret.createdAt) : null}</Table.Cell>
              <Table.Cell className="text-right">
                <MoreActionsTooltip
                  isInTable
                  actions={[
                    {
                      isDanger: true,
                      title: t('views:secrets.delete', 'Delete Secret'),
                      onClick: () => onDeleteSecret(secret.identifier)
                    }
                  ]}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      )}
    </Table.Root>
  )
}
