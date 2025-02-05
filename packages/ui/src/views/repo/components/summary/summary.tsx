import { useNavigate } from 'react-router-dom'

import { Icon, Spacer, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Text } from '@/components'
import { FileStatus, LatestFileTypes, RepoFile, SummaryItemType, TranslationStore } from '@/views'
import { FileLastChangeBar } from '@views/repo/components'

interface RoutingProps {
  toCommitDetails?: ({ sha }: { sha: string }) => string
}
interface SummaryProps extends RoutingProps {
  latestFile: LatestFileTypes
  files: RepoFile[]
  useTranslationStore: () => TranslationStore
  hideHeader?: boolean
  toCommitDetails?: ({ sha }: { sha: string }) => string
}

export const Summary = ({
  latestFile,
  files,
  useTranslationStore,
  hideHeader = false,
  toCommitDetails
}: SummaryProps) => {
  const navigate = useNavigate()
  const { t } = useTranslationStore()

  return (
    <>
      {!hideHeader && (
        <>
          <FileLastChangeBar
            toCommitDetails={toCommitDetails}
            useTranslationStore={useTranslationStore}
            {...latestFile}
          />
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
                  toCommitDetails={toCommitDetails}
                  useTranslationStore={useTranslationStore}
                  {...latestFile}
                />
              </TableCell>
            </TableRow>
          )}
          {files.map(file => (
            <TableRow key={file.id} onClick={() => navigate(file.path)}>
              <TableCell>
                <div
                  className={`flex cursor-pointer items-center gap-1.5 ${
                    file.status && file.status !== FileStatus.SAFE
                      ? file.status === FileStatus.LOW_RISK
                        ? 'absolute left-0 border-l-2 border-icons-risk'
                        : file.status === FileStatus.MEDIUM_RISK
                          ? 'absolute left-0 border-l-2 border-icons-alert'
                          : 'absolute left-0 border-l-2 border-icons-danger'
                      : ''
                  }`}
                >
                  <Icon
                    className={
                      file.status
                        ? file.status === FileStatus.SAFE
                          ? 'text-icons-9'
                          : file.status === FileStatus.LOW_RISK
                            ? 'ml-3 text-icons-risk'
                            : file.status === FileStatus.MEDIUM_RISK
                              ? 'ml-3 text-icons-alert'
                              : 'ml-3 text-icons-danger'
                        : 'text-icons-9'
                    }
                    name={
                      file.status
                        ? file.status === FileStatus.SAFE
                          ? file.type === SummaryItemType.File
                            ? 'file'
                            : 'folder'
                          : 'triangle-warning'
                        : file.type === SummaryItemType.File
                          ? 'file'
                          : 'folder'
                    }
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
