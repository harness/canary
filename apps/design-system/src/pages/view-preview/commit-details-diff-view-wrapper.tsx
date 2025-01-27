import { FC, useCallback } from 'react'

import { commitDetailsStore } from '@subjects/views/commit-details/commit-details-store'
import { repoFilesStore } from '@subjects/views/repo-files/components/repo-files-store'
import { renderEntries } from '@utils/fileViewUtils'
import { noop, useTranslationStore } from '@utils/viewUtils'

import { FileExplorer } from '@harnessio/ui/components'
import { CommitDiff, CommitSidebar, ICommitDetailsStore } from '@harnessio/ui/views'

export const CommitDetailsDiffViewWrapper: FC = () => {
  const useCommitDetailsStore = useCallback((): ICommitDetailsStore => commitDetailsStore, [])

  return (
    <>
      <CommitSidebar
        useTranslationStore={useTranslationStore}
        navigateToFile={() => {}}
        filesList={repoFilesStore.filesList}
      >
        <FileExplorer.Root onValueChange={noop} value={[]}>
          {renderEntries(repoFilesStore.filesTreeData, '')}
        </FileExplorer.Root>
      </CommitSidebar>
      <CommitDiff useCommitDetailsStore={useCommitDetailsStore} useTranslationStore={useTranslationStore} />
    </>
  )
}
