import { FC, useCallback, useRef, useState } from 'react'

import { commitDetailsStore } from '@subjects/views/commit-details/commit-details-store'
import { repoFilesStore } from '@subjects/views/repo-files/components/repo-files-store'
import { renderEntries } from '@utils/fileViewUtils'
import { noop } from '@utils/viewUtils'

import { FileExplorer, Layout } from '@harnessio/ui/components'
import {
  CommitDiff,
  CommitSidebar,
  DraggableSidebarDivider,
  ICommitDetailsStore,
  SIDEBAR_MIN_WIDTH
} from '@harnessio/views'

export const CommitDetailsDiffViewWrapper: FC = () => {
  const useCommitDetailsStore = useCallback((): ICommitDetailsStore => commitDetailsStore, [])
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_MIN_WIDTH)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <Layout.Flex gapX="lg" ref={containerRef}>
      <CommitSidebar navigateToFile={() => {}} filesList={repoFilesStore.filesList} sidebarWidth={sidebarWidth}>
        <FileExplorer.Root onValueChange={noop} value={[]}>
          {renderEntries(repoFilesStore.filesTreeData, '')}
        </FileExplorer.Root>
      </CommitSidebar>
      <DraggableSidebarDivider width={sidebarWidth} setWidth={setSidebarWidth} containerRef={containerRef} />
      <CommitDiff useCommitDetailsStore={useCommitDetailsStore} />
    </Layout.Flex>
  )
}
