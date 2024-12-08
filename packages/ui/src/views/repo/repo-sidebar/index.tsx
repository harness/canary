import { ReactNode } from 'react'

import { Button, ButtonGroup, Icon, ScrollArea, SearchFiles, Spacer } from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'
import { BranchSelector, BranchSelectorListItem, BranchSelectorTab, IBranchSelectorStore } from '@views/repo'

interface RepoSidebarProps {
  hasHeader?: boolean
  hasSubHeader?: boolean
  navigateToNewFile: () => void
  navigateToFile: (file: string) => void
  filesList?: string[]
  children: ReactNode
  selectBranchOrTag: (branchTag: BranchSelectorListItem, type: BranchSelectorTab) => void
  useRepoBranchesStore: () => IBranchSelectorStore
  useTranslationStore: () => TranslationStore
}

export const RepoSidebar = ({
  hasHeader,
  hasSubHeader,
  navigateToNewFile,
  navigateToFile,
  filesList,
  children,
  selectBranchOrTag,
  useRepoBranchesStore,
  useTranslationStore
}: RepoSidebarProps) => {
  const { branchList } = useRepoBranchesStore()

  return (
    <SandboxLayout.LeftSubPanel className="w-[248px]" hasHeader={hasHeader} hasSubHeader={hasSubHeader}>
      <SandboxLayout.Content className="flex h-full overflow-hidden p-0">
        <div className="flex w-full flex-col gap-3 pt-5">
          <div className="grid w-full auto-cols-auto grid-flow-col grid-cols-[1fr] items-center gap-2 px-5">
            {branchList && (
              <BranchSelector
                onSelectBranch={selectBranchOrTag}
                useRepoBranchesStore={useRepoBranchesStore}
                useTranslationStore={useTranslationStore}
              />
            )}
            <ButtonGroup spacing="0" className="h-full rounded shadow-as-border shadow-borders-2">
              <Button
                className="border-borders-2 p-0"
                size="icon"
                variant="ghost"
                aria-label="Create new file"
                onClick={navigateToNewFile}
              >
                <Icon size={16} name="add-file" className="text-icons-3" />
              </Button>
            </ButtonGroup>
          </div>
          <div className="px-5">
            <SearchFiles
              navigateToFile={navigateToFile}
              filesList={filesList}
              useTranslationStore={useTranslationStore}
            />
          </div>
          <ScrollArea viewportClassName="px-5 pr-3.5">
            {children}
            <Spacer size={10} />
          </ScrollArea>
        </div>
      </SandboxLayout.Content>
    </SandboxLayout.LeftSubPanel>
  )
}
