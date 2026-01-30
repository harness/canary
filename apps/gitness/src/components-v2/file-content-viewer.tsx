import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { isNull } from 'lodash-es'

import {
  OpenapiGetContentOutput,
  TypesCommit,
  TypesRenameDetails,
  useListCommitsQuery
} from '@harnessio/code-service-client'
import {
  Accordion,
  FileViewerControlBar,
  getIsMarkdown,
  IconV2,
  Layout,
  MarkdownViewer,
  Pagination,
  ScrollArea,
  Skeleton,
  Tabs,
  Text,
  ViewTypeValue
} from '@harnessio/ui/components'
import { useRouterContext, useTheme } from '@harnessio/ui/context'
import { cn, decodeURIComponentIfValid } from '@harnessio/ui/utils'
import { CommitsList, FileReviewError, monacoThemes } from '@harnessio/ui/views'
import { CodeEditor } from '@harnessio/yaml-editor'

import GitCommitDialog from '../components-v2/git-commit-dialog'
import { useRoutes } from '../framework/context/NavigationContext'
import { useDownloadRawFile } from '../framework/hooks/useDownloadRawFile'
import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import { parseAsInteger, useQueryState } from '../framework/hooks/useQueryState'
import { useAPIPath } from '../hooks/useAPIPath'
import { useCodeEditorSelectionState } from '../hooks/useCodeEditorSelectionState'
import useCodePathDetails from '../hooks/useCodePathDetails'
import { useGitRef } from '../hooks/useGitRef'
import { useRepoBranchesStore } from '../pages-v2/repo/stores/repo-branches-store'
import { PathParams } from '../RouteDefinitions'
import { PageResponseHeader } from '../types'
import { decodeGitContent, filenameToLanguage, formatBytes, GitCommitAction, normalizeGitRef } from '../utils/git-utils'
import GitBlame from './GitBlame'

const getDefaultView = (language?: string): ViewTypeValue => {
  return getIsMarkdown(language) ? 'preview' : 'code'
}

type RenameHistorySectionProps = {
  titlePath: string
  repoRef: string
  spaceId: string
  repoId: string
  routes: any
  gitRef: string
}

const RenameHistorySection: React.FC<RenameHistorySectionProps> = ({
  titlePath,
  repoRef,
  spaceId,
  repoId,
  routes,
  gitRef
}) => {
  const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined)
  const { data, isFetching } = useListCommitsQuery({
    repo_ref: repoRef,
    queryParams: {
      git_ref: gitRef,
      path: titlePath || '',
      limit: 20
    }
  })

  return (
    <div className="space-y-cn-sm">
      <Accordion.Root
        type="single"
        collapsible
        onValueChange={value => setAccordionValue(Array.isArray(value) ? value[0] : value)}
      >
        <Accordion.Item value="rename-history" style={{ border: 'none' }}>
          <Accordion.Trigger indicatorProps={{ className: 'hidden' }}>
            <div className="flex items-center gap-cn-xs">
              <IconV2 name="nav-arrow-down" size="xs" className="text-cn-3" />
              <IconV2 name="git-commit" size="xs" className="text-cn-3" />
              <Text variant="body-single-line-normal" color="foreground-2">
                Renamed from {titlePath} - {accordionValue ? 'Hide History' : 'Show History'}
              </Text>
            </div>
          </Accordion.Trigger>
          <Accordion.Content>
            <div className="mt-cn-md">
              {isFetching ? (
                <Skeleton.List />
              ) : data?.body?.commits?.length ? (
                <CommitsList
                  className="mt-cn-md"
                  toCommitDetails={({ sha }: { sha: string }) =>
                    routes.toRepoCommitDetails({ spaceId, repoId, commitSHA: sha })
                  }
                  toCode={({ sha }: { sha: string }) => `${routes.toRepoFiles({ spaceId, repoId })}/${sha}`}
                  data={data.body.commits.map((item: TypesCommit) => ({
                    sha: item.sha,
                    parent_shas: item.parent_shas,
                    title: item.title,
                    message: item.message,
                    author: item.author,
                    committer: item.committer
                  }))}
                />
              ) : (
                <Layout.Vertical className="mt-cn-md p-cn-sm">
                  <Text variant="body-single-line-normal" color="foreground-3">
                    No previous commits found
                  </Text>
                </Layout.Vertical>
              )}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  )
}

