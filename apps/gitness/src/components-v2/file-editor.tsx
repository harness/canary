import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { OpenapiGetContentOutput } from '@harnessio/code-service-client'
import {
  EditViewTypeValue,
  FileEditorControlBar,
  getIsMarkdown,
  IconV2,
  Layout,
  MarkdownViewer,
  Tabs
} from '@harnessio/ui/components'
import { cn, decodeURIPath } from '@harnessio/ui/utils'
import { monacoThemes, PathActionBar } from '@harnessio/ui/views'
import { CodeDiffEditor, CodeEditor, CodeEditorProps } from '@harnessio/yaml-editor'

import GitCommitDialog from '../components-v2/git-commit-dialog'
import { useRoutes } from '../framework/context/NavigationContext'
import { useThemeStore } from '../framework/context/ThemeContext'
import { useExitPrompt } from '../framework/hooks/useExitPrompt'
import useCodePathDetails from '../hooks/useCodePathDetails'
import { useGitRef } from '../hooks/useGitRef'
import { useRepoBranchesStore } from '../pages-v2/repo/stores/repo-branches-store'
import { PathParams } from '../RouteDefinitions'
import { decodeGitContent, FILE_SEPARATOR, filenameToLanguage, GitCommitAction, PLAIN_TEXT } from '../utils/git-utils'
import { splitPathWithParents } from '../utils/path-utils'

export interface FileEditorProps {
  repoDetails?: OpenapiGetContentOutput
  defaultBranch: string
  loading?: boolean
}

