import { ReactNode } from 'react'

import { ScrollArea, SearchFiles, Spacer } from '@/components'
import { SandboxLayout } from '@/views'

interface CommitsSidebarProps {
  navigateToFile: (file: string) => void
  filesList?: string[]
  children: ReactNode
}

export const CommitSidebar = ({ navigateToFile, filesList, children }: CommitsSidebarProps) => {
  return (
    <div className="nested-sidebar-height sticky top-[var(--cn-page-nav-height)]">
      <SandboxLayout.LeftSubPanel className="w-[248px]">
        <SandboxLayout.Content className="h-full overflow-hidden pr-0">
          <div className="flex size-full flex-col gap-3">
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
  )
}
