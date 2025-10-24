import { useCallback, useEffect, useRef } from 'react'

import { IconV2, Skeleton, Table, Text, TimeAgoCard } from '@/components'
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
  scheduleFileMetaFetch?: (paths: string[]) => void
}

export const Summary = ({
  latestFile,
  files,
  hideHeader = false,
  toCommitDetails,
  toRepoFileDetails,
  scheduleFileMetaFetch
}: SummaryProps) => {
  const { t } = useTranslation()

  // files that have been observed and metadata requested
  const observedFilesRef = useRef(new Set<string>())
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null)
  const tableRowsRef = useRef<Map<string, HTMLTableRowElement>>(new Map())

  // Initialize intersection observer for lazy metadata loading
  useEffect(() => {
    if (!scheduleFileMetaFetch) return

    // Disconnect existing observer
    if (intersectionObserverRef.current) {
      intersectionObserverRef.current.disconnect()
    }

    // Create new intersection observer
    intersectionObserverRef.current = new IntersectionObserver(
      entries => {
        const visiblePaths: string[] = []

        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const fileId = entry.target.getAttribute('data-file-id')
            if (fileId && !observedFilesRef.current.has(fileId)) {
              observedFilesRef.current.add(fileId)
              visiblePaths.push(fileId)
            }
          }
        })

        // Report visible files to hook for batched processing
        if (visiblePaths.length > 0) {
          scheduleFileMetaFetch(visiblePaths)
        }
      },
      {
        // Load metadata when file is 200px from viewport
        rootMargin: '200px',
        threshold: 0
      }
    )

    // Observe all current table rows
    tableRowsRef.current.forEach(element => {
      if (element && intersectionObserverRef.current) {
        intersectionObserverRef.current.observe(element)
      }
    })

    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect()
      }
    }
  }, [scheduleFileMetaFetch, files])

  // Reset observed files and table row refs when files list changes
  useEffect(() => {
    observedFilesRef.current.clear()
    tableRowsRef.current.clear()
  }, [files])

  // Set table row ref for intersection observer
  const setTableRowRef = useCallback((element: HTMLTableRowElement | null, fileId: string) => {
    if (element) {
      tableRowsRef.current.set(fileId, element)
      // Observe new elements immediately
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.observe(element)
      }
    } else {
      tableRowsRef.current.delete(fileId)
    }
  }, [])

  return (
    <>
      {!hideHeader && <FileLastChangeBar toCommitDetails={toCommitDetails} {...latestFile} />}

      <Table.Root>
        {!hideHeader && (
          <Table.Header>
            <Table.Row>
              <Table.Head className="w-[300px]">{t('views:repos.name', 'Name')}</Table.Head>
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
            <Table.Row
              key={file.id}
              to={toRepoFileDetails?.({ path: file.path }) ?? ''}
              data-file-id={file.id}
              ref={element => setTableRowRef(element, file.id)}
            >
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
                            ? 'empty-page'
                            : 'folder'
                          : 'warning-triangle-solid'
                        : file.type === SummaryItemType.File
                          ? 'empty-page'
                          : 'folder'
                    }
                  />
                  <Text color="foreground-1" truncate className="w-[300px]">
                    {file.name}
                  </Text>
                </div>
              </Table.Cell>
              <Table.Cell>
                {file.lastCommitMessage ? (
                  <Text className="line-clamp-1">{file.lastCommitMessage}</Text>
                ) : (
                  <Skeleton.Box className="w-full h-5" />
                )}
              </Table.Cell>
              <Table.Cell className="text-right" disableLink>
                {file.timestamp ? (
                  <TimeAgoCard
                    timestamp={file.timestamp}
                    dateTimeFormatOptions={{ dateStyle: 'medium' }}
                    textProps={{ color: 'foreground-3', wrap: 'nowrap', align: 'right' }}
                  />
                ) : (
                  <Skeleton.Box className="w-full h-5" />
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  )
}
