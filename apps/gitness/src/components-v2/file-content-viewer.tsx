import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { OpenapiGetContentOutput, TypesCommit, useListCommitsQuery } from '@harnessio/code-service-client'
import { FileViewerControlBar, MarkdownViewer, Pagination, SkeletonList, ViewTypeValue } from '@harnessio/ui/components'
import { BranchSelectorTab, CommitsList, monacoThemes } from '@harnessio/ui/views'
import { CodeEditor } from '@harnessio/yaml-editor'

import GitCommitDialog from '../components-v2/git-commit-dialog'
import GitBlame from '../components/GitBlame'
import { useRoutes } from '../framework/context/NavigationContext'
import { useThemeStore } from '../framework/context/ThemeContext'
import { useDownloadRawFile } from '../framework/hooks/useDownloadRawFile'
import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import { parseAsInteger, useQueryState } from '../framework/hooks/useQueryState'
import { useAPIPath } from '../hooks/useAPIPath'
import useCodePathDetails from '../hooks/useCodePathDetails'
import { useTranslationStore } from '../i18n/stores/i18n-store'
import { useRepoBranchesStore } from '../pages-v2/repo/stores/repo-branches-store'
import { PathParams } from '../RouteDefinitions'
import { PageResponseHeader } from '../types'
import {
  decodeGitContent,
  FILE_SEPERATOR,
  filenameToLanguage,
  formatBytes,
  GitCommitAction,
  normalizeGitRef,
  REFS_TAGS_PREFIX
} from '../utils/git-utils'

const getIsMarkdown = (language?: string) => language === 'markdown'

const getDefaultView = (language?: string): ViewTypeValue => {
  return getIsMarkdown(language) ? 'preview' : 'code'
}

interface FileContentViewerProps {
  repoContent?: OpenapiGetContentOutput
}

/**
 * TODO: This code was migrated from V2 and needs to be refactored.
 */
export default function FileContentViewer({ repoContent }: FileContentViewerProps) {
  const routes = useRoutes()
  const { spaceId, repoId } = useParams<PathParams>()
  const fileName = repoContent?.name || ''
  const language = filenameToLanguage(fileName) || ''
  const fileContent = decodeGitContent(repoContent?.content?.data)
  const repoRef = useGetRepoRef()
  const { fullGitRef, fullResourcePath } = useCodePathDetails()
  const parentPath = fullResourcePath?.split(FILE_SEPERATOR).slice(0, -1).join(FILE_SEPERATOR)
  const downloadFile = useDownloadRawFile()
  const navigate = useNavigate()
  const apiPath = useAPIPath()
  const rawURL = apiPath(`/api/v1/repos/${repoRef}/raw/${fullResourcePath}?git_ref=${fullGitRef}`)
  const [view, setView] = useState<ViewTypeValue>(getDefaultView(language))
  const [isDeleteFileDialogOpen, setIsDeleteFileDialogOpen] = useState(false)
  const { selectedBranchTag, selectedRefType } = useRepoBranchesStore()
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const { theme } = useThemeStore()
  const { t } = useTranslationStore()
  const { data: { body: commitData, headers } = {}, isFetching: isFetchingCommits } = useListCommitsQuery({
    repo_ref: repoRef,
    queryParams: {
      page,
      git_ref: normalizeGitRef(
        selectedRefType === BranchSelectorTab.TAGS
          ? REFS_TAGS_PREFIX + selectedBranchTag?.name
          : selectedBranchTag?.name
      ),
      path: fullResourcePath
    }
  })

  const xNextPage = parseInt(headers?.get(PageResponseHeader.xNextPage) || '')
  const xPrevPage = parseInt(headers?.get(PageResponseHeader.xPrevPage) || '')

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

  /**
   * Navigate to Edit file route
   */
  const handleEditFile = () => {
    navigate(`${routes.toRepoFiles({ spaceId, repoId })}/edit/${fullGitRef}/~/${fullResourcePath}`)
  }

  const renderFileView = () => {
    switch (view) {
      case 'preview':
        // For Markdown 'preview'
        if (getIsMarkdown(language)) {
          return (
            <div className="pb-11">
              <MarkdownViewer source={fileContent} withBorderWrapper />
            </div>
          )
        }
        // If a non-markdown file somehow has 'preview', we could fallback to 'code'
        return (
          <CodeEditor
            className="overflow-hidden rounded-b-md border-x border-b"
            height="100%"
            language={language}
            codeRevision={{ code: fileContent }}
            onCodeRevisionChange={() => undefined}
            themeConfig={themeConfig}
            options={{
              readOnly: true
            }}
          />
        )

      case 'code':
        return (
          <CodeEditor
            className="overflow-hidden rounded-b-md border-x border-b"
            height="100%"
            language={language}
            codeRevision={{ code: fileContent }}
            onCodeRevisionChange={() => undefined}
            themeConfig={themeConfig}
            options={{
              readOnly: true
            }}
          />
        )

      case 'blame':
        return <GitBlame height="100%" themeConfig={themeConfig} codeContent={fileContent} language={language} />

      case 'history':
        if (isFetchingCommits) {
          return <SkeletonList />
        }
        return (
          <div className="pb-11">
            <CommitsList
              className="rounded-b-md border-x border-b bg-cn-background-1 p-6"
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
            <Pagination nextPage={xNextPage} previousPage={xPrevPage} currentPage={page} goToPage={setPage} t={t} />
          </div>
        )
      default:
        return null
    }
  }

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
            navigate(`${routes.toRepoFiles({ spaceId, repoId })}${parentPath ? `/~/${parentPath}` : ''}`)
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
      <FileViewerControlBar
        view={view}
        onChangeView={onChangeView}
        isMarkdown={getIsMarkdown(language)}
        fileBytesSize={formatBytes(repoContent?.content?.size || 0)}
        fileContent={fileContent}
        url={rawURL}
        handleDownloadFile={handleDownloadFile}
        handleEditFile={handleEditFile}
        handleOpenDeleteDialog={() => handleToggleDeleteDialog(true)}
      />
      {renderFileView()}
    </>
  )
}
