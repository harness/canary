import { FC, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Button, IconV2, Layout, ListActions } from '@/components'
import { useTranslation } from '@/context'
import { useLocalStorage, UserPreference } from '@/hooks'
import { TypesUser } from '@/types'
import {
  ChangedFilesShortInfo,
  DiffModeOptions,
  DraggableSidebarDivider,
  InViewDiffRenderer,
  jumpToFile,
  PrincipalPropsType,
  SIDEBAR_MIN_WIDTH,
  TypesDiffStats
} from '@/views'
import { DiffModeEnum } from '@git-diff-view/react'
import { cn } from '@utils/cn'
import { chunk } from 'lodash-es'

import { HeaderProps, PullRequestAccordion } from '../../components/pull-request-accordian'
import { PullRequestDiffSidebar } from '../../components/pull-request-diff-sidebar'
import {
  calculateDetectionMargin,
  IN_VIEWPORT_DETECTION_MARGIN,
  innerBlockName,
  outterBlockName,
  PULL_REQUEST_DIFF_RENDERING_BLOCK_SIZE,
  shouldRetainDiffChildren
} from '../../utils'

interface PullRequestCompareDiffListProps {
  diffStats: TypesDiffStats
  diffData: HeaderProps[]
  currentUser?: TypesUser
  sourceBranch?: string
  principalProps: PrincipalPropsType
  onGetFullDiff: (path?: string) => Promise<string | void>
  toRepoFileDetails?: ({ path }: { path: string }) => string
}

const PullRequestCompareDiffList: FC<PullRequestCompareDiffListProps> = ({
  diffStats,
  diffData,
  currentUser,
  sourceBranch,
  principalProps,
  onGetFullDiff,
  toRepoFileDetails
}) => {
  const { t } = useTranslation()
  const [diffMode, setDiffMode] = useLocalStorage<DiffModeEnum>(UserPreference.DIFF_VIEW_STYLE, DiffModeEnum.Split)
  const handleDiffModeChange = (value: string) => {
    setDiffMode(value === 'Split' ? DiffModeEnum.Split : DiffModeEnum.Unified)
  }
  const [openItems, setOpenItems] = useState<string[]>([])
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_MIN_WIDTH)
  const diffBlocks = useMemo(() => chunk(diffData, PULL_REQUEST_DIFF_RENDERING_BLOCK_SIZE), [diffData])
  const diffsContainerRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [showExplorer, setShowExplorer] = useState(true)

  useEffect(() => {
    if (diffData.length > 0) {
      setOpenItems(diffData.map(diffItem => diffItem.text))
    }
  }, [diffData])

  const toggleOpen = useCallback(
    (fileText: string) => {
      setOpenItems(curr => (curr.includes(fileText) ? curr.filter(t => t !== fileText) : [...curr, fileText]))
    },
    [setOpenItems]
  )

  const goToDiff = useCallback(
    (fileName: string) => {
      jumpToFile(fileName, diffBlocks, undefined, diffsContainerRef)
    },
    [diffBlocks]
  )

  const setCollapsed = useCallback(
    (fileText: string, val: boolean) => {
      setOpenItems(items => {
        if (val) {
          return items.filter(item => item !== fileText)
        } else {
          return items.includes(fileText) ? items : [...items, fileText]
        }
      })
    },
    [setOpenItems]
  )

  return (
    <Layout.Flex className="flex-1" ref={containerRef}>
      {showExplorer && (
        // TODO: Replace -mb-[28px] with a proper value from the design system once available
        <Layout.Flex className="-mb-[28px]">
          <PullRequestDiffSidebar
            sidebarWidth={sidebarWidth}
            filePaths={diffData?.map(diff => diff.filePath) || []}
            goToDiff={goToDiff}
            diffsData={
              diffData?.map(item => ({
                addedLines: item.addedLines || 0,
                deletedLines: item.deletedLines || 0,
                lang: item.filePath.split('.')[1],
                filePath: item.filePath,
                isDeleted: !!item.isDeleted,
                unchangedPercentage: item.unchangedPercentage || 0
              })) || []
            }
            setShowExplorer={setShowExplorer}
          />
          <DraggableSidebarDivider width={sidebarWidth} setWidth={setSidebarWidth} containerRef={containerRef} />
        </Layout.Flex>
      )}
      <Layout.Flex className={cn('p-0', showExplorer ? 'pl-cn-sm' : '')} direction="column">
        <Layout.Horizontal
          align="center"
          justify="between"
          gap="xl"
          className="layer-high bg-cn-1 pt-cn-xl pb-cn-xs sticky top-[var(--cn-breadcrumbs-height)]"
        >
          <Layout.Horizontal className="grow" align="center">
            {!showExplorer && (
              <Button
                variant="outline"
                onClick={() => setShowExplorer(true)}
                iconOnly
                tooltipProps={{
                  content: t('views:pullRequests.expandSidebar', 'Expand Sidebar')
                }}
                title={t('views:pullRequests.expandSidebar', 'Expand Sidebar')}
              >
                <IconV2 name="expand-sidebar" />
              </Button>
            )}
            <ChangedFilesShortInfo diffData={diffData} diffStats={diffStats} goToDiff={goToDiff} />
          </Layout.Horizontal>
          <Layout.Horizontal gap="xl">
            <ListActions.Dropdown
              selectedValue={diffMode === DiffModeEnum.Split ? 'Split' : 'Unified'}
              onChange={handleDiffModeChange}
              title={diffMode === DiffModeEnum.Split ? 'Split' : 'Unified'}
              items={DiffModeOptions}
            />
          </Layout.Horizontal>
        </Layout.Horizontal>
        <div className="flex flex-col" ref={diffsContainerRef}>
          {diffBlocks?.map((diffsBlock, blockIndex) => {
            return (
              <InViewDiffRenderer
                key={blockIndex}
                blockName={outterBlockName(blockIndex)}
                root={document as unknown as RefObject<Element>}
                shouldRetainChildren={shouldRetainDiffChildren}
                detectionMargin={calculateDetectionMargin(diffData?.length)}
              >
                {diffsBlock?.map((item, index) => (
                  <div className="pt-cn-xs" key={item.filePath}>
                    <InViewDiffRenderer
                      key={item.filePath}
                      blockName={innerBlockName(item?.filePath ?? (blockIndex + index).toString())}
                      root={diffsContainerRef}
                      shouldRetainChildren={shouldRetainDiffChildren}
                      detectionMargin={IN_VIEWPORT_DETECTION_MARGIN}
                    >
                      <PullRequestAccordion
                        principalProps={principalProps}
                        key={`item?.title ? ${item?.title}-${index} : ${index}`}
                        header={item}
                        currentUser={currentUser}
                        diffMode={diffMode}
                        openItems={openItems}
                        onToggle={() => toggleOpen(item.text)}
                        setCollapsed={val => setCollapsed(item.text, val)}
                        onGetFullDiff={onGetFullDiff}
                        toRepoFileDetails={toRepoFileDetails}
                        sourceBranch={sourceBranch}
                        hideViewedCheckbox
                        addWidget={false}
                      />
                    </InViewDiffRenderer>
                  </div>
                ))}
              </InViewDiffRenderer>
            )
          })}
        </div>
      </Layout.Flex>
    </Layout.Flex>
  )
}

export default PullRequestCompareDiffList
