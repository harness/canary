import { useCallback, useState } from 'react'

import { noop, useTranslationStore } from '@utils/viewUtils'

import { EditViewTypeValue, FileEditorControlBar, GitCommitDialog, GitCommitFormType } from '@harnessio/ui/components'
import { CodeModes, PathActionBar } from '@harnessio/ui/views'
import { CodeDiffEditor, CodeEditor } from '@harnessio/yaml-editor'

import { useExitConfirm } from '../hooks/use-exit-confirm'
import { themes } from '../theme/monaco-theme'
import { repoFilesStore } from './repo-files-store'

export const RepoFileEdit = () => {
  const [view, setView] = useState<EditViewTypeValue>('edit')
  const [isCommitDialogOpen, setIsCommitDialogOpen] = useState(false)
  const [fileName, setFileName] = useState('README.md')
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
        useTranslationStore={useTranslationStore}
        changeFileName={vel => setFileName(vel)}
        onBlurFileName={noop}
        gitRefName={repoFilesStore.branchSelectorStore.selectedBranchTag?.name || ''}
        fileName={fileName}
        handleOpenCommitDialog={() => toggleOpenCommitDialog(true)}
        handleCancelFileEdit={handleCancelFileEdit}
      />

      <FileEditorControlBar view={view} onChangeView={onChangeView} />

      {view === 'edit' ? (
        <CodeEditor
          language="json"
          codeRevision={{
            code: repoFilesStore.jsonFileContent
          }}
          onCodeRevisionChange={() => undefined}
          themeConfig={{
            defaultTheme: 'dark',
            themes
          }}
          options={{
            readOnly: false
          }}
        />
      ) : (
        <CodeDiffEditor
          language="json"
          original={repoFilesStore.jsonFileContent}
          modified={repoFilesStore.jsonFileContent}
          themeConfig={{
            defaultTheme: 'dark',
            themes
          }}
          theme="dark"
          options={{
            readOnly: true
          }}
        />
      )}
    </>
  )
}
