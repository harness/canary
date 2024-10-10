import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Text } from '@harnessio/canary'
import { timeAgo } from '../utils/utils'
import { Icon } from '@harnessio/canary'

export interface KeysList {
  created?: number
  verified?: number | null
  identifier: string
  usage?: string
  fingerprint?: string
  comment?: string
  type?: string
}

interface PageProps {
  publicKeys: KeysList[]
  deletePublicKey: (id: string) => void
}

export const ProfileKeysList: React.FC<PageProps> = ({ publicKeys, deletePublicKey }) => {
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
                <div className="h-full flex items-center">{timeAgo(new Date(key.created!).getTime())}</div>
              </TableCell>
              <TableCell className="h-1">
                {/* <div className="h-full flex items-center">
                  {key.last_used ? new Date(key.last_used).toLocaleString() : 'Never used'}
                </div> */}
              </TableCell>
              <TableCell className="content-center">
                <div className="flex gap-1.5 items-center justify-end" onClick={() => deletePublicKey(key.identifier)}>
                  <Icon name="trash" size={14} className="text-tertiary-background" />
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4}>
              <Text as="p" size={2} align="center" color={'tertiaryBackground'} className="text-center w-full">
                There are no SSH keys associated with this account.
              </Text>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
