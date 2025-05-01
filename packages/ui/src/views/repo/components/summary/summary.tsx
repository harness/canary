import { Icon, Spacer, Table, Text } from '@/components'
import { useRouterContext } from '@/context'
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
  toRepoFileDetails?: ({ path }: { path: string }) => string
}

export const Summary = ({
  latestFile,
  files,
  useTranslationStore,
  hideHeader = false,
  toCommitDetails,
  toRepoFileDetails
}: SummaryProps) => {
  const { navigate } = useRouterContext()
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

      <Table.Root variant="asStackedList">
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
                <FileLastChangeBar
                  onlyTopRounded
                  withoutBorder
                  toCommitDetails={toCommitDetails}
                  useTranslationStore={useTranslationStore}
                  {...latestFile}
                />
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
                        ? 'absolute left-0 border-l-2 border-cn-borders-warning'
                        : file.status === FileStatus.MEDIUM_RISK
                          ? 'absolute left-0 border-l-2 border-cn-borders-warning'
                          : 'absolute left-0 border-l-2 border-cn-borders-danger'
                      : ''
                  }`}
                >
                  <Icon
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
                            ? 'file'
                            : 'folder'
                          : 'triangle-warning'
                        : file.type === SummaryItemType.File
                          ? 'file'
                          : 'folder'
                    }
                    size={16}
                  />
                  <span className="w-44 truncate text-cn-foreground-1">{file.name}</span>
                </div>
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
      </Table.Root>
    </>
  )
}
