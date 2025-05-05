import { Icon, MoreActionsTooltip, NoData, SkeletonList, SkeletonTable, Table } from '@/components'
import { useRouterContext } from '@/context'
import { timeAgo } from '@/utils'

import { SecretListProps } from './types'

const Title = ({ title }: { title: string }): JSX.Element => (
  <span className="max-w-full truncate font-medium text-cn-foreground-1">{title}</span>
)

export function SecretList({
  secrets,
  useTranslationStore,
  isLoading,
  toSecretDetails,
  onDeleteSecret
}: SecretListProps): JSX.Element {
  const { navigate } = useRouterContext()
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
      tableClassName="table-fixed"
    >
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-[361px]">{t('views:secret.title', 'Name')}</Table.Head>
          <Table.Head className="w-[350px]">{t('views:common.manager', 'Secrets Manager')}</Table.Head>
          <Table.Head className="w-60">{t('views:common.lastActivity', 'Last Activity')}</Table.Head>
          <Table.Head></Table.Head>
        </Table.Row>
      </Table.Header>
      {isLoading ? (
        <SkeletonTable countRows={12} countColumns={5} />
      ) : (
        <Table.Body>
          {secrets.map(secret => (
            <Table.Row
              key={secret.identifier}
              className="cursor-pointer"
              onClick={() => navigate(`${toSecretDetails?.(secret)}`)}
            >
              <Table.Cell className="w-[361px] content-center truncate">
                <div className="flex items-center gap-2.5 !py-2.5">
                  <Icon name="ssh-key" size={24} />
                  <Title title={secret.identifier} />
                </div>
              </Table.Cell>
              <Table.Cell className="w-[350px] content-center truncate !py-2.5">
                {secret.spec?.secretManagerIdentifier}
              </Table.Cell>
              <Table.Cell className="content-center !py-2.5">
                {secret?.updatedAt ? timeAgo(secret.updatedAt) : null}
              </Table.Cell>
              <Table.Cell className="content-center !py-2.5 text-right">
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
