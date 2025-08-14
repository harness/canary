import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { OpenapiGetContentOutput, TypesCommit, useListCommitsQuery } from '@harnessio/code-service-client'
import {
  FileViewerControlBar,
  getIsMarkdown,
  IconV2,
  Layout,
  MarkdownViewer,
  Pagination,
  ScrollArea,
  Skeleton,
  Tabs,
  ViewTypeValue
} from '@harnessio/ui/components'
import { cn } from '@harnessio/ui/utils'
import { CommitsList, FileReviewError, monacoThemes } from '@harnessio/ui/views'
import { CodeEditor } from '@harnessio/yaml-editor'

import GitCommitDialog from '../components-v2/git-commit-dialog'
import { useRoutes } from '../framework/context/NavigationContext'
import { useThemeStore } from '../framework/context/ThemeContext'
import { useDownloadRawFile } from '../framework/hooks/useDownloadRawFile'
import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import { parseAsInteger, useQueryState } from '../framework/hooks/useQueryState'
import { useAPIPath } from '../hooks/useAPIPath'
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
  const { theme } = useThemeStore()

  const { gitRefName } = useGitRef()

  const fileError = !repoContent || !repoContent.content || !repoContent.content.data

  const { data: { body: commitData, headers } = {}, isFetching: isFetchingCommits } = useListCommitsQuery({
    repo_ref: repoRef,
    queryParams: {
      page,
      git_ref: normalizeGitRef(gitRefName),
      path: fullResourcePath
    }
  })

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

  const handleDownloadFile = () => {
    downloadFile({
      repoRef,
      resourcePath: fullResourcePath || '',
      gitRef: fullGitRef || ''
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
    <Layout.Flex align="center" justify="center" className="rounded-b-3 flex h-full rounded-t-none border border-t-0">
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
        className="repo-files-height flex flex-col overflow-hidden"
        value={view as string}
        onValueChange={val => onChangeView(val as ViewTypeValue)}
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
        />

        <Tabs.Content
          value="preview"
          className={cn('grow overflow-hidden', { 'border border-t-0 rounded-b-3': getIsMarkdown(language) })}
        >
          {loading && <Loader />}

          {!loading && (
            <>
              {fileError && (
                <div className="flex h-full items-center justify-center">
                  <FileReviewError onButtonClick={() => {}} className="my-0 h-full rounded-t-none border-t-0" />
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
                    className="overflow-hidden"
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

        <Tabs.Content value="code" className="grow">
          {loading && <Loader />}

          {!loading && (
            <CodeEditor
              className="overflow-hidden"
              height="100%"
              language={language}
              codeRevision={{ code: fileContent }}
              themeConfig={themeConfig}
              options={{ readOnly: true }}
              theme={monacoTheme}
            />
          )}
        </Tabs.Content>

        <Tabs.Content value="blame" className="grow">
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
