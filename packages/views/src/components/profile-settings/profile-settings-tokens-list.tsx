import { Icon, Text } from '@harnessio/canary'
import { Table } from '@harnessio/ui/components'

import { timeAgo } from '../../utils/utils'
import { TokensList } from './types'

interface PageProps {
  tokens: TokensList[]
  openAlertDeleteDialog: (params: { identifier: string; type: string }) => void
}

export const ProfileTokensList: React.FC<PageProps> = ({ tokens, openAlertDeleteDialog }) => {
  return (
    <Table.Root variant="asStackedList">
      <Table.Header>
        <Table.Row>
          <Table.Head>Token</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head>Expiration date</Table.Head>
          <Table.Head>Created</Table.Head>
          <Table.Head></Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {tokens && tokens.length > 0 ? (
          tokens.map(token => (
            <Table.Row key={token.uid}>
              <Table.Cell>
                <Text weight="bold">{token.identifier}</Text>
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-2">
                  <Icon name="green-dot" size={8} />
                  <Text>Active</Text>
                </div>
              </Table.Cell>
              <Table.Cell>
                {token.expires_at ? new Date(token.expires_at).toLocaleString() : 'No Expiration'}
              </Table.Cell>
              <Table.Cell>{timeAgo(new Date(token.issued_at!).getTime())}</Table.Cell>
              <Table.Cell className="content-center">
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
              </Table.Cell>
            </Table.Row>
          ))
        ) : (
          <Table.Row>
            <Table.Cell colSpan={5}>
              <Text as="p" size={2} align="center" color={'tertiaryBackground'} className="w-full text-center">
                There are no personal access tokens associated with this account.
              </Text>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table.Root>
  )
}
