import { ReactNode } from 'react'

import { Button, Icon, ScrollArea, SearchFiles, Spacer } from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'
import { BranchSelector, BranchSelectorListItem, BranchSelectorTab, IBranchSelectorStore } from '@views/repo'

interface RepoSidebarProps {
  navigateToNewFile: () => void
  navigateToFile: (file: string) => void
  filesList?: string[]
  children: ReactNode
  selectBranchOrTag: (branchTag: BranchSelectorListItem, type: BranchSelectorTab) => void
  useRepoBranchesStore: () => IBranchSelectorStore
  useTranslationStore: () => TranslationStore
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export const RepoSidebar = ({
  navigateToNewFile,
  navigateToFile,
  filesList,
  children,
  selectBranchOrTag,
  useRepoBranchesStore,
  useTranslationStore,
  searchQuery,
  setSearchQuery
}: RepoSidebarProps) => {
  const { branchList } = useRepoBranchesStore()

  return (
    <>
      <div className="nested-sidebar-height sticky top-[var(--cn-page-nav-height)]">
        <SandboxLayout.LeftSubPanel className="w-[247px] border-none">
          <SandboxLayout.Content className="h-full overflow-hidden p-0">
            <div className="flex size-full flex-col gap-3 pt-5">
              <div className="grid w-full auto-cols-auto grid-flow-col grid-cols-[1fr] items-center gap-2 px-5">
                {branchList && (
                  <BranchSelector
                    onSelectBranch={selectBranchOrTag}
                    useRepoBranchesStore={useRepoBranchesStore}
                    useTranslationStore={useTranslationStore}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                )}
                <Button
                  iconOnly
                  theme="muted"
                  variant="surface"
                  aria-label="Create new file"
                  onClick={navigateToNewFile}
                >
                  <Icon size={16} name="plus" className="text-icons-3" />
                </Button>
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
      </div>
      {/* Sticky right border */}
      <div className="border-cn-borders-4 sticky top-0 w-px border-r" />
    </>
  )
}
