import { Icon, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Text } from '@/components'
import { timeAgo } from '@/utils/utils'
import { TranslationStore } from '@/views'

import { TokensList } from '../types'

interface PageProps {
  tokens: TokensList[]
  openAlertDeleteDialog: (params: { identifier: string; type: string }) => void
  useTranslationStore: () => TranslationStore
}

export const ProfileTokensList: React.FC<PageProps> = ({ tokens, openAlertDeleteDialog, useTranslationStore }) => {
  const { t } = useTranslationStore()
  return (
    <Table variant="asStackedList">
      <TableHeader>
        <TableRow>
          <TableHead>{t('views:profileSettings.tokenTableHeader', 'Token')}</TableHead>
          <TableHead>{t('views:profileSettings.statusTableHeader', 'Status')}</TableHead>
          <TableHead>{t('views:profileSettings.expirationDateTableHeader', 'Expiration date')}</TableHead>
          <TableHead>{t('views:profileSettings.createdTableHeader', 'Created')}</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tokens && tokens.length > 0 ? (
          tokens.map(token => (
            <TableRow key={token.uid}>
              <TableCell>
                <Text weight="bold">{token.identifier}</Text>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Icon name="green-dot" size={8} />
                  <Text>{t('views:profileSettings.active', 'Active')}</Text>
                </div>
              </TableCell>
              <TableCell>
                {token.expires_at
                  ? new Date(token.expires_at).toLocaleString()
                  : t('views:profileSettings.noExpiration', 'No Expiration')}
              </TableCell>
              <TableCell>{timeAgo(new Date(token.issued_at!).getTime())}</TableCell>
              <TableCell className="content-center">
                <div
                  role="button"
                  tabIndex={0}
                  className="flex cursor-pointer items-center justify-end gap-1.5"
                  onClick={() => {
                    openAlertDeleteDialog({ identifier: token.identifier!, type: 'token' })
                  }}
                >
                  <Icon name="trash" size={14} className="text-tertiary-background" />
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5}>
              <Text as="p" size={2} align="center" color={'tertiaryBackground'} className="w-full text-center">
                {t(
                  'views:profileSettings.noTokenDescription',
                  'There are no personal access tokens associated with this account.'
                )}
              </Text>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
