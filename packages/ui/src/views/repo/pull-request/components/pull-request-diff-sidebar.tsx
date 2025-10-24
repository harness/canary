import { FC, useRef } from 'react'

import { Button, IconV2, Layout, ScrollArea, SearchFiles, Text } from '@/components'
import { useTranslation } from '@/context'

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
  setShowExplorer: (value: boolean) => void
}

export const PullRequestDiffSidebar: FC<PullRequestDiffSidebarProps> = ({
  sidebarWidth,
  filePaths,
  goToDiff,
  activeDiff,
  diffsData,
  setShowExplorer
}) => {
  const { t } = useTranslation()
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
        <Layout.Horizontal gap="sm" align="center" className="mb-cn-3xs">
          <Button
            variant="outline"
            onClick={() => setShowExplorer(false)}
            iconOnly
            tooltipProps={{
              content: t('views:pullRequests.collapseSidebar', 'Collapse Sidebar')
            }}
            title={t('views:pullRequests.collapseSidebar', 'Collapse Sidebar')}
          >
            <IconV2 name="collapse-sidebar" />
          </Button>
          <Text variant="heading-subsection" truncate>
            {t('views:repos.files', 'Files')}
          </Text>
        </Layout.Horizontal>

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
