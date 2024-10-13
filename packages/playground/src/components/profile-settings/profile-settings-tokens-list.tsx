import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Text } from '@harnessio/canary'
import { Icon } from '@harnessio/canary'
import { timeAgo } from '../../utils/utils'
import { TokensList } from './types'

interface PageProps {
  tokens: TokensList[]
  openAlertDeleteDialog: (params: { identifier: string; type: string }) => void
}

export const ProfileTokensList: React.FC<PageProps> = ({ tokens, openAlertDeleteDialog }) => {
  return (
    <Table variant="asStackedList">
      <TableHeader>
        <TableRow>
          <TableHead>Token</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Expiration date</TableHead>
          <TableHead>Created</TableHead>
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
                  <Text>Active</Text>
                </div>
              </TableCell>
              <TableCell>{token.expires_at ? new Date(token.expires_at).toLocaleString() : 'No Expiration'}</TableCell>
              <TableCell>{timeAgo(new Date(token.issued_at!).getTime())}</TableCell>
              <TableCell className="content-center">
                <div
                  className="flex gap-1.5 items-center justify-end cursor-pointer"
                  onClick={() => {
                    openAlertDeleteDialog({ identifier: token.identifier!, type: 'token' })
                  }}>
                  <Icon name="trash" size={14} className="text-tertiary-background" />
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5}>
              <Text as="p" size={2} align="center" color={'tertiaryBackground'} className="text-center w-full">
                There are no personal access tokens associated with this account.
              </Text>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
