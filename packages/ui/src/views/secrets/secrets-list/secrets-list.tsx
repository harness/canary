import { IconV2, MoreActionsTooltip, NoData, Skeleton, Table, TimeAgoCard } from '@/components'
import { useTranslation } from '@/context'

import { SecretListProps } from './types'

const Title = ({ title }: { title: string }): JSX.Element => (
  <span className="text-cn-1 max-w-full truncate font-medium">{title}</span>
)

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
    <Table.Root className={isLoading ? '[mask-image:linear-gradient(to_bottom,black_30%,transparent_100%)]' : ''}>
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-1/3">{t('views:secret.title', 'Name')}</Table.Head>
          <Table.Head className="w-1/3">{t('views:common.manager', 'Secrets Manager')}</Table.Head>
          <Table.Head className="w-1/3">{t('views:common.lastActivity', 'Last Activity')}</Table.Head>
          <Table.Head></Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {secrets.map(secret => (
          <Table.Row key={secret.identifier} className="cursor-pointer" to={toSecretDetails?.(secret)}>
            <Table.Cell className="w-[361px] content-center truncate">
              <div className="flex items-center gap-2.5">
                <IconV2 name="ssh-key" size="md" />
                <Title title={secret.identifier} />
              </div>
            </Table.Cell>
            <Table.Cell className="w-[350px] content-center truncate">
              {secret.spec?.secretManagerIdentifier}
            </Table.Cell>
            <Table.Cell className="content-center">
              {secret?.updatedAt ? <TimeAgoCard timestamp={secret.updatedAt} /> : null}
            </Table.Cell>
            <Table.Cell className="content-center text-right">
              <MoreActionsTooltip
                isInTable
                actions={[
                  {
                    isDanger: true,
                    title: t('views:secrets.delete', 'Delete Secret'),
                    onClick: () => onDeleteSecret(secret.identifier)
                  },
                  {
                    title: t('views:secrets.edit', 'Edit Secret'),
                    onClick: () => onEditSecret(secret)
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
