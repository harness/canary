import { BranchListProps, BranchSelector, Button, ButtonGroup, Icon, SearchFiles } from '@/components'
import { SandboxLayout } from '@/views'

interface RepoSidebarProps {
  hasHeader?: boolean
  hasSubHeader?: boolean
  selectedBranch: string
  branchList: BranchListProps[] | undefined
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
              <BranchSelector size="sm" name={selectedBranch} branchList={branchList} selectBranch={selectBranch} />
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
