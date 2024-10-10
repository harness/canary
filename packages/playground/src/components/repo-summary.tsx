import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  ButtonGroup,
  Icon,
  Spacer,
  StackedList,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text
} from '@harnessio/canary'
import React from 'react'
import { getInitials } from '../utils/utils'

export enum SummaryItemType {
  Folder = 0,
  File = 1
}

interface UserProps {
  name: string
  avatarUrl?: string
}

export interface FileProps {
  id: string
  type: SummaryItemType
  name: string
  lastCommitMessage: string
  timestamp: string
  user?: UserProps
  sha?: string
}

interface PageProps {
  latestFile: Pick<FileProps, 'user' | 'lastCommitMessage' | 'timestamp' | 'sha'>
  files?: FileProps[]
}

export const TopTitle = ({ file }: { file: Pick<FileProps, 'user' | 'lastCommitMessage' | 'timestamp' | 'sha'> }) => {
  const { user, lastCommitMessage } = file

  return (
    <ButtonGroup.Root verticalAlign="center" spacing="2">
      <Avatar size="6">
        <AvatarImage src={user?.avatarUrl} />
        <AvatarFallback>
          <Text size={0} color="tertiaryBackground">
            {getInitials(user?.name || '')}
          </Text>
        </AvatarFallback>
      </Avatar>
      <Text size={2} weight="normal" color="tertiaryBackground" wrap="nowrap">
        {user?.name}
      </Text>
      <Text size={2} weight="normal" color="primary" wrap="nowrap">
        {lastCommitMessage}
      </Text>
    </ButtonGroup.Root>
  )
}

export const TopDetails = ({ file }: { file: Pick<FileProps, 'user' | 'lastCommitMessage' | 'timestamp' | 'sha'> }) => {
  const { sha, timestamp } = file
  return (
    <ButtonGroup.Root verticalAlign="center" spacing="2">
      <Text size={2} weight="normal" color="tertiaryBackground">
        {sha}
      </Text>
      <Text size={2} weight="normal" color="tertiaryBackground">
        |
      </Text>
      <Text size={2} weight="normal" color="tertiaryBackground">
        {timestamp}
      </Text>
    </ButtonGroup.Root>
  )
}

export const Summary = ({ ...props }: PageProps) => {
  const { latestFile, files } = props

  return (
    <>
      <StackedList.Root>
        <StackedList.Item disableHover isHeader className="py-2.5 px-3">
          {latestFile ? (
            <>
              <StackedList.Field title={<TopTitle file={latestFile} />} />
              <StackedList.Field right title={<TopDetails file={latestFile} />} />
            </>
          ) : (
            <Text>No files available</Text>
          )}
        </StackedList.Item>
      </StackedList.Root>
      <Spacer size={5} />
      <Table variant="asStackedList">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Last commit message</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        {files && files.length > 0 ? (
          <TableBody>
            {files.map(file => (
              <TableRow key={file.id}>
                <TableCell>
                  <ButtonGroup.Root direction="horizontal" verticalAlign="center" spacing="1.5">
                    {file.type === SummaryItemType.File ? (
                      <Icon name="file" size={14} className="text-tertiary-background" />
                    ) : (
                      <Icon name="folder" size={14} className="text-tertiary-background" />
                    )}
                    <Text truncate color="primary">
                      {file.name}
                    </Text>
                  </ButtonGroup.Root>
                </TableCell>
                <TableCell>
                  <Text color="tertiaryBackground" className="line-clamp-1">
                    {file.lastCommitMessage}
                  </Text>
                </TableCell>
                <TableCell className="text-right">
                  <Text color="tertiaryBackground" wrap="nowrap">
                    {file.timestamp}
                  </Text>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <Text>No files available</Text>
        )}
      </Table>
    </>
  )
}
