import { FC, HTMLAttributes, PropsWithChildren, useRef, useState } from 'react'

import { repoFilesStore } from '@subjects/views/repo-files/components/repo-files-store'
import { renderEntries } from '@utils/fileViewUtils'
import { noop } from '@utils/viewUtils'

import { FileExplorer, Layout } from '@harnessio/ui/components'
import {
  BranchSelectorV2,
  DraggableSidebarDivider,
  RepoSidebar as RepoSidebarView,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH
} from '@harnessio/ui/views'

export const RepoFilesViewWrapper: FC<PropsWithChildren<HTMLAttributes<HTMLElement>>> = ({ children }) => {
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_MIN_WIDTH)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <Layout.Flex className="flex-1" ref={containerRef}>
      <div
        className="shrink-0 overflow-hidden"
        style={{
          width: `${sidebarWidth}px`,
          minWidth: `${SIDEBAR_MIN_WIDTH}px`,
          maxWidth: `${SIDEBAR_MAX_WIDTH}px`
        }}
      >
        <RepoSidebarView
          navigateToNewFile={noop}
          navigateToFile={noop}
          filesList={repoFilesStore.filesList}
          branchSelectorRenderer={() => (
            <BranchSelectorV2
              repoId="canary"
              spaceId="org"
              branchList={[]}
              tagList={[]}
              selectedBranchorTag={{ name: 'main', sha: 'sha' }}
              selectedBranch={{ name: 'main', sha: 'sha' }}
              onSelectBranch={noop}
              isBranchOnly={false}
              dynamicWidth={false}
              setSearchQuery={noop}
            />
          )}
        >
          <FileExplorer.Root onValueChange={noop} value={[]}>
            {renderEntries(repoFilesStore.filesTreeData, '')}
          </FileExplorer.Root>
        </RepoSidebarView>
      </div>
      <DraggableSidebarDivider width={sidebarWidth} setWidth={setSidebarWidth} containerRef={containerRef} />

      {children}
    </Layout.Flex>
  )
}
