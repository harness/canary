import { useNavigate } from 'react-router-dom'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  CommitCopyActions,
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
import { LatestFileTypes, RepoFile, SummaryItemType, TranslationStore } from '@/views'
import { getInitials } from '@utils/stringUtils'

interface SummaryProps {
  latestFile: LatestFileTypes
  files: RepoFile[]
  useTranslationStore: () => TranslationStore
}

export const TopTitle = ({ file }: { file: LatestFileTypes }) => {
  const { user, lastCommitMessage } = file

  return (
    <div className="flex items-center gap-2">
      <Avatar size="6">
        <AvatarImage src={user?.avatarUrl || ''} />
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
    </div>
  )
}

export const TopDetails = ({ file }: { file: LatestFileTypes }) => {
  const { sha, timestamp } = file
  return (
    <div className="flex items-center gap-2">
      <CommitCopyActions sha={sha || ''} />
      <Text className="text-borders-2" size={2} weight="normal">
        |
      </Text>
      <Text size={2} weight="normal" color="tertiaryBackground">
        {timestamp}
      </Text>
    </div>
  )
}

export const Summary = ({ latestFile, files, useTranslationStore }: SummaryProps) => {
  const navigate = useNavigate()
  const { t } = useTranslationStore()

  return (
    <>
      <StackedList.Root>
        <StackedList.Item disableHover isHeader className="px-3 py-2">
          {latestFile ? (
            <>
              <StackedList.Field title={<TopTitle file={latestFile} />} />
              <StackedList.Field right title={<TopDetails file={latestFile} />} />
            </>
          ) : (
            <Text>{t('views:repos.noFile', 'No files available')}</Text>
          )}
        </StackedList.Item>
      </StackedList.Root>
      <Spacer size={4} />
      <Table variant="asStackedList">
        <TableHeader>
          <TableRow>
            <TableHead>{t('views:repos.name', 'Name')}</TableHead>
            <TableHead>{t('views:repos.lastCommit', 'Last commit message')}</TableHead>
            <TableHead className="text-right">{t('views:repos.date', 'Date')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map(file => (
            <TableRow key={file.id} onClick={() => navigate(file.path)}>
              <TableCell>
                <div className="flex cursor-pointer items-center gap-1.5">
                  <Icon
                    className="text-icons-7"
                    name={file.type === SummaryItemType.File ? 'file' : 'folder'}
                    size={16}
                  />
                  <Text truncate color="primary">
                    {file.name}
                  </Text>
                </div>
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
      </Table>
    </>
  )
}
