import { useCallback, useState } from 'react'

import { noop } from '@utils/viewUtils'

import {
  EditViewTypeValue,
  FileEditorControlBar,
  GitCommitDialog,
  GitCommitFormType,
  MarkdownViewer
} from '@harnessio/ui/components'
import { BranchSelectorTab, CodeModes, PathActionBar } from '@harnessio/ui/views'
import { CodeDiffEditor, CodeEditor } from '@harnessio/yaml-editor'

import { useExitConfirm } from '../hooks/use-exit-confirm'
import { repoFilesStore } from './repo-files-store'

export const getIsMarkdown = (language?: string) => language === 'markdown'

export const RepoFileEdit = () => {
  const [view, setView] = useState<EditViewTypeValue>('edit')
  const [isCommitDialogOpen, setIsCommitDialogOpen] = useState(false)
  const [fileName, setFileName] = useState('README.md')
  const [language, _setLanguage] = useState('markdown')
  const { show } = useExitConfirm()

  const toggleOpenCommitDialog = (value: boolean) => {
    setIsCommitDialogOpen(value)
  }

  /**
   * Change view handler
   * @param value
   */
  const onChangeView = (value: EditViewTypeValue) => {
    setView(value)
  }

  /**
   * Cancel edit handler
   */
  const handleCancelFileEdit = useCallback(() => {
    show({
      onConfirm: noop
    })
  }, [show])

  const renderFileView = () => {
    switch (view) {
      case 'preview':
        // For Markdown 'preview'
        if (getIsMarkdown(language)) {
          return (
            <MarkdownViewer
              source={repoFilesStore.mdFileContent}
              withBorderWrapper
              borderWrapperClassName="max-h-screen overflow-auto"
            />
          )
        }
        // For other file types, render code diff editor
        return (
          <CodeDiffEditor
            language={language}
            original={repoFilesStore.mdFileContent}
            modified={repoFilesStore.mdFileContent}
            themeConfig={{
              defaultTheme: 'dark'
            }}
            options={{
              readOnly: true
            }}
          />
        )

      case 'edit':
        return (
          <CodeEditor
            language={language}
            codeRevision={{ code: repoFilesStore.mdFileContent }}
            themeConfig={{
              defaultTheme: 'dark'
            }}
            onCodeRevisionChange={() => undefined}
            options={{
              readOnly: false
            }}
          />
        )

      default:
        return null
    }
  }

  return (
    <>
      <GitCommitDialog
        isOpen={isCommitDialogOpen}
        onClose={() => toggleOpenCommitDialog(false)}
        onFormSubmit={noop as unknown as (formValues: GitCommitFormType) => Promise<void>}
        disableCTA={false}
        dryRun={noop}
        violation={false}
        bypassable={false}
        currentBranch={repoFilesStore.branchSelectorStore.selectedBranchTag?.name || ''}
        setAllStates={noop}
        isSubmitting={false}
      />

      <PathActionBar
        codeMode={CodeModes.EDIT}
        pathParts={repoFilesStore.pathParts}
        changeFileName={vel => setFileName(vel)}
        onBlurFileName={noop}
        gitRefName={repoFilesStore.branchSelectorStore.selectedBranchTag?.name || ''}
        fileName={fileName}
        handleOpenCommitDialog={() => toggleOpenCommitDialog(true)}
        handleCancelFileEdit={handleCancelFileEdit}
        selectedRefType={BranchSelectorTab.BRANCHES}
      />

      <FileEditorControlBar view={view} onChangeView={onChangeView} />

      {renderFileView()}
    </>
  )
}
