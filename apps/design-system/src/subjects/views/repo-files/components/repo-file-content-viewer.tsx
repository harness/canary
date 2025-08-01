import { useState } from 'react'

import { noop } from '@utils/viewUtils'

import {
  FileViewerControlBar,
  GitCommitDialog,
  GitCommitFormType,
  MarkdownViewer,
  Tabs,
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
      <Tabs.Root
        className="flex flex-col h-full"
        value={view as string}
        onValueChange={val => onChangeView(val as ViewTypeValue)}
      >
        <FileViewerControlBar
          view={view}
          isMarkdown={isMarkdown}
          fileBytesSize="100 KB"
          fileContent={isMarkdown ? repoFilesStore.markdownFileContent : repoFilesStore.jsonFileContent}
          url=""
          handleDownloadFile={noop}
          handleEditFile={noop}
          handleOpenDeleteDialog={() => handleToggleDeleteDialog(true)}
        />

        {isMarkdown && (
          <Tabs.Content value="preview">
            <MarkdownViewer source={repoFilesStore.markdownFileContent} withBorder /> :
          </Tabs.Content>
        )}

        <Tabs.Content value="code">
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
        </Tabs.Content>

        <Tabs.Content value="blame">
          <BlameEditor
            code={repoFilesStore.jsonFileContent}
            language="json"
            lineNumbersPosition="center"
            blameData={repoFilesStore.blameJsonFileContent}
            themeConfig={{
              defaultTheme: 'dark',
              themes
            }}
            className={'grow'}
          />
        </Tabs.Content>
      </Tabs.Root>
    </>
  )
}
