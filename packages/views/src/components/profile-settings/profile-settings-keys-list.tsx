import { Icon, Text } from '@harnessio/canary'
import { Table } from '@harnessio/ui/components'

import { timeAgo } from '../../utils/utils'
import { KeysList } from './types'

interface PageProps {
  publicKeys: KeysList[]
  openAlertDeleteDialog: (params: { identifier: string; type: string }) => void
}

export const ProfileKeysList: React.FC<PageProps> = ({ publicKeys, openAlertDeleteDialog }) => {
  return (
    <Table.Root variant="asStackedList">
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Added</Table.Head>
          <Table.Head>Last used date</Table.Head>
          <Table.Head></Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {publicKeys && publicKeys.length > 0 ? (
          publicKeys.map((key: KeysList) => (
            <Table.Row key={key.identifier}>
              <Table.Cell>
                <div className="inline-flex gap-2">
                  <Icon name="ssh-key" size={42} />
                  <div className="flex flex-col">
                    <Text weight="bold">{key.identifier}</Text>
                    <Text truncate color="tertiaryBackground" className="max-w-[200px] overflow-hidden">
                      {key.fingerprint}
                    </Text>
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell className="h-1">
                <div className="flex h-full items-center">{timeAgo(new Date(key.created!).getTime())}</div>
              </Table.Cell>
              <Table.Cell className="h-1">
                {/* <div className="h-full flex items-center">
                  {key.last_used ? new Date(key.last_used).toLocaleString() : 'Never used'}
                </div> */}
              </Table.Cell>
              <Table.Cell className="content-center">
                <div
                  role="button"
                  tabIndex={0}
                  className="flex cursor-pointer items-center justify-end gap-1.5"
                  onClick={() => {
                    openAlertDeleteDialog({ identifier: key.identifier!, type: 'key' })
                  }}
                >
                  <Icon name="trash" size={14} className="text-tertiary-background" />
                </div>
              </Table.Cell>
            </Table.Row>
          ))
        ) : (
          <Table.Row>
            <Table.Cell colSpan={4}>
              <Text as="p" size={2} align="center" color={'tertiaryBackground'} className="w-full text-center">
                There are no SSH keys associated with this account.
              </Text>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table.Root>
  )
}
