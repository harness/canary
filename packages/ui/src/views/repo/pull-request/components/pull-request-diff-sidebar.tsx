import { ScrollArea, SearchFiles } from '@/components'

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
      className={`h-screen sticky top-[55px] shrink-0 min-w-[${SIDEBAR_MIN_WIDTH}px] max-w-[${SIDEBAR_MAX_WIDTH}px] pr-cn-xs overflow-hidden`}
      style={{
        width: `${sidebarWidth}px`
      }}
    >
      <div className="flex h-[calc(100vh-55px)] flex-col gap-3 pt-1.5">
        <SearchFiles
          navigateToFile={file => {
            setJumpToDiff(file)
          }}
          filesList={filePaths}
        />
        <ScrollArea className="pb-cn-xl -mr-cn-xs pr-cn-xs">
          <PullRequestChangesExplorer
            paths={filePaths}
            setJumpToDiff={setJumpToDiff}
            activePath={activePath}
            diffsData={diffsData}
          />
        </ScrollArea>
      </div>
    </div>
  )
}
