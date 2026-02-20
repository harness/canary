import { useCallback, useState } from 'react'

import { noop } from '@utils/viewUtils'

import {
  EditViewTypeValue,
  FileEditorControlBar,
  getIsMarkdown,
  GitCommitDialog,
  GitCommitFormType,
  MarkdownViewer,
  Tabs
} from '@harnessio/ui/components'
import { BranchSelectorTab, CodeModes, PathActionBar } from '@harnessio/views'
import { CodeDiffEditor, CodeEditor } from '@harnessio/yaml-editor'

import { useExitConfirm } from '../hooks/use-exit-confirm'
import { repoFilesStore } from './repo-files-store'

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

      <Tabs.Root
        className="flex h-full flex-col"
        value={view as string}
        onValueChange={val => onChangeView(val as EditViewTypeValue)}
      >
        <FileEditorControlBar />

        <Tabs.Content value="edit" className="grow">
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
        </Tabs.Content>

        <Tabs.Content value="preview" className="grow">
          {getIsMarkdown(language) ? (
            <MarkdownViewer source={repoFilesStore.mdFileContent} withBorder className="max-h-screen overflow-auto" />
          ) : (
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
          )}
        </Tabs.Content>
      </Tabs.Root>
    </>
  )
}
