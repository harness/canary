import { useState } from 'react'

import { noop } from '@utils/viewUtils'

import {
  FileViewerControlBar,
  GitCommitDialog,
  GitCommitFormType,
  MarkdownViewer,
  ViewTypeValue
} from '@harnessio/ui/components'
import { BlameEditor, CodeEditor } from '@harnessio/yaml-editor'

import { themes } from '../theme/monaco-theme'
import { repoFilesStore } from './repo-files-store'

export const RepoFileContentViewer = ({ isMarkdown = false }: { isMarkdown?: boolean }) => {
  const [isDeleteFileDialogOpen, setIsDeleteFileDialogOpen] = useState(false)
  const [view, setView] = useState<ViewTypeValue>(isMarkdown ? 'preview' : 'code')

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

  return (
    <>
      <GitCommitDialog
        isOpen={isDeleteFileDialogOpen}
        onClose={() => handleToggleDeleteDialog(false)}
        onFormSubmit={noop as unknown as (formValues: GitCommitFormType) => Promise<void>}
        disableCTA={false}
        dryRun={noop}
        violation={false}
        bypassable={false}
        currentBranch={repoFilesStore.branchSelectorStore.selectedBranchTag?.name || ''}
        setAllStates={noop}
        isSubmitting={false}
      />
      <FileViewerControlBar
        view={view}
        onChangeView={onChangeView}
        isMarkdown={isMarkdown}
        fileBytesSize="100 KB"
        fileContent={isMarkdown ? repoFilesStore.markdownFileContent : repoFilesStore.jsonFileContent}
        url=""
        handleDownloadFile={noop}
        handleEditFile={noop}
        handleOpenDeleteDialog={() => handleToggleDeleteDialog(true)}
      />
      {isMarkdown && view === 'preview' ? (
        <MarkdownViewer source={repoFilesStore.markdownFileContent} withBorderWrapper />
      ) : view === 'code' ? (
        <CodeEditor
          language="json"
          codeRevision={{
            code: isMarkdown ? repoFilesStore.markdownFileContent : repoFilesStore.jsonFileContent
          }}
          onCodeRevisionChange={() => undefined}
          themeConfig={{
            defaultTheme: 'dark',
            themes
          }}
          options={{
            readOnly: true
          }}
        />
      ) : (
        <BlameEditor
          code={repoFilesStore.jsonFileContent}
          language="json"
          lineNumbersPosition="center"
          blameData={repoFilesStore.blameJsonFileContent}
          themeConfig={{
            defaultTheme: 'dark',
            themes
          }}
        />
      )}
    </>
  )
}
