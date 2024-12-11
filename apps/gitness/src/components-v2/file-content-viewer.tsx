import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { OpenapiGetContentOutput } from '@harnessio/code-service-client'
import { FileViewerControlBar, MarkdownViewer, ViewTypeValue } from '@harnessio/ui/components'
import { CodeEditor } from '@harnessio/yaml-editor'

import GitCommitDialog from '../components-v2/git-commit-dialog'
import GitBlame from '../components/GitBlame'
import { useDownloadRawFile } from '../framework/hooks/useDownloadRawFile'
import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import useCodePathDetails from '../hooks/useCodePathDetails'
import { themes } from '../pages/pipeline-edit/theme/monaco-theme'
import { PathParams } from '../RouteDefinitions.ts'
import { decodeGitContent, filenameToLanguage, formatBytes, GitCommitAction } from '../utils/git-utils'

const getIsMarkdown = (language?: string) => language === 'markdown'

const getDefaultView = (language?: string): ViewTypeValue => {
  return getIsMarkdown(language) ? 'preview' : 'code'
}

interface FileContentViewerProps {
  repoContent?: OpenapiGetContentOutput
  defaultBranch: string
}

/**
 * TODO: This code was migrated from V2 and needs to be refactored.
 */
export default function FileContentViewer({ repoContent, defaultBranch }: FileContentViewerProps) {
  const { spaceId, repoId } = useParams<PathParams>()
  const fileName = repoContent?.name || ''
  const language = filenameToLanguage(fileName) || ''
  const fileContent = decodeGitContent(repoContent?.content?.data)
  const repoRef = useGetRepoRef()
  const { fullGitRef, fullResourcePath } = useCodePathDetails()
  const downloadFile = useDownloadRawFile()
  const navigate = useNavigate()
  const rawURL = `/api/v1/repos/${repoRef}/raw/${fullResourcePath}?git_ref=${fullGitRef}`
  const [view, setView] = useState<ViewTypeValue>(getDefaultView(language))
  const [isDeleteFileDialogOpen, setIsDeleteFileDialogOpen] = useState(false)

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
      defaultTheme: 'dark',
      themes
    }),
    []
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
    navigate(`edit/${fullGitRef}/~/${fullResourcePath}`)
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
            navigate(`/${spaceId}/repos/${repoId}/code`)
          } else {
            navigate(`/${spaceId}/repos/${repoId}/pull-requests/compare/${defaultBranch}...${newBranchName}`)
          }
        }}
        defaultBranch={defaultBranch}
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

      {language === 'markdown' && view === 'preview' ? (
        <MarkdownViewer source={fileContent} withBorderWrapper />
      ) : view === 'code' ? (
        <CodeEditor
          language={language}
          codeRevision={{ code: fileContent }}
          onCodeRevisionChange={() => {}}
          themeConfig={themeConfig}
          options={{
            readOnly: true
          }}
        />
      ) : (
        <GitBlame themeConfig={themeConfig} codeContent={fileContent} language={language} />
      )}
    </>
  )
}
