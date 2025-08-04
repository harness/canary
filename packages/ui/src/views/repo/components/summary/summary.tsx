import { IconV2, Table, Text, TimeAgoCard } from '@/components'
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
      {!hideHeader && <FileLastChangeBar toCommitDetails={toCommitDetails} {...latestFile} />}

      <Table.Root>
        {!hideHeader && (
          <Table.Header>
            <Table.Row>
              <Table.Head>{t('views:repos.name', 'Name')}</Table.Head>
              <Table.Head>{t('views:repos.lastCommit', 'Last commit message')}</Table.Head>
              <Table.Head containerProps={{ justify: 'end' }}>{t('views:repos.date', 'Date')}</Table.Head>
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
              <Table.Cell className="relative">
                <div
                  className={`flex cursor-pointer items-center gap-1.5 ${
                    file.status && file.status !== FileStatus.SAFE
                      ? file.status === FileStatus.LOW_RISK
                        ? 'border-cn-borders-warning absolute left-0 top-1/2 -translate-y-1/2 border-l-2'
                        : file.status === FileStatus.MEDIUM_RISK
                          ? 'border-cn-borders-warning absolute left-0 top-1/2 -translate-y-1/2 border-l-2'
                          : 'border-cn-borders-danger absolute left-0 top-1/2 -translate-y-1/2 border-l-2'
                      : ''
                  }`}
                >
                  <IconV2
                    className={
                      file.status
                        ? file.status === FileStatus.SAFE
                          ? 'text-icons-9'
                          : file.status === FileStatus.LOW_RISK
                            ? 'text-cn-foreground-warning ml-3'
                            : file.status === FileStatus.MEDIUM_RISK
                              ? 'text-cn-foreground-warning ml-3'
                              : 'text-cn-foreground-danger ml-3'
                        : 'text-cn-foreground-2'
                    }
                    name={
                      file.status
                        ? file.status === FileStatus.SAFE
                          ? file.type === SummaryItemType.File
                            ? 'page'
                            : 'folder'
                          : 'warning-triangle-solid'
                        : file.type === SummaryItemType.File
                          ? 'page'
                          : 'folder'
                    }
                  />
                  <Text color="foreground-1" truncate className="w-44">
                    {file.name}
                  </Text>
                </div>
              </Table.Cell>
              <Table.Cell>
                <Text className="line-clamp-1">{file.lastCommitMessage}</Text>
              </Table.Cell>
              <Table.Cell className="text-right" disableLink>
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
