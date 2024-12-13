import { useNavigate } from 'react-router-dom'

import { Icon, Spacer, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Text } from '@/components'
import { LatestFileTypes, RepoFile, SummaryItemType, TranslationStore } from '@/views'
import { FileLastChangeBar } from '@views/repo/components'

interface SummaryProps {
  latestFile: LatestFileTypes
  files: RepoFile[]
  useTranslationStore: () => TranslationStore
  hideHeader?: boolean
}

export const Summary = ({ latestFile, files, useTranslationStore, hideHeader = false }: SummaryProps) => {
  const navigate = useNavigate()
  const { t } = useTranslationStore()

  return (
    <>
      {!hideHeader && (
        <>
          <FileLastChangeBar useTranslationStore={useTranslationStore} {...latestFile} />
          <Spacer size={4} />
        </>
      )}

      <Table variant="asStackedList">
        {!hideHeader && (
          <TableHeader>
            <TableRow>
              <TableHead>{t('views:repos.name', 'Name')}</TableHead>
              <TableHead>{t('views:repos.lastCommit', 'Last commit message')}</TableHead>
              <TableHead className="text-right">{t('views:repos.date', 'Date')}</TableHead>
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {hideHeader && (
            <TableRow>
              <TableCell className="!p-0" colSpan={3}>
                <FileLastChangeBar
                  onlyTopRounded
                  withoutBorder
                  useTranslationStore={useTranslationStore}
                  {...latestFile}
                />
              </TableCell>
            </TableRow>
          )}
          {files.map(file => (
            <TableRow key={file.id} onClick={() => navigate(file.path)}>
              <TableCell>
                <div className="flex cursor-pointer items-center gap-1.5">
                  <Icon
                    className="text-icons-9"
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
