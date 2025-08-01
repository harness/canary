import { ReactNode } from 'react'

import { Button, IconV2, ScrollArea, SearchFiles, Spacer } from '@/components'
import { SandboxLayout } from '@/views'

interface RepoSidebarProps {
  navigateToNewFile: () => void
  navigateToFile: (file: string) => void
  filesList?: string[]
  children: ReactNode
  branchSelectorRenderer: ReactNode
}

export const RepoSidebar = ({
  navigateToNewFile,
  branchSelectorRenderer,
  navigateToFile,
  filesList,
  children
}: RepoSidebarProps) => {
  return (
    <>
      <div className="nested-sidebar-height sticky top-[var(--cn-page-nav-height)]">
        <SandboxLayout.LeftSubPanel className="w-[247px] border-none">
          <SandboxLayout.Content className="h-full overflow-hidden pr-0">
            <div className="flex size-full flex-col gap-3">
              <div className="grid w-full auto-cols-auto grid-flow-col grid-cols-[1fr] items-center gap-2 pr-3">
                {branchSelectorRenderer}
                <Button iconOnly variant="outline" aria-label="Create file" onClick={navigateToNewFile}>
                  <IconV2 name="plus" className="text-icons-3" />
                </Button>
              </div>
              <div className="pr-3">
                <SearchFiles navigateToFile={navigateToFile} filesList={filesList} />
              </div>
              <ScrollArea className="grid-cols-[100%] pr-3">
                {children}
                <Spacer size={7} />
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
