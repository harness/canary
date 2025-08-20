import { Layout, ScrollArea, SearchFiles } from '@/components'

import { SIDEBAR_MAX_WIDTH, SIDEBAR_MIN_WIDTH } from '../../components/draggable-sidebar-divider'
import {
  ExplorerDiffData,
  PullRequestChangesExplorer
} from '../details/components/changes/pull-request-changes-explorer'

interface PullRequestDiffSidebarProps {
  sidebarWidth: number
  filePaths: string[]
  setJumpToDiff: (fileName: string) => void
  activePath?: string
  diffsData?: ExplorerDiffData[]
}

export const PullRequestDiffSidebar: React.FC<PullRequestDiffSidebarProps> = ({
  sidebarWidth,
  filePaths,
  setJumpToDiff,
  activePath,
  diffsData
}) => {
  return (
    <div
      className="nested-sidebar-height pr-cn-lg sticky top-[var(--cn-breadcrumbs-height)] -ml-8 overflow-hidden"
      style={{
        width: `${sidebarWidth}px`,
        minWidth: `${SIDEBAR_MIN_WIDTH}px`,
        maxWidth: `${SIDEBAR_MAX_WIDTH}px`
      }}
    >
      <Layout.Flex direction="column" className="pt-cn-xl max-h-full pl-8" gapY="sm">
        <SearchFiles navigateToFile={setJumpToDiff} filesList={filePaths} contentClassName="width-popover-max-width" />

        <ScrollArea className="grid-cols-[100%] pb-7">
          <PullRequestChangesExplorer
            paths={filePaths}
            setJumpToDiff={setJumpToDiff}
            activePath={activePath}
            diffsData={diffsData}
          />
        </ScrollArea>
      </Layout.Flex>
    </div>
  )
}
