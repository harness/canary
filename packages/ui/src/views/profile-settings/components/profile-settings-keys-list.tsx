import { FC } from 'react'

import { Icon, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Text } from '@/components'
import { timeAgo } from '@utils/utils'
import { TranslationStore } from '@views/repo'

import { KeysList } from '../types'

interface ProfileKeysListProps {
  publicKeys: KeysList[]
  openAlertDeleteDialog: (params: { identifier: string; type: string }) => void
  useTranslationStore: () => TranslationStore
}

export const ProfileKeysList: FC<ProfileKeysListProps> = ({
  publicKeys,
  openAlertDeleteDialog,
  useTranslationStore
}) => {
  const { t } = useTranslationStore()
  return (
    <Table variant="asStackedList">
      <TableHeader>
        <TableRow>
          <TableHead>{t('views:profileSettings.name', 'Name')}</TableHead>
          <TableHead>{t('views:profileSettings.added', 'Added')}</TableHead>
          <TableHead>{t('views:profileSettings.lastUsedDate', 'Last used date')}</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {publicKeys && publicKeys.length > 0 ? (
          publicKeys.map((key: KeysList) => (
            <TableRow key={key.identifier}>
              <TableCell>
                <div className="inline-flex gap-2">
                  <Icon name="ssh-key" size={42} />
                  <div className="flex flex-col">
                    <Text weight="bold">{key.identifier}</Text>
                    <Text className="max-w-[200px] overflow-hidden" truncate color="tertiaryBackground">
                      {key.fingerprint}
                    </Text>
                  </div>
                </div>
              </TableCell>
              <TableCell className="h-1">
                <div className="flex h-full items-center">{timeAgo(new Date(key.created!).getTime())}</div>
              </TableCell>
              <TableCell className="h-1">
                {/* <div className="h-full flex items-center">
                  {key.last_used ? new Date(key.last_used).toLocaleString() : 'Never used'}
                </div> */}
              </TableCell>
              <TableCell className="content-center">
                <div
                  role="button"
                  tabIndex={0}
                  className="p-1"
                  onClick={() => {
                    openAlertDeleteDialog({ identifier: key.identifier!, type: 'key' })
                  }}
                >
                  <span className="sr-only">Delete personal access token</span>
                  <Icon className="text-tertiary-background" name="trash" size={14} />
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell className="!p-4" colSpan={4}>
              <Text className="w-full text-center" as="p" size={2} align="center" color="foreground-4">
                {t(
                  'views:profileSettings.noDataKeysDescription',
                  'There are no SSH keys associated with this account.'
                )}
              </Text>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
