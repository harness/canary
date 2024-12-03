import { useNavigate } from 'react-router-dom'

import { Icon, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Text } from '@/components'
import { LatestFileTypes, RepoFile, SummaryItemType, TranslationStore } from '@/views'
import { FileLastChangeBar } from '@views/repo/components'

interface SummaryProps {
  latestFile: LatestFileTypes
  files: RepoFile[]
  useTranslationStore: () => TranslationStore
}

export const Summary = ({ latestFile, files, useTranslationStore }: SummaryProps) => {
  const navigate = useNavigate()
  const { t } = useTranslationStore()

  return (
    <>
      <FileLastChangeBar useTranslationStore={useTranslationStore} {...latestFile} />
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