interface RenameHistoryDetectorProps {
  repoRef: string
  spaceId: string
  repoId: string
  routes: any
  currentPath: string
  gitRef: string
}

const RenameHistoryDetector: React.FC<RenameHistoryDetectorProps> = ({
  repoRef,
  spaceId,
  repoId,
  routes,
  currentPath,
  gitRef
}) => {
  const [oldPath, setOldPath] = useState<string | null>(null)

  // Try to detect if this file was renamed by looking at the first commit
  const { data: firstCommit } = useListCommitsQuery({
    repo_ref: repoRef,
    queryParams: {
      git_ref: gitRef,
      path: decodeURIComponentIfValid(decodeURIComponentIfValid(currentPath)),
      limit: 1
    }
  })

  const { data: renameInfo } = useListCommitsQuery(
    {
      repo_ref: repoRef,
      queryParams: {
        git_ref: firstCommit?.body?.commits?.[0]?.sha || '',
        path: decodeURIComponentIfValid(decodeURIComponentIfValid(currentPath)),
        limit: 1
      }
    },
    { enabled: !!firstCommit?.body?.commits?.[0]?.sha }
  )

  useEffect(() => {
    if (renameInfo?.body?.rename_details && renameInfo.body.rename_details.length > 0) {
      const renameDetail = renameInfo.body.rename_details[0]
      if (renameDetail.old_path && renameDetail.commit_sha_before) {
        setOldPath(renameDetail.old_path)
      }
    }
  }, [renameInfo])

  if (!oldPath) return null

  return (
    <RenameHistorySection
      titlePath={oldPath}
      repoRef={repoRef}
      spaceId={spaceId}
      repoId={repoId}
      routes={routes}
      gitRef={gitRef}
    />
  )
}

interface FileContentViewerProps {
  repoContent?: OpenapiGetContentOutput
  loading?: boolean
}

/**
 * TODO: This code was migrated from V2 and needs to be refactored.
 */
