import { useNavigate } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage, ButtonGroup, Icon, Spacer, StackedList, Text } from '@harnessio/canary'
import { CommitCopyActions, Table } from '@harnessio/ui/components'

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
  path: string
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
      <Text size={2} weight="normal" color="primary" className="line-clamp-1">
        {lastCommitMessage}
      </Text>
    </ButtonGroup.Root>
  )
}

export const TopDetails = ({ file }: { file: Pick<FileProps, 'user' | 'lastCommitMessage' | 'timestamp' | 'sha'> }) => {
  const { sha, timestamp } = file
  return (
    <ButtonGroup.Root verticalAlign="center" spacing="2">
      <CommitCopyActions sha={sha || ''} />
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
  const navigate = useNavigate()

  return (
    <>
      <StackedList.Root>
        <StackedList.Item disableHover isHeader className="px-3 py-2.5">
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
      <Table.Root variant="asStackedList">
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
            <Table.Head>Last commit message</Table.Head>
            <Table.Head className="text-right">Date</Table.Head>
          </Table.Row>
        </Table.Header>
        {files && files.length > 0 ? (
          <Table.Body>
            {files.map(file => (
              <Table.Row key={file.id} onClick={() => navigate(file.path)}>
                <Table.Cell>
                  <ButtonGroup.Root
                    direction="horizontal"
                    verticalAlign="center"
                    spacing="1.5"
                    className="cursor-pointer"
                  >
                    {file.type === SummaryItemType.File ? (
                      <Icon name="file" size={14} className="text-tertiary-background" />
                    ) : (
                      <Icon name="folder" size={14} className="text-tertiary-background" />
                    )}
                    <Text truncate color="primary">
                      {file.name}
                    </Text>
                  </ButtonGroup.Root>
                </Table.Cell>
                <Table.Cell>
                  <Text color="tertiaryBackground" className="line-clamp-1">
                    {file.lastCommitMessage}
                  </Text>
                </Table.Cell>
                <Table.Cell className="text-right">
                  <Text color="tertiaryBackground" wrap="nowrap">
                    {file.timestamp}
                  </Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        ) : (
          <Text>No files available</Text>
        )}
      </Table.Root>
    </>
  )
}
