import { FC, useState } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  CopyButton,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  ListActions,
  Spacer,
  StackedList,
  Text
} from '@components/index'
import { DiffModeEnum } from '@git-diff-view/react'
import { DiffModeOptions, TranslationStore, TypesDiffStats } from '@views/index'

import PullRequestDiffViewer from '../../components/pull-request-diff-viewer'
import { useDiffConfig } from '../../hooks/useDiffConfig'
import { parseStartingLineIfOne } from '../../utils'
import { HeaderProps } from '../pull-request-compare.types'

const LineTitle: FC<Omit<HeaderProps, 'title' | 'data' | 'lang'>> = ({ text }) => (
  <div className="flex items-center justify-between gap-3">
    <div className="inline-flex items-center gap-2">
      <p className="font-medium">{text}</p>
      <CopyButton name={text} />
    </div>
    <div className="inline-flex items-center gap-x-6">
      <div className="flex items-center gap-2">
        <Icon name="ellipsis" size={12} />
      </div>
    </div>
  </div>
)

interface PullRequestAccordionProps {
  header?: HeaderProps
  data?: string
  diffMode: DiffModeEnum
  currentUser?: string
  useTranslationStore: () => TranslationStore
}

const PullRequestAccordion: FC<PullRequestAccordionProps> = ({
  header,
  diffMode,
  currentUser,
  useTranslationStore
}) => {
  const { highlight, wrap, fontsize } = useDiffConfig()
  const startingLine =
    parseStartingLineIfOne(header?.data ?? '') !== null ? parseStartingLineIfOne(header?.data ?? '') : null
  return (
    <StackedList.Root>
      <StackedList.Item disableHover isHeader className="cursor-default p-0 hover:bg-transparent">
        <Accordion type="multiple" className="w-full">
          <AccordionItem isLast value={header?.text ?? ''}>
            <AccordionTrigger leftChevron className="p-4 text-left">
              <StackedList.Field title={<LineTitle text={header?.text ?? ''} />} />
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex w-full border-t">
                <div className="w-full bg-transparent">
                  {startingLine ? (
                    <div className="bg-tag-background-code-8">
                      <div className="ml-16 w-full px-2 py-1 font-mono">{startingLine}</div>
                    </div>
                  ) : null}
                  <PullRequestDiffViewer
                    currentUser={currentUser}
                    data={header?.data}
                    fontsize={fontsize}
                    highlight={highlight}
                    mode={diffMode}
                    wrap={wrap}
                    addWidget={false}
                    fileName={header?.title ?? ''}
                    lang={header?.lang ?? ''}
                    isBinary={header?.isBinary}
                    addedLines={header?.addedLines}
                    removedLines={header?.removedLines}
                    deleted={header?.deleted}
                    unchangedPercentage={header?.unchangedPercentage}
                    useTranslationStore={useTranslationStore}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </StackedList.Item>
    </StackedList.Root>
  )
}

interface PullRequestCompareDiffListProps {
  diffStats: TypesDiffStats
  diffData: HeaderProps[]
  currentUser?: string
  useTranslationStore: () => TranslationStore
}

const PullRequestCompareDiffList: FC<PullRequestCompareDiffListProps> = ({
  diffStats,
  diffData,
  currentUser,
  useTranslationStore
}) => {
  const [diffMode, setDiffMode] = useState<DiffModeEnum>(DiffModeEnum.Split)
  const handleDiffModeChange = (value: string) => {
    setDiffMode(value === 'Split' ? DiffModeEnum.Split : DiffModeEnum.Unified)
  }

  return (
    <>
      <ListActions.Root>
        <ListActions.Left>
          <DropdownMenu>
            <p className="text-14 leading-tight text-foreground-4">
              Showing{' '}
              <DropdownMenuTrigger asChild>
                <span className="cursor-pointer text-foreground-accent ease-in-out">
                  {diffStats.files_changed || 0} changed files
                </span>
              </DropdownMenuTrigger>{' '}
              with {diffStats.additions || 0} additions and {diffStats.deletions || 0} deletions
            </p>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                {diffData?.map(diff => (
                  <DropdownMenuItem
                    key={diff.filePath}
                    onClick={() => {}}
                    className="flex w-80 cursor-pointer items-center justify-between px-3 py-2"
                  >
                    <Text size={1} className="flex-1 overflow-hidden truncate text-primary">
                      {diff.filePath}
                    </Text>
                    <div className="ml-4 flex items-center space-x-2">
                      {diff.addedLines != null && diff.addedLines > 0 && (
                        <Badge variant="outline" size="sm" theme="success">
                          +{diff.addedLines}
                        </Badge>
                      )}
                      {diff.removedLines != null && diff.removedLines > 0 && (
                        <Badge variant="outline" size="sm" theme="destructive">
                          -{diff.removedLines}
                        </Badge>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
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
      <Spacer size={3} />
      {diffData?.map((item, index) => (
        <>
          <Spacer size={3} />
          <PullRequestAccordion
            key={`item?.title ? ${item?.title}-${index} : ${index}`}
            header={item}
            currentUser={currentUser}
            data={item?.data}
            diffMode={diffMode}
            useTranslationStore={useTranslationStore}
          />
        </>
      ))}
    </>
  )
}

export default PullRequestCompareDiffList
