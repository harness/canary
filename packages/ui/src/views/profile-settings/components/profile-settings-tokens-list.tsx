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
import { timeAgo } from '@/utils/utils'
import { TranslationStore } from '@/views'

import { TokensList } from '../types'

interface ProfileTokensListProps {
  tokens: TokensList[]
  isLoading?: boolean
  openAlertDeleteDialog: (params: { identifier: string; type: string }) => void
  useTranslationStore: () => TranslationStore
}

export const ProfileTokensList: FC<ProfileTokensListProps> = ({
  tokens,
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
          <TableHead>{t('views:profileSettings.tokenTableHeader', 'Token')}</TableHead>
          <TableHead>{t('views:profileSettings.statusTableHeader', 'Status')}</TableHead>
          <TableHead>{t('views:profileSettings.expirationDateTableHeader', 'Expiration date')}</TableHead>
          <TableHead>{t('views:profileSettings.createdTableHeader', 'Created')}</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      {isLoading ? (
        <SkeletonTable countRows={5} />
      ) : (
        <TableBody>
          {tokens.length ? (
            tokens.map(token => (
              <TableRow key={token.uid}>
                <TableCell className="content-center">
                  <span className="block w-[200px] truncate font-medium text-foreground-1">{token.identifier}</span>
                </TableCell>
                <TableCell className="content-center">
                  <div className="flex items-center gap-x-1.5">
                    <Icon name="green-dot" size={8} className="text-foreground-success" />
                    <span className="text-foreground-3">{t('views:profileSettings.active', 'Active')}</span>
                  </div>
                </TableCell>
                <TableCell className="content-center">
                  <span className="text-foreground-1">
                    {token.expires_at
                      ? new Date(token.expires_at).toLocaleString()
                      : t('views:profileSettings.noExpiration', 'No Expiration')}
                  </span>
                </TableCell>
                <TableCell className="content-center">
                  <span className="text-foreground-3">{timeAgo(new Date(token.issued_at!).getTime())}</span>
                </TableCell>
                <TableCell className="content-center text-right">
                  <MoreActionsTooltip
                    isInTable
                    actions={[
                      {
                        isDanger: true,
                        title: t('views:profileSettings.deleteToken', 'Delete token'),
                        onClick: () => {
                          openAlertDeleteDialog({ identifier: token.identifier!, type: 'token' })
                        }
                      }
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell className="content-center !p-4" colSpan={5}>
                <p className="text-center text-14 text-foreground-4">
                  {t(
                    'views:profileSettings.noTokenDescription',
                    'There are no personal access tokens associated with this account.'
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
