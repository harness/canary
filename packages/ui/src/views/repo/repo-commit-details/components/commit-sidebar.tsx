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
        <SandboxLayout.Content className="flex h-full overflow-hidden p-0">
          <div className="flex w-full flex-col gap-3 pt-5">
            <div className="px-5">
              <SearchFiles navigateToFile={navigateToFile} filesList={filesList} />
            </div>
            <ScrollArea viewportClassName="px-5 pr-3.5">
              {children}
              <Spacer size={10} />
            </ScrollArea>
          </div>
        </SandboxLayout.Content>
      </SandboxLayout.LeftSubPanel>
    </div>
  )
}
