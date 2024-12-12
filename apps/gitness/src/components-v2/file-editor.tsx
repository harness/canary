import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { OpenapiGetContentOutput } from '@harnessio/code-service-client'
import { EditViewTypeValue, FileEditorControlBar } from '@harnessio/ui/components'
import { PathActionBar } from '@harnessio/ui/views'
import { CodeDiffEditor, CodeEditor } from '@harnessio/yaml-editor'

import GitCommitDialog from '../components-v2/git-commit-dialog'
import { useExitConfirm } from '../framework/hooks/useExitConfirm'
import useCodePathDetails from '../hooks/useCodePathDetails'
import { useTranslationStore } from '../i18n/stores/i18n-store'
import { useRepoBranchesStore } from '../pages-v2/repo/stores/repo-branches-store'
import { themes } from '../pages/pipeline-edit/theme/monaco-theme'
import { PathParams } from '../RouteDefinitions'
import { decodeGitContent, FILE_SEPERATOR, filenameToLanguage, GitCommitAction, PLAIN_TEXT } from '../utils/git-utils'
import { splitPathWithParents } from '../utils/path-utils'

export interface FileEditorProps {
  repoDetails?: OpenapiGetContentOutput
  defaultBranch: string
}

export const FileEditor: FC<FileEditorProps> = ({ repoDetails, defaultBranch }) => {
  const navigate = useNavigate()
  const { codeMode, fullGitRef, gitRefName, fullResourcePath } = useCodePathDetails()
  const { spaceId, repoId } = useParams<PathParams>()
  const { show } = useExitConfirm()
  const repoPath = `/${spaceId}/repos/${repoId}/code/${fullGitRef}`

  const [fileName, setFileName] = useState('')
  const [language, setLanguage] = useState('')
  const [originalFileContent, setOriginalFileContent] = useState('')
  const [content, setContent] = useState(originalFileContent)
  const [view, setView] = useState<EditViewTypeValue>('edit')
  const [dirty, setDirty] = useState(false)
  const [isCommitDialogOpen, setIsCommitDialogOpen] = useState(false)
  const { selectedBranchTag } = useRepoBranchesStore()

  const themeConfig = useMemo(
    () => ({
      defaultTheme: 'dark',
      themes
    }),
    []
  )

  const isNew = useMemo(() => repoDetails && repoDetails.type === 'dir', [repoDetails])
  const [parentPath, setParentPath] = useState(
    isNew ? fullResourcePath : fullResourcePath?.split(FILE_SEPERATOR).slice(0, -1).join(FILE_SEPERATOR)
  )
  const pathParts = useMemo(() => (parentPath?.length ? splitPathWithParents(parentPath, repoPath) : []), [parentPath])
  const fileResourcePath = useMemo(
    () => [(parentPath || '').trim(), (fileName || '').trim()].filter(p => !!p.trim()).join(FILE_SEPERATOR),
    [parentPath, fileName]
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
    setDirty(!(!fileName || (isUpdate && content === originalFileContent)))
  }, [fileName, isUpdate, content, originalFileContent])

  useEffect(() => {
    setContent(originalFileContent)
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
        setOriginalFileContent(content)
      }
    }

    setParentPath(_parentPath)
  }, [fileName, parentPath, language, content])

  /**
   * Navigate to file view route
   */
  const onExitConfirm = useCallback(() => {
    const navigateTo = `/${spaceId}/repos/${repoId}/code/${fullGitRef}/${fullResourcePath ? `~/${fullResourcePath}` : ''}`
    navigate(navigateTo)
  }, [fullGitRef, fullResourcePath, navigate, repoId, spaceId])

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
        payload={content}
        sha={repoDetails?.sha}
        onSuccess={(_commitInfo, isNewBranch, newBranchName, fileName) => {
          if (!isNewBranch) {
            navigate(
              `/${spaceId}/repos/${repoId}/code/${fullGitRef}/~/${isNew ? fileResourcePath + fileName : fileResourcePath}`
            )
          } else {
            navigate(`/${spaceId}/repos/${repoId}/pull-requests/compare/${defaultBranch}...${newBranchName}`)
          }
        }}
        currentBranch={fullGitRef || selectedBranchTag?.name}
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
      />

      <FileEditorControlBar view={view} onChangeView={onChangeView} />

      {view === 'edit' ? (
        <CodeEditor
          language={language}
          codeRevision={{ code: content }}
          onCodeRevisionChange={value => setContent(value?.code || '')}
          themeConfig={themeConfig}
          options={{
            readOnly: false
          }}
        />
      ) : (
        <CodeDiffEditor
          language={language}
          original={originalFileContent}
          modified={content}
          themeConfig={themeConfig}
          options={{
            readOnly: true
          }}
        />
      )}
    </>
  )
}
