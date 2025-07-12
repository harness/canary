import { IconV2, Spacer, Table, Text, TimeAgoCard } from '@/components'
import { useTranslation } from '@/context'
import { FileStatus, LatestFileTypes, RepoFile, SummaryItemType } from '@/views'
import { FileLastChangeBar } from '@views/repo/components'

interface RoutingProps {
  toCommitDetails?: ({ sha }: { sha: string }) => string
}
interface SummaryProps extends RoutingProps {
  latestFile: LatestFileTypes
  files: RepoFile[]
  hideHeader?: boolean
  toCommitDetails?: ({ sha }: { sha: string }) => string
  toRepoFileDetails?: ({ path }: { path: string }) => string
}

export const Summary = ({
  latestFile,
  files,
  hideHeader = false,
  toCommitDetails,
  toRepoFileDetails
}: SummaryProps) => {
  const { t } = useTranslation()

  return (
    <>
      {!hideHeader && (
        <>
          <FileLastChangeBar toCommitDetails={toCommitDetails} {...latestFile} />
          <Spacer size={4} />
        </>
      )}

      <Table.Root>
        {!hideHeader && (
          <Table.Header>
            <Table.Row>
              <Table.Head>{t('views:repos.name', 'Name')}</Table.Head>
              <Table.Head>{t('views:repos.lastCommit', 'Last commit message')}</Table.Head>
              <Table.Head className="text-right">{t('views:repos.date', 'Date')}</Table.Head>
            </Table.Row>
          </Table.Header>
        )}
        <Table.Body>
          {hideHeader && (
            <Table.Row>
              <Table.Cell className="!p-0" colSpan={3}>
                <FileLastChangeBar onlyTopRounded withoutBorder toCommitDetails={toCommitDetails} {...latestFile} />
              </Table.Cell>
            </Table.Row>
          )}
          {files.map(file => (
            <Table.Row key={file.id} to={toRepoFileDetails?.({ path: file.path }) ?? ''}>
              <Table.Cell>
                <div
                  className={`flex cursor-pointer items-center gap-1.5 ${
                    file.status && file.status !== FileStatus.SAFE
                      ? file.status === FileStatus.LOW_RISK
                        ? 'absolute left-0 border-l-2 border-cn-borders-warning'
                        : file.status === FileStatus.MEDIUM_RISK
                          ? 'absolute left-0 border-l-2 border-cn-borders-warning'
                          : 'absolute left-0 border-l-2 border-cn-borders-danger'
                      : ''
                  }`}
                >
                  <IconV2
                    className={
                      file.status
                        ? file.status === FileStatus.SAFE
                          ? 'text-icons-9'
                          : file.status === FileStatus.LOW_RISK
                            ? 'ml-3 text-icons-alert'
                            : file.status === FileStatus.MEDIUM_RISK
                              ? 'ml-3 text-icons-warning'
                              : 'ml-3 text-icons-danger'
                        : 'text-icons-9'
                    }
                    name={
                      file.status
                        ? file.status === FileStatus.SAFE
                          ? file.type === SummaryItemType.File
                            ? 'page'
                            : 'folder'
                          : 'warning-triangle'
                        : file.type === SummaryItemType.File
                          ? 'page'
                          : 'folder'
                    }
                  />
                  <span className="w-44 truncate text-cn-foreground-1">{file.name}</span>
                </div>
              </Table.Cell>
              <Table.Cell>
                <Text color="foreground-3" className="line-clamp-1">
                  {file.lastCommitMessage}
                </Text>
              </Table.Cell>
              <Table.Cell className="text-right">
                <TimeAgoCard
                  timestamp={file?.timestamp}
                  dateTimeFormatOptions={{ dateStyle: 'medium' }}
                  textProps={{ color: 'foreground-3', wrap: 'nowrap', align: 'right' }}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  )
}
