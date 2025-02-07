import { FC } from 'react'

import {
  Icon,
  MoreActionsTooltip,
  SkeletonTable,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components'
import { timeAgo } from '@utils/utils'
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
    <Table
      className={isLoading ? '[mask-image:linear-gradient(to_bottom,black_30%,transparent_100%)]' : ''}
      variant="asStackedList"
    >
      <TableHeader>
        <TableRow>
          <TableHead>{t('views:profileSettings.name', 'Name')}</TableHead>
          <TableHead>{t('views:profileSettings.added', 'Added')}</TableHead>
          <TableHead>{t('views:profileSettings.lastUsedDate', 'Last used date')}</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>

      {isLoading ? (
        <SkeletonTable countRows={4} countColumns={4} />
      ) : (
        <TableBody>
          {publicKeys.length ? (
            publicKeys.map((key: KeysList) => (
              <TableRow key={key.identifier}>
                <TableCell className="content-center">
                  <div className="inline-flex items-center gap-x-2.5">
                    <Icon name="ssh-key" size={32} className="bg-background-8 text-foreground-2 rounded-md" />
                    <div className="flex flex-col">
                      <span className="block w-[200px] truncate font-medium text-foreground-1">{key.identifier}</span>
                      <span className="w-[200px] truncate text-12 text-foreground-3">{key.fingerprint}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="h-1 content-center">
                  <span className="text-foreground-1">{timeAgo(new Date(key.created!).getTime())}</span>
                </TableCell>
                <TableCell className="h-1 content-center">
                  {/* TODO: pass the data to KeysList item about last used date */}
                  {/* <span className="text-foreground-1">
                  {key.last_used ? new Date(key.last_used).toLocaleString() : 'Never used'}
                </span> */}
                </TableCell>
                <TableCell className="content-center text-right">
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
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell className="content-center !p-4" colSpan={4}>
                <p className="text-center text-14 text-foreground-4">
                  {t(
                    'views:profileSettings.noDataKeysDescription',
                    'There are no SSH keys associated with this account.'
                  )}
                </p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      )}
    </Table>
  )
}
