import { FC, useCallback, useRef, useState } from 'react'

import { commitDetailsStore } from '@subjects/views/commit-details/commit-details-store'
import { repoFilesStore } from '@subjects/views/repo-files/components/repo-files-store'
import { renderEntries } from '@utils/fileViewUtils'
import { noop } from '@utils/viewUtils'

import { FileExplorer, Layout } from '@harnessio/ui/components'
import {
  CommitDiff,
  CommitDiffsViewProps,
  CommitSidebar,
  DraggableSidebarDivider,
  ICommitDetailsStore,
  SIDEBAR_MIN_WIDTH
} from '@harnessio/views'

type DiffMode = CommitDiffsViewProps['diffMode']

const SPLIT_MODE = 1 as DiffMode

export const CommitDetailsDiffViewWrapper: FC = () => {
  const useCommitDetailsStore = useCallback((): ICommitDetailsStore => commitDetailsStore, [])
  const [diffMode, setDiffMode] = useState<DiffMode>(SPLIT_MODE)
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
      <CommitDiff useCommitDetailsStore={useCommitDetailsStore} diffMode={diffMode} setDiffMode={setDiffMode} />
    </Layout.Flex>
  )
}
