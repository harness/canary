import { ReactNode } from 'react'

import { Layout, ScrollArea, SearchFiles } from '@/components'

interface CommitsSidebarProps {
  navigateToFile: (file: string) => void
  filesList?: string[]
  children: ReactNode
}

export const CommitSidebar = ({ navigateToFile, filesList, children }: CommitsSidebarProps) => {
  return (
    <div className="nested-sidebar-height pt-cn-md -mt-cn-md sticky top-[var(--cn-page-nav-height)]">
      <Layout.Flex direction="column" className="max-h-full overflow-hidden" gapY="sm">
        <SearchFiles navigateToFile={navigateToFile} filesList={filesList} contentClassName="width-popover-max-width" />

        <ScrollArea className="pb-cn-xl -mr-5 grid-cols-[100%] pr-5" classNameContent="w-[248px]">
          {children}
        </ScrollArea>
      </Layout.Flex>
    </div>
  )
}
