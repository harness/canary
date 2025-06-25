import { FC, HTMLAttributes, PropsWithChildren } from 'react'

import { repoFilesStore } from '@subjects/views/repo-files/components/repo-files-store'
import { renderEntries } from '@utils/fileViewUtils'
import { noop } from '@utils/viewUtils'

import { FileExplorer } from '@harnessio/ui/components'
import { BranchSelectorV2, RepoSidebar as RepoSidebarView } from '@harnessio/ui/views'

export const RepoFilesViewWrapper: FC<PropsWithChildren<HTMLAttributes<HTMLElement>>> = ({ children }) => {
  return (
    <div className="grid" style={{ gridTemplateColumns: 'auto 1px 1fr' }}>
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
      <div className="min-h-[calc(100vh-var(--cn-page-nav-height))]">{children}</div>
    </div>
  )
}
