import { useNavigate } from 'react-router-dom'

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
} from '@/components'
import { CommitCopyActions } from '@/components/commit-copy-actions'
import { getInitials } from '@/utils/utils'

import { RepoFile, SummaryItemType } from '../../repo.types'

interface SummaryProps {
  latestFile: Pick<RepoFile, 'user' | 'lastCommitMessage' | 'timestamp' | 'sha'>
  files?: RepoFile[]
}

const TopTitle = ({ file }: { file: Pick<RepoFile, 'user' | 'lastCommitMessage' | 'timestamp' | 'sha'> }) => {
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

const TopDetails = ({ file }: { file: Pick<RepoFile, 'user' | 'lastCommitMessage' | 'timestamp' | 'sha'> }) => {
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

const Summary: React.FC<SummaryProps> = ({ latestFile, files }) => {
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
      <Table variant="asStackedList">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Last commit message</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        {files?.length ? (
          <TableBody>
            {files.map(file => (
              <TableRow key={file.id} onClick={() => navigate(file.path)}>
                <TableCell>
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

export default Summary
