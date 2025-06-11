import { Icon, Spacer, TableV2 as Table, Text } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { timeAgo } from '@/utils'
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
  const { navigate } = useRouterContext()
  const { t } = useTranslation()

  return (
    <>
      {!hideHeader && (
        <>
          <FileLastChangeBar toCommitDetails={toCommitDetails} {...latestFile} />
          <Spacer size={4} />
        </>
      )}

      <Table.Root variant="default" disableHighlightOnHover>
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
            <Table.Row key={file.id} onClick={() => navigate(toRepoFileDetails?.({ path: file.path }) ?? '')}>
              <Table.Cell>
                <div
                  className={`flex cursor-pointer items-center gap-1.5 ${
                    file.status && file.status !== FileStatus.SAFE
                      ? file.status === FileStatus.LOW_RISK
                        ? 'border-cn-borders-warning absolute left-0 border-l-2'
                        : file.status === FileStatus.MEDIUM_RISK
                          ? 'border-cn-borders-warning absolute left-0 border-l-2'
                          : 'border-cn-borders-danger absolute left-0 border-l-2'
                      : ''
                  }`}
                >
                  <Icon
                    className={
                      file.status
                        ? file.status === FileStatus.SAFE
                          ? 'text-icons-9'
                          : file.status === FileStatus.LOW_RISK
                            ? 'text-icons-alert ml-3'
                            : file.status === FileStatus.MEDIUM_RISK
                              ? 'text-icons-warning ml-3'
                              : 'text-icons-danger ml-3'
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
                  <span className="text-cn-foreground-1 w-44 truncate">{file.name}</span>
                </div>
              </Table.Cell>
              <Table.Cell>
                <Text color="foreground-3" className="line-clamp-1">
                  {file.lastCommitMessage}
                </Text>
              </Table.Cell>
              <Table.Cell className="text-right">
                <Text color="foreground-3" wrap="nowrap" align="right">
                  {timeAgo(file.timestamp, { dateStyle: 'medium' })}
                </Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  )
}
