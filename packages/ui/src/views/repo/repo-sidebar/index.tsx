import { ReactNode } from 'react'

import { Button, ButtonGroup, Icon, ScrollArea, SearchFiles, Spacer } from '@/components'
import { SandboxLayout } from '@/views'
import { BranchSelectorListItem } from '@views/repo'
import { BranchSelector } from '@views/repo/components'

interface RepoSidebarProps {
  hasHeader?: boolean
  hasSubHeader?: boolean
  repoId: string
  spaceId: string
  selectedBranch: BranchSelectorListItem
  branchList: BranchSelectorListItem[]
  tagList: BranchSelectorListItem[]
  selectBranch: (branch: BranchSelectorListItem) => void
  navigateToNewFile: () => void
  navigateToNewFolder: () => void
  navigateToFile: (file: string) => void
  filesList?: string[]
  children: ReactNode
}

export const RepoSidebar = ({
  hasHeader,
  hasSubHeader,
  repoId,
  spaceId,
  selectedBranch,
  branchList,
  tagList,
  selectBranch,
  navigateToNewFile,
  navigateToNewFolder,
  navigateToFile,
  filesList,
  children
}: RepoSidebarProps) => {
  return (
    <SandboxLayout.LeftSubPanel className="w-[248px]" hasHeader={hasHeader} hasSubHeader={hasSubHeader}>
      <SandboxLayout.Content className="flex h-full overflow-hidden p-0">
        <div className="flex w-full flex-col gap-3 p-5 pb-0 pr-0">
          <div className="grid w-full auto-cols-auto grid-flow-col grid-cols-[1fr] items-center gap-3 pr-5">
            {branchList && (
              <BranchSelector
                selectedBranch={selectedBranch}
                branchList={branchList}
                tagList={tagList}
                onSelectBranch={selectBranch}
                repoId={repoId}
                spaceId={spaceId}
              />
            )}
            <ButtonGroup.Root spacing="0" className="h-full overflow-hidden rounded shadow-as-border shadow-borders-2">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-none border-l border-borders-2 p-0"
                onClick={navigateToNewFolder}
              >
                <Icon size={16} name="add-folder" className="text-icons-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-none border-l border-borders-2 p-0"
                onClick={navigateToNewFile}
              >
                <Icon size={16} name="add-file" className="text-icons-3" />
              </Button>
            </ButtonGroup.Root>
          </div>
          <div className="pr-5">
            <SearchFiles navigateToFile={navigateToFile} filesList={filesList} />
          </div>
          <ScrollArea className="pr-5">
            {children}
            <Spacer size={10} />
          </ScrollArea>
        </div>
      </SandboxLayout.Content>
    </SandboxLayout.LeftSubPanel>
  )
}
