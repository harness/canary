import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { OpenapiGetContentOutput } from '@harnessio/code-service-client'
import { EditViewTypeValue, FileEditorControlBar } from '@harnessio/ui/components'
import { monacoThemes, PathActionBar } from '@harnessio/ui/views'
import { CodeDiffEditor, CodeEditor } from '@harnessio/yaml-editor'

import GitCommitDialog from '../components-v2/git-commit-dialog'
import { useRoutes } from '../framework/context/NavigationContext'
import { useThemeStore } from '../framework/context/ThemeContext'
import { useExitConfirm } from '../framework/hooks/useExitConfirm'
import useCodePathDetails from '../hooks/useCodePathDetails'
import { useTranslationStore } from '../i18n/stores/i18n-store'
import { useRepoBranchesStore } from '../pages-v2/repo/stores/repo-branches-store'
import { PathParams } from '../RouteDefinitions'
import { decodeGitContent, FILE_SEPERATOR, filenameToLanguage, GitCommitAction, PLAIN_TEXT } from '../utils/git-utils'
import { splitPathWithParents } from '../utils/path-utils'

export interface FileEditorProps {
  repoDetails?: OpenapiGetContentOutput
  defaultBranch: string
}

export const FileEditor: FC<FileEditorProps> = ({ repoDetails, defaultBranch }) => {
  const routes = useRoutes()
  const navigate = useNavigate()
  const { codeMode, fullGitRef, gitRefName, fullResourcePath } = useCodePathDetails()
  const { repoId, spaceId } = useParams<PathParams>()
  const { show } = useExitConfirm()
  const repoPath = `${routes.toRepoFiles({ spaceId, repoId })}/${fullGitRef}`

  const [fileName, setFileName] = useState('')
  const [language, setLanguage] = useState('')
  const [originalFileContent, setOriginalFileContent] = useState('')
  const [contentRevision, setContentRevision] = useState({ code: originalFileContent })
  const [view, setView] = useState<EditViewTypeValue>('edit')
  const [dirty, setDirty] = useState(false)
  const [isCommitDialogOpen, setIsCommitDialogOpen] = useState(false)
  const { selectedBranchTag } = useRepoBranchesStore()
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

  const isNew = useMemo(() => repoDetails && repoDetails.type === 'dir', [repoDetails])
  const [parentPath, setParentPath] = useState(
    isNew ? fullResourcePath : fullResourcePath?.split(FILE_SEPERATOR).slice(0, -1).join(FILE_SEPERATOR)
  )
  const fileResourcePath = useMemo(
    () => [(parentPath || '').trim(), (fileName || '').trim()].filter(p => !!p.trim()).join(FILE_SEPERATOR),
    [parentPath, fileName]
  )
  const pathToSplit = useMemo(() => {
    if (isNew) {
      return parentPath
    } else if (parentPath?.length && fileName.length) {
      return [parentPath, fileName].join(FILE_SEPERATOR)
    }
    return parentPath?.length ? parentPath : fileName
  }, [isNew, parentPath, fileName])
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
  const isUpdate = useMemo(() => fullResourcePath === fileResourcePath, [fullResourcePath, fileResourcePath])
  const commitAction = useMemo(
    () => (isNew ? GitCommitAction.CREATE : isUpdate ? GitCommitAction.UPDATE : GitCommitAction.MOVE),
    [isNew, isUpdate]
  )

  useEffect(() => {
    const currentFileName = isNew ? '' : repoDetails?.name || ''
    setFileName(currentFileName)
    setLanguage(filenameToLanguage(currentFileName) || '')
    setOriginalFileContent(decodeGitContent(repoDetails?.content?.data))
  }, [isNew, repoDetails])

  useEffect(() => {
    setDirty(!(!fileName || (isUpdate && contentRevision.code === originalFileContent)))
  }, [fileName, isUpdate, contentRevision, originalFileContent])

  useEffect(() => {
    setContentRevision({ code: originalFileContent })
  }, [originalFileContent])

  const toggleOpenCommitDialog = (value: boolean) => {
    setIsCommitDialogOpen(value)
  }

  const rebuildPaths = useCallback(() => {
    const _tokens = fileName?.split(FILE_SEPERATOR).filter(part => !!part.trim())
    const _fileName = ((_tokens?.pop() as string) || '').trim()
    const _parentPath = parentPath
      ?.split(FILE_SEPERATOR)
      .concat(_tokens || '')
      .map(p => p.trim())
      .filter(part => !!part.trim())
      .join(FILE_SEPERATOR)

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
  const onExitConfirm = useCallback(() => {
    const navigateTo = `${routes.toRepoFiles({ spaceId, repoId })}/${fullGitRef}/${fullResourcePath ? `~/${fullResourcePath}` : ''}`
    navigate(navigateTo)
  }, [fullGitRef, fullResourcePath, navigate, repoId, spaceId, routes])

  /**
   * Cancel edit handler
   * - if dirty - open confirm exit dialog via context
   * - if !dirty - call navigate fnc
   */
  const handleCancelFileEdit = useCallback(() => {
    if (dirty) {
      show({
        onConfirm: () => onExitConfirm()
      })
    } else {
      onExitConfirm()
    }
  }, [dirty, onExitConfirm, show])

  /**
   * Change view handler
   * @param value
   */
  const onChangeView = (value: EditViewTypeValue) => {
    setView(value)
  }

  return (
    <>
      <GitCommitDialog
        open={isCommitDialogOpen}
        onClose={() => toggleOpenCommitDialog(false)}
        commitAction={commitAction}
        gitRef={fullGitRef || ''}
        oldResourcePath={commitAction === GitCommitAction.MOVE ? fullResourcePath : undefined}
        resourcePath={fileResourcePath || ''}
        payload={contentRevision.code}
        sha={repoDetails?.sha}
        onSuccess={(_commitInfo, isNewBranch, newBranchName) => {
          if (!isNewBranch) {
            navigate(`${routes.toRepoFiles({ spaceId, repoId })}/${fullGitRef}/~/${fileResourcePath}`)
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
        useTranslationStore={useTranslationStore}
        changeFileName={vel => setFileName(vel)}
        onBlurFileName={rebuildPaths}
        gitRefName={gitRefName}
        fileName={fileName}
        handleOpenCommitDialog={() => toggleOpenCommitDialog(true)}
        handleCancelFileEdit={handleCancelFileEdit}
        parentPath={parentPath}
        setParentPath={setParentPath}
      />

      <FileEditorControlBar view={view} onChangeView={onChangeView} />

      {view === 'edit' ? (
        <CodeEditor
          height="100%"
          language={language}
          codeRevision={contentRevision}
          onCodeRevisionChange={valueRevision => setContentRevision(valueRevision ?? { code: '' })}
          themeConfig={themeConfig}
          theme={monacoTheme}
          options={{
            readOnly: false
          }}
        />
      ) : (
        <CodeDiffEditor
          height="100%"
          language={language}
          original={originalFileContent}
          modified={contentRevision.code}
          themeConfig={themeConfig}
          theme={monacoTheme}
          options={{
            readOnly: true
          }}
        />
      )}
    </>
  )
}
