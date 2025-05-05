import { FC } from 'react'

import { Icon, MoreActionsTooltip, SkeletonTable, Table } from '@/components'
import { timeAgo } from '@/utils'
import { TranslationStore } from '@views/repo'

import { KeysList } from '../types'

interface ProfileKeysListProps {
  publicKeys: KeysList[]
  isLoading?: boolean
  openAlertDeleteDialog: (params: { identifier: string; type: string }) => void
  useTranslationStore: () => TranslationStore
}

export const ProfileKeysList: FC<ProfileKeysListProps> = ({
  publicKeys,
  isLoading,
  openAlertDeleteDialog,
  useTranslationStore
}) => {
  const { t } = useTranslationStore()

  return (
    <Table.Root
      className={isLoading ? '[mask-image:linear-gradient(to_bottom,black_30%,transparent_100%)]' : ''}
      variant="asStackedList"
    >
      <Table.Header>
        <Table.Row>
          <Table.Head>{t('views:profileSettings.name', 'Name')}</Table.Head>
          <Table.Head>{t('views:profileSettings.added', 'Added')}</Table.Head>
          <Table.Head>{t('views:profileSettings.lastUsedDate', 'Last used date')}</Table.Head>
          <Table.Head />
        </Table.Row>
      </Table.Header>

      {isLoading ? (
        <SkeletonTable countRows={4} countColumns={4} />
      ) : (
        <Table.Body>
          {publicKeys.length ? (
            publicKeys.map((key: KeysList) => (
              <Table.Row key={key.identifier}>
                <Table.Cell className="content-center">
                  <div className="inline-flex items-center gap-x-2.5">
                    <Icon name="ssh-key" size={32} className="rounded-md bg-cn-background-8 text-cn-foreground-2" />
                    <div className="flex flex-col">
                      <span className="block w-[200px] truncate font-medium text-cn-foreground-1">
                        {key.identifier}
                      </span>
                      <span className="w-[200px] truncate text-1 text-cn-foreground-3">{key.fingerprint}</span>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell className="h-1 content-center">
                  <span className="text-cn-foreground-1">{timeAgo(new Date(key.created!).getTime())}</span>
                </Table.Cell>
                <Table.Cell className="h-1 content-center">
                  {/* TODO: pass the data to KeysList item about last used date */}
                  {/* <span className="text-cn-foreground-1">
                  {key.last_used ? new Date(key.last_used).toLocaleString() : 'Never used'}
                </span> */}
                </Table.Cell>
                <Table.Cell className="content-center text-right">
                  <MoreActionsTooltip
                    isInTable
                    actions={[
                      {
                        isDanger: true,
                        title: t('views:profileSettings.deleteSshKey', 'Delete SSH key'),
                        onClick: () => openAlertDeleteDialog({ identifier: key.identifier!, type: 'key' })
                      }
                    ]}
                  />
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row className="hover:bg-transparent">
              <Table.Cell className="content-center !p-4" colSpan={4}>
                <p className="text-center text-2 text-cn-foreground-2">
                  {t(
                    'views:profileSettings.noDataKeysDescription',
                    'There are no SSH keys associated with this account.'
                  )}
                </p>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      )}
    </Table.Root>
  )
}
