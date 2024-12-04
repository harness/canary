import { Icon, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Text } from '@harnessio/canary'

import { timeAgo } from '../../utils/utils'
import { KeysList } from './types'

interface PageProps {
  publicKeys: KeysList[]
  openAlertDeleteDialog: (params: { identifier: string; type: string }) => void
}

export const ProfileKeysList: React.FC<PageProps> = ({ publicKeys, openAlertDeleteDialog }) => {
  return (
    <Table variant="asStackedList">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Added</TableHead>
          <TableHead>Last used date</TableHead>
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
                    <Text truncate color="tertiaryBackground" className="max-w-[200px] overflow-hidden">
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
                  className="flex cursor-pointer items-center justify-end gap-1.5"
                  onClick={() => {
                    openAlertDeleteDialog({ identifier: key.identifier!, type: 'key' })
                  }}
                >
                  <Icon name="trash" size={14} className="text-tertiary-background" />
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4}>
              <Text as="p" size={2} align="center" color={'tertiaryBackground'} className="w-full text-center">
                There are no SSH keys associated with this account.
              </Text>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
