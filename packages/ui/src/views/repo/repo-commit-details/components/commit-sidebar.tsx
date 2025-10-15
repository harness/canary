import { ReactNode } from 'react'

import { Layout, ScrollArea, SearchFiles } from '@/components'
import { SIDEBAR_MAX_WIDTH, SIDEBAR_MIN_WIDTH } from '@views/repo/components'

interface CommitsSidebarProps {
  navigateToFile: (file: string) => void
  filesList?: string[]
  children: ReactNode
  sidebarWidth: number
}

export const CommitSidebar = ({ navigateToFile, filesList, children, sidebarWidth }: CommitsSidebarProps) => {
  return (
    <div
      className="nested-sidebar-height pt-cn-xl sticky top-[var(--cn-breadcrumbs-height)]"
      style={{
        width: `${sidebarWidth}px`,
        minWidth: `${SIDEBAR_MIN_WIDTH}px`,
        maxWidth: `${SIDEBAR_MAX_WIDTH}px`
      }}
    >
      <Layout.Flex direction="column" className="max-h-full overflow-hidden" gapY="sm">
        <SearchFiles navigateToFile={navigateToFile} filesList={filesList} />

        <ScrollArea className="pb-cn-xl pr-cn-sm grid-cols-[100%]" classNameContent="w-[248px]">
          {children}
        </ScrollArea>
      </Layout.Flex>
    </div>
  )
}
