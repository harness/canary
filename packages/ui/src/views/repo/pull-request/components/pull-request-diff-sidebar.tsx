import { useRef } from 'react'

import { Layout, ScrollArea, SearchFiles } from '@/components'

import { SIDEBAR_MAX_WIDTH, SIDEBAR_MIN_WIDTH } from '../../components/draggable-sidebar-divider'
import {
  ExplorerDiffData,
  PullRequestChangesExplorer
} from '../details/components/changes/pull-request-changes-explorer'

interface PullRequestDiffSidebarProps {
  sidebarWidth: number
  filePaths: string[]
  goToDiff: (fileName: string) => void
  activeDiff?: string
  diffsData?: ExplorerDiffData[]
}

export const PullRequestDiffSidebar: React.FC<PullRequestDiffSidebarProps> = ({
  sidebarWidth,
  filePaths,
  goToDiff,
  activeDiff,
  diffsData
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  return (
    <div
      className="nested-sidebar-height pr-cn-sm sticky top-[var(--cn-breadcrumbs-height)] -ml-8 overflow-hidden"
      style={{
        width: `${sidebarWidth}px`,
        minWidth: `${SIDEBAR_MIN_WIDTH}px`,
        maxWidth: `${SIDEBAR_MAX_WIDTH}px`
      }}
    >
      <Layout.Flex direction="column" className="pt-cn-xl max-h-full pl-8" gapY="sm">
        <SearchFiles navigateToFile={goToDiff} filesList={filePaths} />

        <ScrollArea className="pr-cn-sm -mr-cn-sm grid-cols-[100%] pb-7" ref={scrollAreaRef}>
          <PullRequestChangesExplorer
            paths={filePaths}
            goToDiff={goToDiff}
            activeDiff={activeDiff}
            diffsData={diffsData}
            scrollAreaRef={scrollAreaRef}
          />
        </ScrollArea>
      </Layout.Flex>
    </div>
  )
}
