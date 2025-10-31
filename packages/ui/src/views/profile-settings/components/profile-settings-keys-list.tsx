import { FC, useCallback } from 'react'

import { IconV2, MoreActionsTooltip, Skeleton, Table, Text, TimeAgoCard } from '@/components'
import { useCustomDialogTrigger, useTranslation } from '@/context'

import { KeysList } from '../types'

interface ProfileKeysListProps {
  publicKeys: KeysList[]
  isLoading?: boolean
  openAlertDeleteDialog: (params: { identifier: string; type: string }) => void
}

export const ProfileKeysList: FC<ProfileKeysListProps> = ({ publicKeys, isLoading, openAlertDeleteDialog }) => {
  const { t } = useTranslation()

  const { triggerRef, registerTrigger } = useCustomDialogTrigger()
  const handleDeleteKey = useCallback(
    (keyId: string) => {
      registerTrigger()
      openAlertDeleteDialog({ identifier: keyId, type: 'key' })
    },
    [openAlertDeleteDialog, registerTrigger]
  )

  return (
    <Table.Root
      className={isLoading ? '[mask-image:linear-gradient(to_bottom,black_30%,transparent_100%)]' : ''}
      disableHighlightOnHover
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
        <Skeleton.Table countRows={4} countColumns={4} hideHeader />
      ) : (
        <Table.Body>
          {publicKeys.length ? (
            publicKeys.map((key: KeysList) => (
              <Table.Row key={key.identifier}>
                <Table.Cell className="content-center">
                  <div className="inline-flex items-center gap-x-cn-sm">
                    <IconV2 name="ssh-key" size="lg" className="rounded-cn-3 bg-cn-gray-secondary text-cn-2" />
                    <div className="flex flex-col">
                      <Text variant="body-strong" color="foreground-1" className="w-[200px]" truncate>
                        {key.identifier}
                      </Text>
                      <Text as="span" variant="caption-normal" color="foreground-3" className="w-[200px]" truncate>
                        {key.fingerprint}
                      </Text>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell className="h-1 content-center">
                  <TimeAgoCard timestamp={new Date(key.created!).getTime()} textProps={{ color: 'foreground-1' }} />
                </Table.Cell>
                <Table.Cell className="h-1 content-center">
                  {/* TODO: pass the data to KeysList item about last used date */}
                  {/* <span className="text-cn-1">
                  {key.last_used ? new Date(key.last_used).toLocaleString() : 'Never used'}
                </span> */}
                </Table.Cell>
                <Table.Cell className="content-center text-right">
                  <MoreActionsTooltip
                    ref={triggerRef}
                    isInTable
                    actions={[
                      {
                        isDanger: true,
                        title: t('views:profileSettings.deleteSshKey', 'Delete SSH key'),
                        onClick: () => handleDeleteKey(key.identifier!)
                      }
                    ]}
                  />
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row className="hover:bg-transparent">
              <Table.Cell className="content-center !p-cn-md" colSpan={4}>
                <Text align="center">
                  {t(
                    'views:profileSettings.noDataKeysDescription',
                    'There are no SSH keys associated with this account.'
                  )}
                </Text>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      )}
    </Table.Root>
  )
}
