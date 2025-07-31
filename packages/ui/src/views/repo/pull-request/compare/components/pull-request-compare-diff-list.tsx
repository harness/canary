import { FC, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { DropdownMenu, IconV2, Layout, ListActions, StatusBadge, Text } from '@/components'
import { useTranslation } from '@/context'
import { formatNumber } from '@/utils'
import { DiffModeOptions, InViewDiffRenderer, jumpToFile, PrincipalPropsType, TypesDiffStats } from '@/views'
import { DiffModeEnum } from '@git-diff-view/react'
import { chunk } from 'lodash-es'

import { HeaderProps, PullRequestAccordion } from '../../components/pull-request-accordian'
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
  currentUser?: string
  sourceBranch?: string
  jumpToDiff?: string
  setJumpToDiff: (fileName: string) => void
  principalProps: PrincipalPropsType
  onGetFullDiff: (path?: string) => Promise<string | void>
  toRepoFileDetails?: ({ path }: { path: string }) => string
}

const PullRequestCompareDiffList: FC<PullRequestCompareDiffListProps> = ({
  diffStats,
  diffData,
  currentUser,
  jumpToDiff,
  sourceBranch,
  setJumpToDiff,
  principalProps,
  onGetFullDiff,
  toRepoFileDetails
}) => {
  const { t } = useTranslation()

  const [diffMode, setDiffMode] = useState<DiffModeEnum>(DiffModeEnum.Split)
  const handleDiffModeChange = (value: string) => {
    setDiffMode(value === 'Split' ? DiffModeEnum.Split : DiffModeEnum.Unified)
  }
  const [openItems, setOpenItems] = useState<string[]>([])
  const diffBlocks = useMemo(() => chunk(diffData, PULL_REQUEST_DIFF_RENDERING_BLOCK_SIZE), [diffData])
  const diffsContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (diffData.length > 0) {
      const itemsToOpen: string[] = []
      diffData.map(diffItem => {
        itemsToOpen.push(diffItem.text)
      })
      setOpenItems(itemsToOpen)
    }
  }, [diffData])

  const toggleOpen = useCallback(
    (fileText: string) => {
      setOpenItems(curr => (curr.includes(fileText) ? curr.filter(t => t !== fileText) : [...curr, fileText]))
    },
    [setOpenItems]
  )
  useEffect(() => {
    if (!jumpToDiff) return
    jumpToFile(jumpToDiff, diffBlocks, setJumpToDiff)
  }, [jumpToDiff, diffBlocks, setJumpToDiff])

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

  const changedFilesCount = diffStats.files_changed || 0

  return (
    <>
      <ListActions.Root>
        <ListActions.Left>
          <DropdownMenu.Root>
            <Text as="p" variant="body-single-line-normal" className="text-2 leading-tight text-cn-foreground-2 pt-1.5">
              {t('views:commits.commitDetailsDiffShowing', 'Showing')}{' '}
              <FilesChangedCount showAsDropdown={changedFilesCount !== 0}>
                <Text
                  as="span"
                  variant="body-single-line-normal"
                  className="cursor-pointer text-cn-foreground-accent ease-in-out"
                >
                  {formatNumber(changedFilesCount)} {t('views:commits.commitDetailsDiffChangedFiles', 'changed files')}
                </Text>
              </FilesChangedCount>{' '}
              {t('views:commits.commitDetailsDiffWith', 'with')} {formatNumber(diffStats?.additions || 0)}{' '}
              {t('views:commits.commitDetailsDiffAdditionsAnd', 'additions and')}{' '}
              {formatNumber(diffStats?.deletions || 0)} {t('views:commits.commitDetailsDiffDeletions', 'deletions')}
            </Text>
            <DropdownMenu.Content className="max-h-[360px] max-w-[396px]" align="start">
              {diffData?.map(diff => (
                <DropdownMenu.Item
                  key={diff.filePath}
                  onClick={() => {
                    if (diff.filePath) {
                      setJumpToDiff(diff.filePath)
                    }
                  }}
                  title={
                    <Layout.Flex direction="row" align="center" className=" min-w-0 gap-x-3">
                      <Layout.Flex direction="row" align="center" justify="start" className=" min-w-0 flex-1 gap-x-1.5">
                        <IconV2 name="page" className="shrink-0 text-icons-1" />
                        <span className="overflow-hidden truncate text-2 text-cn-foreground-1 [direction:rtl]">
                          {diff.filePath}
                        </span>
                      </Layout.Flex>
                      <Layout.Flex direction="row" align="center" justify="center" className=" shrink-0 text-2">
                        {diff.addedLines != null && diff.addedLines > 0 && (
                          <StatusBadge variant="outline" size="sm" theme="success">
                            +{diff.addedLines}
                          </StatusBadge>
                        )}
                        {diff.addedLines != null &&
                          diff.addedLines > 0 &&
                          diff.deletedLines != null &&
                          diff.deletedLines > 0 && <span className="mx-1.5 h-3 w-px bg-cn-background-3" />}
                        {diff.deletedLines != null && diff.deletedLines > 0 && (
                          <StatusBadge variant="outline" size="sm" theme="danger">
                            -{diff.deletedLines}
                          </StatusBadge>
                        )}
                      </Layout.Flex>
                    </Layout.Flex>
                  }
                />
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </ListActions.Left>
        <ListActions.Right>
          <ListActions.Dropdown
            selectedValue={diffMode === DiffModeEnum.Split ? 'Split' : 'Unified'}
            onChange={handleDiffModeChange}
            title={diffMode === DiffModeEnum.Split ? 'Split' : 'Unified'}
            items={DiffModeOptions}
          />
        </ListActions.Right>
      </ListActions.Root>
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
                <div className="pt-4" key={item.filePath}>
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
    </>
  )
}

function FilesChangedCount({
  children,
  showAsDropdown = false
}: {
  children: React.ReactNode
  showAsDropdown: boolean
}) {
  return showAsDropdown ? <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger> : <>{children}</>
}

export default PullRequestCompareDiffList