export default function FileContentViewer({ repoContent, loading }: FileContentViewerProps) {
  const routes = useRoutes()
  const { spaceId, repoId } = useParams<PathParams>()
  const fileName = repoContent?.name || ''
  const language = filenameToLanguage(fileName) || ''
  const fileContent = decodeGitContent(repoContent?.content?.data)
  const isGitLfsObject = repoContent?.content?.lfs_object_id !== undefined
  const repoRef = useGetRepoRef()
  const { fullGitRef, fullResourcePath } = useCodePathDetails()
  const downloadFile = useDownloadRawFile()
  const navigate = useNavigate()
  const apiPath = useAPIPath()
  const rawURL = apiPath(`/api/v1/repos/${repoRef}/raw/${fullResourcePath}?git_ref=${fullGitRef}`)
  const [view, setView] = useState<ViewTypeValue>(getDefaultView(language))
  const [isDeleteFileDialogOpen, setIsDeleteFileDialogOpen] = useState(false)
  const { selectedBranchTag, selectedRefType } = useRepoBranchesStore()
  const [page, _setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const { theme } = useTheme()
  const { selectedLine, setSelectedLine } = useCodeEditorSelectionState()

  const { gitRefName } = useGitRef()

  const { useSearchParams } = useRouterContext()
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('keyword')

  const fileError = !repoContent || !repoContent.content || !repoContent.content.data

  const { data: { body: commitData, headers } = {}, isFetching: isFetchingCommits } = useListCommitsQuery({
    repo_ref: repoRef,
    queryParams: {
      page,
      git_ref: normalizeGitRef(gitRefName),
      path: decodeURIComponentIfValid(decodeURIComponentIfValid(fullResourcePath))
    }
  })

  const [cachedRenameDetails, setCachedRenameDetails] = useState<TypesRenameDetails[] | null>(null)

  useEffect(() => {
    if (commitData?.rename_details && commitData.rename_details.length > 0) {
      setCachedRenameDetails(commitData.rename_details)
    }
  }, [commitData?.rename_details])

  const renameDetailsToRender = useMemo(() => {
    if (commitData?.rename_details && commitData.rename_details.length > 0) return commitData.rename_details
    return cachedRenameDetails || null
  }, [commitData?.rename_details, cachedRenameDetails])

  // TODO: temporary solution for matching themes
  const monacoTheme = (theme ?? '').startsWith('dark') ? 'dark' : 'light'

  /**
   * Toggle delete dialog open state
   * @param value
   */
  const handleToggleDeleteDialog = (value: boolean) => {
    setIsDeleteFileDialogOpen(value)
  }

  /**
   * Change view file state
   * @param value
   */
  const onChangeView = (value: ViewTypeValue) => {
    setView(value)
  }

  /**
   * Set default view
   */
  useEffect(() => {
    setView(getDefaultView(language))
  }, [language])

  const themeConfig = useMemo(
    () => ({
      defaultTheme: monacoTheme,
      monacoThemes
    }),
    [monacoTheme]
  )

  const codeRevision = useMemo(
    () => ({
      code: fileContent
    }),
    [fileContent]
  )

  const handleDownloadFile = () => {
    downloadFile({
      repoRef,
      resourcePath: fullResourcePath || '',
      gitRef: fullGitRef || '',
      filename: fileName
    })
  }
  const xPrevPage = useMemo(() => parseInt(headers?.get(PageResponseHeader.xPrevPage) || ''), [headers])
  const xNextPage = useMemo(() => parseInt(headers?.get(PageResponseHeader.xNextPage) || ''), [headers])

  const getPrevPageLink = useCallback(() => {
    return `?page=${xPrevPage}`
  }, [xPrevPage])

  const getNextPageLink = useCallback(() => {
    return `?page=${xNextPage}`
  }, [xNextPage])

  /**
   * Navigate to Edit file route
   */
  const handleEditFile = () => {
    navigate(`${routes.toRepoFiles({ spaceId, repoId })}/edit/${fullGitRef}/~/${fullResourcePath}`)
  }

  const Loader = () => (
    <Layout.Flex
      align="center"
      justify="center"
      className="flex h-full rounded-b-cn-3 rounded-t-cn-none border border-t-0"
    >
      <IconV2 className="animate-spin" name="loader" size="lg" />
    </Layout.Flex>
  )

  return (
    <>
      <GitCommitDialog
        open={isDeleteFileDialogOpen}
        onClose={() => handleToggleDeleteDialog(false)}
        commitAction={GitCommitAction.DELETE}
        gitRef={fullGitRef || ''}
        resourcePath={fullResourcePath || ''}
        onSuccess={(_commitInfo, isNewBranch, newBranchName) => {
          if (!isNewBranch) {
            // Navigate to files view in the same branch after deletion
            navigate(`${routes.toRepoFiles({ spaceId, repoId })}/${fullGitRef}`)
          } else {
            navigate(
              routes.toPullRequestCompare({
                spaceId,
                repoId,
                diffRefs: `${selectedBranchTag?.name}...${newBranchName}`
              })
            )
          }
        }}
        currentBranch={fullGitRef || selectedBranchTag?.name || ''}
        isNew={false}
      />
      <Tabs.Root
        className="flex grow flex-col overflow-hidden"
        value={view as string}
        onValueChange={val => {
          setSelectedLine(undefined)
          onChangeView(val as ViewTypeValue)
        }}
      >
        <FileViewerControlBar
          view={view}
          isMarkdown={getIsMarkdown(language)}
          fileBytesSize={formatBytes(repoContent?.content?.size || 0)}
          fileContent={fileContent}
          url={rawURL}
          handleDownloadFile={handleDownloadFile}
          handleEditFile={handleEditFile}
          handleOpenDeleteDialog={() => handleToggleDeleteDialog(true)}
          refType={selectedRefType}
          isGitLfsObject={isGitLfsObject}
        />

        <Tabs.Content
          value="preview"
          className={cn('grow overflow-hidden', { 'border border-t-0 rounded-b-cn-3': getIsMarkdown(language) })}
        >
          {loading && <Loader />}

          {!loading && (
            <>
              {fileError && (
                <div className="flex h-full items-center justify-center">
                  <FileReviewError onButtonClick={() => {}} className="my-0 h-full rounded-t-cn-none border-t-0" />
                </div>
              )}

              {!fileError && getIsMarkdown(language) && (
                <ScrollArea className="h-full grid-cols-[100%]">
                  <MarkdownViewer source={fileContent} withBorder className="border-x-0 border-b-0" />
                </ScrollArea>
              )}

              {!fileError && !getIsMarkdown(language) && (
                <ScrollArea className="h-full grid-cols-[100%]">
                  <CodeEditor
                    className="overflow-hidden rounded-b-cn-3 border border-t-0 border-cn-3"
                    height="100%"
                    language={language}
                    codeRevision={{ code: fileContent }}
                    themeConfig={themeConfig}
                    options={{ readOnly: true }}
                    theme={monacoTheme}
                  />
                </ScrollArea>
              )}
            </>
          )}
        </Tabs.Content>

        <Tabs.Content value="code" className="min-h-0 grow">
          {loading && <Loader />}

          {!loading && (
            <CodeEditor
              className="overflow-hidden rounded-b-cn-3 border border-t-0 border-cn-3"
              height="100%"
              language={language}
              codeRevision={codeRevision}
              themeConfig={themeConfig}
              options={{ readOnly: true }}
              theme={monacoTheme}
              enableLinesSelection={true}
              onSelectedLineChange={setSelectedLine}
              selectedLine={selectedLine}
              highlightKeyword={!isNull(keyword) ? keyword : undefined}
            />
          )}
        </Tabs.Content>

        <Tabs.Content value="blame" className="min-h-0 grow">
          {loading && <Loader />}

          {!loading && (
            <GitBlame
              height="100%"
              themeConfig={themeConfig}
              codeContent={fileContent}
              language={language}
              toCommitDetails={({ sha }: { sha: string }) => {
                return routes.toRepoCommitDetails({ spaceId, repoId, commitSHA: sha })
              }}
            />
          )}
        </Tabs.Content>

        <Tabs.Content value="history" className="grow overflow-hidden">
          {isFetchingCommits ? (
            <Skeleton.List />
          ) : (
            <ScrollArea className="h-full grid-cols-[100%]">
              <CommitsList
                className="mt-cn-md"
                toCommitDetails={({ sha }: { sha: string }) =>
                  routes.toRepoCommitDetails({ spaceId, repoId, commitSHA: sha })
                }
                toCode={({ sha }: { sha: string }) => `${routes.toRepoFiles({ spaceId, repoId })}/${sha}`}
                data={commitData?.commits?.map((item: TypesCommit) => ({
                  sha: item.sha,
                  parent_shas: item.parent_shas,
                  title: item.title,
                  message: item.message,
                  author: item.author,
                  committer: item.committer
                }))}
              />

              {/* Show rename history if available */}
              {renameDetailsToRender && renameDetailsToRender.length > 0 && (
                <Layout.Vertical className="mt-cn-md">
                  {renameDetailsToRender.map((detail, index) => {
                    if (!detail.old_path) return null
                    return (
                      <RenameHistorySection
                        key={index}
                        titlePath={detail.old_path}
                        repoRef={repoRef}
                        spaceId={spaceId || ''}
                        repoId={repoId || ''}
                        routes={routes}
                        gitRef={fullGitRef}
                      />
                    )
                  })}
                </Layout.Vertical>
              )}

              {/* Always show rename history if we know the file was renamed, even without rename_details */}
              {!renameDetailsToRender && fullResourcePath && (
                <Layout.Vertical className="mt-cn-md">
                  <RenameHistoryDetector
                    repoRef={repoRef}
                    spaceId={spaceId || ''}
                    repoId={repoId || ''}
                    routes={routes}
                    currentPath={fullResourcePath}
                    gitRef={fullGitRef}
                  />
                </Layout.Vertical>
              )}

              <Pagination
                indeterminate
                hasNext={xNextPage > 0}
                hasPrevious={xPrevPage > 0}
                getPrevPageLink={getPrevPageLink}
                getNextPageLink={getNextPageLink}
              />
            </ScrollArea>
          )}
        </Tabs.Content>
      </Tabs.Root>
    </>
  )
}
