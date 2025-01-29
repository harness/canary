import { ReactNode } from 'react'

import { ScrollArea, SearchFiles, Spacer } from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'

interface CommitsSidebarProps {
  navigateToFile: (file: string) => void
  filesList?: string[]
  children: ReactNode
  useTranslationStore: () => TranslationStore
}

export const CommitSidebar = ({ navigateToFile, filesList, children, useTranslationStore }: CommitsSidebarProps) => {
  return (
    // 100vh = screen height - (55px Breadcrumbs Height + 45px SubHeader Height = 100px)
    // Total height of topbar and outlet should be 100vh
    <div className="sticky top-[100px] h-[calc(100vh-100px)]">
      <SandboxLayout.LeftSubPanel className="w-[248px]">
        <SandboxLayout.Content className="flex h-full overflow-hidden p-0">
          <div className="flex w-full flex-col gap-3 pt-5">
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
  )
}
