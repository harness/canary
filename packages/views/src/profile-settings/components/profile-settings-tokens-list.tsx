import { FC, useCallback } from 'react'

import { IconV2, MoreActionsTooltip, Skeleton, Table, Text, TimeAgoCard } from '@harnessio/ui/components'
import { useCustomDialogTrigger, useTranslation } from '@harnessio/ui/context'

import { TokensList } from '../types'

interface ProfileTokensListProps {
  tokens: TokensList[]
  isLoading?: boolean
  openAlertDeleteDialog: (params: { identifier: string; type: string }) => void
}

export const ProfileTokensList: FC<ProfileTokensListProps> = ({ tokens, isLoading, openAlertDeleteDialog }) => {
  const { t } = useTranslation()

  const { triggerRef, registerTrigger } = useCustomDialogTrigger()
  const handleDeleteToken = useCallback(
    (tokenId: string) => {
      registerTrigger()
      openAlertDeleteDialog({ identifier: tokenId, type: 'token' })
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
          <Table.Head>{t('views:profileSettings.tokenTableHeader', 'Token')}</Table.Head>
          <Table.Head>{t('views:profileSettings.statusTableHeader', 'Status')}</Table.Head>
          <Table.Head>{t('views:profileSettings.expirationDateTableHeader', 'Expiration date')}</Table.Head>
          <Table.Head>{t('views:profileSettings.createdTableHeader', 'Created')}</Table.Head>
          <Table.Head />
        </Table.Row>
      </Table.Header>
      {isLoading ? (
        <Skeleton.Table countRows={5} countColumns={5} hideHeader />
      ) : (
        <Table.Body>
          {tokens.length ? (
            tokens.map(token => (
              <Table.Row key={token.uid}>
                <Table.Cell className="content-center">
                  <span className="block w-[200px] truncate font-medium text-cn-1">{token.identifier}</span>
                </Table.Cell>
                <Table.Cell className="content-center">
                  <div className="flex items-center gap-x-cn-2xs">
                    <IconV2 name="circle" size="2xs" className="text-cn-success" />
                    <span className="text-cn-3">{t('views:profileSettings.active', 'Active')}</span>
                  </div>
                </Table.Cell>
                <Table.Cell className="content-center">
                  <span className="text-cn-1">
                    {token.expires_at
                      ? new Date(token.expires_at).toLocaleString()
                      : t('views:profileSettings.noExpiration', 'No Expiration')}
                  </span>
                </Table.Cell>
                <Table.Cell className="content-center">
                  <TimeAgoCard timestamp={new Date(token.issued_at!).getTime()} textProps={{ color: 'foreground-3' }} />
                </Table.Cell>
                <Table.Cell className="content-center text-right">
                  <MoreActionsTooltip
                    ref={triggerRef}
                    isInTable
                    actions={[
                      {
                        isDanger: true,
                        title: t('views:profileSettings.deleteToken', 'Delete token'),
                        onClick: () => {
                          handleDeleteToken(token.identifier!)
                        }
                      }
                    ]}
                  />
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row className="hover:bg-transparent">
              <Table.Cell className="content-center !p-cn-md" colSpan={5}>
                <Text align="center">
                  {t(
                    'views:profileSettings.noTokenDescription',
                    'There are no personal access tokens associated with this account.'
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
