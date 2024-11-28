import { Button, ButtonGroup, Icon, SearchFiles } from '@/components'
import { SandboxLayout } from '@/views'
import { BranchSelectorListProps } from '@views/repo'
import { BranchSelector } from '@views/repo/components'

interface RepoSidebarProps {
  hasHeader?: boolean
  hasSubHeader?: boolean
  selectedBranch: string
  branchList: BranchSelectorListProps[]
  tagList: BranchSelectorListProps[]
  selectBranch: (branch: string) => void
  navigateToNewFile: () => void
  navigateToFile: (file: string) => void
  filesList: string[] | undefined
}

export const RepoSidebar = ({
  hasHeader,
  hasSubHeader,
  selectedBranch,
  branchList,
  tagList,
  selectBranch,
  navigateToNewFile,
  navigateToFile,
  filesList
}: RepoSidebarProps) => {
  return (
    <SandboxLayout.LeftSubPanel hasHeader={hasHeader} hasSubHeader={hasSubHeader}>
      <SandboxLayout.Content>
        <div className="flex flex-col gap-5">
          <div className="grid w-full auto-cols-auto grid-flow-col grid-cols-[1fr] items-center gap-3">
            {branchList && (
              <BranchSelector
                name={selectedBranch}
                branchList={branchList}
                tagList={tagList}
                selectBranch={selectBranch}
                // TODO: spaceId and repoId transfer is required
                repoId="repoId"
                spaceId="spaceId"
              />
            )}
            <ButtonGroup.Root
              spacing="0"
              className="h-full overflow-hidden rounded-md shadow-[inset_0_0_0_1px] shadow-border"
            >
              <Button size="sm" variant="ghost" className="w-8 rounded-none border-l p-0" onClick={navigateToNewFile}>
                <Icon size={15} name="add-file" className="text-primary/80" />
              </Button>
            </ButtonGroup.Root>
          </div>
          <SearchFiles navigateToFile={navigateToFile} filesList={filesList} />
        </div>
      </SandboxLayout.Content>
    </SandboxLayout.LeftSubPanel>
  )
}