export const FileEditor: FC<FileEditorProps> = ({ repoDetails, defaultBranch, loading }) => {
  const routes = useRoutes()
  const navigate = useNavigate()
  const { codeMode, fullGitRef, gitRefName, fullResourcePath } = useCodePathDetails()
  const { repoData } = useGitRef()
  const { repoId, spaceId } = useParams<PathParams>()
  const repoPath = `${routes.toRepoFiles({ spaceId, repoId })}/${fullGitRef}`

  const [fileName, setFileName] = useState('')
  const [language, setLanguage] = useState('')
  const [originalFileContent, setOriginalFileContent] = useState('')
  const [contentRevision, setContentRevision] = useState<CodeEditorProps<unknown>['codeRevision']>({
    code: originalFileContent
  })
  const [view, setView] = useState<EditViewTypeValue>('edit')
  const [dirty, setDirty] = useState(false)
  const [isCommitDialogOpen, setIsCommitDialogOpen] = useState(false)
  useExitPrompt({ isDirty: dirty && !isCommitDialogOpen })
  const { selectedBranchTag, selectedRefType } = useRepoBranchesStore()
  const { theme } = useThemeStore()
  // TODO: temporary solution for matching themes
  const monacoTheme = (theme ?? '').startsWith('dark') ? 'dark' : 'light'

  const themeConfig = useMemo(
    () => ({
      defaultTheme: monacoTheme,
      monacoThemes
    }),
    [monacoTheme]
  )

  const isNew = useMemo(() => !repoDetails || repoDetails?.type === 'dir', [repoDetails])
  const [parentPath, setParentPath] = useState('')
  const fileResourcePath = useMemo(
    () => [(parentPath || '').trim(), (fileName || '').trim()].filter(p => !!p.trim()).join(FILE_SEPARATOR),
    [parentPath, fileName]
  )

  const encodedFileResourcePath = useMemo(
    () =>
      [(parentPath || '').trim(), (encodeURI(encodeURI(fileName)) || '').trim()]
        .filter(p => !!p.trim())
        .join(FILE_SEPARATOR),
    [parentPath, fileName]
  )
  const isShowPreview = () => !isNew || getIsMarkdown(language)
  const [showPreview, setShowPreview] = useState(isShowPreview())

  const pathToSplit = useMemo(() => {
    if (isNew) {
      return fullResourcePath || parentPath
    } else if (parentPath?.length && fileName.length) {
      return [parentPath, fileName].join(FILE_SEPARATOR)
    }
    return parentPath?.length ? parentPath : fileName
  }, [isNew, parentPath, fileName, fullResourcePath])

  useEffect(() => {
    if (!fullResourcePath) return

    const newPath = isNew ? fullResourcePath : fullResourcePath.split(FILE_SEPARATOR).slice(0, -1).join(FILE_SEPARATOR)

    if (parentPath !== newPath) {
      setParentPath(newPath)
    }
  }, [isNew, fullResourcePath])

  useEffect(() => {
    setLanguage(filenameToLanguage(fileName) || '')
    setShowPreview(isShowPreview())
  }, [fileName, isNew, language])

  const pathParts = useMemo(
    () => [
      {
        path: repoId!,
        parentPath: repoPath
      },
      ...splitPathWithParents(pathToSplit, repoPath)
    ],
    [pathToSplit, repoId, repoPath]
  )

  const isUpdate = useMemo(
    () => fullResourcePath === encodedFileResourcePath,
    [fullResourcePath, encodedFileResourcePath]
  )

  const commitAction = useMemo(
    () => (isNew ? GitCommitAction.CREATE : isUpdate ? GitCommitAction.UPDATE : GitCommitAction.MOVE),
    [isNew, isUpdate]
  )

  useEffect(() => {
    let currentFileName = ''
    if (isNew) {
      // For new files, check if filename is provided via query parameter
      // This enables pre-filling filename when navigating from "Create README" button
      try {
        const urlParams = new URLSearchParams(window.location.search)
        currentFileName = urlParams.get('name') || ''
      } catch (error) {
        // Fallback to empty string if URL parsing fails
        currentFileName = ''
      }
    } else {
      // For existing files, use the file's actual name
      currentFileName = repoDetails?.name || ''
    }

    setFileName(currentFileName)
    setLanguage(filenameToLanguage(currentFileName) || '')
    const decodedContent = decodeGitContent(repoDetails?.content?.data)
    setOriginalFileContent(decodedContent)
    setContentRevision({ code: decodedContent })
  }, [isNew, repoDetails])

  useEffect(() => {
    setDirty(!(!fileName || (isUpdate && contentRevision.code === originalFileContent)))
  }, [fileName, isUpdate, contentRevision, originalFileContent])

  const toggleOpenCommitDialog = (value: boolean) => {
    setIsCommitDialogOpen(value)
  }

  const rebuildPaths = useCallback(() => {
    const _tokens = fileName?.split(FILE_SEPARATOR).filter(part => !!part.trim()) || []
    const _fileName = (_tokens.pop() || '').trim()
    const _parentPath = (parentPath?.split(FILE_SEPARATOR) || [])
      .concat(_tokens)
      .map(p => p.trim())
      .filter(part => !!part.trim())
      .join(FILE_SEPARATOR)

    if (_fileName) {
      const normalizedFilename = _fileName.trim()
      const newLanguage = filenameToLanguage(normalizedFilename)

      if (normalizedFilename !== fileName) {
        setFileName(normalizedFilename)
      }
      if (language !== newLanguage) {
        setLanguage(newLanguage || PLAIN_TEXT)
        setOriginalFileContent(contentRevision.code)
      }
    }

    setParentPath(_parentPath)
  }, [fileName, parentPath, language, contentRevision])

  /**
   * Navigate to file view route
   */
  const handleCancelFileEdit = useCallback(() => {
    const navigateTo = repoData?.is_empty
      ? `${routes.toRepoSummary({ spaceId, repoId })}`
      : `${routes.toRepoFiles({ spaceId, repoId })}/${fullGitRef}/${fullResourcePath ? `~/${fullResourcePath}` : ''}`
    navigate(navigateTo)
  }, [fullGitRef, fullResourcePath, navigate, repoData?.is_empty, repoId, spaceId, routes])

  /**
   * Change view handler
   * @param value
   */
  const onChangeView = (value: EditViewTypeValue) => {
    setView(value)
  }

  const Loader = () => (
    <Layout.Flex align="center" justify="center" className="rounded-b-3 flex h-full rounded-t-none border border-t-0">
      <IconV2 className="animate-spin" name="loader" size="lg" />
    </Layout.Flex>
  )

  return (
    <>
      <GitCommitDialog
        open={isCommitDialogOpen}
        onClose={() => toggleOpenCommitDialog(false)}
        commitAction={commitAction}
        gitRef={fullGitRef || ''}
        oldResourcePath={
          commitAction === GitCommitAction.MOVE ? decodeURIPath(decodeURIPath(fullResourcePath)) : undefined
        }
        resourcePath={decodeURIPath(decodeURIPath(fileResourcePath)) || ''}
        payload={contentRevision.code}
        sha={repoDetails?.sha}
        onSuccess={(_commitInfo, isNewBranch, newBranchName) => {
          if (!isNewBranch) {
            navigate(`${routes.toRepoFiles({ spaceId, repoId })}/${fullGitRef}/~/${encodedFileResourcePath}`)
          } else {
            navigate(routes.toPullRequestCompare({ spaceId, repoId, diffRefs: `${defaultBranch}...${newBranchName}` }))
          }
        }}
        currentBranch={fullGitRef || selectedBranchTag?.name || ''}
        isNew={!!isNew}
      />

      <PathActionBar
        codeMode={codeMode}
        pathParts={pathParts}
        changeFileName={vel => setFileName(vel)}
        onBlurFileName={rebuildPaths}
        gitRefName={gitRefName}
        fileName={fileName}
        handleOpenCommitDialog={() => toggleOpenCommitDialog(true)}
        handleCancelFileEdit={handleCancelFileEdit}
        parentPath={parentPath}
        setParentPath={setParentPath}
        selectedRefType={selectedRefType}
      />

      <Tabs.Root
        className="flex h-full flex-col overflow-auto"
        value={view as string}
        onValueChange={val => onChangeView(val as EditViewTypeValue)}
      >
        <FileEditorControlBar showPreview={showPreview} />

        <Tabs.Content value="edit" className="grow min-h-0">
          {loading && <Loader />}

          {!loading && (
            <CodeEditor
              height="100%"
              language={language}
              codeRevision={{ ...contentRevision }}
              onCodeRevisionChange={valueRevision => setContentRevision(valueRevision ?? { code: '' })}
              themeConfig={themeConfig}
              theme={monacoTheme}
              options={{ readOnly: false }}
            />
          )}
        </Tabs.Content>

        <Tabs.Content
          value="preview"
          className={cn('grow', { 'overflow-auto border border-t-0 rounded-b-3': getIsMarkdown(language) })}
        >
          {loading && <Loader />}

          {!loading && getIsMarkdown(language) && (
            <MarkdownViewer source={contentRevision.code} withBorder className="border-x-0 border-b-0" />
          )}

          {!loading && !getIsMarkdown(language) && (
            <CodeDiffEditor
              height="100%"
              language={language}
              original={originalFileContent}
              modified={contentRevision.code}
              themeConfig={themeConfig}
              theme={monacoTheme}
              options={{ readOnly: true }}
            />
          )}
        </Tabs.Content>
      </Tabs.Root>
    </>
  )
}
