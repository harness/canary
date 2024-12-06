import { ReactNode } from 'react'

import { Button, ButtonGroup, Icon, ScrollArea, SearchFiles, Spacer } from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'
import { IBranchSelectorStore } from '@views/repo'
import { BranchSelector } from '@views/repo/components'

interface RepoSidebarProps {
  hasHeader?: boolean
  hasSubHeader?: boolean
  navigateToNewFile: () => void
  navigateToNewFolder: () => void
  navigateToFile: (file: string) => void
  filesList?: string[]
  children: ReactNode
  useBranchSelectorStore: () => IBranchSelectorStore
  useTranslationStore: () => TranslationStore
}

export const RepoSidebar = ({
  hasHeader,
  hasSubHeader,
  navigateToNewFile,
  navigateToNewFolder,
  navigateToFile,
  filesList,
  children,
  useBranchSelectorStore,
  useTranslationStore
}: RepoSidebarProps) => {
  const { branchList } = useBranchSelectorStore()

  return (
    <SandboxLayout.LeftSubPanel className="w-[248px]" hasHeader={hasHeader} hasSubHeader={hasSubHeader}>
      <SandboxLayout.Content className="flex h-full overflow-hidden p-0">
        <div className="flex w-full flex-col gap-3 p-5 pb-0 pr-0">
          <div className="grid w-full auto-cols-auto grid-flow-col grid-cols-[1fr] items-center gap-3 pr-5">
            {branchList && (
              <BranchSelector
                useBranchSelectorStore={useBranchSelectorStore}
                useTranslationStore={useTranslationStore}
              />
            )}
            <ButtonGroup spacing="0" className="h-full overflow-hidden rounded shadow-as-border shadow-borders-2">
              <Button
                className="rounded-none border-l border-borders-2 p-0"
                size="icon"
                variant="ghost"
                aria-label="Create new folder"
                onClick={navigateToNewFolder}
              >
                <Icon size={16} name="add-folder" className="text-icons-3" />
              </Button>
              <Button
                className="rounded-none border-l border-borders-2 p-0"
                size="icon"
                variant="ghost"
                aria-label="Create new file"
                onClick={navigateToNewFile}
              >
                <Icon size={16} name="add-file" className="text-icons-3" />
              </Button>
            </ButtonGroup>
          </div>
          <div className="pr-5">
            <SearchFiles
              navigateToFile={navigateToFile}
              filesList={filesList}
              useTranslationStore={useTranslationStore}
            />
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
